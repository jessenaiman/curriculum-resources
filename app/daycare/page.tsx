import { SiteShell } from "../../components/SiteShell";
import { EarlyYearsHub } from "../../components/EarlyYearsHub";
import { DAYCARE_SONGS } from "../../lib/early-years";

export default function DaycarePage() {
  return (
    <SiteShell active="daycare">
      <EarlyYearsHub
        band="daycare"
        title="Daycare"
        tagline="A new song for today, every time you return. Pick one, sing it together — that's the whole lesson."
        lead={{ patch: "miss-puddles", name: "Miss Puddles" }}
        tier="list"
        topics={DAYCARE_SONGS}
      />
    </SiteShell>
  );
}
