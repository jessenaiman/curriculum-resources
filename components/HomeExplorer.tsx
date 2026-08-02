"use client";

import Link from "next/link";
import { useState } from "react";

type SlimLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  gradeBand: string;
};
type HowCard = { title: string; para?: string };
type HomeData = {
  hero: { eyebrow?: string; title?: string; summary?: string };
  lessons: SlimLesson[];
  how: { introTitle?: string; introPara?: string; cards: HowCard[] };
};

const GRADES = [
  { key: "all", label: "All bands", age: "" },
  { key: "daycare", label: "Daycare", age: "0–2 yrs" },
  { key: "preschool", label: "Preschool", age: "3–4 yrs" },
  { key: "grade-one", label: "Grade 1", age: "5–6 yrs" },
  { key: "grade-two", label: "Grade 2", age: "6–7 yrs" },
] as const;

type GradeKey = (typeof GRADES)[number]["key"];

const CREW = [
  { patch: "old-macdonald", name: "Old MacDonald", role: "Headmaster & band leader" },
  { patch: "miss-puddles", name: "Miss Puddles", role: "Daycare teacher" },
  { patch: "mr-rusty", name: "Mr Rusty", role: "Music & dance" },
  { patch: "miss-hayley", name: "Miss Hayley", role: "Grade 1–2 & drama" },
  { patch: "mr-sam", name: "Mr Sam", role: "Math & building" },
  { patch: "mr-maisy", name: "Mr Maisy", role: "Physical education" },
  { patch: "mr-puddles", name: "Mr Puddles", role: "Art & photography" },
  { patch: "miss-maisy", name: "Miss Maisy", role: "Secretary & gardening" },
];

const TRAILS = [
  { img: "/scenes/early-years-worksheet-example.png", title: "A Barn Band Day", band: "Daycare", lead: "miss-puddles", who: "Miss Puddles" },
  { img: "/scenes/follow-the-duckling.png", title: "Follow the Duckling", band: "Daycare", lead: "miss-puddles", who: "Miss Puddles" },
  { img: "/scenes/clap-your-hands.png", title: "Clap Your Hands", band: "Preschool", lead: "mr-rusty", who: "Mr Rusty" },
  { img: "/scenes/seven-jumps.png", title: "Seven Jumps", band: "Preschool", lead: "mr-maisy", who: "Mr Maisy" },
];

function leadFor(subject: string) {
  if (/math/i.test(subject)) return { patch: "mr-sam", who: "Mr Sam" };
  if (/literacy|phonics|language|reading/i.test(subject)) return { patch: "miss-hayley", who: "Miss Hayley" };
  return { patch: "old-macdonald", who: "Old MacDonald" };
}

function matches(gradeBand: string, key: GradeKey) {
  if (key === "all") return true;
  if (key === "grade-one") return /1/.test(gradeBand);
  if (key === "grade-two") return /2/.test(gradeBand);
  return false;
}

export function HomeExplorer({ hero, lessons, how }: HomeData) {
  const [band, setBand] = useState<GradeKey>("all");
  const filtered = lessons.filter((l) => matches(l.gradeBand, band));
  const active = GRADES.find((g) => g.key === band)!;

  return (
    <>
      <section className="home-hero">
        <div className="hero-gradebar">
          <span className="gradebar-tag stitch">Start with your class</span>
          <div className="grade-tabs" role="group" aria-label="Filter lessons by grade band">
            {GRADES.map((g) => (
              <button
                key={g.key}
                type="button"
                className={`grade-tab stitch ${g.key}${band === g.key ? " is-active" : ""}`}
                aria-pressed={band === g.key}
                onClick={() => setBand(g.key)}
              >
                {g.age && <small>{g.age}</small>}
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hero-main">
          <div className="hero-copy">
            <div className="hero-id">
              <img src="/brand-emblem.png" alt="Embroidered tree and music-note emblem" />
              <span className="breadcrumb">{hero.eyebrow}</span>
            </div>
            <h1>{hero.title}</h1>
            <p className="hero-byline">Where familiar songs become new places to learn.</p>
            <p className="hero-summary">{hero.summary}</p>
            <div className="hero-actions">
              <Link className="primary-button" href="/topics">Browse lesson topics</Link>
              <Link className="text-link" href="/about">Why this site exists →</Link>
            </div>
          </div>
          <figure className="hero-frame stitch">
            <img src="/scenes/old-mac-and-barnyard-music-circle.png" alt="Old MacDonald leading a barnyard music circle with the children" />
            <figcaption>Music circle · the whole school sings together</figcaption>
          </figure>
        </div>

        <p className="hero-promise stitch">
          <span>THE PROMISE</span>
          Open a topic, see the lesson, start planning — no accounts, ratings, or link dumps.
        </p>
      </section>

      <section className="crew" aria-label="The teaching crew">
        <div className="crew-head">
          <span className="eyebrow">The teaching crew</span>
          <h2>Eight familiar faces plan alongside you.</h2>
        </div>
        <ul className="crew-strip">
          {CREW.map((m) => (
            <li className="crew-member" key={m.patch}>
              <span className="crew-patch"><img src={`/patches/${m.patch}.png`} alt={`${m.name} felt patch`} /></span>
              <strong>{m.name}</strong>
              <small>{m.role}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section">
        <div className="section-intro">
          <span className="eyebrow">Start with a real lesson</span>
          <h2>Web lessons for Grade 1 &amp; 2.</h2>
          <p>
            {band === "all"
              ? "Every topic follows the same teacher-friendly pattern: watch, try, practise, check, and carry it forward."
              : band === "daycare" || band === "preschool"
                ? "Web lessons begin at Grade 1 — for the little ones, start with the felt-art trails below."
                : `Showing ${active.label} starting points. Each topic follows the same watch → try → practise → check pattern.`}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="topic-card-grid" key={band}>
            {filtered.map((lesson) => {
              const lead = leadFor(lesson.subject);
              return (
                <Link className="topic-card stitch" href={`/topics/${lesson.slug}`} key={lesson.slug}>
                  <span className="topic-lead"><img src={`/patches/${lead.patch}.png`} alt="" /><em>{lead.who}</em></span>
                  <span className="topic-subject">{lesson.subject} · {lesson.category}</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.summary}</p>
                  <p className="card-guidance">Open for the watch → try → practise → check steps.</p>
                  <div className="topic-card-footer"><span>{lesson.gradeBand}</span><span className="card-cta">Open topic <b aria-hidden="true">→</b></span></div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="topic-empty stitch">
            <strong>No web lessons for {active.label} yet.</strong>
            <p>Daycare &amp; Preschool plan with felt-art poster trails — scroll down to see the little ones&rsquo; lessons.</p>
            <a className="text-link" href="#felt-trails">See the felt-art trails ↓</a>
          </div>
        )}
      </section>

      <section className="trail-section" id="felt-trails">
        <div className="section-intro">
          <span className="eyebrow">Felt-art trails</span>
          <h2>Poster lessons for the little ones.</h2>
          <p>Daycare &amp; Preschool are pre-literate, so each lesson is a felt poster plus a short adult-led trail: a song, a story, a movement, and something to make.</p>
        </div>
        <div className="trail-shelf">
          {TRAILS.map((t) => (
            <Link className="trail-card stitch" href="/topics" key={t.title}>
              <span className="trail-thumb">
                <img src={t.img} alt={t.title} />
                <span className="trail-lead"><img src={`/patches/${t.lead}.png`} alt="" /></span>
                <span className="trail-band">{t.band}</span>
              </span>
              <span className="trail-cap">
                <strong>{t.title}</strong>
                <small>Led by {t.who}</small>
                <span className="card-guidance">See the song, story, activity and make-it steps.</span>
                <span className="card-cta">Open the trail <b aria-hidden="true">→</b></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section how-it-works paper-panel stitch">
        <div className="section-intro compact">
          <span className="eyebrow">Designed for tomorrow morning</span>
          <h2>{how.introTitle}</h2>
          <p>{how.introPara}</p>
        </div>
        <div className="promise-grid">
          {how.cards.map((c, i) => (
            <article key={c.title}>
              <span className="promise-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.title}</h3>
              <p>{c.para}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
