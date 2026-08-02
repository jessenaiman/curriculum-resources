"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PrintableDoc, SingleLessonTopic } from "../lib/mdx-content";
import { charKey } from "../lib/char-key";
import { iconPath } from "../lib/char-icon";

/* ── icons ── */
const WatchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2" /><polygon points="10,8 16,11 10,14" fill="currentColor" stroke="none" /></svg>);
const TryIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
const PracticeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>);
const CheckIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const ExtendIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const ExternalIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
const DownloadIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const CopyIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
const BulbIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>);
const StarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const DocIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);
function CategoryIcon({ type }: { type: string }) {
  if (type === "music") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
  if (type === "document") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
  if (type === "game") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><circle cx="16" cy="10" r="1" fill="currentColor" /><circle cx="18" cy="12" r="1" fill="currentColor" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
}
const PRACTICE_TILES: Record<string, React.ReactNode> = {
  counters: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="4" /><circle cx="16" cy="16" r="4" /></svg>,
  "number-cards": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="8" height="14" rx="1" /><rect x="13" y="5" width="8" height="14" rx="1" /><text x="7" y="14" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">3</text><text x="17" y="14" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">5</text></svg>,
  "plus-sign": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  "equals-sign": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="15" x2="19" y2="15" /></svg>,
};

const STEPS = [
  { key: "watch", label: "Watch", sub: "Best starting resource", icon: <WatchIcon /> },
  { key: "try", label: "Try", sub: "Teacher-led activity", icon: <TryIcon /> },
  { key: "practice", label: "Practice", sub: "Student practice", icon: <PracticeIcon /> },
  { key: "check", label: "Check", sub: "Quick assessment", icon: <CheckIcon /> },
  { key: "extend", label: "Extend", sub: "Search more", icon: <ExtendIcon /> },
] as const;

function leadFor(subject: string) {
  if (/math/i.test(subject)) return { patch: "mr-sam", name: "Mr Sam" };
  if (/literacy|phonics|language|reading/i.test(subject)) return { patch: "miss-hayley", name: "Miss Hayley" };
  return { patch: "old-macdonald", name: "Old MacDonald" };
}

export function SingleLessonPage({ lesson }: { lesson: SingleLessonTopic }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const { meta, watch, try: tryStep, practice, check, extend, curriculumPath, printables } = lesson;

  const standards = [meta.standardUS, meta.standardOntario].filter(Boolean).join(" · ") || meta.standards;
  const curriculumLesson = meta.curriculumLesson || meta.title;
  const curriculumSource = meta.recommendedSource || meta.sourceReference;
  const lead = leadFor(meta.subject);
  const pathSegments = curriculumPath.length > 0 ? curriculumPath : [meta.subject, meta.category, meta.title];
  const docs: PrintableDoc[] = printables.length
    ? printables
    : practice.printable
      ? [{ title: practice.printableLabel || "Printable", image: "", format: practice.printableFormat || "PDF", url: practice.printableURL || "" }]
      : [];

  const step = STEPS[active];

  async function copySearch() {
    await navigator.clipboard.writeText(extend.searchPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  function openPreview(i: number) { setPreview(i); }
  function closePreview() { setPreview(null); }
  function movePreview(d: number) { setPreview((p) => (p === null ? p : (p + d + docs.length) % docs.length)); }

  useEffect(() => {
    if (preview === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
      else if (e.key === "ArrowRight") movePreview(1);
      else if (e.key === "ArrowLeft") movePreview(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, docs.length]);

  const previewDoc = preview !== null ? docs[preview] : null;

  return (
    <div className="lp-page lesson-page" data-char={charKey(lead.name)}>
      <section className="lp-hero stitch">
        <div className="lp-topbar">
          <nav className="lp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="lp-bc-home" aria-label="Home"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></Link>
            <span className="lp-bc-sep">›</span><span>{meta.gradeBand}</span>
            <span className="lp-bc-sep">›</span><span>{meta.subject}</span>
            <span className="lp-bc-sep">›</span><span className="lp-bc-current">{meta.category}</span>
          </nav>
          <span className="lp-grade-chip">{meta.grade}</span>
        </div>

        <header className="lp-header">
          <div className="lp-header-copy">
            <h1>{meta.title}<span className="lp-sparkle" aria-hidden="true">✦</span></h1>
            <p className="lp-summary">{meta.summary}</p>
          </div>
          <div className="lp-lead-badge stitch">
            <img className="lp-lead-patch" src={iconPath(lead.patch)} alt="" />
            <div className="lp-lead-meta">
              <strong>Built for {meta.grade}</strong>
              <small>{lead.name} · {meta.timeEstimate}</small>
            </div>
          </div>
        </header>
      </section>

      <section className="lp-academics stitch" aria-label="Curriculum alignment">
        <div><span>Curriculum lesson</span><strong>{curriculumLesson}</strong></div>
        <div><span>Standards</span><strong>{standards || "Standards pending"}</strong></div>
        <div><span>Recommended source</span><strong>{curriculumSource || "Source pending"}</strong>{meta.externalResource && <a href={meta.externalResource} target="_blank" rel="noreferrer">Open source ↗</a>}</div>
      </section>

      <div className="lp-split">
        <section className="lp-interact" aria-label="Lesson sequence">
          <div className="lp-map" role="tablist" aria-label="Lesson steps">
            {STEPS.map((s, i) => (
              <button key={s.key} role="tab" aria-selected={i === active} className={i === active ? "active" : ""} onClick={() => setActive(i)}>
                <span className="lp-map-num">{i + 1}</span>
                <span className="lp-map-icon">{s.icon}</span>
                <span className="lp-map-text"><strong>{s.label}</strong><small>{s.sub}</small></span>
              </button>
            ))}
          </div>

          <div className="lp-focus lp-panel stitch" aria-live="polite">
            <div className="lp-focus-eyebrow"><span className="lp-focus-icon">{step.icon}</span> Step {active + 1} · {step.label}</div>

            {step.key === "watch" && (
              <>
                <div className="lp-video">
                  <span className="lp-video-play"><svg width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21" /></svg></span>
                  <span className="lp-video-title">{watch.title}</span>
                </div>
                <p className="lp-step-desc">{watch.description}</p>
                <div className="lp-actions">
                  <a className="lp-btn" href={watch.url} target="_blank" rel="noreferrer">{watch.viewLabel} <ExternalIcon /></a>
                  <a className="lp-btn-ghost" href={watch.url} target="_blank" rel="noreferrer">{watch.openLabel} <ExternalIcon /></a>
                </div>
              </>
            )}

            {step.key === "try" && (
              <>
                <h3 className="lp-step-title">{tryStep.title}</h3>
                <p className="lp-step-desc">{tryStep.description}</p>
                {tryStep.teacher && <p className="lp-role"><strong>Teacher:</strong> {tryStep.teacher}</p>}
                {tryStep.students && <p className="lp-role"><strong>Students:</strong> {tryStep.students}</p>}
                {tryStep.lookFor && <p className="lp-lookfor"><strong>Look for:</strong> {tryStep.lookFor}</p>}
                {tryStep.tip && <div className="lp-tip"><BulbIcon /><span>{tryStep.tip}</span></div>}
              </>
            )}

            {step.key === "practice" && (
              <>
                <h3 className="lp-step-title">{practice.title}</h3>
                <p className="lp-step-desc">{practice.description}</p>
                {practice.icons.length > 0 && (
                  <div className="lp-tiles">{practice.icons.map((ic) => <span className="lp-tile" key={ic}>{PRACTICE_TILES[ic] || PRACTICE_TILES.counters}</span>)}</div>
                )}
                {docs.length > 0 && <p className="lp-pointer">The printable worksheet{docs.length > 1 ? "s" : ""} for this step {docs.length > 1 ? "are" : "is"} in the planning panel — preview, download or print {docs.length > 1 ? "them" : "it"} there. →</p>}
              </>
            )}

            {step.key === "check" && (
              <>
                <h3 className="lp-step-title">{check.title}</h3>
                <p className="lp-step-desc">{check.description}</p>
                {check.teacher && <p className="lp-role"><strong>Teacher:</strong> {check.teacher}</p>}
                {check.students && <p className="lp-role"><strong>Students:</strong> {check.students}</p>}
                {check.lookFor && <p className="lp-lookfor"><strong>Look for:</strong> {check.lookFor}</p>}
                {check.tip && <div className="lp-tip lp-tip-star"><StarIcon /><span>{check.tip}</span></div>}
              </>
            )}

            {step.key === "extend" && (
              <>
                <p className="lp-step-desc">Find more ideas and resources to extend this lesson.</p>
                <div className="lp-copybox">
                  <div className="lp-copy-label">Copy this search</div>
                  <div className="lp-copy-row"><code>{extend.searchPrompt}</code><button className="lp-copy-btn" onClick={copySearch} aria-label="Copy search prompt">{copied ? "✓" : <CopyIcon />}</button></div>
                </div>
                {extend.categories.length > 0 && (
                  <div className="lp-explore">
                    <span className="lp-explore-label">Or explore these</span>
                    {extend.categories.map((c) => <span className="lp-explore-item" key={c.label}><CategoryIcon type={c.icon} />{c.label}</span>)}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="lp-plan" aria-label="Lesson planning and documents">
          <div className="lp-plan-card lp-panel stitch">
            <div className="lp-plan-head">
              <span className="eyebrow">Lesson documents</span>
              <h2>{docs.length} {docs.length === 1 ? "sheet" : "sheets"} to preview &amp; print</h2>
              <p>Open any sheet to read it before you download or print. These become your printable PDFs.</p>
            </div>
            {docs.length > 0 ? (
              <div className="lp-docs">
                {docs.map((d, i) => (
                  d.image ? (
                    <div className="lp-doc" key={d.title + i}>
                      <button className="lp-doc-thumb" onClick={() => openPreview(i)} aria-label={`Preview ${d.title}`}>
                        <img src={d.image} alt={d.title} />
                        <span className="lp-doc-fmt">{d.format}</span>
                        <span className="lp-doc-zoom" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg></span>
                      </button>
                      <div className="lp-doc-foot">
                        <strong>{d.title}</strong>
                        {d.url ? <a className="lp-doc-dl" href={d.url} download aria-label={`Download ${d.title}`}><DownloadIcon /></a> : null}
                      </div>
                    </div>
                  ) : (
                    <div className="lp-doc-row" key={d.title + i}>
                      <span className="lp-doc-row-icon"><DocIcon /></span>
                      <strong>{d.title}</strong>
                      <em>{d.format}</em>
                      {d.url ? <a className="lp-btn-ghost" href={d.url} target="_blank" rel="noreferrer">Open <ExternalIcon /></a> : <span className="lp-doc-soon">Coming soon</span>}
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="lp-doc-empty">No printable sheets for this lesson yet.</p>
            )}
          </div>

          <div className="lp-plan-card lp-facts lp-panel stitch">
            <div className="lp-fact"><span>Grade &amp; time</span><strong>{meta.grade} · {meta.timeEstimate}</strong></div>
            <div className="lp-fact"><span>Standards</span><strong>{standards || "Pending"}</strong></div>
            <div className="lp-fact">
              <span>Curriculum path</span>
              <div className="lp-path">{pathSegments.map((seg, i) => <span key={seg} className={`lp-path-node${i === pathSegments.length - 1 ? " lp-path-active" : ""}`}>{seg}</span>)}</div>
            </div>
            {lesson.planningNote && <div className="lp-fact"><span>Planning note</span><p className="lp-note">{lesson.planningNote}</p></div>}
          </div>
        </aside>
      </div>

      <nav className="lp-course-nav" aria-label="Lesson navigation">
        {meta.previousSlug ? <Link href={`/topics/${meta.previousSlug}`}><span>← Previous lesson</span><strong>{meta.previousTitle}</strong></Link> : <div><span>Previous lesson</span><strong>{meta.previousTitle || "Start of sequence"}</strong></div>}
        <div><span>Current lesson</span><strong>{meta.title}</strong></div>
        {meta.nextSlug ? <Link href={`/topics/${meta.nextSlug}`}><span>Next lesson →</span><strong>{meta.nextTitle}</strong></Link> : <div><span>Next lesson</span><strong>{meta.nextTitle || "End of sequence"}</strong></div>}
      </nav>
      <details className="lp-source"><summary>Curriculum source and editing note</summary><p>{meta.sourceReference || `This page is generated from content/lessons/${meta.slug}.mdx.`}</p></details>

      {previewDoc && (
        <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={`Preview: ${previewDoc.title}`} onClick={closePreview}>
          <button className="lp-lightbox-close" onClick={closePreview} aria-label="Close preview"><CloseIcon /></button>
          <button className="lp-lightbox-nav lp-prev" onClick={(e) => { e.stopPropagation(); movePreview(-1); }} aria-label="Previous sheet">‹</button>
          <div className="lp-lightbox-card" onClick={(e) => e.stopPropagation()}>
            {previewDoc.image ? <img className="lp-lightbox-img" src={previewDoc.image} alt={previewDoc.title} /> : <div className="lp-lightbox-none"><DocIcon /><p>No preview available yet.</p></div>}
            <div className="lp-lightbox-bar">
              <div className="lp-lightbox-cap"><strong>{previewDoc.title}</strong><small>{previewDoc.format}{preview !== null ? ` · ${preview + 1} of ${docs.length}` : ""}</small></div>
              <div className="lp-lightbox-actions">
                {previewDoc.url ? <a className="lp-btn-ghost" href={previewDoc.url} download><DownloadIcon /> Download</a> : null}
                {previewDoc.url ? <a className="lp-btn" href={previewDoc.url} target="_blank" rel="noreferrer">Open / Print ↗</a> : null}
              </div>
            </div>
          </div>
          <button className="lp-lightbox-nav lp-next" onClick={(e) => { e.stopPropagation(); movePreview(1); }} aria-label="Next sheet">›</button>
        </div>
      )}
    </div>
  );
}
