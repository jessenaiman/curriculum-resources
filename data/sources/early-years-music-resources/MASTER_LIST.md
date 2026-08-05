# MASTER LIST — Collected Song-Teaching Resource Files

**Purpose:** The single handoff document between the **Retrieval Agent** and the
**Processing Agent** (later: the Song Historian persona).

- **Retrieval Agent writes here:** when it downloads a file, it appends one row
  (file, source, category folder, retrieval date) and marks status `pending`.
  It does NOT extract, verify lyrics, or write metadata — that is processing work.
- **Processing Agent reads here:** works through `pending` rows, checks them off
  (`done` / `needs-ocr` / `rejected`), and writes the extracted data + metadata.
- Rows are never deleted — every file that entered the collection stays visible.

**Status legend:**
- `pending` — downloaded, awaiting processing (no extraction done yet)
- `done` — processed: lyrics/actions extracted and metadata recorded
- `needs-ocr` — image-based PDF (no text layer); OCR or manual entry required
- `rejected` — not a song resource / unusable / duplicate
- `snapshot` — HTML/text capture saved (page itself is the resource)

---

## Queue (work through in order)

| # | File | Source title | Creator | Folder | Type | Date added | Status | Processor | Notes |
|---|------|--------------|---------|--------|------|------------|--------|-----------|-------|
| _(populated by retrieval runs; see per-run logs below)_ | | | | | | | | | |

---

## Round 1 retrieval log (2026-08-04)

| # | File | Folder | Status |
|---|------|--------|--------|
| 1 | ala-alsc-sample-storytime-asides.pdf | 01-libraries-agencies/pdf | done |
| 2 | alaeditions-essential-lapsit-guide-web-extras.pdf | 01-libraries-agencies/pdf | done |
| 3 | chicago-public-library-every-child-ready-to-read.html | 01-libraries-agencies/web | snapshot |
| 4 | clive-public-library-baby-lap-time-rhymes.pdf | 01-libraries-agencies/pdf | done |
| 5 | demco-lets-make-music-dance.pdf | 01-libraries-agencies/pdf | done |
| 6 | des-plaines-public-library-baby-storytime-rhymes.pdf | 01-libraries-agencies/pdf | done |
| 7 | earlylit-saroj-ghoting-handouts-activities.html | 01-libraries-agencies/web | snapshot |
| 8 | evanston-public-library-ecrr-singing.html | 01-libraries-agencies/web | snapshot |
| 9 | great-scott-county-lle-booklet-0-24mo.pdf | 01-libraries-agencies/pdf | done |
| 10 | haverhill-public-library-baby-bounce-rhymes.pdf | 01-libraries-agencies/pdf | done |
| 11 | health-unit-nursery-rhymes-circle-time-cards.pdf | 01-libraries-agencies/pdf | done |
| 12 | isabella-plains-ecs-50-songs-rhymes-preschool.pdf | 01-libraries-agencies/pdf | done |
| 13 | kcls-tell-me-a-story-baby-rhymes.html | 01-libraries-agencies/web | snapshot |
| 14 | la-county-library-storytime-rhymes.pdf | 01-libraries-agencies/pdf | done |
| 15 | library-of-michigan-rtrm-toolkit-2020.txt | 01-libraries-agencies/web | snapshot |
| 16 | library-toolshed-early-literacy-virtual-storytimes.pdf | 01-libraries-agencies/pdf | done |
| 17 | lit-for-life-bouncy-rhymes.pdf | 01-libraries-agencies/pdf | done |
| 18 | lvccld-storytime-resources-outline.pdf | 01-libraries-agencies/pdf | done |
| 19 | mid-north-coast-library-baby-bounce-booklet.pdf | 01-libraries-agencies/pdf | done |
| 20 | montana-state-library-ready2read-songs.pdf | 01-libraries-agencies/pdf | done |
| 21 | multnomah-county-library-read-talk-sing-write-play.pdf | 01-libraries-agencies/pdf | done |
| 22 | ohio-ready-to-read-rhyme-with-me.pdf | 01-libraries-agencies/pdf | done |
| 23 | pawling-free-library-wiggle-rhymes.html | 01-libraries-agencies/web | snapshot |
| 24 | pierce-county-library-wiggles-tickles-rhymes.pdf | 01-libraries-agencies/pdf | done |
| 25 | richland-library-fingerplays-songs.html | 01-libraries-agencies/web | snapshot |
| 26 | state-library-victoria-lets-read-toolkit.pdf | 01-libraries-agencies/pdf | done |
| 27 | stillwater-public-library-baby-toddler-storytime-handout.pdf | 01-libraries-agencies/pdf | done |
| 28 | swanton-public-library-bounce-rhymes.pdf | 01-libraries-agencies/pdf | needs-ocr |
| 29 | tacoma-public-library-storytime-rhymes-songs.pdf | 01-libraries-agencies/pdf | done |
| 30 | tompkins-county-library-virtual-baby-storytime.pdf | 01-libraries-agencies/pdf | done |
| 31 | uark-ecep-favorite-songs-fingerplays.pdf | 01-libraries-agencies/pdf | done |
| 32 | wagga-wagga-library-baby-bounce-songs-rhymes.pdf | 01-libraries-agencies/pdf | done |
| 33 | wyoming-state-library-sing-practice.html | 01-libraries-agencies/web | snapshot |
| 34 | ypsilanti-district-library-storytime-songs.html | 01-libraries-agencies/web | snapshot |
| 35 | 2care2teach4kids-chubby-snowman.pdf | 02-educators-publishers/pdf | done |
| 36 | 2care2teach4kids-five-little-ladybugs.pdf | 02-educators-publishers/pdf | done |
| 37 | 2care2teach4kids-five-little-monkey.pdf | 02-educators-publishers/pdf | done |
| 38 | 2care2teach4kids-five-little-pumpkins.pdf | 02-educators-publishers/pdf | done |
| 39 | 2care2teach4kids-hello-how-are-you.pdf | 02-educators-publishers/pdf | done |
| 40 | 2care2teach4kids-is-here-today.pdf | 02-educators-publishers/pdf | done |
| 41 | 2care2teach4kids-the-itsy.pdf | 02-educators-publishers/pdf | done |
| 42 | abc-jesus-loves-me-fingerplays-action-songs.html | 02-educators-publishers/web | snapshot |
| 43 | bcs-pre-k-songs-chants-fingerplays-transitions.pdf | 02-educators-publishers/pdf | done |
| 44 | deposit-csd-kindergarten-music-curriculum.pdf | 02-educators-publishers/pdf | done |
| 45 | dr-jean-finger-plays-booklet.pdf | 02-educators-publishers/pdf | done |
| 46 | good-days-with-kids-circle-time-songs-toddlers.pdf | 02-educators-publishers/pdf | done |
| 47 | health-unit-nursery-rhymes-fingerplays-songs-cards.pdf | 02-educators-publishers/pdf | done |
| 48 | lets-play-music-colours-lesson-plan.pdf | 02-educators-publishers/pdf | done |
| 49 | lets-play-music-feelings-lesson-plan.pdf | 02-educators-publishers/pdf | done |
| 50 | naeyc-beyond-twinkle-twinkle.pdf | 02-educators-publishers/pdf | done |
| 51 | nc-dpi-mep-lesson-plan-template.docx | 02-educators-publishers/doc | done |
| 52 | oxford-kodaly-in-kindergarten-classroom-preview.pdf | 02-educators-publishers/pdf | done |
| 53 | prekinders-nursery-rhyme-posters-set1.pdf | 02-educators-publishers/pdf | done |
| 54 | prekinders-nursery-rhyme-posters-set2.pdf | 02-educators-publishers/pdf | done |
| 55 | san-diego-unified-kindergarten-music.pdf | 02-educators-publishers/pdf | done |
| 56 | sc-school-kindergarten-music-movement-activities.pdf | 02-educators-publishers/pdf | needs-ocr |
| 57 | storytime-standouts-a-sailor-went-to-sea.pdf | 02-educators-publishers/pdf | done |
| 58 | storytime-standouts-eensy-weensy-spider.pdf | 02-educators-publishers/pdf | done |
| 59 | storytime-standouts-five-little-ducks.pdf | 02-educators-publishers/pdf | done |
| 60 | storytime-standouts-five-little-farmers.pdf | 02-educators-publishers/pdf | done |
| 61 | storytime-standouts-jelly-in-the-bowl.pdf | 02-educators-publishers/pdf | done |
| 62 | storytime-standouts-little-peter-rabbit.pdf | 02-educators-publishers/pdf | done |
| 63 | storytime-standouts-wheels-on-the-bus.pdf | 02-educators-publishers/pdf | done |
| 64 | uark-ecec-favorite-songs-and-fingerplays.pdf | 02-educators-publishers/pdf | rejected (duplicate of uark-ecep) |
| 65 | uccs-family-development-center-dr-seuss-lesson-plan.docx | 02-educators-publishers/doc | done |
| 66 | dream-english-teaching-ideas-ebook.pdf | 03-performers-programs/pdf | done |
| 67 | jack-hartmann-a-to-z-flash-cards.pdf | 03-performers-programs/pdf | needs-ocr |
| 68 | jack-hartmann-stretchy-word-snake-coloring-activity.pdf | 03-performers-programs/pdf | needs-ocr |
| 69 | laurie-berkner-band-berkner-bytes-movement-pack-1.pdf | 03-performers-programs/pdf | done |
| 70 | laurie-berkner-band-berkner-bytes-preschool-readiness-pack-1.pdf | 03-performers-programs/pdf | done |
| 71 | laurie-berkner-band-berkner-bytes-preschool-routine-pack.pdf | 03-performers-programs/pdf | done |
| 72 | macaroni-soup-miss-carole-red-red-robin-sticks-dance.html | 03-performers-programs/web | snapshot |
| 73 | macaroni-soup-miss-carole-song-archive.html | 03-performers-programs/web | snapshot |
| 74 | macaroni-soup-miss-carole-the-shaker-hop.html | 03-performers-programs/web | snapshot |
| 75 | mother-goose-club-five-little-monkeys-activity-book.pdf | 03-performers-programs/pdf | needs-ocr |
| 76 | mother-goose-club-five-little-monkeys-lyric-book.pdf | 03-performers-programs/pdf | needs-ocr |
| 77 | mother-goose-club-itsy-bitsy-spider-lyric-book.pdf | 03-performers-programs/pdf | needs-ocr |
| 78 | nancy-kopman-senses-lyrics.pdf | 03-performers-programs/pdf | done |
| 79 | nancy-kopman-the-seasons-lyrics.pdf | 03-performers-programs/pdf | done |
| 80 | nancy-stewart-sing-into-reading-workshop-handout.pdf | 03-performers-programs/pdf | done |
| 81 | nancy-stewart-singable-songs-for-storytimes.pdf | 03-performers-programs/pdf | done |
| 82 | raffi-baby-beluga-lyrics-arrangement.pdf | 03-performers-programs/pdf | needs-ocr |
| 83 | raffi-down-by-the-bay-lyrics-arrangement.pdf | 03-performers-programs/pdf | needs-ocr |
| 84 | raffi-wheels-on-the-bus-lyrics-arrangement.pdf | 03-performers-programs/pdf | needs-ocr |
| 85 | supersimple-songs-hello-flashcards.pdf | 03-performers-programs/pdf | done |
| 86 | supersimple-songs-itsy-bitsy-spider-flashcards.pdf | 03-performers-programs/pdf | done |
| 87 | supersimple-songs-skidamarink-flashcards.pdf | 03-performers-programs/pdf | done |
| 88 | supersimple-songs-twinkle-twinkle-little-star-lyrics-poster.pdf | 03-performers-programs/pdf | done |
| 89 | the-learning-groove-free-song-lyrics-activities.html | 03-performers-programs/web | snapshot |
| 90 | the-learning-station-brain-boosting-music-movement-handout.pdf | 03-performers-programs/pdf | needs-ocr |
| 91 | the-learning-station-tony-chestnut-activity-handout.pdf | 03-performers-programs/pdf | needs-ocr |
| 92 | the-wiggles-dice-roll-activity.pdf | 03-performers-programs/pdf | needs-ocr |
| 93 | the-wiggles-wiggle-and-learn-circus-colouring.pdf | 03-performers-programs/pdf | needs-ocr |

## Round 2 retrieval log (2026-08-04, verified complete — 75 files, all magic-byte OK)

All round-2 files verified on disk (04: 25, 05: 25, 06: 25). Metadata reports in `metadata/`:
`04-historical-public-domain.md`, `05-libraries-deep.md`, `06-educators-performers-deep.md`
(+ `-unresolved.md` each). Rows below remain `pending` until the processing agent works them.

| # | File | Folder | Status |
|---|------|--------|--------|
| 94 | booktrust-rhyme-sheet-animals-and-nature-welsh.pdf | 05-libraries-deep/pdf | pending |
| 95 | booktrust-rhyme-sheet-animals-and-nature.pdf | 05-libraries-deep/pdf | pending |
| 96 | booktrust-rhyme-sheet-bird-themed.pdf | 05-libraries-deep/pdf | pending |
| 97 | booktrust-rhyme-sheet-wind-the-bobbin-up-five-little-ducks.pdf | 05-libraries-deep/pdf | pending |
| 98 | edmonton-public-library-welcome-baby-rhyme-booklet.pdf | 05-libraries-deep/pdf | pending |
| 99 | evansville-vanderburgh-storytime-to-go.pdf | 05-libraries-deep/pdf | pending |
| 100 | libraries-ni-rhyme-challenge-fish-alive.pdf | 05-libraries-deep/pdf | pending |
| 101 | libraries-ni-rhyme-challenge-five-little-monkeys.pdf | 05-libraries-deep/pdf | pending |
| 102 | libraries-ni-rhyme-challenge-jack-and-jill.pdf | 05-libraries-deep/pdf | pending |
| 103 | libraries-ni-rhyme-challenge-miss-polly.pdf | 05-libraries-deep/pdf | pending |
| 104 | libraries-ni-rhyme-challenge-row-your-boat.pdf | 05-libraries-deep/pdf | pending |
| 105 | logan-libraries-f5f-grand-old-duke-of-york.pdf | 05-libraries-deep/pdf | pending |
| 106 | logan-libraries-f5f-incy-wincy-spider.pdf | 05-libraries-deep/pdf | pending |
| 107 | logan-libraries-f5f-round-and-round-the-garden.pdf | 05-libraries-deep/pdf | pending |
| 108 | merri-bek-libraries-rhymetime-favourites.pdf | 05-libraries-deep/pdf | pending |
| 109 | perth-union-library-baby-songs-rhymes-storytime.pdf | 05-libraries-deep/pdf | pending |
| 110 | sunshine-coast-libraries-rhymes-with-ryan-ep1-song-sheet.pdf | 05-libraries-deep/pdf | pending |
| 111 | sunshine-coast-libraries-rhymes-with-ryan-ep2-song-sheet.pdf | 05-libraries-deep/pdf | pending |
| 112 | winnipeg-public-library-rhymes-and-songs.pdf | 05-libraries-deep/pdf | pending |
| 113 | christchurch-city-libraries-baby-rhymes-a.html | 05-libraries-deep/web | pending |
| 114 | christchurch-city-libraries-baby-rhymes-b.html | 05-libraries-deep/web | pending |
| 115 | christchurch-city-libraries-baby-rhymes.html | 05-libraries-deep/web | pending |
| 116 | princeton-public-library-storytime-songs.html | 05-libraries-deep/web | pending |
| 117 | san-francisco-public-library-storytime-sweet-songs.html | 05-libraries-deep/web | pending |
| 118 | scottish-book-trust-bookbug-cross-cross-line-line.html | 05-libraries-deep/web | pending |
| 119 | ams-montessori-movement-music-in-classroom.pdf | 06-educators-performers-deep/pdf | pending |
| 120 | ella-jenkins-folkways-lyrics-sfw45073.pdf | 06-educators-performers-deep/pdf | pending |
| 121 | greg-and-steve-alphabetical-song-list-2020.pdf | 06-educators-performers-deep/pdf | pending |
| 122 | greg-and-steve-songs-by-subject.pdf | 06-educators-performers-deep/pdf | pending |
| 123 | makingmusicfun-itsy-bitsy-spider-leadsheet.pdf | 06-educators-performers-deep/pdf | pending |
| 124 | montessori-early-years-programme-2021.pdf | 06-educators-performers-deep/pdf | pending |
| 125 | nevada-prek-music-standards-teacher-guidebook-2020.pdf | 06-educators-performers-deep/pdf | pending |
| 126 | peter-alsop-kids-peace-song.pdf | 06-educators-performers-deep/pdf | pending |
| 127 | red-grammer-circle-of-light.pdf | 06-educators-performers-deep/pdf | pending |
| 128 | red-grammer-i-think-youre-wonderful.pdf | 06-educators-performers-deep/pdf | pending |
| 129 | red-grammer-see-me-beautiful.pdf | 06-educators-performers-deep/pdf | pending |
| 130 | usfa-sesame-street-fire-safety-educator-guide-2015.pdf | 06-educators-performers-deep/pdf | pending |
| 131 | usfa-sesame-street-fire-safety-family-guide-2015.pdf | 06-educators-performers-deep/pdf | pending |
| 132 | vh1-save-the-music-principals-guide-2010.pdf | 06-educators-performers-deep/pdf | pending |
| 133 | cedarwood-waldorf-song-and-verse.html | 06-educators-performers-deep/web | pending |
| 134 | earthschooling-basic-waldorf-verses.html | 06-educators-performers-deep/web | pending |
| 135 | ella-jenkins-find-a-song-catalog.html | 06-educators-performers-deep/web | pending |
| 136 | hap-palmer-lyrics-and-activities.html | 06-educators-performers-deep/web | pending |
| 137 | headstart-1-2-3-dance-with-me.html | 06-educators-performers-deep/web | pending |
| 138 | headstart-music-in-child-development.md | 06-educators-performers-deep/web | pending |
| 139 | jbrary-toddler-storytime-wiggles-songs.html | 06-educators-performers-deep/web | pending |
| 140 | jbrary-welcome-and-hello-songs.html | 06-educators-performers-deep/web | pending |
| 141 | music-together-song-samples.html | 06-educators-performers-deep/web | pending |
| 142 | pbs-daniel-tiger-strategy-songs-article.html | 06-educators-performers-deep/web | pending |
| 143 | usfa-sesame-fire-drill-song-script.txt | 06-educators-performers-deep/web | pending |
| 144 | froebel-mother-play-nursery-songs-1906.pdf | 04-historical-public-domain/pdf | pending |
| 145 | gaynor-songs-child-world-1897.pdf | 04-historical-public-domain/pdf | pending |
| 146 | gaynor-songs-child-world-no2-1904.pdf | 04-historical-public-domain/pdf | pending |
| 147 | gaynor-tiny-tunes-book-1915.pdf | 04-historical-public-domain/pdf | pending |
| 148 | green-history-of-nursery-rhymes-1899.pdf | 04-historical-public-domain/pdf | pending |
| 149 | hofer-childrens-singing-games-1914.pdf | 04-historical-public-domain/pdf | pending |
| 150 | jenks-songs-games-little-ones-1887.pdf | 04-historical-public-domain/pdf | pending |
| 151 | mcconathy-music-hour-kindergarten-first-grade-1929.pdf | 04-historical-public-domain/pdf | pending |
| 152 | merrill-mother-gooses-melody-1843.pdf | 04-historical-public-domain/pdf | pending |
| 153 | moses-rhythmic-action-plays-dances-1915.pdf | 04-historical-public-domain/pdf | pending |
| 154 | newbery-original-mother-gooses-melody-1889.pdf | 04-historical-public-domain/pdf | pending |
| 155 | parker-progressive-music-series-one-book-1921.pdf | 04-historical-public-domain/pdf | pending |
| 156 | poulsson-finger-plays-nursery-kindergarten-1893.pdf | 04-historical-public-domain/pdf | pending |
| 157 | stanford-national-song-book-1906.pdf | 04-historical-public-domain/pdf | pending |
| 158 | walker-songs-games-little-ones-1911.pdf | 04-historical-public-domain/pdf | pending |
| 159 | ward-songs-for-little-ones-at-home-1852.pdf | 04-historical-public-domain/pdf | pending |
| 160 | gutenberg-babys-bouquet-1878.txt | 04-historical-public-domain/doc | pending |
| 161 | gutenberg-babys-opera-1877.txt | 04-historical-public-domain/doc | pending |
| 162 | gutenberg-gomme-traditional-games-england-scotland-ireland-vol1-1894.txt | 04-historical-public-domain/doc | pending |
| 163 | gutenberg-gomme-traditional-games-england-scotland-ireland-vol2-1898.txt | 04-historical-public-domain/doc | pending |
| 164 | gutenberg-only-true-mother-goose-melodies-1843.txt | 04-historical-public-domain/doc | pending |
| 165 | gutenberg-quigley-index-kindergarten-songs-1914.txt | 04-historical-public-domain/doc | pending |
| 166 | gutenberg-real-mother-goose-1916.txt | 04-historical-public-domain/doc | pending |
| 167 | newell-games-songs-american-children-1903.txt | 04-historical-public-domain/doc | pending |
| 168 | loc-american-folklife-childrens-songs-games-guide.html | 04-historical-public-domain/web | pending |

## Round 3 retrieval log (2026-08-04)

Round 3 = NEW regions/program types for libraries & agencies, saved to `08-libraries-more/`
(UK county/gov libraries, France, Wales, Quebec/Atlantic Canada French, BC/Atlantic attempts, US states
new to the collection: CT/FL/ID/UT/VA + national orgs, hospital/NICU program, Australia VIC).
All 19 files magic-byte verified (PDFs start %PDF; HTML pages contain the published rhyme content).
Fallbacks used: Python urllib (DCMS), Wayback Machine (Idaho/ULA/Monash originals 403/Cloudflare/Akamai).
Metadata/unresolved: `metadata/08-libraries-more-unresolved.md`. Rows remain `pending` for the processor.

| # | File | Folder | Status |
|---|------|--------|--------|
| 169 | bookstart-rhymetimes-training-factsheet-pack.pdf | 08-libraries-more/pdf | pending |
| 170 | cumbria-chat-play-share-rhymes-zoom-zoom-zoom.pdf | 08-libraries-more/pdf | pending |
| 171 | cumbria-chat-play-share-rhymes-jelly-on-a-plate.pdf | 08-libraries-more/pdf | pending |
| 172 | dcms-libraries-rhyme-times-maternal-mental-health.pdf | 08-libraries-more/pdf | pending |
| 173 | bradford-libraries-rhyme-challenge-2025-26-rhyme-sheets.html | 08-libraries-more/web | pending |
| 174 | winnipeg-public-library-comptines-et-chansons-fr.pdf | 08-libraries-more/pdf | pending |
| 175 | library-toolshed-rhymes-for-babies-toddlers-french.pdf | 08-libraries-more/pdf | pending |
| 176 | cdeacf-chansons-et-comptines.pdf | 08-libraries-more/pdf | pending |
| 177 | hsc-manitoba-nicu-early-literacy-pamphlet.pdf | 08-libraries-more/pdf | pending |
| 178 | empower-simcoe-infant-early-literacy-booklet.pdf | 08-libraries-more/pdf | pending |
| 179 | cc-vsa-comptines-et-chansons-2022.pdf | 08-libraries-more/pdf | pending |
| 180 | ndna-wales-songs-rhymes-welsh-factsheet.pdf | 08-libraries-more/pdf | pending |
| 181 | cybrarium-bilingual-storytime-takeout.pdf | 08-libraries-more/pdf | pending |
| 182 | perrot-memorial-library-storytime-rhymes.html | 08-libraries-more/web | pending |
| 183 | idaho-commission-libraries-bilingual-storytime.pdf | 08-libraries-more/pdf | pending |
| 184 | webjunction-bilingual-storytimes-slides.pdf | 08-libraries-more/pdf | pending |
| 185 | ula-spanish-storytime-favorites.pdf | 08-libraries-more/pdf | pending |
| 186 | vla-salta-bilingual-storytime-slides.pdf | 08-libraries-more/pdf | pending |
| 187 | monash-library-baby-time-songs-rhymes.pdf | 08-libraries-more/pdf | pending |

## Round 3 retrieval log — 09-educators-performers-more (2026-08-04, verified — 41 files, all magic-byte OK)

Round 3 for educators/publishers/performers, saved to `09-educators-performers-more/`.
34 PDFs + 7 HTML snapshots from NEW creators/programs: musicians (Okee Dokee Brothers,
Justin Roberts, StoryBots), curricula (First Steps in Music / Feierabend-GIA, Carnegie
Hall Musical Explorers, Prodigies), educators (TeachMommyTeach, Teach Preschool Music,
Songs for Teaching, The Teacher's Guide, Music for Kiddos, Kira Willey), districts/states
(Nashua NH, Scranton PA, Georgia Pre-K). Unresolved: `metadata/09-educators-performers-more-unresolved.md`.
Rows remain `pending` until the processing agent works them.

| # | File | Folder | Status |
|---|------|--------|--------|
| 188 | carnegie-musical-explorers-sg1-song.pdf | 09-educators-performers-more/pdf | pending |
| 189 | carnegie-musical-explorers-sg2-city-sounds.pdf | 09-educators-performers-more/pdf | pending |
| 190 | carnegie-musical-explorers-sg3-diy-instruments.pdf | 09-educators-performers-more/pdf | pending |
| 191 | carnegie-musical-explorers-sg4-postcard.pdf | 09-educators-performers-more/pdf | pending |
| 192 | carnegie-musical-explorers-sg5-6-world-map.pdf | 09-educators-performers-more/pdf | pending |
| 193 | feierabend-classical-music-beat-meter-form.pdf | 09-educators-performers-more/pdf | pending |
| 194 | feierabend-creative-movement-handout.pdf | 09-educators-performers-more/pdf | pending |
| 195 | feierabend-first-steps-2020-supplement.pdf | 09-educators-performers-more/pdf | pending |
| 196 | feierabend-first-steps-assessment-form.pdf | 09-educators-performers-more/pdf | pending |
| 197 | feierabend-first-steps-non-music-teachers.pdf | 09-educators-performers-more/pdf | pending |
| 198 | feierabend-first-steps-preschool-beyond-preview.pdf | 09-educators-performers-more/pdf | pending |
| 199 | feierabend-move-move-move-handout.pdf | 09-educators-performers-more/pdf | pending |
| 200 | feierabend-music-movement-early-years-handout.pdf | 09-educators-performers-more/pdf | pending |
| 201 | georgia-prek-content-standards-music.pdf | 09-educators-performers-more/pdf | pending |
| 202 | justin-roberts-how-lucky-we-are-guitar.pdf | 09-educators-performers-more/pdf | pending |
| 203 | justin-roberts-koala-bear-diner-sheet-music.pdf | 09-educators-performers-more/pdf | pending |
| 204 | justin-roberts-lemonade-cello-sheet-music.pdf | 09-educators-performers-more/pdf | pending |
| 205 | justin-roberts-lemonade-uke-sheet-music.pdf | 09-educators-performers-more/pdf | pending |
| 206 | justin-roberts-musical-scavenger-hunt.pdf | 09-educators-performers-more/pdf | pending |
| 207 | justin-roberts-willy-was-a-whale-guitar.pdf | 09-educators-performers-more/pdf | pending |
| 208 | justin-roberts-willy-was-a-whale-piano.pdf | 09-educators-performers-more/pdf | pending |
| 209 | justin-roberts-yellow-bus-sheet-music.pdf | 09-educators-performers-more/pdf | pending |
| 210 | nashua-schools-pk8-music-curriculum.pdf | 09-educators-performers-more/pdf | pending |
| 211 | okee-dokee-brothers-pre-concert-study-guide.pdf | 09-educators-performers-more/pdf | pending |
| 212 | prodigies-free-starter-lesson-plan-sheet-music.pdf | 09-educators-performers-more/pdf | pending |
| 213 | scranton-sd-elementary-music-curriculum-kg5.pdf | 09-educators-performers-more/pdf | pending |
| 214 | storybots-abc-coloring-activity.pdf | 09-educators-performers-more/pdf | pending |
| 215 | storybots-animals-coloring-activity.pdf | 09-educators-performers-more/pdf | pending |
| 216 | teachmommyteach-composing-printable.pdf | 09-educators-performers-more/pdf | pending |
| 217 | teachmommyteach-high-low-animal-sounds.pdf | 09-educators-performers-more/pdf | pending |
| 218 | teachmommyteach-hot-cross-buns-props.pdf | 09-educators-performers-more/pdf | pending |
| 219 | teachmommyteach-loud-soft-sounds.pdf | 09-educators-performers-more/pdf | pending |
| 220 | teachmommyteach-musical-dump-trucks.pdf | 09-educators-performers-more/pdf | pending |
| 221 | teachmommyteach-steady-beat-ideas.pdf | 09-educators-performers-more/pdf | pending |
| 222 | justin-roberts-stuck-at-home-activities.html | 09-educators-performers-more/web | pending |
| 223 | kira-willey-music.html | 09-educators-performers-more/web | pending |
| 224 | music-for-kiddos-frog-lesson-plan.html | 09-educators-performers-more/web | pending |
| 225 | songs-for-teaching-preschool-kindergarten-songs.html | 09-educators-performers-more/web | pending |
| 226 | storybots-printable-activity-books.html | 09-educators-performers-more/web | pending |
| 227 | teach-preschool-music-activities-index.html | 09-educators-performers-more/web | pending |
| 228 | the-teachers-guide-childrens-songs.html | 09-educators-performers-more/web | pending |

### OCR results (round 1 image-based PDFs, 2026-08-04)

OCR run completed via `ocr_image_pdfs.py` (RapidOCR + PyMuPDF). Text captures saved to `ocr/` (dedicated folder, one `.txt` per PDF).

| # | File | Folder | OCR result | Status |
|---|------|--------|-----------|--------|
| 1 | swanton-public-library-bounce-rhymes.pdf | 01-libraries-agencies/pdf | 876 words — lyrics + parenthetical actions recovered | done (ocr) |
| 2 | sc-school-kindergarten-music-movement-activities.pdf | 02-educators-publishers/pdf | 1,540 words — handbook text recovered | done (ocr) |
| 3 | raffi-baby-beluga-lyrics-arrangement.pdf | 03-performers-programs/pdf | 163 words — lyrics recovered, chord-chart noise | done (ocr) |
| 4 | raffi-down-by-the-bay-lyrics-arrangement.pdf | 03-performers-programs/pdf | 75 words — lyrics recovered | done (ocr) |
| 5 | raffi-wheels-on-the-bus-lyrics-arrangement.pdf | 03-performers-programs/pdf | 114 words — lyrics recovered | done (ocr) |
| 6 | mother-goose-club-five-little-monkeys-activity-book.pdf | 03-performers-programs/pdf | 113 words — partial | done (ocr) |
| 7 | mother-goose-club-five-little-monkeys-lyric-book.pdf | 03-performers-programs/pdf | 152 words — lyrics recovered | done (ocr) |
| 8 | mother-goose-club-itsy-bitsy-spider-lyric-book.pdf | 03-performers-programs/pdf | 156 words — lyrics recovered | done (ocr) |
| 9 | the-learning-station-tony-chestnut-activity-handout.pdf | 03-performers-programs/pdf | 450 words — handout text recovered | done (ocr) |
| 10 | jack-hartmann-a-to-z-flash-cards.pdf | 03-performers-programs/pdf | 27 words — letters/images, little text | thin (graphics) |
| 11 | jack-hartmann-stretchy-word-snake-coloring-activity.pdf | 03-performers-programs/pdf | 7 words — coloring page | thin (graphics) |
| 12 | the-wiggles-dice-roll-activity.pdf | 03-performers-programs/pdf | 22 words — activity page | thin (graphics) |
| 13 | the-wiggles-wiggle-and-learn-circus-colouring.pdf | 03-performers-programs/pdf | 6 words — coloring page | thin (graphics) |

## Round 3 retrieval log (2026-08-04)

All round-3 files verified on disk: 15 Internet Archive scanned songbooks (PDF `%PDF` magic byte OK) + 6 Project Gutenberg children's poetry/rhyme collections (non-empty text, `The Project Gutenberg` header). Unresolved sources: `metadata/07-historical-more-unresolved.md`. Rows below remain `pending` until the processing agent works them.

| # | File | Folder | Status |
|---|------|--------|--------|
| 169 | gomme-childrens-singing-games-1909.pdf | 07-historical-more/pdf | pending |
| 170 | gillington-breton-singing-games-1910.pdf | 07-historical-more/pdf | pending |
| 171 | bell-singing-circle-action-songs-1911.pdf | 07-historical-more/pdf | pending |
| 172 | dann-first-year-music-rote-songs-1914.pdf | 07-historical-more/pdf | pending |
| 173 | porter-negro-folk-singing-games-1914.pdf | 07-historical-more/pdf | pending |
| 174 | moffat-little-songs-of-long-ago-1912.pdf | 07-historical-more/pdf | pending |
| 175 | arnold-child-life-in-music-1912.pdf | 07-historical-more/pdf | pending |
| 176 | parsons-rhyme-road-to-music-land-1911.pdf | 07-historical-more/pdf | pending |
| 177 | songs-every-child-should-know-1906.pdf | 07-historical-more/pdf | pending |
| 178 | moore-childs-song-and-game-book-1899.pdf | 07-historical-more/pdf | pending |
| 179 | victor-music-appreciation-little-children-1920.pdf | 07-historical-more/pdf | pending |
| 180 | wier-songs-children-love-to-sing-1916.pdf | 07-historical-more/pdf | pending |
| 181 | westman-lessons-kindergarten-music-1902.pdf | 07-historical-more/pdf | pending |
| 182 | watts-divine-moral-songs-little-children-1902.pdf | 07-historical-more/pdf | pending |
| 183 | mother-gooses-nursery-rhymes-1900.pdf | 07-historical-more/pdf | pending |
| 184 | gutenberg-lang-nursery-rhyme-book-1897.txt | 07-historical-more/doc | pending |
| 185 | gutenberg-lear-nonsense-songs-1871.txt | 07-historical-more/doc | pending |
| 186 | gutenberg-stevenson-childs-garden-verses-1885.txt | 07-historical-more/doc | pending |
| 187 | gutenberg-taylor-rhymes-for-the-nursery-1806.txt | 07-historical-more/doc | pending |
| 188 | gutenberg-bell-cat-and-fiddle-book-1922.txt | 07-historical-more/doc | pending |
| 189 | gutenberg-richards-dramatized-rhythm-plays-1922.txt | 07-historical-more/doc | pending |

---

## Processing notes
- **done** files: lyrics/actions already extracted into `metadata/_extracted_songs.json` and
  `Song_Resources_Review.xlsx` (round 1 build). Metadata reports: `metadata/01-*.md` etc.
- **needs-ocr** files: 13 image-based PDFs. OCR output will be written to
  `<folder>/web/ocr-<name>.txt` by `ocr_image_pdfs.py`, then the processor can
  extract songs from the OCR text.
- Round 2 (folders 04-06) files are added by their retrieval agents with status
  `pending` — the processor (next agent / Song Historian) works them next.
