import Link from "next/link";
import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import { getQuestDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TaskIcon({ status }: { status: string }) {
  switch (status) {
    case "done": return <span className="text-green-400">✓</span>;
    case "doing": return <span className="text-blue-400">◉</span>;
    case "skipped": return <span className="text-gray-500">⊘</span>;
    default: return <span className="text-[var(--text-muted)]">○</span>;
  }
}

function EntryTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "progress": return "📝";
    case "reflection": return "💭";
    case "blocker": return "🚧";
    case "retro": return "🔄";
    default: return "📝";
  }
}

export default async function QuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quest = await getQuestDetail(id) as any;
  const theme = quest.annual_themes;
  const tasks = quest.quest_tasks || [];
  const logs = quest.progress_log || [];

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-[var(--text)]">Dashboard</Link>
          <span>/</span>
          {theme && (
            <>
              <Link href={`/themes/${theme.id}`} className="hover:text-[var(--text)]">
                {theme.emoji} {theme.title}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[var(--text)]">{quest.title}</span>
        </div>

        {/* Quest header */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 mb-8">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold">{quest.title}</h1>
            <StatusBadge status={quest.status} />
          </div>
          {quest.description && (
            <p className="text-[var(--text-muted)] mb-4">{quest.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
            <span className="capitalize">🕐 {quest.horizon} term</span>
            {quest.target_date && <span>📅 Due: {quest.target_date}</span>}
            <span>Created: {formatDate(quest.created_at)}</span>
            {theme?.life_goals && (
              <span>🏔️ {theme.life_goals.emoji} {theme.life_goals.title}</span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tasks column */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">✅ Tasks ({tasks.length})</h2>
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 ${
                      task.status === "done" ? "opacity-50" : ""
                    }`}
                  >
                    <span className="mt-0.5 text-lg"><TaskIcon status={task.status} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${task.status === "done" ? "line-through" : ""}`}>
                          {task.title}
                        </span>
                        {task.recurrence && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400">
                            {task.recurrence}
                          </span>
                        )}
                      </div>
                      {task.notes && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">{task.notes}</p>
                      )}
                      <div className="flex gap-3 mt-1 text-xs text-[var(--text-muted)]">
                        {task.due_date && <span>Due: {task.due_date}</span>}
                        {task.things3_uuid && <span>📱 Things 3</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--text-muted)] rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                No tasks yet
              </div>
            )}
          </div>

          {/* Progress log column */}
          <div>
            <h2 className="text-lg font-semibold mb-4">📜 Progress Log</h2>
            {logs.length > 0 ? (
              <div className="space-y-3">
                {logs.map((log: any) => (
                  <div key={log.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span><EntryTypeIcon type={log.entry_type} /></span>
                      <span className="text-xs text-[var(--text-muted)]">{formatDate(log.created_at)}</span>
                    </div>
                    <p className="text-sm">{log.entry}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--text-muted)] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm">
                No progress logged yet
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
