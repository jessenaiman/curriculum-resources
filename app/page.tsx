import { SiteShell } from "../components/SiteShell";
import { HomeExplorer } from "../components/HomeExplorer";
import { getAllLessons, getPageContent, isSingleLesson } from "../lib/mdx-content";

export default function Home() {
  const page = getPageContent("home");
  const allLessons = getAllLessons();
  const lessons = allLessons.map((lesson) => ({
    slug: lesson.meta.slug,
    title: lesson.meta.title,
    subject: lesson.meta.subject,
    category: lesson.meta.category,
    summary: lesson.meta.summary,
    gradeBand: lesson.meta.gradeBand,
  }));
  const previewLessons = allLessons.filter(isSingleLesson).map((lesson) => ({
    slug: lesson.meta.slug,
    title: lesson.meta.title,
    gradeBand: lesson.meta.gradeBand,
    watch: lesson.watch,
    printables: lesson.printables,
    practice: lesson.practice,
  }));

  return (
    <SiteShell active="home">
      <HomeExplorer
        hero={{ eyebrow: page.meta.eyebrow, title: page.meta.title, summary: page.meta.summary }}
        lessons={lessons}
        previewLessons={previewLessons}
      />
    </SiteShell>
  );
}
