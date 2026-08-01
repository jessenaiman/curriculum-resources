import Link from "next/link";
import type { SiteTheme } from "../lib/site-theme";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function SiteShell({ children, active, suggestedTheme = "farm-day" }: { children: React.ReactNode; active?: "home" | "topics" | "about"; suggestedTheme?: SiteTheme }) {
  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="brand" href="/"><img src="/brand-emblem.png" alt="" /><span><strong>Old MacDonald<br />Had a School</strong><small>Teacher lesson resources</small></span></Link>
        <div className="nav-links">
          <Link href="/" className={active === "home" ? "active" : ""}>Home</Link>
          <Link href="/topics" className={active === "topics" ? "active" : ""}>Browse Topics</Link>
          <Link href="/about" className={active === "about" ? "active" : ""}>About</Link>
          <ThemeSwitcher suggestedTheme={suggestedTheme} />
        </div>
      </nav>
      <div className="site-page">{children}</div>
      <footer><span>Old MacDonald Had a School</span><span>A curriculum-organized starting point for teachers.</span></footer>
    </main>
  );
}
