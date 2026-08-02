import { SiteShell } from "../components/SiteShell";
import { HomeExplorer } from "../components/HomeExplorer";
import { getAllLessons, getPageContent } from "../lib/mdx-content";

export default function Home() {
  const page = getPageContent("home");
  const lessons = getAllLessons().map((lesson) => ({
    slug: lesson.meta.slug,
    title: lesson.meta.title,
    subject: lesson.meta.subject,
    category: lesson.meta.category,
    summary: lesson.meta.summary,
    gradeBand: lesson.meta.gradeBand,
  }));

  return (
    <SiteShell active="home">
      <HomeExplorer
        hero={{ eyebrow: page.meta.eyebrow, title: page.meta.title, summary: page.meta.summary }}
        lessons={lessons}
        how={{
          introTitle: page.sections[0]?.title,
          introPara: page.sections[0]?.paragraphs[0],
          cards: page.sections.slice(1).map((section) => ({ title: section.title, para: section.paragraphs[0] })),
        }}
      />
    </SiteShell>
  );
}
