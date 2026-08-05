// Character bust (public/icons/canva-sheet-02, transparent background) on a
// colored circle — the color-coded identity system from lib/cast.ts (staff
// coded by subject taught, students by their canonical CAST_AND_ROLES.md
// color). Replaces the old iconPath()/iconPathSmall() felt-patch PNGs.

// canva-sheet-02 filenames don't all match the character key 1:1
// (old-macdonald -> old-mac.png; there is no separate "-blue"/"-purple" suffix).
const BUST_FILE: Record<string, string> = {
  "old-macdonald": "old-mac",
  "miss-puddles": "miss-puddles",
  "mr-rusty": "mr-rusty",
  "miss-hayley": "miss-hayley",
  "mr-sam": "mr-sam",
  "mr-maisy": "mr-maisy",
  "mr-puddles": "mr-puddles",
  "miss-maisy": "miss-maisy",
  hopper: "hopper",
  maisy: "maisy",
  penny: "penny",
  puddles: "puddles",
  sam: "sam",
  scout: "scout",
  whiskers: "whiskers",
  rusty: "rusty",
};

export function bustPath(key: string): string {
  const file = BUST_FILE[key];
  return file ? `/icons/canva-sheet-02/${file}.png` : `/patches/${key}.png`;
}

export function CharacterBadge({
  charKey, color, name, size = 48, className,
}: {
  charKey: string; color: string; name: string; size?: number; className?: string;
}) {
  return (
    <span
      className={`char-badge${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <img src={bustPath(charKey)} alt={name} />
    </span>
  );
}
