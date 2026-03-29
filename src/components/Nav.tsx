import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span>⚔️</span>
          <span>Life Quest</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Dashboard</Link>
          <Link href="/themes" className="hover:text-[var(--text)] transition-colors">2026 Themes</Link>
        </nav>
      </div>
    </header>
  );
}
