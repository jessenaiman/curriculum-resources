import aboutRaw from "../content/pages/about.mdx?raw";
import homeRaw from "../content/pages/home.mdx?raw";
import mathRaw from "../content/lessons/addition-subtraction-word-problems.mdx?raw";
import phonicsRaw from "../content/lessons/long-short-vowels.mdx?raw";

export type Step = { label: string; title: string; teacher: string; students: string; lookFor: string; resourceState: "ready" | "missing" | "none"; resourceTitle: string; resourceSource: string; resourceUrl: string; resourceRole: string; resourceNote: string };
export type SearchPrompt = { short: string; label: string; prompt: string };
export type GradeLesson = { grade: string; lesson: string; mode: string; standards: string; goal: string; materials: string; accent: string; steps: Step[]; searches: SearchPrompt[] };
export type LessonTopic = { meta: Record<string, string>; grades: GradeLesson[]; planningNote: string };
export type ContentSection = { title: string; kicker: string; paragraphs: string[]; bullets: string[] };
export type PageContent = { meta: Record<string, string>; sections: ContentSection[] };

function splitDocument(raw: string) {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("MDX file must start with frontmatter");
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");
    if (index > 0) meta[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return { meta, body: match[2].trim() };
}

function field(lines: string[], name: string) {
  const prefix = `- ${name}:`;
  return lines.find((line) => line.startsWith(prefix))?.slice(prefix.length).trim() || "";
}

function parseStep(label: string, title: string, lines: string[]): Step {
  return {
    label, title,
    teacher: field(lines, "Teacher"), students: field(lines, "Students"), lookFor: field(lines, "Look for"),
    resourceState: (field(lines, "Resource state") || "ready") as Step["resourceState"],
    resourceTitle: field(lines, "Resource"), resourceSource: field(lines, "Source"), resourceUrl: field(lines, "URL"), resourceRole: field(lines, "Resource role"), resourceNote: field(lines, "Resource note"),
  };
}

export function parseLesson(raw: string): LessonTopic {
  const { meta, body } = splitDocument(raw);
  const lines = body.split("\n").map((line) => line.trim());
  const planningIndex = lines.findIndex((line) => line === "## Planning note");
  const planningNote = planningIndex >= 0 ? lines.slice(planningIndex + 1).find((line) => line && !line.startsWith("#")) || "" : "";
  const grades: GradeLesson[] = [];
  const gradeIndexes = lines.map((line, index) => line.match(/^## (Grade \d+)$/) ? index : -1).filter((index) => index >= 0);

  for (let gradePosition = 0; gradePosition < gradeIndexes.length; gradePosition++) {
    const start = gradeIndexes[gradePosition];
    const end = gradeIndexes[gradePosition + 1] ?? (planningIndex >= 0 ? planningIndex : lines.length);
    const gradeLines = lines.slice(start + 1, end);
    const firstStep = gradeLines.findIndex((line) => line.startsWith("### "));
    const grade = lines[start].slice(3);
    const metadata = firstStep >= 0 ? gradeLines.slice(0, firstStep) : gradeLines;
    const stepLines = firstStep >= 0 ? gradeLines.slice(firstStep) : [];
    const searchStart = stepLines.findIndex((line) => line === "### Alternative searches");
    const lessonStepLines = searchStart >= 0 ? stepLines.slice(0, searchStart) : stepLines;
    const searchLines = searchStart >= 0 ? stepLines.slice(searchStart + 1) : [];
    const steps: Step[] = [];
    const stepIndexes = lessonStepLines.map((line, index) => /^### [^:]+:/.test(line) ? index : -1).filter((index) => index >= 0);
    for (let i = 0; i < stepIndexes.length; i++) {
      const index = stepIndexes[i];
      const heading = lessonStepLines[index].slice(4);
      const colon = heading.indexOf(":");
      steps.push(parseStep(heading.slice(0, colon).trim(), heading.slice(colon + 1).trim(), lessonStepLines.slice(index + 1, stepIndexes[i + 1] ?? lessonStepLines.length)));
    }
    const searches: SearchPrompt[] = [];
    const searchIndexes = searchLines.map((line, index) => /^#### [^:]+:/.test(line) ? index : -1).filter((index) => index >= 0);
    for (let i = 0; i < searchIndexes.length; i++) {
      const index = searchIndexes[i]; const heading = searchLines[index].slice(5); const colon = heading.indexOf(":");
      const prompt = searchLines.slice(index + 1, searchIndexes[i + 1] ?? searchLines.length).find((line) => line && !line.startsWith("#")) || "";
      searches.push({ short: heading.slice(0, colon).trim(), label: heading.slice(colon + 1).trim(), prompt });
    }
    grades.push({ grade, lesson: field(metadata, "Lesson"), mode: field(metadata, "Mode"), standards: field(metadata, "Standards"), goal: field(metadata, "Goal"), materials: field(metadata, "Materials"), accent: grade === "Grade 1" ? "gold" : "green", steps, searches });
  }
  return { meta, grades, planningNote };
}

export function parsePage(raw: string): PageContent {
  const { meta, body } = splitDocument(raw);
  const sections: ContentSection[] = [];
  for (const block of body.split(/\n(?=## )/)) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines[0]?.startsWith("## ")) continue;
    const paragraphs: string[] = []; const bullets: string[] = []; let kicker = "";
    for (const line of lines.slice(1)) {
      if (line.startsWith("Kicker: ")) kicker = line.slice(8);
      else if (line.startsWith("- ")) bullets.push(line.slice(2));
      else paragraphs.push(line);
    }
    sections.push({ title: lines[0].slice(3), kicker, paragraphs, bullets });
  }
  return { meta, sections };
}

const lessons = [parseLesson(phonicsRaw), parseLesson(mathRaw)];
export function getAllLessons() { return lessons; }
export function getLesson(slug: string) { return lessons.find((lesson) => lesson.meta.slug === slug); }
export function getPageContent(slug: "home" | "about") { return parsePage(slug === "home" ? homeRaw : aboutRaw); }
