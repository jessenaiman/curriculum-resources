import { SiteShell } from "../../components/SiteShell";
import { CastGuidePage } from "../../components/CastGuidePage";

export default function CastGuideRoute() {
  return (
    <SiteShell active="cast-guide">
      <CastGuidePage />
    </SiteShell>
  );
}
