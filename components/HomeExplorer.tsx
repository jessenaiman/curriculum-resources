import Link from "next/link";
import { SubjectDiscovery } from "./SubjectDiscovery";
import { ResourcePreview, type PreviewLesson } from "./ResourcePreview";
import { GradeBandPicker } from "./GradeBandPicker";
import { FeaturedPrintable } from "./FeaturedPrintable";
import { matchesBand } from "../lib/bands";
import { DAYCARE_SONGS, PRESCHOOL_SONGS } from "../lib/early-years";

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

export function HomeExplorer({ hero, lessons, previewLessons }: HomeData) {
  const bandCounts = {
    daycare: DAYCARE_SONGS.length,
    preschool: PRESCHOOL_SONGS.length,
    "grade-one": lessons.filter((l) => matchesBand(l.gradeBand, "grade-one")).length,
    "grade-two": lessons.filter((l) => matchesBand(l.gradeBand, "grade-two")).length,
  };

  return (
    <>
      <GradeBandPicker counts={bandCounts} />

      <section className="home-hero stitch">
        <div className="hero-main">
          <div className="hero-copy">
            <span className="breadcrumb hero-eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p className="hero-byline">Where familiar songs become new places to learn.</p>
            <p className="hero-summary">{hero.summary}</p>
            <div className="hero-actions">
              <Link className="primary-button" href="/topics">Browse lesson topics</Link>
              <Link className="text-link" href="/about">Why this site exists →</Link>
            </div>
          </div>
          <figure className="hero-frame stitch">
            <img src="/scenes/old-mac-and-barnyard-music-circle.png" alt="Old MacDonald leading a barnyard music circle with the children" />
          </figure>
        </div>
      </section>

      <SubjectDiscovery lessons={lessons} />

      <FeaturedPrintable />

      {previewLessons.length > 0 && <ResourcePreview lessons={previewLessons} />}
    </>
  );
}
