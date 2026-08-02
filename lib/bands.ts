import type { StaffMember } from "./cast";

export type BandMeta = {
  key: string;
  label: string;
  ageRange: string;
  tagline: string;
  eyebrow: string;
  leads: string[];
};

export const BAND_META: Record<string, BandMeta> = {
  "grade-one": {
    key: "grade-one",
    label: "Grade 1",
    ageRange: "5–6 yrs",
    tagline: "Reading and rhythm",
    eyebrow: "5–6 YRS · TEACHER-PLANNING RESOURCE",
    leads: ["mr-rusty", "miss-hayley", "mr-sam", "old-macdonald"],
  },
  "grade-two": {
    key: "grade-two",
    label: "Grade 2",
    ageRange: "6–7 yrs",
    tagline: "Building fluency and proof",
    eyebrow: "6–7 YRS · TEACHER-PLANNING RESOURCE",
    leads: ["mr-rusty", "miss-hayley", "mr-sam", "old-macdonald"],
  },
};

export function matchesBand(gradeBand: string, band: string): boolean {
  if (band === "grade-one") return /1/.test(gradeBand);
  if (band === "grade-two") return /2/.test(gradeBand);
  return true;
}

export function bandMatchesStaff(band: string, staff: StaffMember): boolean {
  const meta = BAND_META[band];
  if (!meta) return false;
  // Include staff whose gradeBand mentions the band label or "Whole school"
  const bandNum = band === "grade-one" ? "1" : "2";
  return (
    staff.gradeBand.includes(bandNum) ||
    staff.gradeBand.includes("Whole school") ||
    staff.gradeBand.includes("Grade 1/2") ||
    staff.gradeBand.includes("Grade 1") && band === "grade-one" ||
    staff.gradeBand.includes("Grade 2") && band === "grade-two"
  );
}

export function leadNames(leads: string[], staff: StaffMember[]): string {
  const names = leads
    .map((key) => staff.find((s) => s.key === key)?.name)
    .filter(Boolean);
  if (names.length <= 2) return names.join(" & ");
  return names.slice(0, -1).join(", ") + " & " + names[names.length - 1];
}
