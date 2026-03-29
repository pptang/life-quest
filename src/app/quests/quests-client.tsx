"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";

interface Quest {
  id: string;
  title: string;
  description: string | null;
  horizon: string;
  status: string;
  target_date: string | null;
  annual_themes?: {
    id: string;
    title: string;
    emoji: string | null;
    life_goals?: { title: string; emoji: string } | null;
  } | null;
}

interface Theme {
  id: string;
  title: string;
  emoji: string | null;
}

export function QuestsClient({
  quests,
  themeInfo,
  themes,
}: {
  quests: Quest[];
  themeInfo: { title: string; emoji: string | null; life_goals?: { title: string; emoji: string } | null } | null;
  themes: Theme[];
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/quests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme_id: form.get("theme_id"),
        title: form.get("title"),
        description: form.get("description") || null,
        horizon: form.get("horizon"),
      }),
    });
    setCreating(false);
    setShowCreate(false);
    router.refresh();
  }

  const horizonLabel: Record<string, string> = { short: "Short", mid: "Mid", long: "Long" };

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {themeInfo ? (
            <>
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
                <Link href="/" className="hover:text-[var(--foreground)]">Dashboard</Link>
                <span>/</span>
                <span>{themeInfo.life_goals?.emoji} {themeInfo.life_goals?.title}</span>
              </div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span>{themeInfo.emoji}</span> {themeInfo.title}
              </h1>
            </>
          ) : (
            <h1 className="text-2xl font-bold">All Quests</h1>
          )}
          <p className="text-[var(--muted-foreground)] text-sm mt-1">{quests.length} quests</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          + New Quest
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 space-y-4">
          <input
            name="title"
            placeholder="Quest title..."
            required
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            rows={2}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <div className="flex gap-3">
            <select
              name="theme_id"
              required
              defaultValue={themeInfo ? "" : ""}
              className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select theme...</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.title}</option>
              ))}
            </select>
            <select
              name="horizon"
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            >
              <option value="short">Short</option>
              <option value="mid" selected>Mid</option>
              <option value="long">Long</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-sm rounded-lg hover:bg-[var(--accent)]">Cancel</button>
            <button type="submit" disabled={creating} className="px-4 py-1.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium disabled:opacity-50">
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      )}

      {/* Quest list */}
      <div className="space-y-2">
        {quests.map((quest) => (
          <Link
            key={quest.id}
            href={`/quests/${quest.id}`}
            className="block bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 hover:border-[var(--primary)] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{quest.title}</h3>
                  <StatusBadge status={quest.status} />
                </div>
                {quest.description && (
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-1">{quest.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
                  {quest.annual_themes && (
                    <span>{quest.annual_themes.emoji} {quest.annual_themes.title}</span>
                  )}
                  <span className="px-1.5 py-0.5 rounded bg-[var(--accent)]">{horizonLabel[quest.horizon] || quest.horizon}</span>
                  {quest.target_date && <span>Due: {quest.target_date}</span>}
                </div>
              </div>
              <span className="text-[var(--muted-foreground)]">→</span>
            </div>
          </Link>
        ))}
        {quests.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <p className="text-lg">No quests yet</p>
            <p className="text-sm mt-1">Create your first quest to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
