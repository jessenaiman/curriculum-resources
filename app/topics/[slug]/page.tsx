import { notFound } from "next/navigation";
import { LessonWorkspace } from "../../../components/LessonWorkspace";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons, getLesson } from "../../../lib/mdx-content";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.meta.slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <SiteShell active="topics"><LessonWorkspace lesson={lesson} /></SiteShell>;
}
