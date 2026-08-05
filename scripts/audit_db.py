import sqlite3
from collections import Counter

conn = sqlite3.connect('data/curriculum.db')
cur = conn.cursor()
cur.execute("PRAGMA foreign_keys")  # just informational

def section(title):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)

# ---------- 1. Referential integrity ----------
section("1. REFERENTIAL INTEGRITY (orphaned FKs)")
fks = [
    ("resources_topics", "resource_id", "resources", "id"),
    ("resources_topics", "topic_id", "curriculum_topics", "id"),
    ("circle_time_songs_curriculum", "circle_time_song_id", "circle_time_songs", "id"),
    ("circle_time_songs_curriculum", "curriculum_topic_id", "curriculum_topics", "id"),
    ("circle_time_songs_early_years", "circle_time_song_id", "circle_time_songs", "id"),
    ("circle_time_songs_early_years", "early_years_topic_id", "early_years_topics", "id"),
    ("circle_time_songs_songs", "circle_time_song_id", "circle_time_songs", "id"),
    ("circle_time_songs_songs", "song_id", "songs", "id"),
    ("songs_curriculum", "song_id", "songs", "id"),
    ("songs_curriculum", "curriculum_id", "curriculum_topics", "id"),
    ("songs_early_years", "song_id", "songs", "id"),
    ("songs_early_years", "early_years_id", "early_years_topics", "id"),
    ("songs_music_stages", "song_id", "songs", "id"),
    ("songs_music_stages", "stage_id", "music_arts_stages", "id"),
    ("curriculum_music_stages", "curriculum_id", "curriculum_topics", "id"),
    ("curriculum_music_stages", "stage_id", "music_arts_stages", "id"),
]
orphan_total = 0
for jt, jcol, pt, pcol in fks:
    cur.execute('SELECT COUNT(*) FROM "%s" WHERE "%s" IS NOT NULL AND "%s" NOT IN (SELECT "%s" FROM "%s")' % (jt, jcol, jcol, pcol, pt))
    n = cur.fetchone()[0]
    if n:
        orphan_total += n
        print("  ORPHANS: %s.%s -> %s.%s : %d rows" % (jt, jcol, pt, pcol, n))
if not orphan_total:
    print("  No orphaned FK rows. All junction references resolve.")

# ---------- 2. Duplicate junction pairs ----------
section("2. DUPLICATE JUNCTION PAIRS")
pairs = [
    ("resources_topics", "resource_id", "topic_id"),
    ("circle_time_songs_curriculum", "circle_time_song_id", "curriculum_topic_id"),
    ("circle_time_songs_early_years", "circle_time_song_id", "early_years_topic_id"),
    ("circle_time_songs_songs", "circle_time_song_id", "song_id"),
    ("songs_curriculum", "song_id", "curriculum_id"),
    ("songs_early_years", "song_id", "early_years_id"),
    ("songs_music_stages", "song_id", "stage_id"),
    ("curriculum_music_stages", "curriculum_id", "stage_id"),
]
dup_total = 0
for t, a, b in pairs:
    cur.execute('SELECT "%s", "%s", COUNT(*) c FROM "%s" GROUP BY 1,2 HAVING c > 1 ORDER BY c DESC' % (a, b, t))
    rows = cur.fetchall()
    if rows:
        dup_total += sum(r[2] - 1 for r in rows)
        print("  %s: %d duplicate pair(s), %d redundant rows" % (t, len(rows), sum(r[2]-1 for r in rows)))
        for r in rows[:5]:
            print("    %s=%s, %s=%s appears %dx" % (a, r[0], b, r[1], r[2]))
if not dup_total:
    print("  No duplicate pairs in any junction table.")

# ---------- 3. Junction relevance vocab ----------
section("3. RELEVANCE VOCAB (junction tables)")
for t in [p[0] for p in pairs]:
    cur.execute('SELECT relevance, COUNT(*) FROM "%s" GROUP BY relevance ORDER BY 2 DESC' % t)
    vals = cur.fetchall()
    print("  %s: %s" % (t, vals))

conn.close()
