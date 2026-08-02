import { SiteShell } from "../../components/SiteShell";
import { getPageContent } from "../../lib/mdx-content";

export default function AboutPage() {
  const page = getPageContent("about");
  return (
    <SiteShell active="about">
      <section className="about-hero paper-panel">
        <div>
          <div className="breadcrumb">{page.meta.eyebrow}</div>
          <h1>{page.meta.title}</h1>
          <p className="hero-summary">{page.meta.summary}</p>
        </div>
        <div className="about-mark"><img src="/brand-emblem.png" alt="Old MacDonald Had a School tree and music-note emblem" /></div>
      </section>
      <section className="about-layout">
        <div className="about-story">
          {page.sections.map((section) => (
            <article className="stitch" key={section.title}>
              <span className="eyebrow">{section.kicker}</span>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets.length > 0 && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </article>
          ))}
        </div>
        <aside className="hire-card">
          <span className="eyebrow">Work with me</span>
          <h2>{page.meta.hireTitle}</h2>
          <p>{page.meta.hireSummary}</p>
          <ul><li>Curriculum-organized content systems</li><li>Teacher-resource research and curation</li><li>Educational product and visual design</li></ul>
          {page.meta.contactUrl && <a className="hire-button" href={page.meta.contactUrl}>{page.meta.contactLabel || "Get in touch"}</a>}
        </aside>
      </section>
    </SiteShell>
  );
}
