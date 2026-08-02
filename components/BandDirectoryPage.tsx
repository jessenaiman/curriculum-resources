import Link from "next/link";
import { BandLessonGrid, type BandLesson } from "./BandLessonGrid";
import { iconPath } from "../lib/char-icon";
import { BAND_META, leadNames } from "../lib/bands";
import type { StaffMember } from "../lib/cast";
import type { BandMeta } from "../lib/bands";

export function BandDirectoryPage({
  meta,
  lessons,
  cast,
}: {
  meta: BandMeta;
  lessons: BandLesson[];
  cast: StaffMember[];
}) {
  const readyCount = lessons.filter((l) => l.ready).length;
  const printableCount = lessons.filter((l) => l.hasPrintables).length;
  const names = leadNames(meta.leads, cast);

  return (
    <>
      <section className="gb-hero stitch">
        <div className="gb-hero-content">
          <span className="gb-hero-eyebrow">{meta.eyebrow}</span>
          <h1>{meta.label}</h1>
          <p className="gb-hero-tagline">{meta.tagline}</p>
          <div className="gb-hero-leads">
            <span className="gb-hero-patches">
              {meta.leads.map((key) => (
                <img key={key} src={iconPath(key)} alt="" />
              ))}
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
          <BandLessonGrid lessons={lessons} bandKey={meta.key} />
        </div>
        <div className="gb-info">
          <div className="gb-about paper-panel stitch">
            <h2>About {meta.label}</h2>
            <div className="gb-about-patches">
              {meta.leads.map((key) => (
                <img key={key} src={iconPath(key)} alt="" />
              ))}
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
          <div className="gb-cast paper-panel stitch">
            <h2>Cast &amp; Characters</h2>
            <ul className="gb-cast-list">
              {cast.map((c) => (
                <li key={c.key}>
                  <img src={iconPath(c.key)} alt="" />
                  <div>
                    <strong>{c.name}</strong>
                    <small>{c.role}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
