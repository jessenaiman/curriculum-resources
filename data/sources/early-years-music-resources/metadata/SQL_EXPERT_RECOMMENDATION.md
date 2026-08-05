# SQL Expert Recommendation — Storage Design for the Early-Years Song Collection

**Author:** SQL Expert persona (data integrity & schema design)
**Date:** 2026-08-04
**Status:** Design consultation — nothing in `curriculum.db` was modified.
**Scope:** ~1,100 extracted song records (1,183 in `metadata/_extracted_songs.json`, 1,096 reviewed in `Song_Resources_Review.xlsx`) from ~168 source documents, with full lyrics, printed actions, and mandatory year/era/region metadata for historical versioning.

---

## 0. The decision in one paragraph

**Create a NEW SQLite database, `data/song_collection.db`, as the single source of truth for the collected song research.** Do NOT put this data into `curriculum.db`. The collection gets a **three-table core**: `sources` (one row per document, carrying the mandatory v2 year/era/region), `song_versions` (one row per song-as-taught-in-a-source — the historical versioning layer, with full lyrics and actions as TEXT), and `canonical_songs` (the identity layer that ties every version of "Twinkle Twinkle" together). The spreadsheet becomes a **generated export**, never the source of truth. A short loader script (Python, modeled on the existing `build_spreadsheet.py`) migrates the JSON + review flags + OCR provenance in one deterministic pass, and the whole thing is git-committed like `curriculum.db` already is.

This is the only design that satisfies all four constraints at once: (1) full lyrics live in a DB, (2) historical versions are preserved, not collapsed, (3) the production pipeline in `curriculum.db` is untouched, and (4) the Song Historian persona gets one clean, queryable, versioned store.

---

## 1. Why a NEW database file — and why NOT new tables in curriculum.db

I looked at the actual `curriculum.db` schema before deciding. The arguments:

**Against putting the collection in `curriculum.db`:**
1. **Different lifecycle.** `curriculum.db` is *production*: it feeds `build_merged_dataset.py`, `populate_lesson_content.py`, and the web app. It is schema-stable and its rows are "done". The collection is *research*: it has noise rows, OCR-rough text, unconfirmed canonical mappings, and will be churned by the Song Historian for years. Mixing a 58,978-character OCR blob into a table next to a lesson pipeline is how production queries start silently degrading.
2. **Different shape.** The existing `songs` table (561 rows, Kathy Reid-Naiman catalog) is a *commercial discography*: `cd_title`, `track_num`, `catalog_id`, `artist`. Its identity model is "one song per catalog row". The collection's identity model is "one song, many historical versions" — a fundamentally different shape that would force ugly hacks (duplicate `song_name` rows, `version` columns) into a table the pipeline depends on.
3. **Noise.** The collection deliberately keeps ~79 flagged noise rows (TOC fragments like `i ntroducti on`, `book selection:`) because "rows are never deleted" is the project's stated philosophy (MASTER_LIST.md). Production tables should never contain rows you filter out with `WHERE is_noise = 0`.
4. **Risk isolation.** A mistake in the collection (a bad import, a destructive migration) should never threaten a git-revisioned DB that a web app reads.

**The counter-argument I considered and rejected:** "one DB is easier to join against." It isn't — SQLite `ATTACH DATABASE` solves cross-DB joins in one line, and the two datasets barely need to join anyway (the bridge is a future mapping table, see §10).

**Where it lives:** `C:\Users\jesse\OneDrive\Documents\New project\data\song_collection.db` — sibling to `curriculum.db`, inside the same git-revisioned `data/` tree, so it gets the same commit discipline. Not inside `sources/early-years-music-resources/` (that folder is for raw files and working docs; the DB is a deliverable of the same rank as `curriculum.db`).

> Note: `git status` currently shows `?? sources/` — the collection folder itself is not yet committed. Committing the DB, loader, and schema together with the sources folder (or at least the DB + schema) is part of the migration path (§9).

---

## 2. Schema design — exact CREATE TABLE statements

Run these in `song_collection.db` via the loader script (schema lives in `data/sources/early-years-music-resources/metadata/song_collection_schema.sql`, committed to git). All TEXT, no collation tricks; `year_int` exists purely for chronological sorting.

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ============================================================
-- 1. ERAS lookup — gives chronological ordering for display.
--    "not stated" gets a sort_order so it always sorts LAST.
-- ============================================================
CREATE TABLE IF NOT EXISTS eras (
    id          INTEGER PRIMARY KEY,
    era         TEXT NOT NULL UNIQUE,          -- '2020s', '1980s', '1900-1920', 'Victorian', 'not stated'
    sort_order  INTEGER NOT NULL,              -- 2020s=1, 1980s=2, 1900-1920=3, Victorian=4, 'not stated'=99
    description TEXT
);

-- ============================================================
-- 2. SOURCES — one row per source DOCUMENT (the ~168 PDFs/DOCX/
--    HTML/OCR txt files). Carries the mandatory v2 year/era/
--    region metadata. This is the provenance backbone.
-- ============================================================
CREATE TABLE IF NOT EXISTS sources (
    id              INTEGER PRIMARY KEY,
    filename        TEXT NOT NULL UNIQUE,      -- local_filename, e.g. 'ala-alsc-sample-storytime-asides.pdf'
    title           TEXT NOT NULL,             -- source_title from the index sheets
    creator         TEXT,                      -- 'Toronto Public Library' / 'not stated'
    source_type     TEXT,                      -- 'PDF handout' | 'Word doc' | 'Web page (snapshot)' | 'Scanned songbook' | 'Text capture of scanned book'
    category        TEXT NOT NULL,             -- '01-libraries-agencies' ... '09-educators-performers-more'
    folder_path     TEXT,                      -- relative path to the saved file
    -- ---- v2 mandatory historical metadata (RESEARCH_RULES_v2.md) ----
    year            TEXT NOT NULL DEFAULT 'not stated',  -- display text: '2024', 'c. 1916', 'not stated'
    year_int        INTEGER,                   -- parseable year for ORDER BY; NULL when not stated
    era             TEXT NOT NULL DEFAULT 'not stated',  -- FK-ish -> eras.era; kept as TEXT for readability
    region          TEXT NOT NULL DEFAULT 'not stated',  -- 'Ontario, Canada', 'UK', 'NSW, Australia', 'US (unspecified)'
    -- ---- v1 index fields ----
    age_range       TEXT,
    url             TEXT,
    access_date     TEXT NOT NULL DEFAULT '2026-08-04',
    description     TEXT,
    -- ---- OCR provenance ----
    ocr_txt_path    TEXT,                      -- 'ocr/ocr-swanton-public-library-bounce-rhymes.txt' or NULL
    ocr_status      TEXT DEFAULT 'not_needed', -- 'not_needed' | 'needs_ocr' | 'ocr_done' | 'ocr_failed'
    -- ---- review lifecycle ----
    review_status   TEXT NOT NULL DEFAULT 'new', -- 'new' | 'reviewed' | 'rejected'
    notes           TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- 3. SONG_VERSIONS — one row per song-as-taught-in-a-source.
--    THIS is the historical versioning layer. The same song in
--    7 sources = 7 rows, each a distinct historical witness.
--    Full lyrics and actions are TEXT columns here. Do NOT move
--    them to files or separate tables; the whole point of the
--    DB is queryable full text.
-- ============================================================
CREATE TABLE IF NOT EXISTS song_versions (
    id                  INTEGER PRIMARY KEY,
    source_id           INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    canonical_song_id   INTEGER REFERENCES canonical_songs(id),  -- NULL until the Song Historian maps it
    extract_ref         TEXT NOT NULL UNIQUE,   -- idempotent re-import key: '01-libraries-agencies[123]' (JSON path)
    song_title          TEXT NOT NULL,          -- title AS PRINTED in the source (verbatim, incl. typos)
    normalized_title    TEXT NOT NULL,          -- lowercased, punctuation stripped, whitespace collapsed — for auto-cluster suggestions
    actions             TEXT,                   -- printed action notes, verbatim (NULL = none printed)
    lyrics              TEXT NOT NULL,          -- FULL lyrics text, verbatim. This is the payload.
    age_range           TEXT,                   -- as stated in the source ('Infant/Toddler (0-3)' etc.)
    -- ---- optional per-version historical overrides ----
    -- Normally year/era/region come from the parent source. Use these
    -- ONLY when the source itself dates a specific song differently
    -- (e.g. a 2024 anthology reprinting a rhyme marked "1916").
    year_text           TEXT,
    era                 TEXT,
    region              TEXT,
    source_page         TEXT,                   -- page/section within the source if known
    -- ---- extraction & review ----
    extraction_quality  TEXT NOT NULL DEFAULT 'ok'
                        CHECK (extraction_quality IN ('clean','ok','numbered','rough')),
    is_noise            INTEGER NOT NULL DEFAULT 0,  -- 1 = TOC fragment / header / book title, NOT a song
    noise_reason        TEXT,                   -- 'toc_fragment' | 'header' | 'book_title' | 'duplicate_extract' | other
    review_status       TEXT NOT NULL DEFAULT 'new', -- 'new' | 'needs_review' | 'reviewed' | 'rejected'
    canonical_match     TEXT NOT NULL DEFAULT 'unmapped', -- 'unmapped' | 'auto_suggested' | 'confirmed' | 'manual'
    notes               TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- 4. CANONICAL_SONGS — the identity layer. One row per distinct
--    traditional song identity ('Twinkle Twinkle Little Star').
--    Every song_versions row for a real song eventually points
--    here. This is the answer to "how do we link versions".
-- ============================================================
CREATE TABLE IF NOT EXISTS canonical_songs (
    id                  INTEGER PRIMARY KEY,
    canonical_title     TEXT NOT NULL UNIQUE,   -- 'Twinkle Twinkle Little Star'
    aliases_json        TEXT NOT NULL DEFAULT '[]',  -- '["Twinkle, Twinkle", "Baa Baa Black Sheep variant? - no"]' - known printed-name variants
    song_type           TEXT,                   -- 'nursery rhyme' | 'fingerplay' | 'action song' | 'lullaby' | 'bounce rhyme' | ...
    common_theme        TEXT,                   -- 'weather/stars' etc. (curation aid, not classification)
    first_version_id    INTEGER,                -- id of the earliest-dated known version (historian convenience)
    notes               TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- 5. REVIEW_LOG — lightweight audit trail for the Song Historian
--    persona: who changed what mapping/review decision, when.
-- ============================================================
CREATE TABLE IF NOT EXISTS review_log (
    id          INTEGER PRIMARY KEY,
    version_id  INTEGER REFERENCES song_versions(id) ON DELETE CASCADE,
    action      TEXT NOT NULL,        -- 'mapped_to_canonical' | 'marked_noise' | 'quality_changed' | 'lyrics_edited' ...
    old_value   TEXT,
    new_value   TEXT,
    actor       TEXT NOT NULL DEFAULT 'song-historian',
    at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- 6. FULL-TEXT SEARCH (optional but strongly recommended) —
--    lyric/title/action search over the whole collection.
--    Rebuild with the loader script; no triggers needed.
-- ============================================================
CREATE VIRTUAL TABLE IF NOT EXISTS song_versions_fts USING fts5(
    song_title, actions, lyrics,
    content='song_versions', content_rowid='id'
);
```

### What each table is FOR (and what it is NOT)

| Table | Role | Anti-role |
|---|---|---|
| `sources` | Provenance: where a document came from, when, and its v2 historical context | NOT the place for per-song data |
| `song_versions` | The payload: every extracted song-as-taught, full lyrics + actions | NOT deduplicated — versions are the point |
| `canonical_songs` | Identity: the "song" that versions are versions *of* | NOT a lyrics table |
| `eras` | Display ordering for era buckets | — |
| `review_log` | Audit trail for the historian persona | — |
| `song_versions_fts` | Full-text search | — |

---

## 3. How year / era / region fit

**They are SOURCE-level attributes first.** RESEARCH_RULES_v2.md defines them per saved *file* ("the historical goal: every saved document is a version of how a song was taught"). So:

- `sources.year / year_int / era / region` — **mandatory** (`NOT NULL DEFAULT 'not stated'`), populated from the v2 source index as rounds complete. This is what makes "all versions of Twinkle Twinkle ordered by year" possible even when a version row has no date of its own.
- `song_versions.year_text / era / region` — **optional overrides**, only used when the source itself dates an individual song differently (e.g. a scanned 2024 anthology that reprints a rhyme explicitly marked "1916"). They are `NULL` by default and the version inherits the source's values at query time via `COALESCE`.

**Two practical rules I insist on:**
1. `year` is stored as display TEXT (`'2024'`, `'c. 1916'`, `'not stated'`) **and** as `year_int INTEGER` for sorting. Sorting on TEXT gives you `'1916' < '2024'` only by luck; `year_int` is the honest sort key, `NULL` for unknown.
2. `era` values are the RESEARCH_RULES_v2 buckets (`2020s / 1980s / 1900-1920 / Victorian / not stated`), enforced by the `eras` table so the buckets stay consistent and sortable (`sort_order`: 2020s=1 … Victorian=4, `not stated`=99).

---

## 4. Lyrics and actions: full TEXT columns, no separate tables, no files

- `song_versions.lyrics TEXT NOT NULL` — **the full verbatim text.** This is the entire reason we're leaving spreadsheets. Storing lyrics as attached `.txt` files or a separate `lyrics` table buys nothing (nothing else references lyrics sub-part-wise) and costs you FTS search and one-query access.
- `song_versions.actions TEXT` — printed action notes, verbatim. **686 of 1,183 records (58%) have no printed actions** — those stay `NULL`, not empty string. `NULL` = "source printed none"; `''` would be indistinguishable from a failed extraction.
- Real-world caveat I verified in the data: in `rough`/`numbered` extractions, actions sometimes got merged INTO the lyrics text (e.g. the Berkner "Remix It!" record). That is **acceptable at ingest** — the Song Historian splits them during review and logs the edit. Do not build a separate "actions table" to compensate; it adds joins without fixing the extraction problem.
- **OCR provenance:** image-only PDFs have their OCR text in `ocr/*.txt` (verified: `ocr_results.json` maps `swanton-public-library-bounce-rhymes.pdf → ocr/ocr-swanton-public-library-bounce-rhymes.txt`). The path goes on `sources.ocr_txt_path` + `ocr_status`; a version extracted from OCR can additionally record `source_page`. The DB stores the *cleaned extracted text*; the raw OCR file stays on disk as the recoverable original.

---

## 5. Noise and extraction quality

- `extraction_quality` is a CHECK-constrained enum: `clean | ok | numbered | rough` (matches the review sheet's columns exactly — verified: 644 ok / 424 clean / 28 numbered in the review workbook).
- **Noise rows are KEPT, never deleted** (project philosophy from MASTER_LIST.md), but flagged: `is_noise = 1` + `noise_reason`. Verified examples in the data: `i ntroducti on` (×7, OCR header fragment), `isabella plains early childhood school` (×18, running header), `book selection:` (×5, TOC). The ~79 rows flagged in review become `is_noise = 1, review_status = 'rejected'` — but they stay queryable if a historian ever needs them, and excluded by default with `WHERE is_noise = 0`.
- `review_status` (`new → needs_review → reviewed | rejected`) is the working state for the Song Historian. Nothing auto-publishes.

---

## 6. Versioning & dedup strategy — the core of the design

**The rule: deduplicate at the CANONICAL level only. Never collapse version rows.**

"Five Little Ducks" appearing 7 times in 7 sources is not a data quality problem — it is the dataset's entire value proposition. Each of those 7 rows is a *witness of how the song was taught* in that source's year/era/region. The only thing we dedupe is the *identity*: all 7 point at one `canonical_songs` row via `song_versions.canonical_song_id`.

**How mapping happens (import → historian):**
1. **Import:** `normalized_title` is computed per version (lowercase, strip punctuation, collapse whitespace — so `Open, Shut Them` and `open shut them` cluster). The loader auto-suggests canonical clusters by exact `normalized_title` match and creates provisional `canonical_songs` rows; suggested links are stamped `canonical_match = 'auto_suggested'`.
2. **Review:** the Song Historian confirms (`'confirmed'`) or corrects (`'manual'`) mappings, merges near-duplicate canonical rows (e.g. `Twinkle Twinkle Little Star` vs `Twinkle, Twinkle, Little Star`), and records known printed-name variants in `aliases_json`. Every change lands in `review_log`.
3. **Never silent:** no auto-merge of canonical identities based on fuzzy similarity — `normalized_title` equality only. Two different songs can share a normalized title (rare, but e.g. regional variants of the *same* tune with *different* words should arguably be distinct canonicals — that judgment is the historian's, with `song_type`/`notes` to record the reasoning).

**The money query — "all versions of Twinkle Twinkle, oldest first":**

```sql
SELECT v.id, v.song_title, v.actions, v.lyrics,
       v.extraction_quality, v.is_noise,
       s.title AS source_title, s.creator,
       COALESCE(v.year_text, s.year)            AS display_year,
       COALESCE(v.year_int, s.year_int)         AS sort_year,
       COALESCE(v.era, s.era)                   AS era,
       COALESCE(v.region, s.region)             AS region,
       s.url
FROM song_versions v
JOIN sources s ON s.id = v.source_id
WHERE v.canonical_song_id = (
    SELECT id FROM canonical_songs
    WHERE canonical_title = 'Twinkle Twinkle Little Star'
)
  AND v.is_noise = 0
ORDER BY sort_year IS NULL, sort_year;   -- unknowns sort last
```

And the inverse — "what did this source teach?":

```sql
SELECT v.song_title, c.canonical_title, v.lyrics
FROM song_versions v
LEFT JOIN canonical_songs c ON c.id = v.canonical_song_id
WHERE v.source_id = 42 AND v.is_noise = 0;
```

(Cross-DB join to `curriculum.db` when needed: `ATTACH 'C:\...\curriculum.db' AS cur;` then join normally.)

---

## 7. The spreadsheet's role — demoted to generated export

**Everything that is currently a row in `Song_Resources_Review.xlsx` (Songs sheet, 1,096 rows) moves to the DB.** That sheet is the exact thing we're escaping: 58,978-char lyrics cells, 12 columns of mixed text, no joins, no integrity, no FTS.

What survives as a spreadsheet, and only as a **regenerated artifact** (the loader/export script overwrites it; nobody edits it by hand anymore):

1. `Song_Resources_Review.xlsx` → becomes `song_collection_review_export.xlsx`, generated from the DB for human review rounds. Same columns + `Version ID`, `Canonical Song`, `Year/Era/Region`, `Is Noise`, `Review Status`.
2. The **Sources** sheet (68 rows) and **Image-Based (No Text)** sheet (13 rows) → generated exports of `sources` (the latter filters `ocr_status = 'needs_ocr'`).
3. `MASTER_LIST.md` stays exactly as it is — it is the human queue/handoff document, and that's a *document's* job, not a database's.
4. `metadata/_extracted_songs.json` → becomes an **input artifact** (kept for provenance, no longer the source of truth).

The chain becomes: **source files + review decisions → `song_collection.db` (truth) → generated exports (spreadsheets/MASTER_LIST reports).**

---

## 8. Migration path — from JSON + XLSX to the schema, step by step

All steps are scripted (model the loader on the existing `extract_songs.py` / `build_spreadsheet.py` style) and each lands as a git commit.

1. **Create `data/song_collection.db`** and apply `metadata/song_collection_schema.sql` (the SQL above, committed to git first). Populate `eras`.
2. **Load `sources`** (68+ rows): distinct `source_file` values from `_extracted_songs.json` (all 1,183 records carry `source_file`, `source_title`, `creator`, `age_range`, `url`, `category`). Join in the Sources-sheet columns (Songs Extracted / Clean / OK / Numbered / Rough counts → can be recomputed later) and the **Image-Based sheet** → set `ocr_status = 'needs_ocr'`. Backfill v2 `year/era/region` from the per-category index docs (`metadata/0X-*.md` tables) as rounds complete — missing values default to `'not stated'` per the rules; do NOT guess.
3. **Load `song_versions`** (1,183 rows): one INSERT per JSON record, `extract_ref = '<category>[<index>]'` (UNIQUE → re-runs are idempotent: `INSERT ... ON CONFLICT(extract_ref) DO UPDATE`). Join `source_id` by `filename`. Carry `extraction_quality`, `age_range`, `notes`. Compute `normalized_title` in Python.
4. **Apply review flags:** import the noise/quality decisions recorded during review — set `is_noise = 1` + `noise_reason` on the ~79 flagged rows; set `review_status = 'rejected'` on noise, `'reviewed'` on rows the review confirmed.
5. **Seed canonical clusters:** group by `normalized_title`, auto-create `canonical_songs` for clusters with ≥2 versions (and singletons too — everything maps eventually), link `song_versions.canonical_song_id`, stamp `canonical_match = 'auto_suggested'`. Print a cluster report (title, count, distinct sources/years) for the historian's first pass.
6. **Wire OCR provenance:** read `metadata/ocr_results.json`, set `sources.ocr_txt_path` + `ocr_status`.
7. **Build the FTS index:** `INSERT INTO song_versions_fts(rowid, song_title, actions, lyrics) SELECT id, song_title, actions, lyrics FROM song_versions;`
8. **Generate exports** (review workbook, sources workbook) from the DB; update MASTER_LIST.md references.
9. **Git commit everything:** `song_collection.db`, the schema SQL, the loader script, and the `sources/` tree (`git add` the currently-untracked `sources/` folder). `curriculum.db` is NOT touched.
10. **(Later, optional bridge)** When lesson planning needs collection songs: add a mapping table in `curriculum.db` — e.g. `collection_song_links(id, canonical_song_id, curriculum_id, relevance)` — referencing `canonical_songs.id` by integer (safe across DBs in the same repo). Never copy lyrics into `curriculum.db`.

---

## 9. Indexes

```sql
-- sources
CREATE UNIQUE INDEX IF NOT EXISTS idx_sources_filename ON sources(filename);        -- (already UNIQUE on column; kept for clarity)
CREATE INDEX IF NOT EXISTS idx_sources_era      ON sources(era);
CREATE INDEX IF NOT EXISTS idx_sources_region   ON sources(region);
CREATE INDEX IF NOT EXISTS idx_sources_year_int ON sources(year_int);
CREATE INDEX IF NOT EXISTS idx_sources_category ON sources(category);

-- song_versions
CREATE INDEX IF NOT EXISTS idx_versions_source        ON song_versions(source_id);
CREATE INDEX IF NOT EXISTS idx_versions_canonical     ON song_versions(canonical_song_id);
CREATE INDEX IF NOT EXISTS idx_versions_normalized    ON song_versions(normalized_title);
CREATE INDEX IF NOT EXISTS idx_versions_noise_review  ON song_versions(is_noise, review_status);
CREATE INDEX IF NOT EXISTS idx_versions_quality       ON song_versions(extraction_quality);
CREATE UNIQUE INDEX IF NOT EXISTS idx_versions_extract_ref ON song_versions(extract_ref);  -- (idempotent imports)

-- canonical_songs
CREATE UNIQUE INDEX IF NOT EXISTS idx_canonical_title ON canonical_songs(canonical_title); -- (already UNIQUE; kept for clarity)
CREATE INDEX IF NOT EXISTS idx_canonical_type        ON canonical_songs(song_type);

-- eras
CREATE UNIQUE INDEX IF NOT EXISTS idx_eras_era ON eras(era);
```

These cover every query the project has named or implied:
- by title → `idx_versions_normalized` (cluster discovery) + FTS5 (search);
- by year → `idx_sources_year_int` (join path for `ORDER BY sort_year`);
- by source → `idx_versions_source`;
- by region → `idx_sources_region` (e.g. "all UK sources, all versions");
- by noise/quality/review → `idx_versions_noise_review`, `idx_versions_quality`.

**FTS5 note:** `song_versions_fts` is an external-content FTS table; the loader rebuilds it (`INSERT INTO ... SELECT` after an `INSERT INTO song_versions_fts(song_versions_fts) VALUES('rebuild')`). No triggers — the Song Historian runs the loader after bulk edits, keeping sync logic in one place.

---

## 10. Guardrails for the Song Historian persona

1. **Never delete rows.** `is_noise` and `review_status` are the only "removal" mechanisms (matches MASTER_LIST.md philosophy).
2. **Every mutation of a mapping or review decision goes through `review_log`** — actor, action, old/new. This is what makes the collection defensible as research data.
3. **Lyrics edits** are allowed (fixing OCR garbage, splitting merged actions) but only with `review_status = 'reviewed'` and a `review_log` entry; raw OCR stays recoverable on disk via `sources.ocr_txt_path`.
4. **Canonical merges are manual and logged** — `normalized_title` equality only ever *suggests*.
5. **Run the loader idempotently** (`extract_ref` UNIQUE) — re-imports never duplicate.

---

## 11. What I deliberately did NOT do

- **Did not modify `curriculum.db`** — per the task constraints; also, per §1, it shouldn't be modified at all for this.
- **Did not design a separate `lyrics`/`actions` child-table structure** — full TEXT in `song_versions` is simpler and searchable; there is nothing that references sub-parts of lyrics.
- **Did not design auto-dedup by fuzzy matching** — versions are preserved; identity mapping is human-confirmed.
- **Did not add triggers for FTS sync or `updated_at`** — the loader owns both; fewer moving parts for a single-maintainer research DB.
- **Did not put `year/era/region` only on versions** — they're source-level per the research rules; version-level is an optional override.

---

## 12. TL;DR for the parent agent

- **New file `data/song_collection.db`** (SQLite, git-committed beside `curriculum.db`). Do not touch the production DB.
- **3 core tables:** `sources` (per-document provenance + mandatory v2 year/era/region), `song_versions` (per song-as-taught-in-a-source; full lyrics + actions as TEXT; the versioning layer), `canonical_songs` (identity layer linking all versions of the same song).
- **Plus:** `eras` (sortable era buckets), `review_log` (historian audit), `song_versions_fts` (full-text lyric search).
- **Dedup rule:** never collapse versions; dedupe identity only. "All versions of Twinkle Twinkle by year" = one JOIN + one WHERE on `canonical_song_id` + `ORDER BY sort_year` (§6).
- **Spreadsheet demoted** to a generated export of the DB; JSON becomes an input artifact; MASTER_LIST.md stays a human queue.
- **Migration:** one idempotent Python loader (`extract_ref` UNIQUE) doing JSON → sources → versions → noise/review flags → canonical clusters → OCR provenance → FTS → exports, committed in one pass (§8).
- **Indexes** per §9 cover title/year/source/region/review queries.
