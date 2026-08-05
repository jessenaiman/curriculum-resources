import sqlite3
conn = sqlite3.connect('data/curriculum.db')
cur = conn.cursor()
tables = ["standards_codes","resources","reference_images","curriculum_topics","staff","students",
          "music_units","music_arts_stages","unit_templates","songs","circle_time_songs","early_years_topics"]
def cols(t):
    cur.execute('PRAGMA table_info("%s")' % t); return [r[1] for r in cur.fetchall()]
# (label, sqlite boolean expression using {c} placeholder for column)
checks = [
    ("non-breaking space", "instr(\"{c}\", X'C2A0')>0"),
    ("zero-width/BOM",     "(instr(\"{c}\", X'E2808B')>0 OR instr(\"{c}\", X'EFBBBF')>0)"),
    ("double space",       "instr(\"{c}\", '  ')>0"),
    ("tab or CR",          "(instr(\"{c}\", X'09')>0 OR instr(\"{c}\", X'0D')>0)"),
    ("en/em dash",         "(instr(\"{c}\", X'E28093')>0 OR instr(\"{c}\", X'E28094')>0)"),
]
print("Hidden / special character scan (row counts)")
any_hit=False
for t in tables:
    for c in cols(t):
        for label, expr in checks:
            cond = expr.format(c=c)
            cur.execute('SELECT COUNT(*) FROM "%s" WHERE "%s" IS NOT NULL AND %s' % (t, c, cond))
            n = cur.fetchone()[0]
            if n:
                any_hit=True
                print("  %-32s %-20s %3d rows" % (t+"."+c, label, n))
if not any_hit: print("  none found")
conn.close()
