"""Extract song/fingerplay/rhyme entries (title, lyrics, printed actions)
from the collected early-years music resource files. v2 — improved title
detection, boilerplate filtering, numbered-song splitting, quality flags.

Rule: only extract what is PRINTED in the source document. Never invent
actions, lessons, or lyrics. Parenthetical notes, "Actions:" sections,
and explicit action-cue lines are captured as actions; everything else
in a song block is lyrics (whitespace-normalized, boilerplate removed).

Output: JSON per category with records:
{
  "song_title": str,
  "actions": str or "",
  "lyrics": str or "",
  "source_file": str,
  "source_title": str,
  "creator": str,
  "age_range": str,
  "url": str,
  "category": str,
  "extraction_quality": "clean" | "ok" | "rough" | "single-block" | "numbered",
  "notes": str
}
"""
import os, re, json, sys

ROOT = r"C:\Users\jesse\OneDrive\Documents\New project\data\sources\early-years-music-resources"
CATS = ["01-libraries-agencies", "02-educators-publishers", "03-performers-programs"]

# Boilerplate / noise patterns (titles or lyric lines we drop)
BOILER = re.compile(
    r"^(page\s*\d+|www\.|http|copyright|©|graphics\s*©|design\s*©|"
    r"clipart|cut|tip|logo|thank you|dont feel good|picture or|"
    r"instagram|twitter|facebook|pinterest|contact|web\b|contents|"
    r"table of contents|index\b|introduction|prepared by|"
    r"website:\s*|songs of the month|lyrics and music copyright)"
    r".*$", re.I | re.S)

# Known non-song section headers / layout noise that looks like titles
NOISE_TITLES = {
    "parent corner", "more ideas", "more ideas!", "all wet!", "with your child!",
    "additional verses", "additional verses:", "music elements", "supplies",
    "preparation", "schedule", "rules/expectations", "social-emotional", "rules",
    "math", "science", "art", "literacy", "greeting songs", "lap songs", "action songs",
    "finger songs and rhymes", "goodbye song", "storytime", "welcome time", "baby signs",
    "playtime song", "playtime game", "webster's favorites", "songs and rhymes",
    "chorus", "verse", "verses", "refrain", "repeat", "repeat refrain",
    "song list", "songs", "rhymes", "introduction", "organizing your song collection",
    "more than fun", "more than funmore than fun", "compiled by", "read, write, talk, sing, and play",
    "sign it: baby", "sign it", "a fun rhyme or fingerplay", "check out these great initiatives",
    "storytime songs and", "baby bounce", "favorite songs", "independent school district",
    "virtual baby storytime", "bounces", "tickles", "wiggles", "hello song", "goodbye song",
}

def has_vowels(s):
    return bool(re.search(r"[aeiouyAEIOUY]", s))

# ---------------------------------------------------------------- helpers
def extract_pdf_text(fp):
    from pypdf import PdfReader
    reader = PdfReader(fp)
    parts = []
    for page in reader.pages:
        try:
            t = page.extract_text() or ""
        except Exception:
            t = ""
        parts.append(t)
    return "\n".join(parts)

def extract_docx_text(fp):
    import zipfile
    with zipfile.ZipFile(fp) as z:
        xml = z.read("word/document.xml").decode("utf-8", errors="replace")
    text = re.sub(r"<[^>]+>", " ", xml)
    return text

def normalize_ws(text):
    return re.sub(r"[ \t]+", " ", text)

def clean_lines(text):
    lines = []
    for ln in text.splitlines():
        s = ln.strip()
        if not s:
            continue
        s = normalize_ws(s)
        # drop control chars
        s = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", s).strip()
        if s:
            lines.append(s)
    return lines

ALL_CAPS_RE = re.compile(r"^[A-Z0-9'’\-\s&,.!?()/:]+$")

def is_allcaps(line):
    s = line.replace(" ", "")
    return len(s) >= 3 and bool(ALL_CAPS_RE.match(line))

def is_boilerplate(line):
    if not line:
        return True
    if len(line) < 3:
        return True
    if BOILER.match(line):
        return True
    if re.match(r"^[\d\W]+$", line):  # digits/punct only
        return True
    return False

def looks_like_title(line):
    """Heuristic: a plausible song/rhyme title."""
    if not line or is_boilerplate(line):
        return False
    s = line.strip(" \"'’")
    if len(s) < 3 or len(s) > 60:
        return False
    if not has_vowels(s):
        return False
    words = s.split()
    if len(words) > 10:
        return False
    if s.lower().strip(" .!?") in NOISE_TITLES:
        return False
    # single-letter-per-word layout junk: "H Y S I C"
    if len(words) >= 3 and all(len(w) == 1 for w in words):
        return False
    # attribution lines: "by Denise Fleming", "with Your Child!"
    if re.match(r"^(by|with|from|for|and|&)\s+[A-Z]", s):
        return False
    # ends with bullet-ish punctuation
    if s.endswith((";", ",")) and not s.endswith("!"):
        return False
    # repeated header junk: "Berkner BytesBerkner BytesBerkner Bytes"
    if re.search(r"(.{6,})\1", s):
        return False
    # ALL-CAPS title
    if is_allcaps(s):
        return True
    # Title Case line (most words capitalized) - common in song sheets
    cap = sum(1 for w in words if w[:1].isupper())
    if len(words) >= 2 and cap >= max(2, len(words) - 1):
        return True
    # Quoted title
    if s.startswith('"') and s.endswith('"') and len(words) <= 8:
        return True
    return False

# numbered-song pattern: "1. Everybody Clap" / "1 Everybody Clap"
NUM_SONG = re.compile(r"^(\d{1,2})[.)]?\s+([A-Z][^.!?]{3,60})$")

# numbers that are never song indices (toolkit sections etc.)
NUM_SONG_STOP = {"supplies", "preparation", "schedule", "agenda", "set-up", "set up",
                 "introduction", "references", "reproducibles", "stations", "felt",
                 "templates", "activity", "activities", "tips", "evaluation", "session",
                 "week", "day", "month", "song list", "table of contents"}

# ---------------------------------------------------------------- block splitter
def split_blocks(lines):
    """Split into blocks; each block starts with a detected title line."""
    blocks = []
    cur = []
    for ln in lines:
        if looks_like_title(ln) and cur:
            blocks.append(cur)
            cur = [ln]
        else:
            cur.append(ln)
    if cur:
        blocks.append(cur)
    return blocks

# ---------------------------------------------------------------- action extraction
PAREN_RE = re.compile(r"\(([^)]{2,})\)")

def extract_actions_from_block(lines):
    """Pull printed action cues: parenthetical notes, 'Actions:' sections,
    lines starting with 'Action'/'Do:'. Returns (lyrics, actions)."""
    actions = []
    lyrics = []
    in_actions_section = False
    for ln in lines:
        s = ln.strip()
        low = s.lower()
        if low.startswith("actions:") or low.startswith("action:"):
            in_actions_section = True
            rest = s.split(":", 1)[1].strip()
            if rest:
                actions.append(rest)
            continue
        if in_actions_section:
            actions.append(s)
            continue
        # parenthetical action notes: "(Bounce baby)", "(Wave hand!)"
        cleaned = PAREN_RE.sub("", s).strip()
        if PAREN_RE.search(s):
            for m in PAREN_RE.findall(s):
                actions.append(m.strip())
            if cleaned:
                lyrics.append(cleaned)
        else:
            lyrics.append(s)
    return "\n".join(lyrics).strip(), "\n".join(actions).strip()

def filter_boilerplate_lines(lines):
    """Remove obvious page numbers, URLs, copyright lines from a block."""
    out = []
    for s in lines:
        if re.match(r"^(page\s*\d+|http\S*|www\.\S+|©.*|graphics\s*©.*|design\s*©.*)$", s, re.I):
            continue
        out.append(s)
    return out

# ---------------------------------------------------------------- per-file parse
def parse_html_file(fp, fname, meta):
    """Parse an HTML snapshot: strip tags, keep visible text, then run the
    same block pipeline. Snapshot pages are usually a hub or one song page."""
    with open(fp, encoding="utf-8", errors="replace") as fh:
        html = fh.read()
    # remove comments, scripts, styles, and CSS content
    html = re.sub(r"(?is)<!--.*?-->", " ", html)
    html = re.sub(r"(?is)<script.*?</script>", " ", html)
    html = re.sub(r"(?is)<style.*?</style>", " ", html)
    # crude tag strip, keep block elements as line breaks
    text = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h1|h2|h3|h4|tr)>", "\n", html)
    text = re.sub(r"(?i)<[^>]+>", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&#8211;|&ndash;", "-", text)
    text = re.sub(r"&#8217;|&rsquo;|&#39;|&apos;", "'", text)
    text = re.sub(r"&#8220;|&ldquo;", '"', text)
    text = re.sub(r"&#8221;|&rdquo;", '"', text)
    text = re.sub(r"&#8230;|&hellip;", "...", text)
    text = re.sub(r"&#\d+;|&\w+;", " ", text)
    lines = clean_lines(text)
    # drop CSS-ish lines
    lines = [l for l in lines if not re.search(r"(?i)\{[^}]*\}|sourceURL|contain-intrinsic|@media|:is\(", l)]
    if not lines:
        return []
    blocks = split_blocks(lines)
    records = []
    for blk in blocks:
        title = blk[0].strip(" \"'’")
        body = filter_boilerplate_lines(blk[1:])
        lyrics, actions = extract_actions_from_block(body)
        if is_boilerplate(title) or BOILER.match(title) or title.lower().strip(" .!?") in NOISE_TITLES:
            for cand in body[:8]:
                if looks_like_title(cand):
                    title = cand.strip(" \"'’")
                    break
        if not lyrics and not actions:
            continue
        records.append(make_rec(title, lyrics, actions, fname, meta,
                                "clean" if (lyrics and actions) else "ok"))
    return records


def parse_file(fp, fname, ext, meta):
    if ext == "pdf":
        text = extract_pdf_text(fp)
    elif ext == "docx":
        text = extract_docx_text(fp)
    elif ext == "txt":
        with open(fp, encoding="utf-8", errors="replace") as fh:
            text = fh.read()
    else:
        return []

    lines = clean_lines(text)
    if not lines:
        return []

    records = []
    # try numbered-song structure first (e.g., "1. Everybody Clap")
    numbered = []
    i = 0
    while i < len(lines):
        m = NUM_SONG.match(lines[i])
        if m and i + 1 < len(lines):
            title = m.group(2).strip()
            # skip known non-song numbered sections
            if title.lower().rstrip(".") in NUM_SONG_STOP or not looks_like_title(title):
                i += 1
                continue
            j = i + 1
            body = []
            while j < len(lines) and not NUM_SONG.match(lines[j]):
                body.append(lines[j])
                j += 1
            numbered.append((title, body))
            i = j
        else:
            i += 1
    if len(numbered) >= 2:
        for title, body in numbered:
            body = filter_boilerplate_lines(body)
            lyrics, actions = extract_actions_from_block(body)
            if not lyrics and not actions:
                continue
            records.append(make_rec(title, lyrics, actions, fname, meta, "numbered"))
        if records:
            return records

    # generic block splitting
    blocks = split_blocks(lines)
    for blk in blocks:
        if not blk:
            continue
        # first line is title candidate
        title = blk[0].strip(" \"'’")
        body = filter_boilerplate_lines(blk[1:])
        lyrics, actions = extract_actions_from_block(body)
        # for single-song sheets, the title may be inside the body (e.g.,
        # "A Chubby Little Snowman" appears after a URL line)
        if not lyrics and not actions:
            continue
        if is_boilerplate(title) or BOILER.match(title):
            # look for a plausible title inside the body's first lines
            for cand in body[:6]:
                if looks_like_title(cand) and not is_boilerplate(cand):
                    title = cand.strip(" \"'’")
                    # remove that line from lyrics if it appears as standalone
                    break
        quality = "clean" if (lyrics and actions) else ("ok" if lyrics else "rough")
        records.append(make_rec(title, lyrics, actions, fname, meta, quality))

    return records

def make_rec(title, lyrics, actions, fname, meta, quality):
    return {
        "song_title": title,
        "actions": actions,
        "lyrics": lyrics,
        "source_file": fname,
        "source_title": meta.get("title", ""),
        "creator": meta.get("creator", ""),
        "age_range": meta.get("age_range", ""),
        "url": meta.get("url", ""),
        "category": meta.get("category", ""),
        "extraction_quality": quality,
        "notes": "",
    }

# ---------------------------------------------------------------- metadata loader
def load_metadata():
    """Load parsed metadata (title/creator/age/url per file) from agent reports.
    Parses each detailed record as a BLOCK so url/local_filename stay aligned."""
    meta = {}
    for cat in CATS:
        mp = os.path.join(ROOT, "metadata", cat + ".md")
        if not os.path.exists(mp):
            continue
        with open(mp, encoding="utf-8", errors="replace") as fh:
            lines = fh.readlines()
        cur = None
        for line in lines:
            s = line.strip()
            m = re.match(r"^#{3,4}\s+\d+(?:[–-]\d+)?\.?\s+([a-z0-9][a-z0-9._-]+\.(?:pdf|docx?|html|txt))\s*$", s)
            if m:
                cur = m.group(1)
                meta.setdefault(cur, {})
                continue
            if cur is None:
                continue
            mb = re.match(r"^-\s+\*\*([a-z_]+):\*\*\s*(.*)$", s)
            if mb:
                f, v = mb.group(1), mb.group(2).strip()
                if f in ("url", "title", "creator", "source_type", "age_range", "local_filename"):
                    meta[cur][f] = v
                continue
            mt = re.match(r"^\|\s*([a-z_]+)\s*\|\s*(.*?)\s*\|$", s)
            if mt:
                f, v = mt.group(1), mt.group(2).strip()
                if f in ("url", "title", "creator", "source_type", "age_range", "local_filename"):
                    meta[cur][f] = v
    return meta

# ---------------------------------------------------------------- main
def main(cats_to_run=None):
    meta = load_metadata()
    all_records = {}
    for cat in CATS:
        if cats_to_run and cat not in cats_to_run:
            continue
        cat_records = []
        for sub in ("pdf", "doc", "web"):
            folder = os.path.join(ROOT, cat, sub)
            if not os.path.isdir(folder):
                continue
            for fname in sorted(os.listdir(folder)):
                ext = fname.rsplit(".", 1)[-1].lower()
                if ext not in ("pdf", "docx", "txt", "html"):
                    continue
                fp = os.path.join(folder, fname)
                try:
                    if ext == "html":
                        recs = parse_html_file(fp, fname, meta.get(fname, {}))
                    else:
                        recs = parse_file(fp, fname, ext, meta.get(fname, {}))
                except Exception as e:
                    recs = []
                    print(f"  !! error {cat}/{fname}: {e}", file=sys.stderr)
                # drop near-empty blocks (no real lyric content)
                kept = []
                seen = set()
                for r in recs:
                    lyr = r.get("lyrics", "") or ""
                    words = re.findall(r"[A-Za-z]{3,}", lyr)
                    t = r.get("song_title", "").strip()
                    # real song entries need a plausible title + decent lyric mass
                    if not (t and looks_like_title(t)):
                        continue
                    if len(words) < 8 and not (r.get("actions") and len(words) >= 3):
                        continue
                    if r.get("extraction_quality") == "rough" and len(words) < 15:
                        continue
                    # dedup within file (same title + same lyric head)
                    key = (t.lower(), lyr[:60].lower())
                    if key in seen:
                        continue
                    seen.add(key)
                    kept.append(r)
                for r in kept:
                    r["category"] = cat
                cat_records.extend(kept)
        all_records[cat] = cat_records
        print(f"{cat}: {len(cat_records)} song blocks extracted (after filter)")
    return all_records

if __name__ == "__main__":
    which = sys.argv[1:] if len(sys.argv) > 1 else None
    out = main(which)
    with open(os.path.join(ROOT, "metadata", "_extracted_songs.json"), "w", encoding="utf-8") as fh:
        json.dump(out, fh, indent=1, ensure_ascii=False)
    print("saved metadata/_extracted_songs.json")
