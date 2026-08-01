"use client";

import Link from "next/link";
import { useState } from "react";
import type { SingleLessonTopic } from "../lib/mdx-content";

function StepNumber({ num, icon }: { num: number; icon: React.ReactNode }) {
  return (
    <div className="sl-step-number">
      <span className="sl-num">{num}</span>
      <span className="sl-icon">{icon}</span>
    </div>
  );
}

function WatchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2"/><polygon points="10,8 16,11 10,14" fill="currentColor" stroke="none"/></svg>;
}
function TryIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function PracticeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
}
function CheckIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function ExtendIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function ExternalLinkIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
}
function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function CopyIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
}
function LightbulbIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>;
}
function StarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function NotebookIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
}
function SignpostIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18"/><path d="M3 7h12l3 3-3 3H3z" fill="currentColor" opacity="0.2"/><path d="M3 7h12l3 3-3 3H3z"/><path d="M21 14H9l-3 3 3 3h12z" fill="currentColor" opacity="0.2"/><path d="M21 14H9l-3 3 3 3h12z"/></svg>;
}
function CategoryIcon({ type }: { type: string }) {
  if (type === "music") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
  if (type === "document") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
  if (type === "game") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}

function PracticeIconCard({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    "counters": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="4"/><circle cx="16" cy="16" r="4"/></svg>,
    "number-cards": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="14" rx="1"/><text x="7" y="14" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">3</text><text x="17" y="14" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">5</text></svg>,
    "plus-sign": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    "equals-sign": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="15" x2="19" y2="15"/></svg>,
  };
  return <div className="sl-practice-icon">{icons[icon] || icons["counters"]}</div>;
}

function Arrow() {
  return <div className="sl-arrow" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>;
}

export function SingleLessonPage({ lesson }: { lesson: SingleLessonTopic }) {
  const [copied, setCopied] = useState(false);
  const { meta, watch, try: tryStep, practice, check, extend, curriculumPath } = lesson;
  const standards = [meta.standardUS, meta.standardOntario].filter(Boolean).join(" · ") || meta.standards;
  const curriculumLesson = meta.curriculumLesson || meta.title;
  const curriculumSource = meta.recommendedSource || meta.sourceReference;

  async function copySearch() {
    await navigator.clipboard.writeText(extend.searchPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const pathSegments = curriculumPath.length > 0 ? curriculumPath : [meta.subject, meta.category, meta.title];

  return (
    <div className="sl-page lesson-page">
      {/* Breadcrumb + Grade selector */}
      <div className="sl-topbar">
        <nav className="sl-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="sl-bc-home" aria-label="Home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
          <span className="sl-bc-sep">›</span>
          <span>{meta.gradeBand}</span>
          <span className="sl-bc-sep">›</span>
          <span>{meta.subject}</span>
          <span className="sl-bc-sep">›</span>
          <span className="sl-bc-current">{meta.category}</span>
        </nav>
        <div className="sl-grade-select">
          <span>{meta.grade}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      {/* Title section */}
      <header className="sl-header">
        <div className="sl-header-copy">
          <h1>{meta.title}<span className="sl-sparkle" aria-hidden="true">✦</span></h1>
          <p className="sl-summary">{meta.summary}</p>
        </div>
        <div className="sl-badge">
          <div className="sl-badge-clip" aria-hidden="true">
            <svg width="18" height="30" viewBox="0 0 18 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2C6.5 2 5 4 5 6v16c0 3 1.8 5 4 5s4-2 4-5V6c0-2-1.5-4-4-4z"/><path d="M9 6v14"/></svg>
          </div>
          <div className="sl-badge-star" aria-hidden="true">★</div>
          <div className="sl-badge-text">
            <strong>Built for {meta.grade}</strong>
            <span>Approx. {meta.timeEstimate}</span>
          </div>
        </div>
      </header>

      <section className="sl-academic-meta" aria-label="Curriculum alignment">
        <div>
          <span>Curriculum lesson</span>
          <strong>{curriculumLesson}</strong>
        </div>
        <div>
          <span>Standards</span>
          <strong>{standards || "Standards pending"}</strong>
        </div>
        <div>
          <span>Recommended source</span>
          <strong>{curriculumSource || "Source pending"}</strong>
          {meta.externalResource && <a href={meta.externalResource} target="_blank" rel="noreferrer">Open source ↗</a>}
        </div>
      </section>

      {/* 5-step flow */}
      <section className="sl-steps" aria-label="Lesson steps">
        {/* Step 1: Watch */}
        <article className="sl-card">
          <div className="sl-card-head">
            <StepNumber num={1} icon={<WatchIcon />} />
            <div><strong>Watch</strong><small>Best starting resource</small></div>
          </div>
          <div className="sl-card-body">
            <div className="sl-video-thumb">
              <div className="sl-video-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
              <span className="sl-video-title">{watch.title}</span>
            </div>
            <p className="sl-video-desc">{watch.description}</p>
            <div className="sl-video-actions">
              <a href={watch.url} target="_blank" rel="noreferrer" className="sl-btn-primary">{watch.viewLabel} <ExternalLinkIcon /></a>
              <a href={watch.url} target="_blank" rel="noreferrer" className="sl-btn-secondary">{watch.openLabel} <ExternalLinkIcon /></a>
            </div>
          </div>
        </article>

        <Arrow />

        {/* Step 2: Try */}
        <article className="sl-card">
          <div className="sl-card-head">
            <StepNumber num={2} icon={<TryIcon />} />
            <div><strong>Try</strong><small>Teacher-led activity</small></div>
          </div>
          <div className="sl-card-body">
            <h3 className="sl-step-title">{tryStep.title}</h3>
            <p className="sl-step-desc">{tryStep.description}</p>
            {tryStep.tip && (
              <div className="sl-tip">
                <LightbulbIcon />
                <span>{tryStep.tip}</span>
              </div>
            )}
          </div>
        </article>

        <Arrow />

        {/* Step 3: Practice */}
        <article className="sl-card">
          <div className="sl-card-head">
            <StepNumber num={3} icon={<PracticeIcon />} />
            <div><strong>Practice</strong><small>Student practice</small></div>
          </div>
          <div className="sl-card-body">
            <h3 className="sl-step-title">{practice.title}</h3>
            <p className="sl-step-desc">{practice.description}</p>
            {practice.icons.length > 0 && (
              <div className="sl-practice-icons">
                {practice.icons.map((icon) => <PracticeIconCard key={icon} icon={icon} />)}
              </div>
            )}
            {practice.printable && (
              <div className="sl-printable-area">
                {practice.printableURL ? (
                  <a className="sl-btn-primary sl-btn-download" href={practice.printableURL} target="_blank" rel="noreferrer">{practice.printableLabel} <DownloadIcon /></a>
                ) : (
                  <button className="sl-btn-primary sl-btn-download">{practice.printableLabel} <DownloadIcon /></button>
                )}
                <span className="sl-format-label">{practice.printableFormat}</span>
              </div>
            )}
          </div>
        </article>

        <Arrow />

        {/* Step 4: Check */}
        <article className="sl-card">
          <div className="sl-card-head">
            <StepNumber num={4} icon={<CheckIcon />} />
            <div><strong>Check</strong><small>Quick assessment</small></div>
          </div>
          <div className="sl-card-body">
            <h3 className="sl-step-title">{check.title}</h3>
            <p className="sl-step-desc">{check.description}</p>
            {check.tip && (
              <div className="sl-tip">
                <StarIcon />
                <span>{check.tip}</span>
              </div>
            )}
          </div>
        </article>

        <Arrow />

        {/* Step 5: Extend */}
        <article className="sl-card sl-card-extend">
          <div className="sl-card-head">
            <StepNumber num={5} icon={<ExtendIcon />} />
            <div><strong>Extend</strong><small>Search more</small></div>
          </div>
          <div className="sl-card-body">
            <p className="sl-step-desc">Find more ideas and resources to extend this lesson.</p>
            <div className="sl-search-box">
              <div className="sl-search-label">Copy this search</div>
              <div className="sl-search-row">
                <code>{extend.searchPrompt}</code>
                <button className="sl-copy-btn" onClick={copySearch} aria-label="Copy search prompt">
                  {copied ? "✓" : <CopyIcon />}
                </button>
              </div>
            </div>
            {extend.categories.length > 0 && (
              <div className="sl-explore">
                <span className="sl-explore-label">Or explore these</span>
                {extend.categories.map((cat) => (
                  <div key={cat.label} className="sl-explore-item">
                    <CategoryIcon type={cat.icon} />
                    <span>{cat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </section>

      {/* Bottom section */}
      <section className="sl-bottom">
        <div className="sl-teacher-notes">
          <div className="sl-bottom-icon"><NotebookIcon /></div>
          <div>
            <h3>Teacher Notes</h3>
            <p>Jot down ideas, adaptations or reminders for your class.</p>
          </div>
          <div className="sl-notes-lines" aria-label="Notes area">
            <div className="sl-note-line" />
            <div className="sl-note-line" />
            <div className="sl-note-line" />
          </div>
        </div>
        <div className="sl-curriculum-path">
          <div className="sl-bottom-icon"><SignpostIcon /></div>
          <div>
            <h3>Curriculum Path</h3>
            <p>Where this topic fits in your learning journey.</p>
          </div>
          <div className="sl-path-flow">
            {pathSegments.map((seg, i) => (
              <span key={seg} className={`sl-path-node${i === pathSegments.length - 1 ? " sl-path-active" : ""}`}>
                {seg}
                {i < pathSegments.length - 1 && <span className="sl-path-arrow" aria-hidden="true">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>
      <details className="sl-source-note">
        <summary>Curriculum source and editing note</summary>
        <p>{meta.sourceReference || `This page is generated from content/lessons/${meta.slug}.mdx.`}</p>
      </details>
      <nav className="sl-course-nav" aria-label="Lesson navigation">
        {meta.previousSlug ? (
          <Link href={`/topics/${meta.previousSlug}`}>
            <span>← Previous lesson</span>
            <strong>{meta.previousTitle}</strong>
          </Link>
        ) : <div><span>Previous lesson</span><strong>{meta.previousTitle || "Start of sequence"}</strong></div>}
        <div><span>Current lesson</span><strong>{meta.title}</strong></div>
        {meta.nextSlug ? (
          <Link href={`/topics/${meta.nextSlug}`}>
            <span>Next lesson →</span>
            <strong>{meta.nextTitle}</strong>
          </Link>
        ) : <div><span>Next lesson</span><strong>{meta.nextTitle || "End of sequence"}</strong></div>}
      </nav>
    </div>
  );
}
