"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BandLessonGrid, type BandLesson } from "./BandLessonGrid";
import { CharacterBadge } from "./CharacterBadge";
import { CLUSTERS, clusterFor } from "./SubjectDiscovery";
import { STAFF } from "../lib/cast";
import { BAND_META, leadNames } from "../lib/bands";
import type { StaffMember } from "../lib/cast";
import type { BandMeta } from "../lib/bands";

function staffColor(key: string): string {
  return STAFF.find((s) => s.key === key)?.color ?? "var(--navy)";
}

export function BandDirectoryPage({
  meta,
  lessons,
  cast,
}: {
  meta: BandMeta;
  lessons: BandLesson[];
  cast: StaffMember[];
}) {
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const readyCount = lessons.filter((l) => l.ready).length;
  const printableCount = lessons.filter((l) => l.hasPrintables).length;
  const names = leadNames(meta.leads, cast);

  const filtered = useMemo(
    () => (activeCluster ? lessons.filter((l) => clusterFor(l.subject) === activeCluster) : lessons),
    [lessons, activeCluster]
  );

  return (
    <>
      <section className="gb-hero stitch">
        <div className="gb-hero-content">
          <span className="gb-hero-eyebrow">{meta.eyebrow}</span>
          <h1>{meta.label}</h1>
          <p className="gb-hero-tagline">{meta.tagline}</p>
          <div className="gb-hero-leads">
            <span className="gb-hero-patches">
              {meta.leads.map((key) => {
                const staff = STAFF.find((s) => s.key === key);
                return <CharacterBadge key={key} charKey={key} color={staffColor(key)} name={staff?.name ?? key} size={44} />;
              })}
            </span>
            <span className="gb-hero-led">Led by {names}</span>
          </div>
        </div>
        <div className="gb-hero-pills">
          {Object.values(BAND_META).map((b) => (
            <Link
              key={b.key}
              href={`/band/${b.key}`}
              className={`gb-band-pill${b.key === meta.key ? " active" : ""}`}
            >
              {b.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="gb-body">
        <div className="gb-main">
          <BandLessonGrid lessons={filtered} />
        </div>
        <div className="gb-info">
          <div className="gb-about paper-panel stitch">
            <h2>About {meta.label}</h2>
            <div className="gb-about-patches">
              {meta.leads.map((key) => {
                const staff = STAFF.find((s) => s.key === key);
                return <CharacterBadge key={key} charKey={key} color={staffColor(key)} name={staff?.name ?? key} size={36} />;
              })}
            </div>
            <div className="gb-about-names">
              <strong>{names}</strong>
              <small>CLASS LEAD</small>
            </div>
            <dl className="gb-stats">
              <div><dt>Age range</dt><dd>{meta.ageRange}</dd></div>
              <div><dt>Lessons</dt><dd>{lessons.length}</dd></div>
              <div><dt>Ready now</dt><dd>{readyCount}</dd></div>
              <div><dt>With printables</dt><dd>{printableCount}</dd></div>
            </dl>
          </div>
          <div className="gb-subjects paper-panel stitch">
            <h2>Subjects</h2>
            <ul className="gb-subjects-list" role="tablist" aria-label="Filter by subject">
              <li>
                <button
                  className={`gb-subject-row${!activeCluster ? " active" : ""}`}
                  onClick={() => setActiveCluster(null)}
                  role="tab"
                  aria-selected={!activeCluster}
                >
                  <span className="gb-subject-icon gb-subject-icon-all">{"•"}</span>
                  <span>All subjects</span>
                </button>
              </li>
              {CLUSTERS.map((c) => (
                <li key={c.key}>
                  <button
                    className={`gb-subject-row tone-${c.tone}${activeCluster === c.key ? " active" : ""}`}
                    onClick={() => setActiveCluster(c.key)}
                    role="tab"
                    aria-selected={activeCluster === c.key}
                  >
                    <span className="gb-subject-icon">{c.icon}</span>
                    <span>{c.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
