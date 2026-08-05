// Metadata for the homepage grade-band picker strip — the first section on
// the page, one card per band linking into its own hub. Short label/tagline
// copy intentionally mirrors the Figma reference (age range + one-line
// tagline per band); color comes from the existing --band-* tokens in
// globals.css, not new values.
export type HomeBand = {
  key: string;
  label: string;
  ageRange: string;
  tagline: string;
  href: string;
  leadKey: string;
  colorVar: string;
};

export const HOME_BANDS: HomeBand[] = [
  { key: "daycare", label: "Daycare", ageRange: "0–2 yrs", tagline: "Lap and floor learning", href: "/daycare", leadKey: "miss-puddles", colorVar: "--band-daycare" },
  { key: "preschool", label: "Preschool", ageRange: "3–4 yrs", tagline: "Story and sensation", href: "/preschool", leadKey: "miss-puddles", colorVar: "--band-preschool" },
  { key: "grade-one", label: "Grade 1", ageRange: "5–6 yrs", tagline: "Reading and rhythm", href: "/band/grade-one", leadKey: "mr-rusty", colorVar: "--band-g1" },
  { key: "grade-two", label: "Grade 2", ageRange: "6–7 yrs", tagline: "Building fluency and proof", href: "/band/grade-two", leadKey: "mr-sam", colorVar: "--band-g2" },
];
