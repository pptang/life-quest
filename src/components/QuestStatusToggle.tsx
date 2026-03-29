"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  { value: "not_started", label: "Not Started", color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  { value: "in_progress", label: "In Progress", color: "bg-green-400/10 text-green-400 border-green-400/30" },
  { value: "blocked", label: "Blocked", color: "bg-red-400/10 text-red-400 border-red-400/30" },
  { value: "paused", label: "Paused", color: "bg-gray-400/10 text-gray-400 border-gray-400/30" },
  { value: "completed", label: "Completed", color: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
];

export default function QuestStatusToggle({ questId, currentStatus }: { questId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const current = statuses.find((s) => s.value === status) || statuses[0];

  async function updateStatus(newStatus: string) {
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all hover:brightness-125 ${current.color} ${loading ? "opacity-50" : ""}`}
      >
        {current.label}
        <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-[#1a1a28] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => updateStatus(s.value)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-hover)] transition-colors ${
                  s.value === status ? "bg-[var(--bg-hover)]" : ""
                }`}
              >
                <span className={statuses.find((x) => x.value === s.value)?.color.split(" ").slice(1).join(" ")}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
