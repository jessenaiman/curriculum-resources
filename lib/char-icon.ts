// Maps a character key (the /patches/<key>.png filename base, also the
// data-char value) to the properly-cropped, high-contrast circular icon in
// public/icons/early-years/face-patches/ — see icon-repair-philosophy.md.
// Use this everywhere a character appears at icon size (nav, shelf tiles,
// cast cards). The old /patches/<key>.png portraits have a pale off-white
// fill that disappears against a light background at small sizes — reserve
// those for large, single-figure moments only (e.g. a lesson's lead badge
// photo), not repeated icon grids.
const ICON_FILE: Record<string, string> = {
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

export function iconPath(key: string): string {
  const file = ICON_FILE[key];
  return file ? `/icons/early-years/face-patches/${file}.png` : `/patches/${key}.png`;
}
