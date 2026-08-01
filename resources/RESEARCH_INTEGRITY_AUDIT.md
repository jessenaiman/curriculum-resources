# Research Integrity Audit — New project/resources
**Generated:** 2026-08-01 · **Auditor:** Hermes agent (deepseek-v4-flash)
**Method:** Web backend was broken (firecrawl pinned, no Portal credits) from ~Jul 28. Files were
checked for: (1) presence of URLs, (2) URL liveness (curl), (3) citation verification against
Crossref DOI registry (free API). No LLM tokens burned in verification.

---

## Bottom line

**~2,700 of ~9,000 lines** of research content in this folder were produced WITHOUT working web
access (Aug 1 files, 0–2 URLs each). The July 31 files have real, resolving URLs. Individual
files below.

---

## VERIFIED ✅ (web-sourced, URLs resolve)

| File | Lines | URLs | Notes |
|---|---|---|---|
| early_years_songs.md | 1449 | 110 | URLs curl-tested, resolve (200/403=bot-block, real) |
| early_years_nature_songs.md | 459 | 36 | Same — real URLs |

## PARTIALLY VERIFIED ⚠️ (some links, needs spot-checks)

| File | Lines | URLs | Notes |
|---|---|---|---|
| kathy_teaching_guide.md | 293 | 4 | 4 links, content is teaching guide |
| kathy_songs_research.md | 1111 | 2 | 2 links only — mostly unverified claims |
| songs_batch1.md | 172 | 1 | 1 link |
| songs_batch2.md | 158 | 2 | 2 links |

## UNVERIFIED ❌ (0 URLs = training-data output)

| File | Lines | Risk |
|---|---|---|
| early_childhood_song_research.md | 352 | High — core research doc |
| circle_time_songs_reference.md | 484 | High |
| early_years_artist_catalogue.md | 483 | High |
| early_years_movement_songs.md | 182 | Med |
| influential_childrens_music_artists.md | 210 | High |
| songs_batch3.md | 274 | Med |
| traditional_folk_songs_for_curriculum.md | 419 | High |
| review_folk_educator_1.md | 549 | Med (reviews of other files) |
| review_folk_educator_2.md | 1176 | Med |
| review_folk_educator_3.md | 788 | Med |
| verification_artist_catalogue.md | 551 | Audit files — honest but blind |
| verification_movement_nature.md | 134 | same |
| verification_songs.md | 245 | same |

---

## Citation audit (music_education_research_findings.md) — DONE ✅

27 citations now carry verified DOI links (Crossref). **4 flagged UNVERIFIED:**

- **Hesse, Grossman & Sabine (2022)** "Music training and attention in children" — **NO SUCH PAPER FOUND** (likely fabricated)
- **Hutcheson (2016)** "impact of music on childhood cognitive development" — resolves to composer Ernest Hutcheson (Grove), not the claimed research
- **OAKE (2020)** — no retrievable position statement
- **NAfME (2023)** — position statement exists at nafme.org but unlinked

**Also corrected/marked [closest match]:**
- Young (2014) → actual RSME paper is 2016 (10.1177/1321103X16640106)
- Goswami (2011) → DOI points to Phil Trans B but title doesn't match exactly — re-check
- Welch et al. (2009) "Singing and brain development" → closest is Oxford Handbook of Singing chapter (2019)
- Fancourt et al. (2017) → closest PLOS ONE 2016 drumming study

**Confirmed real (DOIs verified):** Kraus 2010 (nrn2882), Trainor 2012, Schlaug 2009, Pantev 2001,
Rauscher 1993, Schellenberg 2004+2006, Moreno 2011, Schön 2008, Phillips-Silver & Trainor 2005,
Kirschner & Tomasello 2010, Cirelli 2014, Rabinowitch 2013, Gouzouasis 2007, Malloch & Trevarthen
2009, Keller & Dalla Bella 2017, Trevarthen & Malloch 2018, Bartleet & Sunderland 2022.

---

## What this means for the app

1. **Do not ship** curriculum claims from the ❌ files without re-verification.
2. **Priority redo order:** early_childhood_song_research.md → circle_time_songs_reference.md →
   traditional_folk_songs_for_curriculum.md → influential_childrens_music_artists.md →
   early_years_artist_catalogue.md (the ones feeding the app's content).
3. **The good news:** the earlier verification files (verification_*.md) did an honest blind audit —
   most "DOUBTFUL" flags were correct suspicions. The redo can build on those.

---

## Prevention

- The root cause was `web.backend: firecrawl` with no key/credits — fixed 2026-08-01 (tavily).
- **Lesson:** agents must verify web tools actually work before claiming web research.
  Future sessions: check `web.backend` + key presence at session start.
