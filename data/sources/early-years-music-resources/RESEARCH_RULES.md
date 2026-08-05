# Shared Research Rules — Early-Years Music Song-Teaching Resources

**Access date for ALL records: 2026-08-04**

## Mission
Find freely shared, openly downloadable teaching resources for early-years music:
PDF handouts, Word documents, songbooks, fingerplay collections, nursery-rhyme
guides, circle-time plans, movement activities, baby-bounce resources, instrument
activities, and preschool music lesson plans.

A typical target is a public-library "baby bounce" song sheet or a preschool
teacher's fingerplay handout — a PDF or DOCX that is freely downloadable from an
open webpage, with lyrics/actions printed in it.

## Hard rules
1. **Free only.** No paywalled, login-only, subscription, or "add to cart" material.
   If a page asks for an email to unlock a download, it is login-only → record in
   UNRESOLVED, do not bypass.
2. **No copyright violation.** Only save material the publisher/author has openly
   posted for free download. Do not scrape print books or commercial songbooks.
3. **Do NOT** classify songs, infer actions, create lessons, or match material to
   any existing dataset. Record what the document factually contains.
4. **Breadth over depth.** Cover many educators/organizations. Do not focus on any
   single artist.
5. Verify every download is a real file:
   - PDFs must start with `%PDF` (magic bytes).
   - DOCX files are ZIP archives starting with `PK`.
   - If curl returns HTML instead of a PDF/DOCX, either save it as a web snapshot
     (`.html`) if the page itself is a useful openly published resource, or record
     as UNRESOLVED.

## Download method (git-bash on Windows)
```bash
curl -L --max-time 60 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -o "FILENAME.pdf" "URL"
```
Verify magic bytes with:
```bash
head -c 8 FILE | od -c | head -1
# %PDF  -> valid PDF
# P K   -> valid DOCX/ZIP
```

## Filename convention
`sanitized-creator-short-description.ext` — lowercase, hyphens only, no spaces.
Example: `toronto-public-library-baby-bounce-songs.pdf`

## Metadata schema (record for EVERY saved source)
| Field | Example |
|-------|---------|
| title | Baby Bounce Song Sheets |
| creator | Toronto Public Library |
| source_type | PDF handout |
| age_range | Infant/Toddler (0–3) |
| songs_topics | Twinkle Twinkle, Itsy Bitsy Spider, ... |
| url | https://... |
| local_filename | toronto-public-library-baby-bounce-songs.pdf |
| access_date | 2026-08-04 |
| description | 1–2 sentence factual description |

If the document is too long to list every song, list the first ~10 titles or the
section headings. If the age range is not stated, write "not stated".

## Web snapshots
If a page is openly published and useful (e.g., a full storytime plan with songs
listed inline) but offers no PDF/DOCX, save it as `.html` with curl:
```bash
curl -L --max-time 60 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -o "FILE.html" "URL"
```
Record it in metadata with source_type "Web page (snapshot)".

## UNRESOLVED list
For every useful source you could NOT download, record: title, creator, URL,
reason (paywall / login required / link dead / format not downloadable / blocked).
