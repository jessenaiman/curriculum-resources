export const siteThemes = ["farm-day", "lullaby-dusk", "storybook-focus"] as const;

export type SiteTheme = (typeof siteThemes)[number];

export function resolveSiteTheme(meta: Record<string, string>): SiteTheme {
  const explicit = (meta.theme || "").trim().toLowerCase() as SiteTheme;
  if (siteThemes.includes(explicit)) return explicit;

  const signal = [meta.title, meta.category, meta.subject, meta.mood, meta.tags].filter(Boolean).join(" ").toLowerCase();
  if (/lullaby|bedtime|sleep|night|quiet|calm/.test(signal)) return "lullaby-dusk";
  if (/story|storytelling|imagin|pretend|dramatic|reflection/.test(signal)) return "storybook-focus";
  return "farm-day";
}
