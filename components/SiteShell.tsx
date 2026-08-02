import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

export type ActivePage =
  | "home" | "topics" | "about" | "cast-guide"
  | "daycare" | "preschool" | "kindergarten" | "grade-one" | "grade-two";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "daycare", label: "Daycare", href: "/daycare" },
  { key: "preschool", label: "Preschool", href: "/preschool" },
  { key: "kindergarten", label: "Kindergarten", href: "/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/band/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/band/grade-two" },
  { key: "cast-guide", label: "Cast Guide", href: "/cast-guide" },
] as const;

export function SiteShell({ children, active }: { children: React.ReactNode; active?: ActivePage }) {
  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="brand" href="/"><img src="/brand-emblem.png" alt="" /><span><strong>Old MacDonald<br />Had a School</strong><small>Teacher lesson resources</small></span></Link>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-link${active === item.key ? ` active nav-${item.key}` : ""}`}
              aria-current={active === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <ThemeSwitcher />
        </div>
      </nav>
      <div className="site-page">{children}</div>
      <footer><span>Old MacDonald Had a School</span><span>A curriculum-organized starting point for teachers.</span></footer>
    </main>
  );
}
