import Link from "next/link";
import { SubjectDiscovery } from "./SubjectDiscovery";
import { ResourcePreview, type PreviewLesson } from "./ResourcePreview";
import { iconPath } from "../lib/char-icon";

type SlimLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  gradeBand: string;
};
type HomeData = {
  hero: { eyebrow?: string; title?: string; summary?: string };
  lessons: SlimLesson[];
  previewLessons: PreviewLesson[];
};

const CREW_TEASER = ["miss-puddles", "mr-rusty", "miss-hayley", "mr-sam"];

export function HomeExplorer({ hero, lessons, previewLessons }: HomeData) {
  return (
    <>
      <section className="home-hero stitch">
        <div className="hero-main">
          <div className="hero-copy">
            <div className="hero-id">
              <img src="/brand-emblem.png" alt="Embroidered tree and music-note emblem" />
              <span className="breadcrumb">{hero.eyebrow}</span>
            </div>
            <h1>{hero.title}</h1>
            <p className="hero-byline">Where familiar songs become new places to learn.</p>
            <p className="hero-summary">{hero.summary}</p>
            <div className="hero-actions">
              <Link className="primary-button" href="/topics">Browse lesson topics</Link>
              <Link className="text-link" href="/about">Why this site exists →</Link>
            </div>
            <div className="hero-crew-teaser">
              <Link className="hero-crew-teaser-link" href="/cast-guide">
                <span className="hero-crew-teaser-patches">
                  {CREW_TEASER.map((p) => <img key={p} src={iconPath(p)} alt="" />)}
                </span>
                <span className="hero-crew-teaser-copy">
                  <strong>Meet the crew who teaches each subject</strong>
                  <small>Eight familiar faces, one lens each — open the Cast Guide →</small>
                </span>
              </Link>
            </div>
          </div>
          <figure className="hero-frame stitch">
            <img src="/scenes/old-mac-and-barnyard-music-circle.png" alt="Old MacDonald leading a barnyard music circle with the children" />
            <figcaption>Music circle · the whole school sings together</figcaption>
          </figure>
        </div>

        <p className="hero-promise stitch">
          <span>THE PROMISE</span>
          Open a topic, see the lesson, start planning — no accounts, ratings, or link dumps.
        </p>
      </section>

      <SubjectDiscovery lessons={lessons} />

      {previewLessons.length > 0 && <ResourcePreview lessons={previewLessons} />}
    </>
  );
}
