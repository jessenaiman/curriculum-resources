import sqlite3
conn = sqlite3.connect('data/curriculum.db')
cur = conn.cursor()
def section(t):
    print("\n" + "="*60 + "\n" + t + "\n" + "="*60)

# ---------- junction coverage (distinct on BOTH sides) ----------
section("JUNCTION COVERAGE (distinct keys on each side)")
def cov(jt, a, at, b, bt):
    cur.execute('SELECT COUNT(DISTINCT "%s") FROM "%s"' % (a, jt)); da = cur.fetchone()[0]
    cur.execute('SELECT COUNT(DISTINCT "%s") FROM "%s"' % (b, jt)); db = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM "%s"' % at); ta = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM "%s"' % bt); tb = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM "%s"' % jt); n = cur.fetchone()[0]
    print("  %s: %d links | %s-side %d/%d distinct | %s-side %d/%d distinct" % (jt, n, at, da, ta, bt, db, tb))
cov("songs_curriculum","song_id","songs","curriculum_id","curriculum_topics")
cov("songs_early_years","song_id","songs","early_years_id","early_years_topics")
cov("resources_topics","resource_id","resources","topic_id","curriculum_topics")
cov("circle_time_songs_curriculum","circle_time_song_id","circle_time_songs","curriculum_topic_id","curriculum_topics")
cov("circle_time_songs_early_years","circle_time_song_id","circle_time_songs","early_years_topic_id","early_years_topics")
cov("songs_music_stages","song_id","songs","stage_id","music_arts_stages")

# ---------- fully identical song rows ----------
section("FULLY-IDENTICAL song rows (all cols except id)")
cur.execute("""SELECT COUNT(*) FROM (SELECT cd_title,track_num,song_name,topic,actions,art_style,artist,
               catalog_id,sheet_name,theme,instructions,lyrics,verified,suggested_staff,suggested_students,url, COUNT(*) c
               FROM songs GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16 HAVING c>1)""")
print("  groups of fully-identical rows:", cur.fetchone()[0])
cur.execute("""SELECT COALESCE(cd_title,'(null)') cd, COUNT(*) FROM songs GROUP BY cd_title ORDER BY 2 DESC""")
print("  songs by cd_title:")
for r in cur.fetchall(): print("    %-35s %d" % r)

# ---------- provenance: cd vs catalog_id ----------
section("SONGS PROVENANCE (cd_title vs catalog_id)")
cur.execute("SELECT COUNT(*) FROM songs WHERE cd_title IS NULL AND catalog_id IS NULL"); print("  both NULL:", cur.fetchone()[0])
cur.execute("SELECT COUNT(*) FROM songs WHERE cd_title IS NOT NULL AND catalog_id IS NULL"); print("  cd only:", cur.fetchone()[0])
cur.execute("SELECT COUNT(*) FROM songs WHERE cd_title IS NULL AND catalog_id IS NOT NULL"); print("  catalog only:", cur.fetchone()[0])
cur.execute("SELECT COUNT(*) FROM songs WHERE cd_title IS NOT NULL AND catalog_id IS NOT NULL"); print("  both present:", cur.fetchone()[0])

# ---------- track_num stored as TEXT ----------
section("TRACK_NUM FORMAT (declared TEXT)")
cur.execute("SELECT track_num, COUNT(*) FROM songs GROUP BY track_num ORDER BY 1 LIMIT 12")
print("  sample values:", cur.fetchall())
cur.execute("SELECT COUNT(*) FROM songs WHERE track_num LIKE '%.%'"); print("  values containing '.':", cur.fetchone()[0])

# ---------- verified / free flags ----------
section("VERIFIED / FLAG COLUMNS")
for t,c in [("songs","verified"),("resources","verified"),("resources","free"),("resources","paywalled")]:
    cur.execute('SELECT "%s", COUNT(*) FROM "%s" GROUP BY "%s"' % (c,t,c))
    print("  %s.%s: %s" % (t,c,cur.fetchall()))

# ---------- curriculum_topics classification split ----------
section("CURRICULUM_TOPICS subject split (old 'Literacy & Phonics' catch-all vs specific)")
cur.execute("SELECT subject, COUNT(*) FROM curriculum_topics GROUP BY subject ORDER BY 2 DESC")
for r in cur.fetchall(): print("    %-45s %d" % r)
cur.execute("SELECT COUNT(*) FROM curriculum_topics WHERE subject='Literacy & Phonics'")
lit = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM curriculum_topics")
print("  Literacy & Phonics = %d of %d total" % (lit, cur.fetchone()[0]))
# how many Literacy&Phonics rows have a NON-empty category vs empty
cur.execute("SELECT COUNT(*) FROM curriculum_topics WHERE subject='Literacy & Phonics' AND TRIM(COALESCE(category,''))!=''")
print("  L&P rows WITH category:", cur.fetchone()[0])
cur.execute("SELECT COUNT(*) FROM curriculum_topics WHERE subject!='Literacy & Phonics' AND TRIM(COALESCE(category,''))=''")
print("  specific-subject rows with EMPTY category:", cur.fetchone()[0])

# ---------- early_years blank lesson_goal rows: what DO they have? ----------
section("EARLY_YEARS blank lesson_goal rows")
cur.execute("""SELECT COUNT(*) FROM early_years_topics WHERE lesson_goal IS NULL OR TRIM(lesson_goal)=''""")
print("  blank lesson_goal:", cur.fetchone()[0])
cur.execute("""SELECT category, subcategory, seq_num FROM early_years_topics
               WHERE lesson_goal IS NULL OR TRIM(lesson_goal)='' LIMIT 8""")
for r in cur.fetchall(): print("    cat=%r subcat=%r seq=%r" % r)

conn.close()
