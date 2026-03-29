"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";

interface Task {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  recurrence: string | null;
  due_date: string | null;
  completed_at: string | null;
}

interface LogEntry {
  id: string;
  entry_type: string;
  entry: string;
  created_at: string;
}

interface QuestDetail {
  id: string;
  title: string;
  description: string | null;
  horizon: string;
  status: string;
  target_date: string | null;
  created_at: string;
  updated_at: string;
  annual_themes?: { title: string; emoji: string | null; life_goals?: { title: string; emoji: string } | null } | null;
  quest_tasks: Task[];
  progress_log: LogEntry[];
}

const questStatuses = ["not_started", "in_progress", "blocked", "completed", "paused"];
const taskStatuses = ["todo", "doing", "done", "skipped"];

export function QuestDetailClient({ quest }: { quest: QuestDetail }) {
  const router = useRouter();
  const [newTask, setNewTask] = useState("");
  const [newLog, setNewLog] = useState("");
  const [logType, setLogType] = useState("progress");

  async function updateQuestStatus(status: string) {
    await fetch(`/api/quests/${quest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function updateTaskStatus(taskId: string, status: string) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quest_id: quest.id, title: newTask }),
    });
    setNewTask("");
    router.refresh();
  }

  async function addLog(e: React.FormEvent) {
    e.preventDefault();
    if (!newLog.trim()) return;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quest_id: quest.id, entry: newLog, entry_type: logType }),
    });
    setNewLog("");
    router.refresh();
  }

  const entryTypeEmoji: Record<string, string> = {
    progress: "📝",
    reflection: "💭",
    blocker: "🚧",
    retro: "🔄",
  };

  const completedTasks = quest.quest_tasks.filter((t) => t.status === "done").length;
  const totalTasks = quest.quest_tasks.length;

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Link href="/" className="hover:text-[var(--foreground)]">Dashboard</Link>
        <span>/</span>
        {quest.annual_themes && (
          <>
            <Link href={`/quests?theme_id=${quest.id}`} className="hover:text-[var(--foreground)]">
              {quest.annual_themes.emoji} {quest.annual_themes.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--foreground)]">{quest.title}</span>
      </div>

      {/* Header */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{quest.title}</h1>
            {quest.description && (
              <p className="text-[var(--muted-foreground)] mt-2">{quest.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <StatusBadge status={quest.status} />
              <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5 rounded bg-[var(--accent)]">
                {quest.horizon} horizon
              </span>
              {quest.target_date && (
                <span className="text-xs text-[var(--muted-foreground)]">📅 {quest.target_date}</span>
              )}
            </div>
          </div>
        </div>

        {/* Status switcher */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[var(--border)]">
          {questStatuses.map((s) => (
            <button
              key={s}
              onClick={() => updateQuestStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                quest.status === s
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold">Tasks</h2>
          {totalTasks > 0 && (
            <span className="text-xs text-[var(--muted-foreground)]">
              {completedTasks}/{totalTasks} done
            </span>
          )}
        </div>

        <div className="divide-y divide-[var(--border)]">
          {quest.quest_tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-4">
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                className="bg-[var(--background)] border border-[var(--border)] rounded px-2 py-1 text-xs"
              >
                {taskStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className={`flex-1 text-sm ${task.status === "done" ? "line-through text-[var(--muted-foreground)]" : ""}`}>
                {task.title}
              </span>
              {task.due_date && (
                <span className="text-xs text-[var(--muted-foreground)]">{task.due_date}</span>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={addTask} className="p-4 border-t border-[var(--border)] flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            Add
          </button>
        </form>
      </div>

      {/* Progress Log */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)]">
          <h2 className="font-semibold">Progress Log</h2>
        </div>

        <form onSubmit={addLog} className="p-4 border-b border-[var(--border)] space-y-3">
          <div className="flex gap-2">
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            >
              <option value="progress">📝 Progress</option>
              <option value="reflection">💭 Reflection</option>
              <option value="blocker">🚧 Blocker</option>
              <option value="retro">🔄 Retro</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              placeholder="Write a log entry..."
              className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
            >
              Log
            </button>
          </div>
        </form>

        <div className="divide-y divide-[var(--border)]">
          {quest.progress_log.map((entry) => (
            <div key={entry.id} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span>{entryTypeEmoji[entry.entry_type] || "📝"}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {new Date(entry.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm">{entry.entry}</p>
            </div>
          ))}
          {quest.progress_log.length === 0 && (
            <div className="p-6 text-center text-sm text-[var(--muted-foreground)]">
              No log entries yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
