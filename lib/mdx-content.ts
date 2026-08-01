import aboutRaw from "../content/pages/about.mdx?raw";
import homeRaw from "../content/pages/home.mdx?raw";

export type Step = { label: string; title: string; teacher: string; students: string; lookFor: string; resourceState: "ready" | "missing" | "none"; resourceTitle: string; resourceSource: string; resourceUrl: string; resourceRole: string; resourceNote: string };
export type SearchPrompt = { short: string; label: string; prompt: string };
export type GradeLesson = { grade: string; lesson: string; mode: string; standards: string; goal: string; materials: string; accent: string; steps: Step[]; searches: SearchPrompt[] };
export type LessonTopic = { meta: Record<string, string>; grades: GradeLesson[]; planningNote: string };
export type ContentSection = { title: string; kicker: string; paragraphs: string[]; bullets: string[] };
export type PageContent = { meta: Record<string, string>; sections: ContentSection[] };

/* ── Single-grade lesson types (merged 5-step + rich content format) ── */
export type ExtendCategory = { label: string; icon: string };
export type WatchStep = { key: "watch"; label: string; subtitle: string; title: string; description: string; url: string; source: string; viewLabel: string; openLabel: string; thumbnailNote: string };
export type TryStep = { key: "try"; label: string; subtitle: string; title: string; teacher: string; students: string; lookFor: string; tip: string; resourceState: "ready" | "missing" | "none"; resourceTitle: string; resourceSource: string; resourceUrl: string; resourceRole: string; resourceNote: string };
export type PracticeStep = { key: "practice"; label: string; subtitle: string; title: string; teacher: string; students: string; lookFor: string; printable: boolean; printableLabel: string; printableURL: string; printableSource: string; printableFormat: string; icons: string[]; resourceState: "ready" | "missing" | "none"; resourceTitle: string; resourceSource: string; resourceUrl: string; resourceRole: string; resourceNote: string };
export type CheckStep = { key: "check"; label: string; subtitle: string; title: string; teacher: string; students: string; lookFor: string; tip: string };
export type ExtendStep = { key: "extend"; label: string; subtitle: string; searchPrompt: string; categories: ExtendCategory[] };
export type SingleStep = WatchStep | TryStep | PracticeStep | CheckStep | ExtendStep;
export type SingleLessonTopic = {
  format: "single";
  meta: Record<string, string>;
  goal: string;
  materials: string[];
  steps: SingleStep[];
  watch: WatchStep;
  try: TryStep;
  practice: PracticeStep;
  check: CheckStep;
  extend: ExtendStep;
  searches: SearchPrompt[];
  planningNote: string;
  curriculumPath: string[];
};
export type AnyLesson = LessonTopic | SingleLessonTopic;

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

/* ── Single-grade lesson parser ── */
function parseSingleLesson(raw: string): SingleLessonTopic {
  const { meta, body } = splitDocument(raw);
  const lines = body.split("\n").map((l) => l.trim());

  function sectionContent(heading: string): string[] {
    const idx = lines.indexOf(`## ${heading}`);
    if (idx < 0) return [];
    const nextIdx = lines.findIndex((l, i) => i > idx && l.startsWith("## "));
    return lines.slice(idx + 1, nextIdx >= 0 ? nextIdx : lines.length).filter(Boolean);
  }

  function fieldFrom(lines: string[], name: string): string {
    const prefix = `- ${name}:`;
    return lines.find((l) => l.startsWith(prefix))?.slice(prefix.length).trim() || "";
  }

  // Watch
  const watchLines = sectionContent("Watch");
  const watch: WatchStep = {
    key: "watch",
    label: "Watch",
    subtitle: "Best starting resource",
    title: fieldFrom(watchLines, "Title"),
    description: fieldFrom(watchLines, "Description"),
    url: fieldFrom(watchLines, "URL"),
    source: fieldFrom(watchLines, "Source"),
    viewLabel: fieldFrom(watchLines, "ViewLabel") || "View Full Screen",
    openLabel: fieldFrom(watchLines, "OpenLabel") || "Open Link",
    thumbnailNote: fieldFrom(watchLines, "ThumbnailNote"),
  };

  // Try
  const tryLines = sectionContent("Try");
  const tryStep: TryStep = {
    key: "try",
    label: "Try",
    subtitle: "Teacher-led activity",
    title: fieldFrom(tryLines, "Title"),
    description: fieldFrom(tryLines, "Description"),
    teacher: fieldFrom(tryLines, "Teacher"),
    students: fieldFrom(tryLines, "Students"),
    lookFor: fieldFrom(tryLines, "LookFor"),
    tip: fieldFrom(tryLines, "Tip"),
    resourceState: (fieldFrom(tryLines, "ResourceState") || "none") as TryStep["resourceState"],
    resourceTitle: fieldFrom(tryLines, "Resource"),
    resourceSource: fieldFrom(tryLines, "Source"),
    resourceUrl: fieldFrom(tryLines, "URL"),
    resourceRole: fieldFrom(tryLines, "ResourceRole"),
    resourceNote: fieldFrom(tryLines, "ResourceNote"),
  };

  // Practice
  const practiceLines = sectionContent("Practice");
  const iconsRaw = fieldFrom(practiceLines, "Icons");
  const practice: PracticeStep = {
    key: "practice",
    label: "Practice",
    subtitle: "Student practice",
    title: fieldFrom(practiceLines, "Title"),
    description: fieldFrom(practiceLines, "Description"),
    teacher: fieldFrom(practiceLines, "Teacher"),
    students: fieldFrom(practiceLines, "Students"),
    lookFor: fieldFrom(practiceLines, "LookFor"),
    printable: fieldFrom(practiceLines, "Printable") === "true",
    printableLabel: fieldFrom(practiceLines, "PrintableLabel") || "Download Printable",
    printableURL: fieldFrom(practiceLines, "PrintableURL"),
    printableSource: fieldFrom(practiceLines, "PrintableSource"),
    printableFormat: fieldFrom(practiceLines, "PrintableFormat") || "PDF",
    icons: iconsRaw ? iconsRaw.split(",").map((s) => s.trim()) : [],
    resourceState: (fieldFrom(practiceLines, "ResourceState") || "none") as PracticeStep["resourceState"],
    resourceTitle: fieldFrom(practiceLines, "Resource"),
    resourceSource: fieldFrom(practiceLines, "Source"),
    resourceUrl: fieldFrom(practiceLines, "URL"),
    resourceRole: fieldFrom(practiceLines, "ResourceRole"),
    resourceNote: fieldFrom(practiceLines, "ResourceNote"),
  };

  // Check
  const checkLines = sectionContent("Check");
  const check: CheckStep = {
    key: "check",
    label: "Check",
    subtitle: "Quick assessment",
    title: fieldFrom(checkLines, "Title"),
    description: fieldFrom(checkLines, "Description"),
    teacher: fieldFrom(checkLines, "Teacher"),
    students: fieldFrom(checkLines, "Students"),
    lookFor: fieldFrom(checkLines, "LookFor"),
    tip: fieldFrom(checkLines, "Tip"),
  };

  // Extend
  const extendLines = sectionContent("Extend");
  const categories: ExtendCategory[] = [];
  let inCategories = false;
  let currentCat: Partial<ExtendCategory> = {};
  for (const line of extendLines) {
    if (line === "- Categories:") { inCategories = true; continue; }
    if (inCategories && line.startsWith("- label:")) {
      if (currentCat.label) categories.push(currentCat as ExtendCategory);
      currentCat = { label: line.slice("- label:".length).trim() };
    } else if (inCategories && line.startsWith("icon:")) {
      currentCat.icon = line.slice("icon:".length).trim();
    }
  }
  if (currentCat.label) categories.push(currentCat as ExtendCategory);
  const extend: ExtendStep = {
    key: "extend",
    label: "Extend",
    subtitle: "Search more",
    searchPrompt: fieldFrom(extendLines, "SearchPrompt"),
    categories,
  };

  // Planning note
  const planningLines = sectionContent("Planning note");
  const planningNote = planningLines.find((l) => l && !l.startsWith("#")) || "";

  // Curriculum path from frontmatter
  const curriculumPathRaw = meta.curriculumPath || "";
  const curriculumPath = curriculumPathRaw ? curriculumPathRaw.split(",").map((s) => s.trim()) : [];

  return { format: "single", meta, goal: meta.goal || meta.summary || "", materials: [], steps: [], watch, try: tryStep, practice, check, extend, searches: [], planningNote, curriculumPath };
}

function parseAnyLesson(raw: string): AnyLesson {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (match && match[1].includes("format: single")) {
    return parseSingleLesson(raw);
  }
  return parseLesson(raw);
}

const lessonFiles = import.meta.glob("../content/lessons/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const lessons = Object.values(lessonFiles).map(parseAnyLesson).sort((a, b) => a.meta.title.localeCompare(b.meta.title));
export function getAllLessons() { return lessons; }
export function getLesson(slug: string): AnyLesson | undefined { return lessons.find((lesson) => lesson.meta.slug === slug); }
export function isSingleLesson(lesson: AnyLesson): lesson is SingleLessonTopic { return "format" in lesson && lesson.format === "single"; }
export function getPageContent(slug: "home" | "about") { return parsePage(slug === "home" ? homeRaw : aboutRaw); }
