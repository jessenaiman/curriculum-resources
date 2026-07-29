"use client";

import { useEffect, useState } from "react";
import type { GradeLesson } from "../lib/mdx-content";

function storageKey(lessonSlug: string, grade: string) {
  return `gather:${lessonSlug}:${grade}`;
}

export function GatherChecklist({ lessonSlug, grade }: { lessonSlug: string; grade: GradeLesson }) {
  const materials = grade.materials.split(/;\s*/).filter(Boolean);
  const resources = Array.from(
    new Map(
      grade.steps
        .filter((step) => step.resourceState === "ready" && step.resourceTitle)
        .map((step) => [step.resourceTitle, { title: step.resourceTitle, source: step.resourceSource, url: step.resourceUrl }])
    ).values()
  );
  const missing = grade.steps.filter((step) => step.resourceState === "missing");

  const items = [...materials.map((label) => `material:${label}`), ...resources.map((r) => `resource:${r.title}`)];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const key = storageKey(lessonSlug, grade.grade);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(key);
        setChecked(saved ? JSON.parse(saved) : {});
      } catch {
        setChecked({});
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [key]);

  function toggle(item: string) {
    setChecked((previous) => {
      const next = { ...previous, [item]: !previous[item] };
      window.localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }

  function reset() {
    setChecked({});
    window.localStorage.removeItem(key);
  }

  const done = items.filter((item) => checked[item]).length;

  return (
    <section className="gather-checklist" aria-label={`Gather materials for ${grade.grade}`}>
      <div className="gather-head">
        <div>
          <span className="eyebrow">Before you teach</span>
          <h3>Gather for {grade.grade}</h3>
        </div>
        <div className="gather-progress">
          <span className={done === items.length && items.length > 0 ? "all-set" : ""}>{done}/{items.length} ready</span>
          {done > 0 && <button type="button" className="reset-button" onClick={reset}>Reset</button>}
        </div>
      </div>
      <div className="gather-groups">
        {materials.length > 0 && (
          <div className="gather-group">
            <span className="gather-group-label">Materials</span>
            <ul>
              {materials.map((item) => {
                const itemKey = `material:${item}`;
                return (
                  <li key={itemKey} className={checked[itemKey] ? "done" : ""}>
                    <label>
                      <input type="checkbox" checked={!!checked[itemKey]} onChange={() => toggle(itemKey)} />
                      <span>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {resources.length > 0 && (
          <div className="gather-group">
            <span className="gather-group-label">Digital resources</span>
            <ul>
              {resources.map((resource) => {
                const itemKey = `resource:${resource.title}`;
                return (
                  <li key={itemKey} className={checked[itemKey] ? "done" : ""}>
                    <label>
                      <input type="checkbox" checked={!!checked[itemKey]} onChange={() => toggle(itemKey)} />
                      <span>{resource.title}</span>
                    </label>
                    <a className="gather-open" href={resource.url} target="_blank" rel="noreferrer">Open ↗</a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {missing.length > 0 && (
        <div className="gather-missing">
          <span className="state-icon">○</span>
          <div>
            <strong>Still need to find</strong>
            <p>{missing.map((step) => step.title).join(" · ")} — no verified resource yet.</p>
          </div>
        </div>
      )}
    </section>
  );
}
