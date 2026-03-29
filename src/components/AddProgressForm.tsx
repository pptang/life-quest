"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const entryTypes = [
  { value: "progress", label: "📝 Progress", color: "bg-green-400/10 text-green-400" },
  { value: "reflection", label: "💭 Reflection", color: "bg-purple-400/10 text-purple-400" },
  { value: "blocker", label: "🚧 Blocker", color: "bg-red-400/10 text-red-400" },
  { value: "retro", label: "🔄 Retro", color: "bg-blue-400/10 text-blue-400" },
];

export default function AddProgressForm({ questId, themeId }: { questId?: string; themeId?: string }) {
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState("");
  const [entryType, setEntryType] = useState("progress");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!entry.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest_id: questId || null, theme_id: themeId || null, entry_type: entryType, entry: entry.trim() }),
      });
      if (res.ok) {
        setEntry("");
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-dashed border-[var(--border)] p-3 text-sm text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
      >
        + Log Progress
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 space-y-2">
      <div className="flex gap-1.5 flex-wrap">
        {entryTypes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setEntryType(t.value)}
            className={`px-2 py-1 rounded text-xs ${
              entryType === t.value ? t.color + " ring-1 ring-current" : "bg-[var(--bg-hover)] text-[var(--text-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <textarea
        autoFocus
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="What happened?"
        rows={3}
        className="w-full bg-transparent border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] resize-none"
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !entry.trim()}
          className="px-4 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? "Logging..." : "Log"}
        </button>
      </div>
    </form>
  );
}
