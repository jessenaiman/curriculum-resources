"use client";

import { useState } from "react";

type Step = {
  label: string;
  title: string;
  instruction: string;
  resource: "shared" | "missing" | "none";
};

type Grade = {
  grade: string;
  lesson: string;
  title: string;
  mode: string;
  standards: string;
  accent: string;
  resourceTitle: string;
  resourceUrl: string;
  resourceNote: string;
  resourceSteps: string;
  steps: Step[];
};

const grades: Grade[] = [
  {
    grade: "Grade 1",
    lesson: "Lesson 1",
    title: "Distinguish long from short vowel sounds in spoken single-syllable words",
    mode: "Oral — no print",
    standards: "US RF.1.2.a · Ontario B2",
    accent: "gold",
    resourceTitle: "UFLI Foundations Toolbox",
    resourceUrl: "https://ufli.education.ufl.edu/foundations/toolbox/1-34/",
    resourceNote: "Unit-level link confirmed; exact lesson number needs confirmation.",
    resourceSteps: "Supports Hook + Guided Practice",
    steps: [
      { label: "Introduce", title: "Long vs. Short Sound Sort", instruction: "Say words aloud. Students clap once for a short sound and twice for a long sound.", resource: "shared" },
      { label: "Teach together", title: "Teacher-Led Sound Discrimination", instruction: "Say 8–10 CVC words. Students identify long or short using a card.", resource: "shared" },
      { label: "Student practice", title: "Listening Sort with Picture Cards", instruction: "Say each word. Students place its picture in the correct vowel column.", resource: "missing" },
      { label: "Check understanding", title: "Quick Oral Exit", instruction: "Say five words. Students respond “long” or “short” aloud.", resource: "none" },
    ],
  },
  {
    grade: "Grade 2",
    lesson: "Lesson 17",
    title: "Distinguish long and short vowels when reading one-syllable words",
    mode: "Reading — print-based",
    standards: "US RF.2.3.a · Ontario B2",
    accent: "green",
    resourceTitle: "UFLI Foundations — Short Vowel Review, Lesson 41",
    resourceUrl: "https://ufli.education.ufl.edu/foundations/toolbox/35--41/",
    resourceNote: "Confirmed: slide deck, decodable passage, home practice, and roll-and-read.",
    resourceSteps: "Supports all four lesson steps",
    steps: [
      { label: "Introduce", title: "Read-Aloud: Spot the Long Vowel", instruction: "Read a passage. Students raise a hand when they hear a long-vowel word.", resource: "shared" },
      { label: "Teach together", title: "Decode & Sort on the Board", instruction: "Read one-syllable words aloud and sort them into long- and short-vowel columns.", resource: "shared" },
      { label: "Student practice", title: "Vowel Sort Worksheet", instruction: "Students read printed words and sort them into long- and short-vowel groups.", resource: "shared" },
      { label: "Check understanding", title: "Five-Word Quick Check", instruction: "Students read five words and identify whether each vowel sound is long or short.", resource: "shared" },
    ],
  },
];

const searchNeeds = [
  { key: "worksheet", short: "Worksheet", label: "Need another worksheet?", prompt: "Find 2–3 free {grade} long and short vowel worksheets focused on listening and picture sorting. Prefer education publishers, universities, literacy organizations, or established teacher-resource sites. Provide direct links and briefly explain how each resource supports this exact skill." },
  { key: "video", short: "Intro video", label: "Need another intro video?", prompt: "Find 2–3 short {grade} videos that clearly demonstrate the difference between long and short vowel sounds in spoken words. Prefer established education channels. Provide the title, source, direct link, approximate length, and one sentence explaining why it fits." },
  { key: "poster", short: "Visual poster", label: "Need a visual poster?", prompt: "Find 2–3 free long and short vowel posters or anchor charts suitable for Grade 1 or Grade 2. Prefer clear classroom visuals from education publishers or teacher-resource organizations. Provide direct links and describe what each visual shows." },
  { key: "game", short: "Oral game", label: "Need another oral game?", prompt: "Find 2–3 no-preparation oral games for distinguishing long and short vowel sounds with {grade} students. Prefer activities that require only spoken words, picture cards, or simple classroom materials. Provide direct links when available." },
];

function ResourceState({ grade, step }: { grade: Grade; step: Step }) {
  if (step.resource === "missing") {
    return (
      <div className="resource-state missing">
        <span className="state-icon">○</span>
        <div><strong>No verified resource yet</strong><p>This row needs a confirmed picture-card resource.</p></div>
      </div>
    );
  }

  if (step.resource === "none") {
    return (
      <div className="resource-state teacher-led">
        <span className="state-icon">✓</span>
        <div><strong>Teacher-led</strong><p>No resource needed for this step.</p></div>
      </div>
    );
  }

  return (
    <div className="resource-card">
      <div className="resource-kicker">{grade.resourceSteps}</div>
      <div className="resource-row">
        <div>
          <h4>{grade.resourceTitle}</h4>
          <p className="publisher">University of Florida Literacy Institute</p>
        </div>
        <a className="open-button" href={grade.resourceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${grade.resourceTitle}`}>Open ↗</a>
      </div>
      <p className="resource-note">{grade.resourceNote}</p>
    </div>
  );
}

function GradeWorkspace({ grade }: { grade: Grade }) {
  const [activeStep, setActiveStep] = useState(0);
  const [activeSearch, setActiveSearch] = useState(0);
  const [copied, setCopied] = useState(false);
  const step = grade.steps[activeStep];
  const search = searchNeeds[activeSearch];
  const prompt = search.prompt.replaceAll("{grade}", grade.grade);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className={`grade-workspace ${grade.accent}`}>
      <header className="grade-header">
        <div className="grade-id"><span>{grade.grade}</span><small>{grade.lesson}</small></div>
        <div className="mode">{grade.mode}</div>
        <h2>{grade.title}</h2>
        <p className="standards">{grade.standards}</p>
      </header>

      <div className="step-tabs" role="tablist" aria-label={`${grade.grade} lesson steps`}>
        {grade.steps.map((item, index) => (
          <button key={item.label} role="tab" aria-selected={index === activeStep} className={index === activeStep ? "active" : ""} onClick={() => setActiveStep(index)}>
            <span>{index + 1}</span>{item.label}
          </button>
        ))}
      </div>

      <section className="focus-panel" aria-live="polite">
        <div className="step-copy">
          <div className="eyebrow">Step {activeStep + 1} · {step.label}</div>
          <h3>{step.title}</h3>
          <p>{step.instruction}</p>
        </div>
        <ResourceState grade={grade} step={step} />
      </section>

      <section className="search-panel">
        <div className="search-heading"><div><span className="eyebrow">Alternative search</span><h3>Need a different resource?</h3></div><span className="search-count">Choose what is missing</span></div>
        <div className="search-tabs" role="tablist" aria-label={`${grade.grade} search needs`}>
          {searchNeeds.map((item, index) => <button key={item.key} className={index === activeSearch ? "active" : ""} onClick={() => setActiveSearch(index)}>{item.short}</button>)}
        </div>
        <div className="prompt-box">
          <div><strong>{search.label}</strong><p>{prompt}</p></div>
          <button className="copy-button" onClick={copyPrompt}>{copied ? "Copied ✓" : "Copy prompt"}</button>
        </div>
      </section>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top"><img src="/brand-emblem.png" alt="" /><span>Old MacDonald<br />Had a School</span></a>
        <div className="nav-links"><a href="#top" className="active">Home</a><a href="#topic">Browse Topics</a><a href="#about">About</a></div>
      </nav>

      <div className="page-shell" id="top">
        <header className="topic-header" id="topic">
          <div>
            <div className="breadcrumb">Literacy / Phonics / Grade 1–2</div>
            <h1>Long & Short Vowels</h1>
          </div>
          <p><strong>Same skill arc, different entry point.</strong> Grade 1 listens and identifies sounds; Grade 2 reviews and applies the skill in print.</p>
        </header>

        <section className="split-workspace" aria-label="Grade 1 and Grade 2 lesson workspaces">
          {grades.map((grade) => <GradeWorkspace key={grade.grade} grade={grade} />)}
        </section>

        <aside className="diagnostic-note"><strong>Planning note</strong><span>Use Grade 2 diagnostic data to decide whether reteaching is needed.</span></aside>

        <nav className="curriculum-path" aria-label="Curriculum path">
          <a href="#"><span>← Previous topic</span><strong>Letter Sounds / Beginning Sounds</strong></a>
          <div><span>Current topic</span><strong>Long & Short Vowels</strong></div>
          <div className="next-unconfirmed"><span>Next topic · confirmation needed →</span><strong>Blending Sounds / Silent E / Vowel Teams</strong></div>
        </nav>
      </div>

      <footer id="about"><span>Old MacDonald Had a School</span><span>A curriculum-organized starting point for teachers.</span></footer>
    </main>
  );
}
