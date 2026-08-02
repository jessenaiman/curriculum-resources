// Maps a character key to its <key>-<color> filename, shared by both icon
// tiers below (the color suffix is the same regardless of which tier's
// directory it's read from). Canonical accent colors — see
// icon-repair-philosophy.md.
const CHAR_COLOR: Record<string, string> = {
  "old-macdonald": "old-macdonald-yellow",
  "miss-puddles": "miss-puddles-purple",
  "mr-rusty": "mr-rusty-blue",
  "miss-hayley": "miss-hayley-purple",
  "mr-sam": "mr-sam-blue",
  "mr-maisy": "mr-maisy-orange",
  "mr-puddles": "mr-puddles-green",
  "miss-maisy": "miss-maisy-purple",
  hopper: "hopper-red",
  maisy: "maisy-yellow",
  penny: "penny-orange",
  puddles: "puddles-blue",
  sam: "sam-red",
  scout: "scout-green",
  whiskers: "whiskers-orange",
  rusty: "rusty-blue",
};

// The properly-cropped, high-contrast circular felt patch — a stitched
// badge with its own color fill. Use for icon-grid moments with room to
// breathe (~46-56px): shelf tiles, cast cards, lead badges.
export function iconPath(key: string): string {
  const file = CHAR_COLOR[key];
  return file ? `/icons/early-years/face-patches/${file}.png` : `/patches/${key}.png`;
}

// A flatter, no-background cutout bust (no stitched ring) — for small/tight
// chrome where the full circular patch is too busy: nav pills, the hero
// crew-teaser stack (~34-40px and under).
export function iconPathSmall(key: string): string {
  const file = CHAR_COLOR[key];
  return file ? `/icons/early-years/face-busts/${file}.png` : `/patches/${key}.png`;
}

// The full-body felt-puppet portrait, transparent background, no crop at
// all — reserve for a genuinely large single-figure moment (not yet wired
// into any component; none of the current badge slots are big enough to
// show it off).
export function portraitPath(key: string): string {
  return `/portraits/${key}-transparent-circle.png`;
}
