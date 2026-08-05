import sqlite3
from collections import Counter, defaultdict

conn = sqlite3.connect('data/curriculum.db')
cur = conn.cursor()

def section(t):
    print("\n" + "=" * 60)
    print(t)
    print("=" * 60)

# ---------- A. songs duplicates: do they differ by cd/catalog/track? ----------
section("A. songs.song_name duplicates - full column fingerprint")
cur.execute("""SELECT song_name FROM songs WHERE song_name IS NOT NULL AND TRIM(song_name)!=''
               GROUP BY LOWER(TRIM(song_name)) HAVING COUNT(*)>1 ORDER BY COUNT(*) DESC""")
dups = [r[0] for r in cur.fetchall()]
print("  duplicate names:", len(dups))
truly_dup = 0
for name in dups[:12]:
    cur.execute("""SELECT id, cd_title, track_num, catalog_id, sheet_name, artist, verified
                   FROM songs WHERE LOWER(TRIM(song_name))=?""", (name.strip().lower(),))
    rows = cur.fetchall()
    # fingerprint excluding id
    fps = set(tuple(r[1:]) for r in rows)
    marker = "TRUE-DUP(all cols identical)" if len(fps) == 1 else ("distinct on other cols" )
    if len(fps) == 1:
        truly_dup += 1
    print("  '%s' x%d -> %s" % (name, len(rows), marker))
    for r in rows:
        print("      id=%s cd=%r track=%r cat=%r sheet=%r verified=%s" % (r[0], r[1], r[2], r[3], r[4], r[6]))

# ---------- B. curriculum_topics duplicates: per-grade or true dup? ----------
section("B. curriculum_topics.lesson_topic duplicates - grade fingerprint")
cur.execute("""SELECT lesson_topic FROM curriculum_topics WHERE lesson_topic IS NOT NULL AND TRIM(lesson_topic)!=''
               GROUP BY LOWER(TRIM(lesson_topic)) HAVING COUNT(*)>1""")
cdups = [r[0] for r in cur.fetchall()]
print("  duplicate topics:", len(cdups))
same_grade = 0
for name in cdups:
    cur.execute("""SELECT grade, subject, category, seq_num FROM curriculum_topics
                   WHERE LOWER(TRIM(lesson_topic))=?""", (name.strip().lower(),))
    rows = cur.fetchall()
    grades = [r[0] for r in rows]
    if len(set(grades)) < len(rows):  # same grade repeated
        same_grade += 1
        print("  SAME-GRADE REPEAT: '%s'" % name[:60])
        for r in rows:
            print("      grade=%r subj=%r cat=%r seq=%r" % r)
print("  topics repeated at SAME grade:", same_grade, "of", len(cdups))

# ---------- C. standards_codes duplicates: per jurisdiction/grade? ----------
section("C. standards_codes.code duplicates - jurisdiction/grade fingerprint")
cur.execute("""SELECT code FROM standards_codes GROUP BY code HAVING COUNT(*)>1 ORDER BY COUNT(*) DESC""")
scd = [r[0] for r in cur.fetchall()]
print("  duplicate codes:", len(scd))
for code in scd[:6]:
    cur.execute("SELECT jurisdiction, grade, strand FROM standards_codes WHERE code=?", (code,))
    print("  code=%r:" % code)
    for r in cur.fetchall():
        print("      jur=%r grade=%r strand=%r" % r)

# ---------- D. sheet_name vocabulary ----------
section("D. sheet_name VALUES (drives Excel sheet tabs)")
for t in ["songs","early_years_topics","unit_templates"]:
    cur.execute('SELECT sheet_name, COUNT(*) FROM "%s" GROUP BY sheet_name ORDER BY 2 DESC' % t)
    vals = cur.fetchall()
    print("  %s.sheet_name (%d distinct): %s" % (t, len(vals), vals[:20]))

# ---------- E. verify the dash chars are real unicode ----------
section("E. special characters in age_band / grade (repr)")
cur.execute("SELECT DISTINCT age_band FROM music_units")
for r in cur.fetchall():
    print("  music_units:", repr(r[0]))
cur.execute("SELECT DISTINCT grade FROM reference_images")
for r in cur.fetchall():
    print("  reference_images.grade:", repr(r[0]))

# ---------- F. how many songs are actually linked vs orphaned content ----------
section("F. UNLINKED CONTENT (rows with zero junction links)")
def unlinked(tbl, jt, col):
    cur.execute('SELECT COUNT(*) FROM "%s" WHERE id NOT IN (SELECT "%s" FROM "%s")' % (tbl, col, jt))
    return cur.fetchone()[0]
print("  songs not in songs_curriculum:", unlinked("songs","songs_curriculum","song_id"))
print("  songs not in songs_early_years:", unlinked("songs","songs_early_years","song_id"))
print("  curriculum_topics not in songs_curriculum:", unlinked("curriculum_topics","songs_curriculum","curriculum_id"))
print("  early_years_topics not in songs_early_years:", unlinked("early_years_topics","songs_early_years","early_years_id"))
print("  circle_time_songs not in circle_time_songs_songs:", unlinked("circle_time_songs","circle_time_songs_songs","circle_time_song_id"))
print("  music_arts_stages not in songs_music_stages:", unlinked("music_arts_stages","songs_music_stages","stage_id"))
print("  resources not in resources_topics:", unlinked("resources","resources_topics","resource_id"))

conn.close()
