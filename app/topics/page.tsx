import Link from "next/link";
import { SiteShell } from "../../components/SiteShell";
import { getAllLessons } from "../../lib/mdx-content";

export default function TopicsPage() {
  const lessons = getAllLessons();
  return (
    <SiteShell active="topics">
      <header className="listing-header">
        <div className="breadcrumb">Curriculum-organized starting points</div>
        <h1>Browse lesson topics</h1>
        <p>Each page gives you a complete teaching sequence, one curated starting resource, and targeted searches when you need a different option.</p>
      </header>
      <section className="topic-list">
        {lessons.map((lesson) => (
          <Link href={`/topics/${lesson.meta.slug}`} className="topic-list-card" key={lesson.meta.slug}>
            <div><span>{lesson.meta.subject}</span><strong>{lesson.meta.category}</strong></div>
            <h2>{lesson.meta.title}</h2>
            <p>{lesson.meta.summary}</p>
            <div className="topic-list-action">{lesson.meta.gradeBand}<strong>Open lesson →</strong></div>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
}
