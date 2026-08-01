import { notFound } from "next/navigation";
import { LessonWorkspace } from "../../../components/LessonWorkspace";
import { SingleLessonPage } from "../../../components/SingleLessonPage";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons, getLesson, isSingleLesson } from "../../../lib/mdx-content";
import { resolveSiteTheme } from "../../../lib/site-theme";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.meta.slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const suggestedTheme = resolveSiteTheme(lesson.meta);
  if (isSingleLesson(lesson)) {
    return <SiteShell active="topics" suggestedTheme={suggestedTheme}><SingleLessonPage lesson={lesson} /></SiteShell>;
  }
  return <SiteShell active="topics" suggestedTheme={suggestedTheme}><LessonWorkspace lesson={lesson} /></SiteShell>;
}
