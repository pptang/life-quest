import Link from "next/link";
import Nav from "@/components/Nav";
import QuestStatusToggle from "@/components/QuestStatusToggle";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import AddProgressForm from "@/components/AddProgressForm";
import { getQuestDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
            <QuestStatusToggle questId={quest.id} currentStatus={quest.status} />
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
            <div className="space-y-2">
              {tasks.map((task: any) => (
                <TaskItem key={task.id} task={task} />
              ))}
              <AddTaskForm questId={quest.id} />
            </div>
          </div>

          {/* Progress log column */}
          <div>
            <h2 className="text-lg font-semibold mb-4">📜 Progress Log</h2>
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
              <AddProgressForm questId={quest.id} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
