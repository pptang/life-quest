"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusCycle = ["todo", "doing", "done", "skipped"] as const;
type TaskStatus = (typeof statusCycle)[number];

function TaskIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case "done": return <span className="text-green-400 text-lg">✓</span>;
    case "doing": return <span className="text-blue-400 text-lg">◉</span>;
    case "skipped": return <span className="text-gray-500 text-lg">⊘</span>;
    default: return <span className="text-[var(--text-muted)] text-lg">○</span>;
  }
}

export default function TaskItem({ task }: { task: any }) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function cycleStatus() {
    const idx = statusCycle.indexOf(status);
    const next = statusCycle[(idx + 1) % statusCycle.length];
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setStatus(next);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 ${status === "done" ? "opacity-50" : ""}`}>
      <button onClick={cycleStatus} disabled={loading} className="mt-0.5 cursor-pointer hover:scale-110 transition-transform">
        <TaskIcon status={status} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${status === "done" ? "line-through" : ""}`}>
            {task.title}
          </span>
          {task.recurrence && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400">
              {task.recurrence}
            </span>
          )}
        </div>
        {task.notes && <p className="text-xs text-[var(--text-muted)] mt-1">{task.notes}</p>}
        <div className="flex gap-3 mt-1 text-xs text-[var(--text-muted)]">
          {task.due_date && <span>Due: {task.due_date}</span>}
          {task.things3_uuid && <span>📱 Things 3</span>}
        </div>
      </div>
    </div>
  );
}
