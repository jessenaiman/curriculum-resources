"use client";

import { useState } from "react";
import type { EarlyYearsTopic } from "../lib/early-years";
import { CharacterBadge } from "./CharacterBadge";
import { STAFF, STUDENTS } from "../lib/cast";

function charColor(key: string): string {
  return STAFF.find((s) => s.key === key)?.color ?? STUDENTS.find((s) => s.key === key)?.color ?? "var(--gold)";
}
function charName(key: string): string {
  return STAFF.find((s) => s.key === key)?.name ?? STUDENTS.find((s) => s.key === key)?.name ?? key;
}

const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const ZoomIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const DownloadIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);

export type EarlyYearsBand = "daycare" | "preschool" | "kindergarten";
export type EarlyYearsTier = "list" | "detailed" | "bridge";

export function EarlyYearsHub({
  band, title, tagline, lead, tier, topics,
}: {
  band: EarlyYearsBand;
  title: string;
  tagline: string;
  lead: { patch: string; name: string };
  tier: EarlyYearsTier;
  topics: EarlyYearsTopic[];
}) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(false);
  const topic = topics[active];

  return (
    <div className={`ey-page ey-${band}`}>
      <header className="ey-header">
        <span className="eyebrow">{tier === "bridge" ? "Kindergarten · bridge format" : "Adult-led · no worksheet"}</span>
        <h1>{title}</h1>
        <p className="ey-tagline">{tagline}</p>
        {tier === "bridge" && (
          <p className="ey-bridge-note stitch">This band's format is still being finalized — song/topic content below is a placeholder shell, not a finished lesson set.</p>
        )}
      </header>

      <div className="ey-shelf" role="tablist" aria-label="Choose a song or topic for today">
        {topics.map((t, i) => (
          <button key={t.slug} role="tab" aria-selected={i === active} className={`ey-shelf-tile stitch${i === active ? " is-active" : ""}`} onClick={() => setActive(i)}>
            <span className="ey-shelf-patch"><CharacterBadge charKey={t.patch} color={charColor(t.patch)} name={charName(t.patch)} size={40} /></span>
            <span className="ey-shelf-title">{t.title}</span>
          </button>
        ))}
      </div>

      <section className={`ey-detail-panel stitch ey-tier-${tier}`} aria-live="polite">
        <div className="ey-detail-head">
          <h2>{topic.title}</h2>
          <span className="ey-detail-focus">{topic.focus}</span>
        </div>

        <div className="ey-steps">
          {topic.steps.map((s, i) => (
            <span className="ey-step" key={s}><span className="ey-step-num">{i + 1}</span>{s}{i < topic.steps.length - 1 && <span className="ey-step-arrow">→</span>}</span>
          ))}
        </div>

        {tier === "detailed" && topic.choice && (
          <div className="ey-choice">
            <span className="ey-block-label">Movement choices</span>
            <div className="ey-choice-list">{topic.choice.map((c) => <span key={c}>{c}</span>)}</div>
          </div>
        )}
        {tier === "detailed" && topic.noticeFor && (
          <div className="ey-notice">
            <span className="ey-block-label">What to notice</span>
            <div className="ey-choice-list">{topic.noticeFor.map((c) => <span key={c}>{c}</span>)}</div>
          </div>
        )}

        <div className="ey-detail-actions">
          <button className="lp-btn" onClick={() => setPreview(true)}>Preview activity page <ZoomIcon /></button>
        </div>

        <div className="ey-lead-badge">
          <CharacterBadge charKey={lead.patch} color={charColor(lead.patch)} name={lead.name} size={40} />
          <div><strong>Led by {lead.name}</strong><small>{tier === "bridge" ? "Picture-led, with a printable the child can mark." : "Practice is the activity itself — no printable for this band."}</small></div>
        </div>
      </section>

      {preview && (
        <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={`Preview: ${topic.title}`} onClick={() => setPreview(false)}>
          <button className="lp-lightbox-close" onClick={() => setPreview(false)} aria-label="Close preview"><CloseIcon /></button>
          <div className="lp-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <img className="lp-lightbox-img" src={topic.image} alt={topic.title} />
            <div className="lp-lightbox-bar">
              <div className="lp-lightbox-cap"><strong>{topic.title}</strong><small>{topic.focus}</small></div>
              <div className="lp-lightbox-actions">
                <a className="lp-btn-ghost" href={topic.image} download><DownloadIcon /> Download</a>
                <a className="lp-btn" href={topic.image} target="_blank" rel="noreferrer">Open / Print ↗</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
