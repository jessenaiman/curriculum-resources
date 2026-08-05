"use client";

import { useState } from "react";
import type { PracticeStep, PrintableDoc, WatchStep } from "../lib/mdx-content";

const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const DownloadIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const ExternalIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
const ZoomIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const DocIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);

export type PreviewLesson = { slug: string; title: string; gradeBand: string; watch: WatchStep; printables: PrintableDoc[]; practice: PracticeStep };

export function ResourcePreview({ lessons }: { lessons: PreviewLesson[] }) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const lesson = lessons[active];
  if (!lesson) return null;
  const docs: PrintableDoc[] = lesson.printables.length
    ? lesson.printables
    : lesson.practice.printable
      ? [{ title: lesson.practice.printableLabel || "Printable", image: "", format: lesson.practice.printableFormat || "PDF", url: lesson.practice.printableURL || "" }]
      : [];
  const previewDoc = preview !== null ? docs[preview] : null;

  return (
    <section className="home-section resource-preview paper-panel stitch" aria-label="Preview real lesson resources">
      <div className="section-intro compact">
        <span className="eyebrow">See what's inside</span>
        <h2>Preview real lesson resources.</h2>
        <p>Every topic opens with a chosen video and a set of printables — here's what a teacher actually sees, before you click in.</p>
      </div>

      <div className="lp-map rp-map" role="tablist" aria-label="Choose a lesson to preview">
        {lessons.map((l, i) => (
          <button key={l.slug} role="tab" aria-selected={i === active} className={`stitch${i === active ? " active" : ""}`} onClick={() => { setActive(i); setPreview(null); }}>
            <span className="lp-map-text"><strong>{l.title}</strong><small>{l.gradeBand}</small></span>
          </button>
        ))}
      </div>

      <div className="rp-body">
        <div className="rp-video">
          <span className="eyebrow">Watch</span>
          <div className="lp-video">
            <span className="lp-video-play"><svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5,3 19,12 5,21" /></svg></span>
            <span className="lp-video-title">{lesson.watch.title}</span>
          </div>
          <p className="rp-video-note">{lesson.watch.thumbnailNote || lesson.watch.description}</p>
          <a className="lp-btn-ghost" href={lesson.watch.url} target="_blank" rel="noreferrer">{lesson.watch.openLabel || "Open source"} <ExternalIcon /></a>
        </div>

        <div className="rp-docs">
          <span className="eyebrow">{docs.length > 0 ? `${docs.length} printable${docs.length === 1 ? "" : "s"}` : "Printables"}</span>
          {docs.length > 0 ? (
            <div className="lp-docs">
              {docs.map((d, i) => (
                d.image ? (
                  <div className="lp-doc" key={d.title + i}>
                    <button className="lp-doc-thumb" onClick={() => setPreview(i)} aria-label={`Preview ${d.title}`}>
                      <img src={d.image} alt={d.title} />
                      <span className="lp-doc-fmt">{d.format}</span>
                      <span className="lp-doc-zoom" aria-hidden="true"><ZoomIcon /></span>
                    </button>
                    <div className="lp-doc-foot"><strong>{d.title}</strong></div>
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
            <p className="rp-no-docs">This topic's practice step doesn't use a printable — it's teacher-led instead.</p>
          )}
          <a className="rp-open-lesson" href={`/topics/${lesson.slug}`}>Open the full lesson →</a>
        </div>
      </div>

      {previewDoc && (
        <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={`Preview: ${previewDoc.title}`} onClick={() => setPreview(null)}>
          <button className="lp-lightbox-close" onClick={() => setPreview(null)} aria-label="Close preview"><CloseIcon /></button>
          <div className="lp-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <img className="lp-lightbox-img" src={previewDoc.image} alt={previewDoc.title} />
            <div className="lp-lightbox-bar">
              <div className="lp-lightbox-cap"><strong>{previewDoc.title}</strong><small>{previewDoc.format}</small></div>
              <div className="lp-lightbox-actions">
                {previewDoc.url ? <a className="lp-btn-ghost" href={previewDoc.url} download><DownloadIcon /> Download</a> : null}
                <a className="lp-btn" href={`/topics/${lesson.slug}`}>Open lesson ↗</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
