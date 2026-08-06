# Song Tag Taxonomy — Draft v0.2

**Status:** Proposed for pilot testing; not yet approved for bulk retagging  
**Last reviewed:** 2026-08-05  
**Scope:** Controlled vocabulary for canonical songs, documented song versions, and classroom uses

## Core rule

Create a tag only when at least two songs or song versions require it. Every tag needs a definition, inclusion rule, exclusion rule, and evidence basis. Standards codes, source provenance, age ranges, languages, regions, and review states are structured fields or relationships—not tags.

## Three levels that must not be flattened

1. **Canonical song:** identity shared by versions of the same song.
2. **Song version:** lyrics, actions, arrangement, and teaching directions documented in one source.
3. **Song use:** how a teacher or lesson chooses to use a version in a particular session.

This distinction matters because a song may have several documented modalities, energy levels, or routine uses. A teaching choice should not become a permanent claim about the canonical song.

## Proposed controlled vocabulary

### 1. Topic

**Meaning:** Concrete content nouns and settings in the song text.

Initial values:

- Animals
- Farm
- Nature/Plants
- Weather/Seasons
- Colours
- Numbers
- Body Parts
- Food
- Family
- Community/Occupations
- Transportation
- Water/Sea
- Bedtime
- Holidays/Celebrations
- Space
- Music/Instruments

Pilot candidate pending the two-record threshold:

- Health/Hygiene

**Cardinality:** Multi-value.  
**Preferred level:** Song version; promote to canonical song only when stable across reviewed versions.

### 2. Skill Concept

**Meaning:** Plain-language developmental or academic-adjacent concepts supported by the source or a reviewed pedagogical analysis. This is not a curriculum-standard code.

Initial values:

- Counting
- Patterns
- Sequencing
- Friendship
- Sharing/Turn-taking
- Emotions/Feelings
- Self-Regulation
- Days of the Week
- Spatial Awareness
- Same/Different
- Rhyme/Phonological Awareness
- Memory/Recall
- Prediction

**Cardinality:** Multi-value.  
**Preferred level:** Song version or song use.  
**Evidence rule:** Distinguish a concept explicitly taught by the source from an editorially inferred opportunity.

### 3. Participation Modality

**Meaning:** How children use body, voice, objects, or attention during the documented activity.

Initial values:

- Movement
- Fingerplay
- Instrument Play
- Body Percussion
- Call-and-Response
- Quiet Listening
- Vocal Play
- Prop/Puppet Play
- Gesture/Sign

**Cardinality:** Multi-value.  
**Preferred level:** Song version.  
**Note:** Do not add generic “Singing” when it would apply to nearly every record and provide no retrieval value.

### 4. Routine Slot

**Meaning:** Where a teacher places the song in a particular session.

Initial values:

- Greeting
- Transition
- Circle-Time Core
- Calm-Down
- Goodbye

**Cardinality:** Multi-value across uses; one value may be primary within a single planned use.  
**Preferred level:** Song use, not canonical song.

### 5. Song/Activity Type

**Meaning:** Functional or participation type of the documented version.

Initial values:

- Bounce/Beat
- Lullaby
- Action Song
- Singing Game
- Round
- Part-Song
- Counting Song
- Rhyme/Chant

**Cardinality:** Multi-value only when the source genuinely documents more than one type.  
**Preferred level:** Song version.

**Revision from the proposed list:** “Multicultural” is not a musical form. Record language, region, culture/tradition, and source community in dedicated evidence-backed fields. Do not use “multicultural” as a catch-all label.

### 6. Music Concept

**Meaning:** Musical knowledge or musicianship explicitly addressed or strongly supported by the source. This category is needed to represent concepts found in the Feierabend, Kodály, Montessori, Head Start, and pre-K standards material.

Initial values:

- Steady Beat
- Meter
- Rhythm
- Tempo
- Dynamics
- Pitch/High-Low
- Melody
- Timbre
- Musical Form
- Improvisation
- Composition

**Cardinality:** Multi-value.  
**Preferred level:** Song version or song use.  
**Evidence rule:** Do not infer meter, form, tonal content, or teaching sequence from a title or lyric alone.

## Single-value classroom-use attributes

These values should be controlled, but they should not be implemented as ordinary many-to-many song tags.

### Energy Level

- High
- Medium
- Low

Store one value per **song use** or documented arrangement. Energy can change with tempo, arrangement, and teaching choice.

### Teaching Style

- Song-Led
- Story-Led
- Movement-Led
- Sensory-Led
- Craft-Led

Store one value per **lesson, unit, or song use**. This matches the OMFS unit organization but is not an intrinsic property of a song.

## Evidence and review fields

Every tag assignment should retain:

- `evidence_basis`: `source_explicit`, `source_supported`, `editorial_inference`, or `legacy_import`
- `source_id`
- `page_or_section`
- `evidence_excerpt` (short and relevant)
- `confidence`: `high`, `medium`, or `low`
- `review_status`: `proposed`, `reviewed`, or `rejected`
- `reviewer`
- `reviewed_at`

These fields belong in the research database and may be hidden from teacher-facing spreadsheet exports.

## Suggested relational shape

- `tags(id, name, tag_type, definition, inclusion_rule, exclusion_rule, status)`
- `canonical_song_tags(canonical_song_id, tag_id, evidence_basis, review_status, ...)`
- `song_version_tags(song_version_id, tag_id, evidence_basis, source_id, page_or_section, ...)`
- `song_uses(id, song_version_id, lesson_or_unit_id, routine_slot, energy_level, teaching_style, ...)`

If one generalized link table is preferred, it must include an explicit entity type and entity ID. A plain `Song_Tags(song_id, tag_id)` table cannot safely represent all three levels.

## Vocabulary governance

Before adding a tag:

1. Confirm at least two records need it.
2. Check for an existing synonym or broader term.
3. Write its definition and non-example.
4. Decide which entity level it describes.
5. Record the evidence basis.
6. Add aliases for search, but keep one display name.
7. Review vocabulary changes before running bulk classification.

## Open decisions for the pilot

- Decide whether `Call-and-Response` remains a participation modality or moves to a future structural-form category.
- Decide whether `Spatial Awareness` should have child tags such as Left/Right, Positional Language, and Directionality after usage counts are known.
- Decide whether historical pedagogical terms are tags or source-level descriptors.
- Decide whether Topic tags are assigned first to versions and then promoted to canonical songs by review.
- Decide the minimum evidence required for editorially inferred Skill Concept tags.
