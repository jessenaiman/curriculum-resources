import sqlite3
from collections import Counter

conn = sqlite3.connect('data/curriculum.db')
cur = conn.cursor()

def section(title):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)

def colnames(t):
    cur.execute('PRAGMA table_info("%s")' % t)
    return [r[1] for r in cur.fetchall()]

# ---------- 1. Duplicates by natural key ----------
section("1. DUPLICATE NAMES IN CONTENT TABLES")
checks = [
    ("songs", "song_name"),
    ("curriculum_topics", "lesson_topic"),
    ("early_years_topics", "lesson_goal"),
    ("circle_time_songs", "song_name"),
    ("resources", "name"),
    ("standards_codes", "code"),
    ("staff", "name"),
    ("students", "name"),
]
for t, col in checks:
    cur.execute('SELECT "%s", COUNT(*) c FROM "%s" WHERE "%s" IS NOT NULL AND TRIM("%s")!=\'\' GROUP BY LOWER(TRIM("%s")) HAVING c>1 ORDER BY c DESC' % (col, t, col, col, col))
    rows = cur.fetchall()
    if rows:
        print("  %s.%s: %d duplicate name(s)" % (t, col, len(rows)))
        for r in rows[:8]:
            print("    '%s' x%d" % (r[0], r[1]))
    else:
        print("  %s.%s: no duplicates" % (t, col))

# ---------- 2. NULL / empty key fields ----------
section("2. NULL / EMPTY KEY FIELDS")
for t, col in checks:
    cur.execute('SELECT COUNT(*) FROM "%s" WHERE "%s" IS NULL OR TRIM("%s")=\'\'' % (t, col, col))
    n = cur.fetchone()[0]
    if n:
        print("  %s.%s: %d blank/NULL" % (t, col, n))

# ---------- 3. Whitespace / formatting issues across all TEXT cols ----------
section("3. WHITESPACE ISSUES (leading/trailing/double-space)")
tables = ["standards_codes","resources","reference_images","curriculum_topics","staff","students",
          "music_units","music_arts_stages","unit_templates","songs","circle_time_songs",
          "early_years_topics"]
total_ws = 0
for t in tables:
    for c in colnames(t):
        # leading or trailing whitespace
        cur.execute('SELECT COUNT(*) FROM "%s" WHERE "%s" IS NOT NULL AND "%s" != TRIM("%s")' % (t, c, c, c))
        n = cur.fetchone()[0]
        if n:
            total_ws += n
            cur.execute('SELECT id, "%s" FROM "%s" WHERE "%s" IS NOT NULL AND "%s" != TRIM("%s") LIMIT 3' % (c, t, c, c, c))
            ex = cur.fetchall()
            print("  %s.%s: %d rows w/ pad  e.g. %s" % (t, c, n, repr(ex[0][1])[:60]))
if not total_ws:
    print("  No padded text values found.")

# ---------- 4. Controlled vocab: relevance already done; do taught, type, category ----------
section("4. 'taught' FLAG VALUES")
for t in ["curriculum_topics","music_arts_stages","unit_templates","early_years_topics"]:
    cur.execute('SELECT taught, COUNT(*) FROM "%s" GROUP BY taught' % t)
    print("  %s: %s" % (t, cur.fetchall()))

section("5. GRADE VALUES")
for t, c in [("curriculum_topics","grade"),("resources","grade"),("reference_images","grade")]:
    cur.execute('SELECT "%s", COUNT(*) FROM "%s" GROUP BY "%s" ORDER BY 2 DESC' % (c, t, c))
    vals = cur.fetchall()
    print("  %s.%s (%d distinct): %s" % (t, c, len(vals), vals[:25]))

section("6. AGE BAND / AGE GROUP VALUES")
for t, c in [("music_units","age_band"),("music_arts_stages","age_band"),("circle_time_songs","age_group"),("unit_templates","age_bands")]:
    cur.execute('SELECT "%s", COUNT(*) FROM "%s" GROUP BY "%s" ORDER BY 2 DESC' % (c, t, c))
    vals = cur.fetchall()
    print("  %s.%s (%d distinct): %s" % (t, c, len(vals), vals[:20]))

section("7. SUBJECT VALUES")
for t, c in [("curriculum_topics","subject"),("resources","subject")]:
    cur.execute('SELECT "%s", COUNT(*) FROM "%s" GROUP BY "%s" ORDER BY 2 DESC' % (c, t, c))
    print("  %s.%s: %s" % (t, c, cur.fetchall()))

conn.close()
