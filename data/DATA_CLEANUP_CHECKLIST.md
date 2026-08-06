# Song and Curriculum Data Cleanup Checklist

**Purpose:** Living control document for collection, extraction, academic review, taxonomy, database migration, and publication QA.  
**Last reviewed:** 2026-08-05  
**Status legend:** `[ ]` not started · `[-]` in progress · `[x]` completed and checked · `[!]` blocked/decision needed

## Snapshot

- Source folders `01`–`09`: 249 primary files.
- Retrieval/processing log currently includes 156 `pending`, 64 `done`, 14 `needs-ocr`, 9 `done (ocr)`, 14 `snapshot`, 4 `thin (graphics)`, and 1 rejected duplicate.
- `Song_Index.xlsx`: 1,405 extracted rows.
- `metadata/source_manifest.json`: 262 entries, representing all 249 collected source files plus 13 OCR sidecars.
- `curriculum.db`: 561 catalog songs plus 64 circle-time songs.
- `song_tags_clean.json`: 561 legacy, free-text tag strings.
- `Master_Song_Curriculum_Sheet.xlsx`: 625 song rows; 523 age-range cells contain `Sheet1`, `Sheet2`, or `Sheet3` rather than an age range.
- Only 371 master rows have an Educational Domain, with 208 distinct values—clear evidence that this field is not controlled.

## 1. Governance and source of truth

- [x] Separate raw source collection from the production curriculum database.
- [x] Record the proposed `song_collection.db` design in `metadata/SQL_EXPERT_RECOMMENDATION.md`.
- [-] Review and approve [SONG_TAG_TAXONOMY_DRAFT.md](SONG_TAG_TAXONOMY_DRAFT.md).
- [ ] Decide whether `song_collection.db` is the research source of truth and spreadsheets are generated exports.
- [ ] Assign owners for collection, extraction, academic review, taxonomy review, and release approval.
- [ ] Define version numbers for schema, taxonomy, extraction rules, and exports.
- [ ] Require each agent run to update this checklist and append a run report.

## 2. Source inventory and provenance

- [x] Inventory source folders `01`–`09`.
- [x] Preserve unresolved-source lists instead of silently dropping blocked material.
- [ ] Reconcile every `MASTER_LIST.md` row with one primary source file.
- [ ] Separate original sources from OCR sidecars, page images, extracted Markdown, metadata, and generated outputs.
- [ ] Give every primary source a stable `source_id`.
- [ ] Store filename, local path, URL, creator, title, access date, file type, checksum, and source role.
- [ ] Backfill required v2 `year`, `era`, and `region` fields for every source; use `not stated` rather than guessing.
- [ ] Record language separately from region and cultural/traditional context.
- [ ] Record copyright/access status separately from “free to download.”
- [ ] Resolve exact-byte duplicate groups and preserve a `duplicate_of` relationship.
- [ ] Reconcile the master-list status counts with the 249 primary-file inventory.

## 3. Extraction and OCR

- [ ] Update the extraction pipeline to process folders `01`–`09`, not only `01`–`03`.
- [ ] Process the 156 currently pending queue entries.
- [ ] Recheck the 14 `needs-ocr` entries and connect completed OCR outputs to their sources.
- [ ] Review the 9 `done (ocr)` entries against page images.
- [ ] Decide how to represent the 4 `thin (graphics)` sources.
- [ ] Add a per-source extraction outcome: `complete`, `partial`, `needs_ocr`, `manual_review`, `no_song_content`, or `rejected`.
- [ ] Require page/section locators for every extracted record.
- [ ] Separate printed actions from lyrics, headings, lesson prose, navigation text, and web-page boilerplate.
- [ ] Flag large single-block extractions and implausible titles for review.
- [ ] Keep raw extraction text recoverable after cleanup.
- [ ] Re-run extraction deterministically and confirm that reruns do not duplicate records.

## 4. Content-type separation

- [ ] Audit all 1,405 `Song_Index.xlsx` rows as song, song version, fingerplay, activity, lesson plan, guide, book suggestion, printable, craft, standards/framework content, or noise.
- [ ] Move non-song educational resources into appropriate resource/activity entities instead of treating them as songs.
- [ ] Preserve rejected/noise rows with a reason; do not delete research history.
- [ ] Apply the known noise review flags from the existing review work.
- [ ] Create structured entities for activities, lesson plans, books, printables, and teacher guides where repeated use justifies them.
- [ ] Keep source-document identity separate from extracted-item identity.

## 5. Song identity and versioning

- [ ] Create canonical-song identities without collapsing documented versions.
- [ ] Normalize titles for candidate matching only.
- [ ] Manually confirm canonical merges and aliases.
- [ ] Keep regional, historical, lyrical, action, and arrangement differences at the song-version level.
- [ ] Record every merge, split, rejection, and text correction in an audit log.
- [ ] Review overlaps between the 561 catalog songs, 64 circle-time songs, and extracted song versions.
- [ ] Define a safe bridge between the research collection and `curriculum.db` without copying research blobs into the production database.

## 6. Tag taxonomy

- [x] Draft Topic, Skill Concept, Participation Modality, Routine Slot, Song/Activity Type, Music Concept, Energy Level, and Teaching Style definitions.
- [x] Identify Energy Level and Teaching Style as song-use attributes rather than ordinary multi-tags.
- [x] Remove `Multicultural` from Song Form; replace it with evidence-backed language, region, and cultural/traditional context fields.
- [x] Pilot the taxonomy on a stratified set of at least 30 records: catalog songs, library handouts, historical versions, bilingual sources, method documents, and lesson/activity sources.
- [ ] Define inclusion rules and non-examples for every approved value.
- [ ] Confirm every approved tag is used by at least two records.
- [ ] Decide the entity level for each tag type: canonical song, song version, or song use.
- [ ] Define how editorial inference differs from source-explicit classification.
- [ ] Freeze taxonomy v1 before bulk retagging.
- [ ] Migrate all 561 free-text tag strings from `song_tags_clean.json` into controlled rows and links.
- [ ] Produce a legacy-tag crosswalk and unresolved-values queue.
- [ ] Validate single-value constraints for Energy Level and Teaching Style within a song use.
- [ ] Add automated checks for duplicate tags, orphan links, retired tags, and tags used by fewer than two records.

## 7. Academic cross-examination

- [x] Create a research-evidence register with document, framework/method, page, direct excerpt, concept, age band, and implication for the data model.
- [-] Review the Feierabend materials for beat, meter, form, movement, listening, repertoire, and assessment concepts. Core assessment and non-music-teacher documents are reviewed; longer handouts remain.
- [-] Review the Kodály preview for repertoire selection, song analysis, literacy sequence, tonal/rhythmic concepts, and pedagogical use. Pilot-relevant Chapter 1 pages are verified; remaining chapters are not yet integrated.
- [x] Review NAEYC/Head Start sources for developmental, language, relationship, regulation, and inclusive-practice claims.
- [ ] Review Montessori and Waldorf sources for movement, sensory, silence/listening, routine, and seasonal-use claims without treating method-specific practice as universal.
- [ ] Review Nevada, Georgia, Nashua, Scranton, and other standards/curriculum documents for music concepts and age expectations.
- [ ] Review bilingual and multilingual sources for language, community, and cultural provenance fields.
- [ ] Keep standards alignment in dedicated join tables; do not turn standards codes into tags.
- [ ] Mark contradictions or framework-specific differences instead of forcing one universal claim.
- [ ] Require a human reviewer before an academic finding changes controlled vocabulary or publication-facing claims.

## 8. Existing database and workbook cleanup

- [ ] Replace 523 invalid `Sheet1/Sheet2/Sheet3` age-range values with evidence-backed age bands or `not stated`.
- [ ] Collapse the 208 Educational Domain values into approved controlled concepts after review.
- [ ] Audit the seven keyword-inferred Type values in `Master_Song_Curriculum_Sheet.xlsx`.
- [ ] Replace keyword-only type/material inference with reviewed values and retained evidence basis.
- [ ] Review lyrics coverage and distinguish missing, unavailable, intentionally omitted, OCR pending, and verified.
- [ ] Review actions coverage and distinguish printed actions from editorial suggestions.
- [ ] Reconcile `topic`, `theme`, Educational Domain, tags, curriculum links, and early-years links so each has one documented meaning.
- [ ] Check the 1,991 song-to-curriculum links for relevance, over-linking, and unsupported matches.
- [ ] Check early-years and music-stage links against the academic evidence register.
- [ ] Keep provenance/review fields in the database even if teacher-facing exports hide them.

## 9. Database implementation

- [ ] Approve or revise the proposed `song_collection.db` schema.
- [ ] Add structured source, song-version, canonical-song, tag, evidence, and review-log tables.
- [ ] Add song-use records for Routine Slot, Energy Level, Teaching Style, and lesson-specific rationale.
- [ ] Add validation constraints and indexes.
- [ ] Build an idempotent loader from source metadata, extraction outputs, OCR results, and review decisions.
- [ ] Import without modifying `curriculum.db` until the bridge design is approved.
- [ ] Run foreign-key, duplicate, null-field, enum, and full-text-search checks.
- [ ] Back up and verify the database before any migration replaces an existing product.

## 10. Generated exports and application use

- [ ] Generate review workbooks from the database; do not maintain competing truths by hand.
- [ ] Separate internal QA columns from teacher-facing export columns.
- [ ] Include stable IDs in internal exports.
- [ ] Ensure public views do not expose unsupported academic claims or unnecessary full-text copyrighted material.
- [ ] Update `build_master_v3.py` after taxonomy/schema approval; current keyword inference remains provisional.
- [ ] Add application filters only after controlled values and counts are stable.
- [ ] Verify that app labels match the taxonomy display names and definitions.

## 11. QA and release gates

- [ ] No source is published without provenance and review status.
- [ ] No tag is published without an approved definition.
- [ ] No standards claim is published without a source and locator.
- [ ] No editorial inference is presented as source fact.
- [ ] No canonical merge occurs without review history.
- [ ] No OCR correction overwrites the recoverable raw extraction.
- [ ] Spot-check at least 10% of records per source category and 100% of low-confidence records.
- [ ] Run accessibility, cultural-context, and age-appropriateness review on publication-facing descriptions.
- [ ] Record known limitations and unresolved disagreements in the release notes.

## Agent run report template

Append one block per run:

```text
Date/time:
Agent/role:
Scope:
Inputs reviewed:
Records/files examined:
Completed:
Changed vocabulary or schema:
Evidence added:
QA results:
Blockers/decisions needed:
Files changed:
Next recommended action:
```

## Run history

### 2026-08-05 — Checklist initialization

- Reviewed current source folders, queue statuses, `Song_Index.xlsx`, `Master_Song_Curriculum_Sheet.xlsx`, `song_tags_clean.json`, build scripts, the existing SQL recommendation, and the proposed tag revision.
- Created the taxonomy draft and this cross-project checklist.
- No database or workbook data was modified.

### 2026-08-05 — 30-record taxonomy and evidence pilot

- Selected 30 records across production catalog rows, classroom uses, library versions, historical sources, bilingual examples, official guidance, and method texts.
- Page-verified the full six-page NAEYC article and pilot-relevant pages in the Oxford Kodály and Nevada pre-K documents; reviewed the Head Start source and two Feierabend method documents.
- Confirmed that the current v3 master uses `curriculum.db` and `song_tags_clean.json` but does not integrate `Song_Index.xlsx`, the source manifest, version Markdown, OCR outputs, or structured academic evidence.
- Recorded correction cases including duplicate recordings, medleys stored as songs, trailing JSON in lyrics, adjacent-section contamination, index/page-number noise, and the incorrect `Little Sally Water` domain.
- Created `outputs/song-pilot-20260805/Song_Tag_Pilot_30.md` and `outputs/song-pilot-20260805/Academic_Evidence_and_Research_Brief.md`.
- No database or existing workbook data was modified.
- Final `.xlsx` and `.docx` packaging remains pending because the workspace artifact dependency loader is unavailable in this session.
