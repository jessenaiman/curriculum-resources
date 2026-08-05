"use client";

import Link from "next/link";
import { useState } from "react";
import { GatherChecklist } from "./GatherChecklist";
import { StepIcon } from "./icons";
import type { GradeLesson, LessonTopic, Step } from "../lib/mdx-content";

function ResourceState({ step }: { step: Step }) {
  if (step.resourceState === "missing") return <div className="resource-state missing"><span className="state-icon">○</span><div><strong>No verified resource yet</strong><p>{step.resourceNote}</p></div></div>;
  if (step.resourceState === "none") return <div className="resource-state teacher-led"><span className="state-icon">✓</span><div><strong>Teacher-led</strong><p>{step.resourceNote || "No external resource needed for this step."}</p></div></div>;
  return (
    <div className="resource-card stitch">
      <div className="resource-kicker">{step.resourceRole || "Selected starting resource"}</div>
      <div className="resource-row"><div><h4>{step.resourceTitle}</h4><p className="publisher">{step.resourceSource}</p></div><a className="open-button" href={step.resourceUrl} target="_blank" rel="noreferrer">Open ↗</a></div>
      {step.resourceNote && <p className="resource-note">{step.resourceNote}</p>}
    </div>
  );
}

function GradeWorkspace({ grade, lessonSlug }: { grade: GradeLesson; lessonSlug: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [activeSearch, setActiveSearch] = useState(0);
  const [copied, setCopied] = useState(false);
  const step = grade.steps[activeStep];
  const search = grade.searches[activeSearch];

  async function copyPrompt() {
    await navigator.clipboard.writeText(search.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className={`grade-workspace stitch ${grade.accent}`}>
      <header className="grade-header">
        <div className="grade-id"><span>{grade.grade}</span><small>{grade.lesson}</small></div>
        <div className="mode">{grade.mode}</div>
        <h2>{grade.goal}</h2>
        <p className="standards">{grade.standards}</p>
      </header>
      <GatherChecklist lessonSlug={lessonSlug} grade={grade} />
      <div className="lesson-map" role="tablist" aria-label={`${grade.grade} lesson sequence`}>
        {grade.steps.map((item, index) => (
          <button key={item.label} role="tab" aria-selected={index === activeStep} className={index === activeStep ? "active" : ""} onClick={() => setActiveStep(index)}>
            <span><StepIcon label={item.label} /></span><div><small>{item.label}</small><strong>{item.title}</strong></div>
          </button>
        ))}
      </div>
      <section className="focus-panel" aria-live="polite">
        <div className="step-copy">
          <div className="eyebrow"><StepIcon label={step.label} /> Step {activeStep + 1} · {step.label}</div>
          <h3>{step.title}</h3>
          {step.teacher && <p><strong>Teacher:</strong> {step.teacher}</p>}
          {step.students && <p><strong>Students:</strong> {step.students}</p>}
          {step.lookFor && <p className="look-for"><strong>Look for:</strong> {step.lookFor}</p>}
        </div>
        <ResourceState step={step} />
      </section>
      <details className="search-panel">
        <summary><div><span className="eyebrow">Alternative searches</span><h3>Need a different resource?</h3></div><span>Choose what is missing +</span></summary>
        <div className="search-content">
          <div className="search-tabs" role="tablist" aria-label={`${grade.grade} alternative resource searches`}>{grade.searches.map((item, index) => <button key={item.short} className={index === activeSearch ? "active" : ""} onClick={() => setActiveSearch(index)}>{item.short}</button>)}</div>
          <div className="prompt-box"><div><strong>{search.label}</strong><p>{search.prompt}</p></div><button className="copy-button" onClick={copyPrompt}>{copied ? "Copied ✓" : "Copy prompt"}</button></div>
        </div>
      </details>
    </article>
  );
}

export function LessonWorkspace({ lesson }: { lesson: LessonTopic }) {
  return (
    <div className="lesson-page">
      <header className="topic-header">
        <div><div className="breadcrumb">{lesson.meta.subject} / {lesson.meta.category} / {lesson.meta.gradeBand}</div><h1>{lesson.meta.title}</h1></div>
        <p><strong>{lesson.meta.focus}</strong> {lesson.meta.summary}</p>
      </header>
      <section className={`split-workspace${lesson.grades.length === 1 ? " single-workspace" : ""}`} aria-label={lesson.grades.length === 1 ? `${lesson.grades[0].grade} lesson workspace` : "Grade 1 and Grade 2 lesson workspaces"}>{lesson.grades.map((grade) => <GradeWorkspace grade={grade} lessonSlug={lesson.meta.slug} key={grade.grade} />)}</section>
      <aside className="diagnostic-note"><strong>Planning lens</strong><span>{lesson.planningNote}</span></aside>
      <nav className="curriculum-path stitch" aria-label="Curriculum path">
        {lesson.meta.previousSlug ? <Link href={`/topics/${lesson.meta.previousSlug}`}><span>← Previous topic</span><strong>{lesson.meta.previousTitle}</strong></Link> : <div><span>Previous topic</span><strong>{lesson.meta.previousTitle}</strong></div>}
        <div><span>Current topic</span><strong>{lesson.meta.title}</strong></div>
        {lesson.meta.nextSlug ? <Link href={`/topics/${lesson.meta.nextSlug}`}><span>Next topic →</span><strong>{lesson.meta.nextTitle}</strong></Link> : <div className="next-unconfirmed"><span>Next topic · confirmation needed</span><strong>{lesson.meta.nextTitle}</strong></div>}
      </nav>
      <details className="content-source"><summary>Content source and editing note</summary><p>This page is generated from <strong>content/lessons/{lesson.meta.slug}.mdx</strong>. Curriculum reference: {lesson.meta.sourceReference}.</p></details>
    </div>
  );
}
