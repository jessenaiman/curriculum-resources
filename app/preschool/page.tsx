import { SiteShell } from "../../components/SiteShell";
import { EarlyYearsHub } from "../../components/EarlyYearsHub";
import { PRESCHOOL_SONGS } from "../../lib/early-years";

export default function PreschoolPage() {
  return (
    <SiteShell active="preschool">
      <EarlyYearsHub
        band="preschool"
        title="Preschool"
        tagline="The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together."
        lead={{ patch: "miss-puddles", name: "Miss Puddles" }}
        tier="detailed"
        topics={PRESCHOOL_SONGS}
      />
    </SiteShell>
  );
}
