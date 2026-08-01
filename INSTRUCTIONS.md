# Curriculum Database

## Quick Start

```bash
# Open the database
sqlite3 "C:\Users\jesse\OneDrive\Documents\New project\data\curriculum.db"

# Or query from Python
python3 -c "import sqlite3; conn = sqlite3.connect('data/curriculum.db'); c = conn.cursor(); c.execute('SELECT * FROM curriculum_topics WHERE grade=\"Grade 1\"'); print(c.fetchall())"
```

## Tables

| Table | What It Holds |
|-------|---------------|
| `curriculum_topics` | Every lesson row from the tracker (subject, grade, codes, notes) |
| `resources` | Free printable links organized by subject/category/grade |
| `standards_codes` | Ontario + US standard codes (reference lookup) |
| `reference_images` | Character/art reference images (file paths, tags) |
| `resources_topics` | Maps resources to curriculum topics |

## Common Queries

```sql
-- What topics does Grade 1 Math cover?
SELECT lesson_topic, category FROM curriculum_topics WHERE grade='Grade 1' AND subject='Math & Numeracy';

-- Which Ontario codes are missing?
SELECT lesson_topic, category FROM curriculum_topics WHERE ontario_code IS NULL;

-- Find free worksheets for Grade 2 fractions
SELECT name, url, description FROM resources WHERE subject='Math & Numeracy' AND grade='Grade 2' AND type='worksheet' AND free=1;

-- What resources exist for a specific topic?
SELECT r.name, r.url FROM resources r WHERE r.subject='Math & Numeracy' AND r.category='Operations';

-- List all paywalled resources
SELECT name, url FROM resources WHERE paywalled=1;

-- Show all resources for Grade 3
SELECT name, url, type, description FROM resources WHERE grade LIKE '%Grade 3%';
```

## Adding Data

```sql
-- Add a new curriculum topic
INSERT INTO curriculum_topics (subject, category, subcategory, grade, seq_num, lesson_topic, lesson_description, skills_covered, ontario_code, us_code)
VALUES ('Literacy & Phonics', 'Phonics', 'Short Vowels', 'Grade 1', 1.1, 'Short Vowel Sounds', 'Identify and produce short vowel sounds', 'B2.1', 'RF.2.3');

-- Add a new resource
INSERT INTO resources (name, url, type, subject, category, grade, description, free, tags)
VALUES ('New Worksheet', 'https://example.com', 'worksheet', 'Math & Numeracy', 'Operations', 'Grade 1', 'Addition practice', 1, 'free,printable');

-- Link a resource to a topic
INSERT INTO resources_topics (resource_id, topic_id, relevance) VALUES (1, 11, 'primary');
```

## Directory Structure

```
New project/
├── data/
│   └── curriculum.db          ← this database
├── images/
│   ├── characters/            ← reference images go here
│   ├── worksheets/
│   └── resources/
├── resources/                 ← markdown resource files (legacy)
│   ├── math/
│   ├── literacy/
│   ├── science/
│   ├── sel/
│   └── motor/
└── INSTRUCTIONS.md            ← this file
```

## Notes

- `curriculum_topics` has Math & Numeracy seeded (59 rows). Literacy, Science, SEL, Motor will be added as research completes.
- `resources` has 40 free resource links. More will be added as research completes.
- `standards_codes` is empty — waiting for a standards agent to populate Ontario expectation codes.
- `reference_images` is empty — waiting for character/art reference images.
