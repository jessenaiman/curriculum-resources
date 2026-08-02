import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { iconPathSmall } from "../lib/char-icon";
import { CLUSTERS } from "./SubjectDiscovery";

export type ActivePage =
  | "home" | "topics" | "about" | "cast-guide"
  | "daycare" | "preschool" | "kindergarten" | "grade-one" | "grade-two";

const BANDS = [
  { key: "daycare", label: "Daycare", age: "0–2 yrs", href: "/daycare", patch: "miss-puddles", name: "Miss Puddles" },
  { key: "preschool", label: "Preschool", age: "3–4 yrs", href: "/preschool", patch: "miss-puddles", name: "Miss Puddles" },
  { key: "kindergarten", label: "Kindergarten", age: "5 yrs", href: "/kindergarten", patch: "mr-rusty", name: "Mr Rusty" },
  { key: "grade-one", label: "Grade 1", age: "5–6 yrs", href: "/topics?band=grade-one", patch: "miss-hayley", name: "Miss Hayley" },
  { key: "grade-two", label: "Grade 2", age: "6–7 yrs", href: "/topics?band=grade-two", patch: "mr-sam", name: "Mr Sam" },
] as const;

export function SiteShell({ children, active }: { children: React.ReactNode; active?: ActivePage }) {
  return (
    <main>
      <nav className="topbar" aria-label="Utility navigation">
        <Link className="brand" href="/"><img src="/brand-emblem.png" alt="" /><span><strong>Old MacDonald<br />Had a School</strong><small>Teacher lesson resources</small></span></Link>
        <div className="nav-links">
          <Link href="/topics" className={active === "topics" ? "active" : ""}>All Topics</Link>
          <div className="nav-subjects" aria-label="Browse by subject">
            {CLUSTERS.map((c) => (
              <Link key={c.key} href={`/topics?cluster=${c.key}`} className={`nav-subject-pill tone-${c.tone}`}>
                <span className="nav-subject-dot" aria-hidden="true" />{c.title}
              </Link>
            ))}
          </div>
          <Link href="/cast-guide" className={active === "cast-guide" ? "active" : ""}>Cast Guide</Link>
          <Link href="/about" className={active === "about" ? "active" : ""}>About</Link>
          <ThemeSwitcher />
        </div>
      </nav>
      <nav className="band-nav" aria-label="Browse by grade band">
        {BANDS.map((b) => (
          <Link key={b.key} href={b.href} className={`band-btn ${b.key}${active === b.key ? " is-active" : ""}`} aria-current={active === b.key ? "page" : undefined}>
            <span className="band-btn-patch"><img src={iconPathSmall(b.patch)} alt="" /></span>
            <span className="band-btn-copy"><small>{b.age}</small><strong>{b.label}</strong></span>
          </Link>
        ))}
      </nav>
      <div className="site-page">{children}</div>
      <footer><span>Old MacDonald Had a School</span><span>A curriculum-organized starting point for teachers.</span></footer>
    </main>
  );
}
