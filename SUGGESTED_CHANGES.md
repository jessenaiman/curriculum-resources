# Website Redesign — Suggested Changes

## Context

Teachers need to **open a topic and start planning immediately**. The current home page buries the curriculum structure behind generic cards and doesn't surface what teachers actually search for: grade level → subject → lesson → standard code → resources.

The teacher agents produced 5 curriculum maps (Daycare, Kindergarten, Grade 1-3) with 38 weeks of lessons mapped to Ontario standards. The website needs to surface this data prominently.

---

## Home Page Changes

### 1. Add Grade 3 to the Grade Rail
The current rail shows 4 grades (Daycare, Preschool, Grade 1, Grade 2). Grade 3 is missing.

**File:** `app/page.tsx` line 34
```tsx
// Add after grade-two chip
<Link className="grade-chip grade-three" href="/topics?grade=grade-3">
  <small>7–8 yrs</small>
  <span>Grade 3</span>
  <b>→</b>
</Link>
```

**File:** `app/globals.css` line 52
```css
.grade-chip.grade-three { background:#4a6741; }
```

### 2. Replace Generic Topic Cards with Curriculum Map Preview
The current "topic-card-grid" shows generic lesson cards. Replace with a **Week-by-Week Preview** that links to the curriculum map.

**Replace:** `app/page.tsx` lines 44-53

```tsx
<section className="home-section">
  <div className="section-intro">
    <span className="eyebrow">Full-year planning</span>
    <h2>38 weeks of curriculum, mapped to Ontario standards.</h2>
    <p>Each grade has a complete lesson sequence — open your grade, see the week, start planning.</p>
  </div>
  <div className="curriculum-preview-grid">
    {['Daycare', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3'].map((grade) => (
      <Link key={grade} className="curriculum-preview-card" href={`/topics?grade=${grade.toLowerCase().replace(' ', '-')}`}>
        <span className="grade-label">{grade}</span>
        <div className="week-preview">
          <span>Weeks 1–38</span>
          <strong>Ontario-aligned lessons</strong>
        </div>
        <span className="open-arrow">→</span>
      </Link>
    ))}
  </div>
</section>
```

### 3. Add "Quick Start" Section for Teachers
Add a section that answers: "What do I need RIGHT NOW?"

```tsx
<section className="quick-start paper-panel">
  <div className="section-intro compact">
    <span className="eyebrow">Designed for tomorrow morning</span>
    <h2>What do you need today?</h2>
  </div>
  <div className="quick-start-grid">
    <Link href="/topics?subject=language" className="quick-card">
      <span className="quick-icon">📖</span>
      <strong>Literacy lessons</strong>
      <p>Phonics, reading, writing</p>
    </Link>
    <Link href="/topics?subject=math" className="quick-card">
      <span className="quick-icon">🔢</span>
      <strong>Math lessons</strong>
      <p>Number, patterns, measurement</p>
    </Link>
    <Link href="/topics?subject=science" className="quick-card">
      <span className="quick-icon">🔬</span>
      <strong>Science lessons</strong>
      <p>Life systems, earth & space</p>
    </Link>
    <Link href="/topics?subject=arts" className="quick-card">
      <span className="quick-icon">🎵</span>
      <strong>Music & Arts</strong>
      <p>Songs, movement, visual arts</p>
    </Link>
  </div>
</section>
```

### 4. Add "By the Numbers" Trust Section
Teachers want to see coverage at a glance.

```tsx
<section className="stats-row">
  <div className="stat"><strong>190+</strong><span>Unique lessons</span></div>
  <div className="stat"><strong>5</strong><span>Grade levels</span></div>
  <div className="stat"><strong>38</strong><span>Weeks planned</span></div>
  <div className="stat"><strong>0</strong><span>Accounts required</span></div>
</section>
```

---

## Topics Page Changes

### 5. Add Grade Filter
The current topics page shows all lessons. Add a filter bar.

**File:** `app/topics/page.tsx`

```tsx
// Add filter state and UI
const [selectedGrade, setSelectedGrade] = useState('all');
const [selectedSubject, setSelectedSubject] = useState('all');

const filteredLessons = lessons.filter(lesson => {
  if (selectedGrade !== 'all' && lesson.meta.gradeBand !== selectedGrade) return false;
  if (selectedSubject !== 'all' && lesson.meta.subject !== selectedSubject) return false;
  return true;
});
```

Add filter UI above the lesson list:
```tsx
<div className="filter-bar">
  <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}>
    <option value="all">All Grades</option>
    <option value="Daycare">Daycare (0-2)</option>
    <option value="Preschool">Preschool (3-4)</option>
    <option value="Grade 1">Grade 1 (5-6)</option>
    <option value="Grade 2">Grade 2 (6-7)</option>
    <option value="Grade 3">Grade 3 (7-8)</option>
  </select>
  <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
    <option value="all">All Subjects</option>
    <option value="Language">Language</option>
    <option value="Mathematics">Mathematics</option>
    <option value="Science">Science</option>
    <option value="Social Studies">Social Studies</option>
    <option value="Health">Health & PE</option>
    <option value="Arts">The Arts</option>
  </select>
</div>
```

### 6. Show Ontario Code on Each Card
Currently the topic cards show subject and category. Add the Ontario code.

**File:** `components/SiteShell.tsx` or topic card component

```tsx
// In topic-list-card
<div className="topic-list-card">
  <div>
    <span>{lesson.meta.subject}</span>
    <strong>{lesson.meta.category}</strong>
    {lesson.meta.ontarioCode && (
      <code className="ontario-code">{lesson.meta.ontarioCode}</code>
    )}
  </div>
  <h2>{lesson.meta.title}</h2>
  <p>{lesson.meta.summary}</p>
  <div className="topic-list-action">
    {lesson.meta.gradeBand}
    <strong>Open lesson →</strong>
  </div>
</div>
```

---

## Navigation Changes

### 7. Add "Curriculum Maps" Link to Nav
Teachers should be able to access the full-year planning view directly.

**File:** `components/SiteShell.tsx`

```tsx
<div className="nav-links">
  <Link href="/" className={active === "home" ? "active" : ""}>Home</Link>
  <Link href="/curriculum-maps" className={active === "maps" ? "active" : ""}>Curriculum Maps</Link>
  <Link href="/topics" className={active === "topics" ? "active" : ""}>Browse Topics</Link>
  <Link href="/about" className={active === "about" ? "active" : ""}>About</Link>
</div>
```

### 8. Create `/curriculum-maps` Page
A dedicated page showing the full-year planning spreadsheets.

**New file:** `app/curriculum-maps/page.tsx`

```tsx
export default function CurriculumMapsPage() {
  const grades = [
    { name: 'Daycare', age: '0-2 years', weeks: 38, file: 'Curriculum_Map_Daycare.xlsx' },
    { name: 'Kindergarten', age: '4-5 years', weeks: 38, file: 'Curriculum_Map_Kindergarten.xlsx' },
    { name: 'Grade 1', age: '5-6 years', weeks: 38, file: 'Curriculum_Map_Grade1.xlsx' },
    { name: 'Grade 2', age: '6-7 years', weeks: 38, file: 'Curriculum_Map_Grade2.xlsx' },
    { name: 'Grade 3', age: '7-8 years', weeks: 38, file: 'Curriculum_Map_Grade3.xlsx' },
  ];

  return (
    <SiteShell active="maps">
      <header className="listing-header">
        <div className="breadcrumb">Full-year planning</div>
        <h1>Curriculum Maps</h1>
        <p>Downloadable lesson plans for every grade, mapped to Ontario standards.</p>
      </header>
      <section className="curriculum-map-grid">
        {grades.map(grade => (
          <article key={grade.name} className="map-card">
            <span className="grade-label">{grade.name}</span>
            <span className="age-range">{grade.age}</span>
            <span className="weeks">{grade.weeks} weeks</span>
            <a href={`/data/${grade.file}`} download className="download-btn">
              Download →
            </a>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
```

---

## CSS Additions

**File:** `app/globals.css`

```css
/* Curriculum preview cards */
.curriculum-preview-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.curriculum-preview-card {
  display: flex; flex-direction: column; gap: 8px;
  padding: 16px; border-radius: 10px; border: 1px solid var(--line);
  background: var(--paper); transition: border-color 0.15s;
}
.curriculum-preview-card:hover { border-color: var(--gold); }
.grade-label { font-family: Georgia, serif; font-size: 18px; color: var(--navy); font-weight: 700; }
.week-preview span { font-size: 11px; color: #6b7280; }
.week-preview strong { display: block; font-size: 12px; color: var(--navy); }
.open-arrow { margin-top: auto; color: var(--blue); font-size: 14px; }

/* Quick start cards */
.quick-start-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.quick-card {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 20px; border-radius: 10px; border: 1px solid var(--line);
  background: var(--paper); text-align: center; transition: border-color 0.15s;
}
.quick-card:hover { border-color: var(--gold); }
.quick-icon { font-size: 28px; }
.quick-card strong { font-size: 14px; color: var(--navy); }
.quick-card p { margin: 0; font-size: 12px; color: #6b7280; }

/* Stats row */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; }
.stat { text-align: center; padding: 16px; border-radius: 10px; background: var(--paper); border: 1px solid var(--line); }
.stat strong { display: block; font-family: Georgia, serif; font-size: 32px; color: var(--navy); }
.stat span { font-size: 12px; color: #6b7280; }

/* Filter bar */
.filter-bar { display: flex; gap: 12px; margin-bottom: 20px; }
.filter-bar select {
  padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line);
  background: var(--paper); font-size: 13px; color: var(--navy);
}

/* Ontario code badge */
.ontario-code { display: inline-block; margin-top: 4px; padding: 2px 6px; border-radius: 4px; background: #eef4fb; font-size: 9px; color: var(--blue); }

/* Curriculum map cards */
.curriculum-map-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.map-card { display: flex; flex-direction: column; gap: 8px; padding: 20px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper); }
.map-card .grade-label { font-family: Georgia, serif; font-size: 22px; }
.map-card .age-range { font-size: 13px; color: #6b7280; }
.map-card .weeks { font-size: 12px; color: var(--blue); font-weight: 700; }
.download-btn { margin-top: auto; padding: 10px 14px; border-radius: 8px; background: var(--navy); color: white; font-size: 12px; font-weight: 800; text-align: center; }
.download-btn:hover { background: var(--blue); }

@media (max-width: 760px) {
  .curriculum-preview-grid { grid-template-columns: repeat(2, 1fr); }
  .quick-start-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
```

---

## Summary

| Change | Priority | Impact |
|--------|----------|--------|
| Add Grade 3 to rail | High | Completes grade coverage |
| Replace topic cards with curriculum preview | High | Shows 38-week structure |
| Add Quick Start section | High | Answers "what do I need?" |
| Add Grade filter to topics page | High | Reduces navigation clicks |
| Show Ontario codes on cards | Medium | Helps teachers verify alignment |
| Add Curriculum Maps nav link | Medium | Direct access to planning files |
| Create `/curriculum-maps` page | Medium | Downloadable spreadsheets |
| Add stats row | Low | Builds trust |
