"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/quests", label: "All Quests", icon: "⚔️" },
  { href: "/themes", label: "2026 Themes", icon: "🎯" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 bg-[var(--card)] border-b border-[var(--border)]">
        <button onClick={() => setCollapsed(!collapsed)} className="text-xl">
          ☰
        </button>
        <span className="text-lg font-bold">⚔️ Life Quest</span>
      </div>

      {/* Mobile overlay */}
      {collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-full w-64 
          bg-[var(--card)] border-r border-[var(--border)]
          flex flex-col transition-transform duration-200
          ${collapsed ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setCollapsed(false)}>
            <span className="text-2xl">⚔️</span>
            <span className="text-xl font-bold">Life Quest</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)]">Personal Life OS</p>
        </div>
      </aside>
    </>
  );
}
