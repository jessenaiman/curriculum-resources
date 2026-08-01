import { notFound } from "next/navigation";
import { LessonWorkspace } from "../../../components/LessonWorkspace";
import { SingleLessonPage } from "../../../components/SingleLessonPage";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons, getLesson, isSingleLesson } from "../../../lib/mdx-content";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.meta.slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  if (isSingleLesson(lesson)) {
    return <SiteShell active="topics"><SingleLessonPage lesson={lesson} /></SiteShell>;
  }
  return <SiteShell active="topics"><LessonWorkspace lesson={lesson} /></SiteShell>;
}
