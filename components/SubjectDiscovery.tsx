import Link from "next/link";

type SlimLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  gradeBand: string;
};

const WordsIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5c2-1 5-1 7 0v13c-2-1-5-1-7 0z" /><path d="M20 5.5c-2-1-5-1-7 0v13c2-1 5-1 7 0z" /></svg>);
const NumbersIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.4" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.4" /></svg>);
const MusicNatureIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>);
const HeartHomeIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.5s-7.5-4.6-9.5-9.3C1.2 8 3 5 6.3 5c2 0 3.3 1.1 4 2.2C11 6.1 12.3 5 14.3 5c3.3 0 5.1 3 3.8 6.2-2 4.7-9.5 9.3-9.5 9.3z" /></svg>);

export const CLUSTERS = [
  { key: "words", title: "Words & Stories", tone: "words", icon: <WordsIcon />, match: /literacy|phonics|language|reading|vocabulary/i },
  { key: "numbers", title: "Numbers & Making", tone: "numbers", icon: <NumbersIcon />, match: /math|numeracy|fine motor/i },
  { key: "music", title: "Music, Movement & Nature", tone: "music", icon: <MusicNatureIcon />, match: /music|science|nature|motor|movement/i },
  { key: "heart", title: "Heart & Home", tone: "heart", icon: <HeartHomeIcon />, match: /sel|social|emotional|routine|regulation/i },
] as const;

export function clusterFor(subject: string) {
  for (const c of CLUSTERS) {
    if (c.match.test(subject)) return c.key;
  }
  return "heart";
}

export function SubjectDiscovery({ lessons }: { lessons: SlimLesson[] }) {
  const buckets = CLUSTERS.map((c) => ({
    ...c,
    lessons: lessons.filter((l) => clusterFor(l.subject) === c.key),
  }));

  return (
    <section className="home-section discover-section" aria-label="Browse by subject">
      <div className="section-intro">
        <span className="eyebrow">Start with a subject</span>
        <h2>Discover by subject.</h2>
        <p>Four clusters, every grade band inside each one — the same theme grows from Daycare through Grade 2.</p>
      </div>
      <div className="cluster-grid">
        {buckets.map((c) => (
          <article className={`cluster-card stitch tone-${c.tone}`} key={c.key}>
            <div className="cluster-head">
              <span className="cluster-icon">{c.icon}</span>
              <h3>{c.title}</h3>
            </div>
            {c.lessons.length > 0 ? (
              <ul className="cluster-list">
                {c.lessons.slice(0, 4).map((l) => (
                  <li key={l.slug}>
                    <Link href={`/topics/${l.slug}`}>
                      <span className="cluster-list-body">
                        <span className="cluster-list-title">{l.title}</span>
                        <span className="cluster-list-meta"><span className="cluster-band">{l.gradeBand}</span><span className="cluster-ready">Ready</span></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cluster-empty">More {c.title.toLowerCase()} topics are on the way.</p>
            )}
            {c.lessons.length > 4 && (
              <Link className="cluster-more" href={`/topics?cluster=${c.key}`}>+{c.lessons.length - 4} more →</Link>
            )}
            {c.lessons.length > 0 && c.lessons.length <= 4 && (
              <Link className="cluster-more" href={`/topics?cluster=${c.key}`}>Browse {c.title.toLowerCase()} →</Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
