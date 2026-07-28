import Link from "next/link";
import { SiteShell } from "../components/SiteShell";
import { getAllLessons, getPageContent } from "../lib/mdx-content";

export default function Home() {
  const page = getPageContent("home");
  const lessons = getAllLessons();

  return (
    <SiteShell active="home">
      <section className="home-hero paper-panel">
        <div className="hero-copy">
          <div className="breadcrumb">{page.meta.eyebrow}</div>
          <h1>{page.meta.title}</h1>
          <p className="hero-summary">{page.meta.summary}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/topics">Browse lesson topics</Link>
            <Link className="text-link" href="/about">Why this site exists →</Link>
          </div>
        </div>
        <div className="hero-promise">
          <span>THE PROMISE</span>
          <strong>Open a topic. See the lesson. Start planning.</strong>
          <p>No accounts, ratings, link dumps, or complicated planning system.</p>
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
            <Link className="topic-card" href={`/topics/${lesson.meta.slug}`} key={lesson.meta.slug}>
              <span className="topic-subject">{lesson.meta.subject} · {lesson.meta.category}</span>
              <h3>{lesson.meta.title}</h3>
              <p>{lesson.meta.summary}</p>
              <div className="topic-card-footer"><span>{lesson.meta.gradeBand}</span><strong>Open topic →</strong></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section how-it-works paper-panel">
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
