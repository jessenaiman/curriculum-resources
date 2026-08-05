import sqlite3
conn = sqlite3.connect('data/curriculum.db')
cur = conn.cursor()
cur.execute("""SELECT lesson_topic FROM curriculum_topics
               WHERE lesson_topic IS NOT NULL AND TRIM(lesson_topic)!=''
               GROUP BY LOWER(TRIM(lesson_topic)) HAVING COUNT(*)>1""")
dups = [r[0] for r in cur.fetchall()]
both_linked = 0
songs_on_both = 0
for name in dups:
    cur.execute("SELECT id FROM curriculum_topics WHERE LOWER(TRIM(lesson_topic))=?", (name.strip().lower(),))
    ids = [r[0] for r in cur.fetchall()]
    if len(ids) < 2: continue
    per = []
    for tid in ids:
        cur.execute("SELECT COUNT(*), GROUP_CONCAT(song_id) FROM songs_curriculum WHERE curriculum_id=?", (tid,))
        n, lst = cur.fetchone()
        per.append(set(lst.split(',')) if lst else set())
    if all(len(s) > 0 for s in per):
        both_linked += 1
        overlap = set.intersection(*per)
        if overlap:
            songs_on_both += 1
print("duplicate topic groups:", len(dups))
print("groups where BOTH copies have song links:", both_linked)
print("groups where the SAME song links to both copies:", songs_on_both)
# total junction rows touching either copy of a dup topic
ph = ",".join("?" * len(dups))
keys = [d.strip().lower() for d in dups]
cur.execute("""SELECT COUNT(*) FROM songs_curriculum sc JOIN curriculum_topics ct ON sc.curriculum_id=ct.id
               WHERE LOWER(TRIM(ct.lesson_topic)) IN (%s)""" % ph, keys)
print("songs_curriculum rows attached to duplicated topics:", cur.fetchone()[0])
cur.execute("SELECT COUNT(*) FROM songs_curriculum")
print("songs_curriculum rows total:", cur.fetchone()[0])
conn.close()
