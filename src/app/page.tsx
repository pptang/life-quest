import Link from "next/link";
import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import { getDashboardData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { goals, stats } = await getDashboardData();

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {[
            { label: "Total Quests", value: stats.total_quests, color: "var(--text)" },
            { label: "In Progress", value: stats.in_progress, color: "var(--green)" },
            { label: "Not Started", value: stats.not_started, color: "var(--yellow)" },
            { label: "Blocked", value: stats.blocked, color: "var(--red)" },
            { label: "Completed", value: stats.completed, color: "var(--blue)" },
            { label: "Paused", value: stats.paused, color: "var(--text-muted)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Life Goals */}
        <h2 className="text-xl font-semibold mb-6">🏔️ Life Goals</h2>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
              {/* Goal header */}
              <div className="p-5 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-[var(--text-muted)] mt-0.5">{goal.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Themes under this goal */}
              {goal.themes && goal.themes.length > 0 && (
                <div className="divide-y divide-[var(--border)]">
                  {goal.themes.map((theme: any) => (
                    <Link
                      key={theme.id}
                      href={`/themes/${theme.id}`}
                      className="flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg">{theme.emoji}</span>
                        <div className="min-w-0">
                          <div className="font-medium text-sm">{theme.title}</div>
                          <div className="text-xs text-[var(--text-muted)]">{theme.year}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-32 hidden sm:block">
                          <ProgressBar completed={theme.quests_completed} total={theme.quest_count} />
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {theme.quests_in_progress > 0 && (
                            <span className="text-green-400">{theme.quests_in_progress} active</span>
                          )}
                        </div>
                        <span className="text-[var(--text-muted)]">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No themes */}
              {(!goal.themes || goal.themes.length === 0) && (
                <div className="p-4 text-sm text-[var(--text-muted)]">No active themes for 2026</div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
