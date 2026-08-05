import Link from "next/link";
import { HOME_BANDS } from "../lib/home-bands";
import { STAFF } from "../lib/cast";
import { CharacterBadge } from "./CharacterBadge";

export function GradeBandPicker({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="band-picker" aria-label="Choose a grade band">
      <div className="band-picker-grid">
        {HOME_BANDS.map((b) => {
          const lead = STAFF.find((s) => s.key === b.leadKey);
          const count = counts[b.key] ?? 0;
          return (
            <Link key={b.key} href={b.href} className="band-picker-card stitch" style={{ backgroundColor: `var(${b.colorVar})` }}>
              <CharacterBadge charKey={b.leadKey} color={`var(${b.colorVar})`} name={lead?.name ?? b.leadKey} size={68} />
              <div className="band-picker-copy">
                <span className="band-picker-age">{b.ageRange}</span>
                <span className="band-picker-label">{b.label}</span>
                <span className="band-picker-tagline">{b.tagline}</span>
                <span className="band-picker-led">Led by {lead?.name ?? b.leadKey}</span>
                <span className="band-picker-count">{count} lesson{count === 1 ? "" : "s"} →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
