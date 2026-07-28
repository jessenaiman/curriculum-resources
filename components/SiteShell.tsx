import Link from "next/link";

export function SiteShell({ children, active }: { children: React.ReactNode; active?: "home" | "topics" | "about" }) {
  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="brand" href="/"><img src="/brand-emblem.png" alt="" /><span>Old MacDonald<br />Had a School</span></Link>
        <div className="nav-links">
          <Link href="/" className={active === "home" ? "active" : ""}>Home</Link>
          <Link href="/topics" className={active === "topics" ? "active" : ""}>Browse Topics</Link>
          <Link href="/about" className={active === "about" ? "active" : ""}>About</Link>
        </div>
      </nav>
      <div className="site-page">{children}</div>
      <footer><span>Old MacDonald Had a School</span><span>A curriculum-organized starting point for teachers.</span></footer>
    </main>
  );
}
