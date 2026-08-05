# Shared Research Rules v2 — Early-Years Music Song-Teaching Resources

**Access date for ALL records: 2026-08-04**

## Mission
Collect as much as possible: freely shared, openly downloadable teaching
resources for early-years music (song sheets, fingerplay collections,
nursery-rhyme guides, circle-time plans, movement activities, baby-bounce
handouts, instrument activities, preschool music lesson plans) — PLUS
historical/public-domain songbooks and archives that show how songs were
taught in earlier eras.

**The historical goal:** every saved document is a *version* of how a song
was taught. Capturing year/era/region/pedagogy context per file is what
lets us show changes over time (e.g., how "Twinkle Twinkle" was taught in
a 1916 songbook vs a 2024 library handout).

## Folder map (v2)
| Folder | Scope |
|--------|-------|
| `01-libraries-agencies` | Public libraries, library systems, gov agencies, early-literacy orgs (round 1) |
| `02-educators-publishers` | Music educators, teachers, schools, districts, publishers (round 1) |
| `03-performers-programs` | Children's musicians, music programs, media companies (round 1) |
| `04-historical-public-domain` | **NEW** pre-1990 songbooks, public-domain collections, folk-song archives, digitized historical materials (Internet Archive, Gutenberg, Library of Congress, folk archives) |
| `05-libraries-deep` | **NEW** second pass at libraries/agencies — different regions, different programs (baby bounce, rhyme time, storytime) not yet covered |
| `06-educators-performers-deep` | **NEW** second pass at educators/publishers/performers — new creators, new programs |

## Hard rules
1. **Free only.** No paywalled, login-only, subscription, or "add to cart".
   Email-gated downloads are login-only → record in UNRESOLVED.
2. **No copyright violation.** Public-domain (pre-1930 US, pre-author's-death
   elsewhere) is fully allowed. Openly posted free PDFs are allowed. Do NOT
   scrape commercial songbooks or pirated material.
3. **Do NOT** classify songs, infer actions, create lessons, or match to any
   existing dataset. Record what the document factually contains.
4. **Breadth + depth.** Cover many creators. Do NOT focus on any single artist.
   For round 2 (folders 04-06), seek NEW sources not already in folders 01-03.
5. Verify every download is a real file (PDF starts `%PDF`; DOCX starts `PK`).
   If curl returns HTML, either save as `.html` snapshot (if the page itself
   is the useful openly published resource) or record as UNRESOLVED.

## Download method (git-bash on Windows)
```bash
curl -L --max-time 60 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -o "FILENAME.pdf" "URL"
# if Cloudflare/Akamai blocks, try: curl --http1.1 -L -A "Mozilla/5.0 ..." -o ...
# if curl fails with error 23 (binary write), use Python urllib instead
```
Verify magic bytes: `head -c 8 FILE | od -c | head -1` (%PDF or P K).

## Filename convention
`sanitized-creator-short-description.ext` — lowercase, hyphens, no spaces.

## Metadata schema v2 (record for EVERY saved source)
| Field | Example |
|-------|---------|
| title | Baby Bounce Song Sheets |
| creator | Toronto Public Library |
| source_type | PDF handout / Word doc / Web page snapshot / scanned songbook |
| **year** | **2024** (publication/program year if stated; for historical items the edition year; else "not stated") |
| **era** | **2020s / 1980s / 1900-1920 / Victorian / not stated** (approximate bucket if exact year unknown) |
| **region** | **Ontario, Canada / UK / NSW, Australia / US (unspecified)** (where the source is from) |
| age_range | Infant/Toddler (0–3), Preschool (3–5), not stated |
| songs_topics | list of actual song/fingerplay titles seen (first ~10) |
| url | https://... |
| local_filename | creator-short-description.pdf |
| access_date | 2026-08-04 |
| description | 1-2 sentence factual description |

The **year/era/region** fields are mandatory in v2 — they are what the song
historian uses to show how teaching changed over time. If a field is truly
unknown, write "not stated" (do NOT guess).

## Historical / public-domain specifics (folder 04)
- Prioritize: Internet Archive (`archive.org` full-text search),
  Project Gutenberg, Library of Congress digital collections, folk-song
  archives (e.g., folklorist.org, Vaughan Williams Memorial Library), and
  library digitization programs.
- For scanned historical songbooks: record the **edition year** from the
  title page, and note the publisher/printing. These are often scanned
  images — a `.txt` full-text capture via the extraction service is
  acceptable when the PDF is image-only (mark source_type as
  "Text capture of scanned book").
- Prefer items explicitly marked public domain or with clear digitization
  permission (Internet Archive "Public Domain in the USA" etc.).

## Web snapshots
Save `.html` with curl when a page is openly published and useful (full
storytime plan, song list with lyrics). Record source_type "Web page (snapshot)".

## UNRESOLVED list
For every useful source you could NOT download: title, creator, URL, reason
(paywall / login / blocked / dead link / format not downloadable).
