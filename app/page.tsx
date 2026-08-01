import Link from "next/link";
import { SiteShell } from "../components/SiteShell";
import { getAllLessons, getPageContent } from "../lib/mdx-content";

export default function Home() {
  const page = getPageContent("home");
  const lessons = getAllLessons();

  return (
    <SiteShell active="home">
      <section className="home-hero">
        <div className="hero-badge"><span className="badge-ring"><img src="/brand-emblem.png" alt="Embroidered tree and music-note emblem" /></span></div>
        <div className="hero-copy">
          <div className="breadcrumb">{page.meta.eyebrow}</div>
          <h1>{page.meta.title}</h1>
          <p className="hero-byline">Where familiar songs become new places to learn.</p>
          <p className="hero-summary">{page.meta.summary}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/topics">Browse lesson topics</Link>
            <Link className="text-link" href="/about">Why this site exists →</Link>
          </div>
        </div>
        <div className="hero-promise stitch">
          <span>THE PROMISE</span>
          <strong>Open a topic. See the lesson. Start planning.</strong>
          <p>No accounts, ratings, link dumps, or complicated planning system.</p>
        </div>
      </section>

      <section className="grade-rail" aria-label="Browse by grade band">
        <div className="rail-intro"><span className="eyebrow">Start where your class is</span><strong>Browse by grade band</strong></div>
        <Link className="grade-chip daycare stitch" href="/topics"><small>0–2 yrs</small><span>Daycare</span><b>→</b></Link>
        <Link className="grade-chip preschool stitch" href="/topics"><small>3–4 yrs</small><span>Preschool</span><b>→</b></Link>
        <Link className="grade-chip grade-one stitch" href="/topics"><small>5–6 yrs</small><span>Grade 1</span><b>→</b></Link>
        <Link className="grade-chip grade-two stitch" href="/topics"><small>6–7 yrs</small><span>Grade 2</span><b>→</b></Link>
      </section>

      <section className="badge-legend" aria-label="Early Years badge colour meanings">
        <span className="eyebrow">A visual language for planning</span>
        <div className="badge-legend-grid">
          <div className="badge-token music"><b>♪</b><span>Music & listening</span></div>
          <div className="badge-token movement"><b>↗</b><span>Movement & action</span></div>
          <div className="badge-token discovery"><b>✦</b><span>Discovery & focus</span></div>
          <div className="badge-token story"><b>✿</b><span>Storytelling & imagination</span></div>
          <div className="badge-token calm"><b>◌</b><span>Reflection & calm</span></div>
          <div className="badge-token practice"><b>+</b><span>Practice & participation</span></div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-intro">
          <span className="eyebrow">Start with a real lesson</span>
          <h2>Two subjects. One reusable planning pattern.</h2>
          <p>Every topic follows the same teacher-friendly structure while allowing the resource type to fit the subject.</p>
        </div>
        <div className="topic-card-grid">
          {lessons.map((lesson) => (
            <Link className="topic-card stitch" href={`/topics/${lesson.meta.slug}`} key={lesson.meta.slug}>
              <span className="topic-subject">{lesson.meta.subject} · {lesson.meta.category}</span>
              <h3>{lesson.meta.title}</h3>
              <p>{lesson.meta.summary}</p>
              <div className="topic-card-footer"><span>{lesson.meta.gradeBand}</span><strong>Open topic →</strong></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-lesson paper-panel stitch">
        <div className="featured-copy">
          <span className="eyebrow">A sample planning trail</span>
          <h2>Make the next lesson feel ready to teach.</h2>
          <p>Each topic turns a promising resource into a small, usable sequence: introduce, practise, notice, and carry the idea forward.</p>
          <Link className="secondary-button" href="/topics">See the lesson trails →</Link>
        </div>
        <div className="featured-image"><img src="/early-years-worksheet-example.png" alt="Illustrated early-years lesson sequence" /></div>
      </section>

      <section className="home-section how-it-works paper-panel stitch">
        <div className="section-intro compact">
          <span className="eyebrow">Designed for tomorrow morning</span>
          <h2>{page.sections[0]?.title}</h2>
          <p>{page.sections[0]?.paragraphs[0]}</p>
        </div>
        <div className="promise-grid">
          {page.sections.slice(1).map((section, index) => (
            <article key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{section.title}</h3>
              <p>{section.paragraphs[0]}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
