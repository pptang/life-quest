"use client";

import Link from "next/link";
import { StatusDot } from "@/components/status-badge";

interface ThemeWithCounts {
  id: string;
  title: string;
  emoji: string | null;
  description: string | null;
  quest_count: number;
  quests_in_progress: number;
  quests_completed: number;
}

interface GoalWithThemes {
  id: string;
  title: string;
  description: string | null;
  emoji: string;
  themes: ThemeWithCounts[];
}

interface Stats {
  total_quests: number;
  in_progress: number;
  blocked: number;
  completed: number;
  not_started: number;
  paused: number;
}

export function DashboardClient({ data }: { data: { goals: GoalWithThemes[]; stats: Stats } }) {
  const { goals, stats } = data;

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Your life at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Quests" value={stats.total_quests} color="text-[var(--foreground)]" />
        <StatCard label="In Progress" value={stats.in_progress} color="text-green-400" />
        <StatCard label="Not Started" value={stats.not_started} color="text-yellow-400" />
        <StatCard label="Completed" value={stats.completed} color="text-emerald-400" />
      </div>

      {/* Goals with themes */}
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{goal.emoji}</span>
                <div>
                  <h2 className="text-lg font-semibold">{goal.title}</h2>
                  {goal.description && (
                    <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{goal.description}</p>
                  )}
                </div>
              </div>
            </div>

            {goal.themes.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {goal.themes.map((theme) => {
                  const progress = theme.quest_count > 0
                    ? Math.round((theme.quests_completed / theme.quest_count) * 100)
                    : 0;

                  return (
                    <Link
                      key={theme.id}
                      href={`/quests?theme_id=${theme.id}`}
                      className="flex items-center justify-between p-4 hover:bg-[var(--accent)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{theme.emoji}</span>
                        <div>
                          <p className="font-medium">{theme.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {theme.quest_count} quests · {theme.quests_in_progress} active
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary)] rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)] w-8 text-right">{progress}%</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-sm text-[var(--muted-foreground)]">No active themes</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
