// Maps a character/teacher to a kebab key that doubles as the patch filename
// and the `data-char` hook used to drive the per-character accent color
// (see the `[data-char="..."]` token blocks in app/globals.css).
export function charKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function charKeyForSubject(subject: string): string {
  if (/math/i.test(subject)) return "mr-sam";
  if (/literacy|phonics|language|reading/i.test(subject)) return "miss-hayley";
  if (/music/i.test(subject)) return "mr-rusty";
  return "old-macdonald";
}
