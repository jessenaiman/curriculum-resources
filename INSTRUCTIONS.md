# Curriculum Database — Single Source of Truth

All data for the "Old MacDonald's School" teacher resource app lives in `curriculum.db`. The `resources/` folder is a legacy archive — do not edit files there.

## Quick Start

```bash
# Open the database
sqlite3 "C:\Users\jesse\OneDrive\Documents\New project\data\curriculum.db"

# Or query from Python
python3 -c "import sqlite3; conn = sqlite3.connect('data/curriculum.db'); c = conn.cursor(); c.execute('SELECT * FROM curriculum_topics WHERE grade=\"Grade 1\"'); print(c.fetchall())"
```

## All Tables

| Table | Rows | What It Holds |
|-------|------|---------------|
| `curriculum_topics` | 264 | Every lesson row (subject, grade, codes, notes, taught status) |
| `songs` | 561 | Kathy Reid-Naiman song catalog with lyrics, actions, URLs |
| `songs_curriculum` | 1,991 | Links songs → curriculum topics (543/561 songs linked = 96.8%) |
| `songs_early_years` | 58 | Links songs → early years ELOF goals |
| `songs_music_stages` | 55 | Links songs → Gordon MLT preparatory audiation stages |
| `circle_time_songs` | 64 | Circle time song reference with actions, age groups |
| `circle_time_songs_curriculum` | 68 | Links circle time songs → curriculum topics |
| `circle_time_songs_early_years` | 73 | Links circle time songs → early years goals |
| `circle_time_songs_songs` | 7 | Links circle time songs → full songs table |
| `resources` | 40 | Curated educational links (worksheets, videos, activities, games) |
| `resources_topics` | 242 | Links resources → curriculum topics |
| `standards_codes` | 126 | Ontario curriculum codes with full text (Grades 1-3) |
| `staff` | 8 | Staff puppet characters (species, personality, costume, props, friendships) |
| `students` | 8 | Student puppet characters (species, personality, color, learning style) |
| `reference_images` | 7 | Character art reference image paths and tags |
| `early_years_topics` | 129 | ELOF-aligned developmental goals (Infant→Kindergarten) |
| `music_arts_stages` | 31 | Gordon MLT preparatory audiation stages (birth-6) |
| `unit_templates` | 10 | Song/Story/Movement/Sensory/Craft-led unit plans (all need content) |
| `music_units` | — | Music unit structure (ready for content) |

## Generate a Curriculum Page

Two files work together to turn DB data into classroom materials:

### 1. Assembly Query
`data/curriculum_topic_assembly.sql` — Run this with a topic ID to get all songs, resources, standards, characters, and pacing for that topic.

Example usage:
```bash
# Replace "WHERE id = 1" with your topic ID, then:
sqlite3 "data/curriculum.db" < "data/curriculum_topic_assembly.sql"
```

### 2. Generation Prompt
`data/curriculum_page_prompt_template.md` — Feed the query output into an LLM with this template to generate a complete, printable teacher curriculum page.

The template instructs the AI to generate:
- Lesson overview and learning goals
- Materials list with audio/resource links
- Step-by-step lesson plan with puppet characters
- Differentiation for diverse learners
- Assessment ideas
- Cross-curricular connections
- Character moments (Old MacDonald, Mr Rusty, etc.)

## Key Queries

```sql
-- Full topic assembly (replace 1 with topic ID)
SELECT * FROM curriculum_topic_assembly WHERE curriculum_topic_id = 1;

-- Find topics with songs
SELECT ct.id, ct.subject, ct.lesson_topic, COUNT(sc.song_id) as songs
FROM curriculum_topics ct
LEFT JOIN songs_curriculum sc ON ct.id = sc.curriculum_id
GROUP BY ct.id HAVING songs > 0
ORDER BY songs DESC;

-- Find topics with no songs yet (18 remaining unlinked)
SELECT ct.id, ct.subject, ct.lesson_topic
FROM curriculum_topics ct
LEFT JOIN songs_curriculum sc ON ct.id = sc.curriculum_id
WHERE sc.id IS NULL AND ct.grade NOT LIKE '%Grade 1-2%'
ORDER BY ct.subject, ct.grade;

-- All resources for a given subject
SELECT name, type, url, description FROM resources WHERE subject = 'Math & Numeracy';

-- Staff who teach a specific subject
SELECT name, species, shown_doing FROM staff WHERE teaches LIKE '%Phonics%';

-- Weekly pacing for Grade 2 Math
SELECT week, month, lesson_name, ontario_code
FROM curriculum_map WHERE grade = 'Grade 2' AND strand = 'Math & Numeracy';
```

## Current Status (Aug 1, 2026)

| Metric | Value |
|--------|-------|
| Curriculum topics | 264 across 8 subjects, 0 taught |
| Songs in catalog | 561 (all Kathy Reid-Naiman) |
| Songs with lyrics | 46 (imported from verified track_data.json) |
| Songs with audio URL | 80 (linked to kathyreidnaiman.com) |
| Songs linked to curriculum | 543 of 561 (96.8%) |
| Total song-curriculum links | 1,991 (718 primary, 1,273 secondary) |
| Resources | 40 curated links (free) |
| Unit templates | 10 placeholders (need content) |
| Staff/Student characters | 8 staff + 8 students, fully defined |
| Ontario standards | 126 codes across Grades 1-3 |
| US Common Core | 262 codes inline in curriculum_topics |
