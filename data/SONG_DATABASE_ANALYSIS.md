# Educational Song/Rhyme Database — Structure Analysis

**Date:** August 4, 2026
**Project:** Old MacDonald Had a School (Daycare → Grade 3)

---

## 1. Current State of the Data

### Database: `curriculum.db` (21 tables, 5MB)

| Table | Rows | Purpose | Verdict |
|---|---|---|---|
| `songs` | 561 | Original song catalog (lyrics, themes, actions) | ✅ Core data |
| `circle_time_songs` | 64 | Circle-time specific songs | ✅ Useful (separate because circle-time has different format) |
| `curriculum_topics` | 264 | Ontario + US K-3 curriculum standards | ✅ Core data |
| `early_years_topics` | 129 | EYLF/early years developmental goals | ✅ Core data |
| `music_arts_stages` | 31 | Music/arts developmental framework | ✅ Core data |
| `unit_templates` | 10 | Pre-built unit plans with activities/crafts | ✅ Core data (underutilized) |
| `music_units` | 4 | Active unit plans | ✅ Core data |
| `resources` | 40 | External worksheets, links | ✅ Useful |
| `standards_codes` | 126 | Ontario curriculum alignment codes | ✅ Useful |
| `staff` | 8 | Animated staff characters | ✅ Show data |
| `students` | 8 | Animated student characters | ✅ Show data |
| `reference_images` | 7 | Image asset references | ✅ Asset catalog |
| `*_curriculum` | varies | Join tables (songs↔curriculum) | ✅ Required relationships |
| `*_early_years` | varies | Join tables (songs↔EYLF) | ✅ Required relationships |
| `*_music_stages` | varies | Join tables (songs↔stages) | ✅ Required relationships |

**Database is well-structured.** The core schema makes sense. No tables need to be removed.

### Song_Index.xlsx (1,405 rows, 13 columns)

This is the **newly extracted** data from 144 source PDFs/HTML files. This is where the problems are.

### Markdown Files (1,405 files)

Each file has YAML frontmatter + content. The frontmatter contains both useful and noise fields.

---

## 2. Field-by-Field Verdict

### Song_Index.xlsx Columns

| Column | Fill Rate | Verdict | Why |
|---|---|---|---|
| `song_title` | 100% | **✅ CRITICAL** | The thing teachers search for |
| `age_range` | 92% | **✅ CRITICAL** | Which age group this is for |
| `educational_domain` | 99% | **⚠️ USEFUL BUT WRONG** | 8 categories exist, but ~40% are misclassified (e.g., "I'm a Little Teapot" → Math/Counting) |
| `creator` | 94% | **✅ USEFUL** | Attribution — teachers want to know who made it |
| `source_title` | 100% | **✅ USEFUL** | Which book/collection it came from |
| `source_file` | 100% | **⚠️ MARGINALLY USEFUL** | Original filename — useful for tracing back, not for teaching |
| `year` | 29% | **⚠️ MARGINALLY USEFUL** | Publication year — mostly empty, rarely matters for teachers |
| `era` | 25% | **❌ NOISE** | "Victorian", "Contemporary" — teachers don't filter by era |
| `region` | 25% | **❌ NOISE** | "US (Boston)", "UK (London)" — irrelevant for classroom use |
| `confidence` | 100% | **❌ NOISE** | AI confidence score — not educational data, never useful to teachers |
| `review_status` | 100% | **❌ NOISE** | "pending_qc" on every row — workflow flag, not teacher data |
| `source_id` | 100% | **❌ NOISE** | Technical slug — never seen by teachers |
| `markdown_path` | 100% | **❌ NOISE** | File path — purely technical |

### Markdown Frontmatter Fields

| Field | Verdict | Why |
|---|---|---|
| `activity_material` | **✅ USEFUL** | "hands", "scarves", "flannel board" — what materials you need |
| `skill_objective` | **✅ USEFUL** | What the child learns — but currently generic AI text |
| `evidence_quote` | **✅ USEFUL** | The actual lyrics/content from the source |
| `confidence` | **❌ NOISE** | Same AI score as spreadsheet |
| `review_status` | **❌ NOISE** | Same workflow flag |
| `page_section` | **❌ NOISE** | "unknown" on almost every file |
| `educational_domain` | **⚠️ USEFUL BUT WRONG** | Same misclassification issue |
| `age_range` | **✅ USEFUL** | Same as spreadsheet |
| `source_file` | **⚠️ MARGINALLY USEFUL** | For traceability only |
| `source_id` | **❌ NOISE** | Technical slug |
| `source_title` | **✅ USEFUL** | Source attribution |

---

## 3. What Teachers ACTUALLY Need

When a teacher looks for a song/activity, they need to answer:

### "Can I use this with my group?"
- **Age range** — Is this appropriate for my children?
- **Materials needed** — Do I have what I need? (hands, scarves, instruments, flannel board)
- **Time/complexity** — Is this a 2-minute filler or a 15-minute activity?

### "What will my children learn?"
- **Learning objective** — What skill or concept does this develop?
- **Domain** — Which area of development? (BUT the current 8-category system needs fixing)
- **Curriculum alignment** — Does this map to a standard I need to cover?

### "How do I do it?"
- **Lyrics/content** — The actual words
- **Actions/movements** — What do the kids do with their bodies?
- **Instructions** — How to lead it (especially for newer staff)

### "What goes with this?"
- **Related songs** — Other songs on the same theme
- **Books to read** — Picture books that pair with the song
- **Craft ideas** — Art projects that extend the learning
- **Activities** — Games, sensory play, movement activities
- **Puppet/prop ideas** — What to make or use

---

## 4. What to Track Instead of Filtering as "Noise"

The 1,405 extracted files are NOT all songs. They include:

| Content Type | Count (approx) | Should Track As |
|---|---|---|
| **Songs/rhymes with lyrics** | ~800 | `songs` table |
| **Fingerplays** | ~150 | `songs` table (subtype: fingerplay) |
| **Bounce/lap rhymes** | ~100 | `songs` table (subtype: bounce) |
| **Movement activities** | ~80 | New `activities` table or `unit_templates` |
| **Flannel board activities** | ~30 | New `activities` table (subtype: flannel) |
| **Book suggestions** | ~50 | New `book_suggestions` table |
| **Craft ideas** | ~30 | `unit_templates.craft_idea` or new `crafts` table |
| **Lesson plans** | ~20 | `unit_templates` or new `lesson_plans` table |
| **Posters/printables** | ~15 | `resources` table (type: poster) |
| **Storytime tips/guides** | ~40 | `resources` table (type: guide) |
| **Coloring activities** | ~10 | `resources` table (type: activity) |
| **Program guides** | ~10 | `resources` table (type: guide) |

### Recommended New Tables

```sql
-- What the teacher needs for a complete lesson
CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- 'fingerplay', 'bounce', 'movement', 'flannel', 'sensory', 'craft', 'game'
    description TEXT,
    materials_needed TEXT,
    instructions TEXT,
    duration_minutes INTEGER,
    age_min_months INTEGER,
    age_max_months INTEGER,
    source_id TEXT,
    source_title TEXT,
    creator TEXT,
    notes TEXT
);

-- Books that pair with songs/activities
CREATE TABLE book_suggestions (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    isbn TEXT,
    age_range TEXT,
    description TEXT,
    url TEXT,
    free INTEGER DEFAULT 0,
    notes TEXT
);

-- Link table: which books go with which songs
CREATE TABLE songs_books (
    id INTEGER PRIMARY KEY,
    song_id INTEGER REFERENCES songs(id),
    activity_id INTEGER REFERENCES activities(id),
    book_id INTEGER REFERENCES book_suggestions(id),
    relevance TEXT  -- 'primary', 'companion', 'extension'
);

-- Link table: which crafts/activities go with which songs
CREATE TABLE songs_activities (
    id INTEGER PRIMARY KEY,
    song_id INTEGER REFERENCES songs(id),
    activity_id INTEGER REFERENCES activities(id),
    relevance TEXT  -- 'accompanies', 'extends', 'alternative'
);
```

---

## 5. Specific Recommendations

### Immediate Cleanup (Song_Index.xlsx)

1. **DELETE these columns:** `confidence`, `review_status`, `era`, `region`, `source_id`, `markdown_path`
   - They add clutter and confuse anyone looking at the data
   - They serve no educational purpose

2. **KEEP but rename:** `source_file` → `original_filename` (makes it clear this is traceability data, not content)

3. **FIX `educational_domain`:** ~40% of classifications are wrong. Needs human review or better AI classification. The current 8 categories are fine as a starting point but need validation.

4. **STANDARDIZE `age_range`:** There are 70+ unique free-text values. Should be normalized to:
   - `Infant` (0-12 months)
   - `Toddler` (12-36 months)
   - `Preschool` (3-5 years)
   - `Kindergarten` (5-6 years)
   - `Grade 1` (6-7 years)
   - `Grade 2` (7-8 years)
   - `Grade 3` (8-9 years)
   - Or ranges like `Infant-Preschool`

### Markdown Files Cleanup

5. **Remove from frontmatter:** `confidence`, `review_status`, `page_section`

6. **Add to frontmatter:**
   - `materials_needed` (currently `activity_material` — rename for clarity)
   - `duration` (estimate: quick/medium/long or minutes)
   - `type` (song, fingerplay, bounce, movement, flannel, etc.)
   - `curriculum_links` (which standards this supports)

7. **Fix the evidence_quote problem:** Many files have the ENTIRE source text as the evidence quote instead of just the relevant excerpt. This needs trimming.

### Database Structure

8. **The `songs` table is good but needs:**
   - A `type` column (song, fingerplay, bounce, movement, etc.)
   - A `materials_needed` column
   - A `duration_estimate` column
   - Better `lyrics` coverage (only 8% have lyrics currently)

9. **The `unit_templates` table is excellent** — it already has craft_idea, fingerplay, movement_activity, sensory_activity, instrument_exploration, puppet_prop. This should be the model for how we track "related items."

10. **The join tables are correct** — songs↔curriculum, songs↔early_years, songs↔music_stages all make sense.

### Data Quality

11. **The 1,405 extracted files need a content audit:**
    - ~200 are NOT songs/activities (they're book lists, guides, tips, templates)
    - These should be moved to `resources` table, not `songs`
    - The remaining ~1,200 need the educational_domain reclassified

12. **The existing 561 songs in the database have poor lyrics coverage (8.2%)** — the new extraction should fill this gap, but many extractions also lack complete lyrics.

---

## 6. Summary

| What | Status | Action |
|---|---|---|
| Database schema | ✅ Good | Add `activities` table, add `book_suggestions` table |
| Song_Index.xlsx | ❌ Needs cleanup | Delete 6 noise columns, fix domain classification, normalize age ranges |
| Markdown files | ⚠️ Mixed quality | Remove noise frontmatter, add useful fields, audit non-song content |
| songs table | ⚠️ Incomplete | Add type/materials/duration columns, improve lyrics coverage |
| unit_templates | ✅ Excellent model | Use as template for tracking related items (crafts, activities, books) |
| Curriculum alignment | ✅ Solid | 1,991 song↔curriculum links already exist |
| Content classification | ❌ Wrong ~40% | Educational domains need reclassification |

**Bottom line:** The database schema is solid. The extracted data needs cleanup (remove noise columns, fix classifications, normalize age ranges). The biggest gap is that books, crafts, and activities are scattered across files instead of being tracked in structured tables like `unit_templates` already does.
