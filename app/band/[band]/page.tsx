import { notFound } from "next/navigation";
import { SiteShell } from "../../../components/SiteShell";
import { BandDirectoryPage } from "../../../components/BandDirectoryPage";
import { getAllLessons, isSingleLesson } from "../../../lib/mdx-content";
import { BAND_META, matchesBand, bandMatchesStaff } from "../../../lib/bands";
import { STAFF } from "../../../lib/cast";

export function generateStaticParams() {
  return Object.keys(BAND_META).map((band) => ({ band }));
}

export default async function BandPage({ params }: { params: Promise<{ band: string }> }) {
  const { band } = await params;
  const meta = BAND_META[band];
  if (!meta) notFound();

  const allLessons = getAllLessons();
  const lessons = allLessons
    .filter((l) => matchesBand(l.meta.gradeBand, band))
    .map((l) => ({
      slug: l.meta.slug,
      title: l.meta.title,
      subject: l.meta.subject,
      category: l.meta.category,
      summary: l.meta.summary,
      gradeBand: l.meta.gradeBand,
      ready: isSingleLesson(l),
      hasPrintables: isSingleLesson(l) && l.printables.length > 0,
      hasVideo: isSingleLesson(l) && !!l.watch?.url,
    }));

  const cast = STAFF.filter((s) => bandMatchesStaff(band, s));

  return (
    <SiteShell active={band as "grade-one" | "grade-two"}>
      <BandDirectoryPage meta={meta} lessons={lessons} cast={cast} />
    </SiteShell>
  );
}
