import sqlite3

conn = sqlite3.connect('data/curriculum.db')
conn.row_factory = sqlite3.Row
cur = conn.cursor()

print("=== OBJECTS ===")
cur.execute("SELECT type, name FROM sqlite_master WHERE type IN ('table','view') ORDER BY type, name")
for row in cur.fetchall():
    print(row['type'], '|', row['name'])

print("\n=== TABLE COUNTS ===")
cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
tables = [r['name'] for r in cur.fetchall()]
for t in tables:
    cur.execute('SELECT COUNT(*) FROM "%s"' % t)
    print('%s: %d rows' % (t, cur.fetchone()[0]))

print("\n=== SCHEMAS ===")
for t in tables:
    cur.execute('PRAGMA table_info("%s")' % t)
    cols = cur.fetchall()
    print('\n-- %s --' % t)
    for c in cols:
        parts = [c['name'], c['type'] or 'NO-TYPE']
        if c['notnull']: parts.append('NOT NULL')
        if c['dflt_value'] is not None: parts.append('DEFAULT %s' % c['dflt_value'])
        if c['pk']: parts.append('PK')
        print('  ', ' '.join(parts))

print("\n=== INDEXES / FKs ===")
cur.execute("SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index'")
for row in cur.fetchall():
    print('index:', row['name'], 'on', row['tbl_name'])
for t in tables:
    cur.execute('PRAGMA foreign_key_list("%s")' % t)
    for fk in cur.fetchall():
        print('FK %s.%s -> %s.%s' % (t, fk['from'], fk['table'], fk['to']))

conn.close()
