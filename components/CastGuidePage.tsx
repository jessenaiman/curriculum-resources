"use client";

import { useState } from "react";
import { STAFF, STUDENTS } from "../lib/cast";
import { iconPath } from "../lib/char-icon";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .15s ease" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function CastGuidePage() {
  const [view, setView] = useState<"staff" | "students">("staff");
  const [open, setOpen] = useState<string | null>(null);

  function toggleOpen(key: string) {
    setOpen((o) => (o === key ? null : key));
  }

  return (
    <div className="cast-page">
      <header className="cast-header">
        <span className="eyebrow">The full farm-school cast</span>
        <h1>Cast Guide</h1>
        <p className="cast-tagline">Eight staff, each with one teaching lens. Eight students, each modeling a different way of learning, noticing and trying. The curriculum controls the resource — the cast just makes it familiar.</p>
      </header>

      <div className="cast-toggle" role="tablist" aria-label="Staff or students">
        <button role="tab" aria-selected={view === "staff"} className={view === "staff" ? "is-active" : ""} onClick={() => { setView("staff"); setOpen(null); }}>Staff</button>
        <button role="tab" aria-selected={view === "students"} className={view === "students" ? "is-active" : ""} onClick={() => { setView("students"); setOpen(null); }}>Students</button>
      </div>

      {view === "staff" ? (
        <div className="cast-grid">
          {STAFF.map((s) => {
            const isOpen = open === s.key;
            return (
              <article className="cast-card stitch" key={s.key}>
                <button className="cast-card-head" onClick={() => toggleOpen(s.key)} aria-expanded={isOpen}>
                  <img className="cast-card-patch" src={iconPath(s.key)} alt="" />
                  <span className="cast-card-copy">
                    <strong>{s.name}</strong>
                    <small>{s.role}</small>
                    <span className="cast-card-band">{s.gradeBand}</span>
                  </span>
                  <ChevronIcon open={isOpen} />
                </button>
                <p className="cast-card-hook">{s.personality[0]}</p>
                {isOpen && (
                  <div className="cast-card-detail">
                    <div><span className="ey-block-label">Worksheet lens</span><p>{s.worksheetLens}</p></div>
                    <div><span className="ey-block-label">Guides</span><ul>{s.guides.map((g) => <li key={g}>{g}</li>)}</ul></div>
                    <div><span className="ey-block-label">Recognizable</span><ul>{s.recognizable.map((r) => <li key={r}>{r}</li>)}</ul></div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="cast-grid">
          {STUDENTS.map((s) => {
            const isOpen = open === s.key;
            return (
              <article className="cast-card stitch" key={s.key}>
                <button className="cast-card-head" onClick={() => toggleOpen(s.key)} aria-expanded={isOpen}>
                  <img className="cast-card-patch" src={iconPath(s.key)} alt="" />
                  <span className="cast-card-copy">
                    <strong>{s.name}</strong>
                    <small>{s.species}{s.note ? ` · ${s.note}` : ""}</small>
                  </span>
                  <ChevronIcon open={isOpen} />
                </button>
                <p className="cast-card-hook">{s.personality[0]}</p>
                {isOpen && (
                  <div className="cast-card-detail">
                    <div><span className="ey-block-label">Learning strengths</span><ul>{s.learningStrengths.map((g) => <li key={g}>{g}</li>)}</ul></div>
                    <div><span className="ey-block-label">Pairs well with</span><ul>{s.pairsWith.map((g) => <li key={g}>{g}</li>)}</ul></div>
                    <div><span className="ey-block-label">Recognizable</span><ul>{s.recognizable.map((r) => <li key={r}>{r}</li>)}</ul></div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
