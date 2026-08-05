import Link from "next/link";
import { CLUSTERS, clusterFor } from "./SubjectDiscovery";
import { CharacterBadge } from "./CharacterBadge";
import { STAFF } from "../lib/cast";

export type BandLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  gradeBand: string;
  ready: boolean;
  hasPrintables: boolean;
  hasVideo: boolean;
};

function leadForSubject(subject: string): string {
  if (/math/i.test(subject)) return "mr-sam";
  if (/literacy|phonics|language|reading/i.test(subject)) return "miss-hayley";
  if (/music|movement|science|nature/i.test(subject)) return "mr-rusty";
  return "old-macdonald";
}

function ClusterIcon({ clusterKey }: { clusterKey: string }) {
  const cluster = CLUSTERS.find((c) => c.key === clusterKey);
  return cluster?.icon ?? null;
}

const STAFF_NAME: Record<string, string> = {
  "mr-sam": "Mr Sam",
  "miss-hayley": "Miss Hayley",
  "mr-rusty": "Mr Rusty",
  "old-macdonald": "Old MacDonald",
  "miss-puddles": "Miss Puddles",
  "mr-maisy": "Mr Maisy",
  "mr-puddles": "Mr Puddles",
  "miss-maisy": "Miss Maisy",
};

// Presentational only — the active-subject filter state lives in
// BandDirectoryPage (shared with the sidebar Subjects list), so this just
// renders whichever lessons it's handed.
export function BandLessonGrid({ lessons }: { lessons: BandLesson[] }) {
  return (
    <div className="gb-cards">
      {lessons.map((lesson) => {
        const clusterKey = clusterFor(lesson.subject);
        const cluster = CLUSTERS.find((c) => c.key === clusterKey);
        const lead = leadForSubject(lesson.subject);
        const tags: string[] = [];
        if (lesson.hasVideo) tags.push("Video");
        if (lesson.hasPrintables) tags.push("Printable");
        if (lesson.ready) tags.push("5 steps");

        return (
          <article className={`gb-card stitch tone-${clusterKey}`} key={lesson.slug}>
            <div className="gb-card-top">
              <ClusterIcon clusterKey={clusterKey} />
              {!lesson.ready && <span className="gb-card-badge">Coming soon</span>}
            </div>
            <div className="gb-card-body">
              <span className="gb-card-subject">{cluster?.title ?? lesson.subject}</span>
              <h3 className="gb-card-title">{lesson.title}</h3>
              <div className="gb-card-teacher">
                <CharacterBadge charKey={lead} color={STAFF.find((s) => s.key === lead)?.color ?? "var(--navy)"} name={STAFF_NAME[lead] ?? lead} size={24} />
                <span>{STAFF_NAME[lead] ?? lead}</span>
              </div>
              {tags.length > 0 && (
                <div className="gb-card-tags">
                  {tags.map((t) => <span key={t} className="gb-tag">{t}</span>)}
                </div>
              )}
              {lesson.ready ? (
                <Link className="gb-card-action ready" href={`/topics/${lesson.slug}`}>
                  Open lesson →
                </Link>
              ) : (
                <span className="gb-card-action coming-soon">In the works 🌱</span>
              )}
            </div>
          </article>
        );
      })}
      {lessons.length === 0 && (
        <p className="gb-empty">No lessons match this filter yet.</p>
      )}
    </div>
  );
}
