import Link from "next/link";
import Nav from "@/components/Nav";
import QuestStatusToggle from "@/components/QuestStatusToggle";
import AddQuestForm from "@/components/AddQuestForm";
import { getThemeWithQuests } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ThemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const theme = await getThemeWithQuests(id) as any;

  const quests = theme.quests || [];
  const statusOrder = ["in_progress", "blocked", "not_started", "paused", "completed"];
  quests.sort((a: any, b: any) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--text)]">Dashboard</Link>
          <span>/</span>
          <Link href="/themes" className="hover:text-[var(--text)]">Themes</Link>
          <span>/</span>
          <span className="text-[var(--text)]">{theme.emoji} {theme.title}</span>
        </div>

        {/* Theme header */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{theme.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold">{theme.title}</h1>
                {theme.description && (
                  <p className="text-[var(--text-muted)] mt-1">{theme.description}</p>
                )}
                {theme.life_goals && (
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    ↗ {theme.life_goals.emoji} {theme.life_goals.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quests */}
        <h2 className="text-lg font-semibold mb-4">🎯 Quests ({quests.length})</h2>
        <div className="space-y-3">
          {quests.map((quest: any) => {
            const tasks = quest.quest_tasks || [];
            const doneTasks = tasks.filter((t: any) => t.status === "done").length;

            return (
              <div
                key={quest.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 hover:bg-[var(--bg-hover)] transition-colors"
              >
                <Link href={`/quests/${quest.id}`} className="min-w-0 flex-1">
                  <h3 className="font-medium">{quest.title}</h3>
                  {quest.description && (
                    <p className="text-sm text-[var(--text-muted)] mt-1 truncate">{quest.description}</p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs text-[var(--text-muted)]">
                    <span className="capitalize">{quest.horizon} term</span>
                    {tasks.length > 0 && <span>{doneTasks}/{tasks.length} tasks</span>}
                    {quest.target_date && <span>Due: {quest.target_date}</span>}
                  </div>
                </Link>
                <div className="ml-4 shrink-0">
                  <QuestStatusToggle questId={quest.id} currentStatus={quest.status} />
                </div>
              </div>
            );
          })}

          <AddQuestForm themeId={id} />
        </div>
      </main>
    </>
  );
}
