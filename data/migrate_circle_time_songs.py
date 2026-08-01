"""
Migration: Add circle_time_songs schema + parse markdown reference.
Creates 4 new tables and populates circle_time_songs from the reference file.

Run: python migrate_circle_time_songs.py
"""

import sqlite3
import re
import os

DB_PATH = r"C:\Users\jesse\OneDrive\Documents\New project\data\curriculum.db"
MD_PATH = r"C:\Users\jesse\OneDrive\Documents\New project\resources\circle_time_songs_reference.md"

# ─── SCHEMA ───────────────────────────────────────────────────────────────

SCHEMA_SQL = """
-- Circle time songs: pedagogical metadata for circle time activities
CREATE TABLE IF NOT EXISTS circle_time_songs (
    id INTEGER PRIMARY KEY,
    song_name TEXT NOT NULL,
    category TEXT NOT NULL,          -- Greeting | Movement | Fingerplay | Transition | Goodbye
    actions TEXT,                    -- what the children do
    age_group TEXT,                  -- Infant | Toddler | Preschool | Kindergarten (or ranges)
    teaches TEXT,                    -- social skills, spatial awareness, turn-taking, etc.
    source TEXT,                     -- artist or URL
    hdh_focus TEXT,                  -- which HDLH foundation it supports
    notes TEXT
);

-- Join table: circle time songs ↔ curriculum topics
CREATE TABLE IF NOT EXISTS circle_time_songs_curriculum (
    id INTEGER PRIMARY KEY,
    circle_time_song_id INTEGER NOT NULL,
    curriculum_topic_id INTEGER NOT NULL,
    relevance TEXT DEFAULT 'primary', -- 'primary' | 'secondary'
    FOREIGN KEY (circle_time_song_id) REFERENCES circle_time_songs(id),
    FOREIGN KEY (curriculum_topic_id) REFERENCES curriculum_topics(id),
    UNIQUE(circle_time_song_id, curriculum_topic_id)
);

-- Join table: circle time songs ↔ early years topics
CREATE TABLE IF NOT EXISTS circle_time_songs_early_years (
    id INTEGER PRIMARY KEY,
    circle_time_song_id INTEGER NOT NULL,
    early_years_topic_id INTEGER NOT NULL,
    relevance TEXT DEFAULT 'primary', -- 'primary' | 'secondary'
    FOREIGN KEY (circle_time_song_id) REFERENCES circle_time_songs(id),
    FOREIGN KEY (early_years_topic_id) REFERENCES early_years_topics(id),
    UNIQUE(circle_time_song_id, early_years_topic_id)
);

-- Join table: circle time songs ↔ existing songs table
CREATE TABLE IF NOT EXISTS circle_time_songs_songs (
    id INTEGER PRIMARY KEY,
    circle_time_song_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    relevance TEXT DEFAULT 'same song', -- 'same song' | 'similar activity' | 'same artist'
    FOREIGN KEY (circle_time_song_id) REFERENCES circle_time_songs(id),
    FOREIGN KEY (song_id) REFERENCES songs(id),
    UNIQUE(circle_time_song_id, song_id)
);
"""


# ─── MARKDOWN PARSER ──────────────────────────────────────────────────────

def parse_circle_time_markdown(filepath):
    """Parse the circle_time_songs_reference.md into structured song dicts."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    songs = []
    current_category = None

    # Category headers: "## 1. Greeting Songs", "## 2. Movement Songs", etc.
    category_map = {
        'Greeting': 'Greeting',
        'Movement': 'Movement',
        'Fingerplay': 'Fingerplay',
        'Transition': 'Transition',
        'Goodbye': 'Goodbye',
    }

    lines = content.split('\n')
    i = 0
    in_song_section = False
    while i < len(lines):
        line = lines[i].strip()

        # Detect category headers (e.g. "## 1. Greeting Songs", "## 3. Fingerplays")
        cat_match = re.match(r'^##\s+\d+\.\s+(\w+)', line, re.IGNORECASE)
        if cat_match:
            word = cat_match.group(1)
            matched = False
            for pattern, cat_name in category_map.items():
                if pattern.lower() in word.lower():
                    current_category = cat_name
                    in_song_section = True
                    matched = True
                    break
            if not matched:
                in_song_section = False
                current_category = None
            i += 1
            continue

        # Stop parsing songs at non-song sections
        if line.startswith('## ') and in_song_section:
            in_song_section = False
            current_category = None
            i += 1
            continue

        # Detect song headers: "### Song Name"
        if line.startswith('### ') and in_song_section and current_category:
            song_name = line[4:].strip()
            actions = None
            age_group = None
            teaches = None
            source = None

            # Parse the bullet points below the song header
            i += 1
            while i < len(lines):
                sline = lines[i].strip()

                # Stop if we hit another ### or ## or horizontal rule
                if sline.startswith('### ') or sline.startswith('## ') or sline == '---':
                    break

                # Parse each field
                if sline.startswith('- **Actions/Movements:**'):
                    actions = sline.split('**Actions/Movements:**', 1)[1].strip()
                    # Collect multi-line actions
                    i += 1
                    while i < len(lines) and lines[i].strip() and not lines[i].strip().startswith('- **'):
                        if lines[i].strip().startswith('- ') and not lines[i].strip().startswith('- **'):
                            break
                        actions += ' ' + lines[i].strip()
                        i += 1
                    continue

                elif sline.startswith('- **Age Group:**'):
                    age_group = sline.split('**Age Group:**', 1)[1].strip()

                elif sline.startswith('- **Teaches:**'):
                    teaches = sline.split('**Teaches:**', 1)[1].strip()

                elif sline.startswith('- **Where to Find:**'):
                    source = sline.split('**Where to Find:**', 1)[1].strip()

                i += 1

            # Map age_group to standard values
            age_standardized = standardize_age(age_group) if age_group else None

            # Infer HDLH focus from teaches and category
            hdh_focus = infer_hdh_focus(teaches, current_category, song_name)

            songs.append({
                'song_name': song_name,
                'category': current_category,
                'actions': clean_text(actions),
                'age_group': age_standardized,
                'teaches': teaches,
                'source': source,
                'hdh_focus': hdh_focus,
                'notes': None,
            })
            continue

        i += 1

    return songs


def standardize_age(age_text):
    """Convert age range text to standardized age_group values."""
    if not age_text:
        return None
    age_lower = age_text.lower()

    # Determine which groups are mentioned
    groups = []
    if 'infant' in age_lower or 'baby' in age_lower or '6 months' in age_lower:
        groups.append('Infant')
    if 'toddler' in age_lower:
        groups.append('Toddler')
    if 'preschool' in age_lower:
        groups.append('Preschool')
    if 'kindergarten' in age_lower:
        groups.append('Kindergarten')

    if not groups:
        return age_text  # fallback to original

    return ', '.join(groups)


def infer_hdh_focus(teaches, category, song_name):
    """Infer HDLH (How Does Learning Happen) foundation from pedagogical context."""
    if not teaches:
        return None

    teaches_lower = teaches.lower()
    focuses = []

    # HDLH Foundations: Belonging, Engagement, Expression, Well-Being
    # Belonging: social skills, friendship, community, inclusion, turn-taking, group
    belonging_keywords = ['social', 'friendship', 'community', 'inclusion', 'belonging',
                          'turn-taking', 'group', 'sharing', 'together', 'partners',
                          'greeting', 'farewell', 'closure', 'connection']
    if any(k in teaches_lower for k in belonging_keywords):
        focuses.append('Belonging')

    # Engagement: curiosity, exploration, problem-solving, following directions
    engagement_keywords = ['curiosity', 'exploration', 'problem-solv', 'following direction',
                           'listening', 'attention', 'sequencing', 'cause and effect',
                           'anticipation', 'memory', 'concentration']
    if any(k in teaches_lower for k in engagement_keywords):
        focuses.append('Engagement')

    # Expression: communication, language, self-expression, vocabulary
    expression_keywords = ['expression', 'language', 'vocabulary', 'communication',
                           'self-identif', 'name', 'self-esteen', 'introductions',
                           'tongue twister', 'alliteration', 'speech', 'rhym']
    if any(k in teaches_lower for k in expression_keywords):
        focuses.append('Expression')

    # Well-Being: body awareness, motor skills, emotions, self-care, regulation
    wellbeing_keywords = ['body', 'motor', 'emotion', 'self-care', 'regulation',
                          'energy release', 'calming', 'coordination', 'gross motor',
                          'fine motor', 'hygiene', 'self-regulat', 'physical',
                          'shaking', 'jumping', 'dancing', 'spatial']
    if any(k in teaches_lower for k in wellbeing_keywords):
        focuses.append('Well-Being')

    # Also consider category-level defaults
    if not focuses:
        if category == 'Greeting':
            focuses = ['Belonging', 'Expression']
        elif category == 'Movement':
            focuses = ['Well-Being', 'Engagement']
        elif category == 'Fingerplay':
            focuses = ['Engagement', 'Well-Being']
        elif category == 'Transition':
            focuses = ['Engagement', 'Belonging']
        elif category == 'Goodbye':
            focuses = ['Belonging', 'Well-Being']

    return '; '.join(focuses) if focuses else None


def clean_text(text):
    """Clean up extracted text."""
    if not text:
        return None
    # Remove trailing periods, normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    if text.endswith('.'):
        text = text[:-1]
    return text if text else None


# ─── MAIN ─────────────────────────────────────────────────────────────────

def main():
    print("=== Circle Time Songs Migration ===\n")

    # Parse markdown
    print("Parsing markdown reference...")
    songs = parse_circle_time_markdown(MD_PATH)
    print(f"  Extracted {len(songs)} songs\n")

    # Show category breakdown
    from collections import Counter
    cat_counts = Counter(s['category'] for s in songs)
    for cat, count in sorted(cat_counts.items()):
        print(f"  {cat}: {count} songs")
    print()

    # Connect to DB
    print(f"Connecting to {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Enable WAL mode for safety
    cursor.execute("PRAGMA journal_mode=WAL;")

    # Create tables
    print("Creating tables...")
    cursor.executescript(SCHEMA_SQL)
    print("  ✓ circle_time_songs")
    print("  ✓ circle_time_songs_curriculum")
    print("  ✓ circle_time_songs_early_years")
    print("  ✓ circle_time_songs_songs")
    print()

    # Insert songs (idempotent: clear existing data first)
    print("Inserting songs...")
    cursor.execute("DELETE FROM circle_time_songs;")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='circle_time_songs';")

    insert_sql = """
    INSERT INTO circle_time_songs
        (song_name, category, actions, age_group, teaches, source, hdh_focus, notes)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    """

    for song in songs:
        cursor.execute(insert_sql, (
            song['song_name'],
            song['category'],
            song['actions'],
            song['age_group'],
            song['teaches'],
            song['source'],
            song['hdh_focus'],
            song['notes'],
        ))

    conn.commit()
    print(f"  Inserted {len(songs)} songs into circle_time_songs\n")

    # Verify
    print("=== Verification ===")
    cursor.execute("SELECT COUNT(*) FROM circle_time_songs;")
    print(f"  circle_time_songs: {cursor.fetchone()[0]} rows")

    cursor.execute("SELECT COUNT(*) FROM circle_time_songs_curriculum;")
    print(f"  circle_time_songs_curriculum: {cursor.fetchone()[0]} rows")

    cursor.execute("SELECT COUNT(*) FROM circle_time_songs_early_years;")
    print(f"  circle_time_songs_early_years: {cursor.fetchone()[0]} rows")

    cursor.execute("SELECT COUNT(*) FROM circle_time_songs_songs;")
    print(f"  circle_time_songs_songs: {cursor.fetchone()[0]} rows")

    # Show sample data
    print("\n=== Sample Data (first 3 songs) ===")
    cursor.execute("SELECT id, song_name, category, age_group, hdh_focus FROM circle_time_songs LIMIT 3;")
    for row in cursor.fetchall():
        print(f"  id={row[0]} | {row[1]} | {row[2]} | {row[3]} | HDLH: {row[4]}")

    # Show age group distribution
    print("\n=== Age Group Distribution ===")
    cursor.execute("""
        SELECT age_group, COUNT(*) as cnt
        FROM circle_time_songs
        GROUP BY age_group
        ORDER BY cnt DESC;
    """)
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]} songs")

    # Show HDLH focus distribution
    print("\n=== HDLH Focus Distribution ===")
    cursor.execute("""
        SELECT hdh_focus, COUNT(*) as cnt
        FROM circle_time_songs
        GROUP BY hdh_focus
        ORDER BY cnt DESC;
    """)
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]} songs")

    conn.close()
    print("\n=== Migration complete ===")


if __name__ == '__main__':
    main()
