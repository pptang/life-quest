"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddQuestForm({ themeId }: { themeId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [horizon, setHorizon] = useState("mid");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme_id: themeId, title: title.trim(), description: description.trim() || null, horizon }),
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setHorizon("mid");
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
        className="w-full rounded-xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
      >
        + Add Quest
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quest title..."
        className="w-full bg-transparent border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full bg-transparent border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] resize-none"
      />
      <div className="flex items-center gap-2">
        <label className="text-xs text-[var(--text-muted)]">Horizon:</label>
        {["short", "mid", "long"].map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setHorizon(h)}
            className={`px-2 py-1 rounded text-xs capitalize ${
              horizon === h ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-hover)] text-[var(--text-muted)]"
            }`}
          >
            {h}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="px-4 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Quest"}
        </button>
      </div>
    </form>
  );
}
