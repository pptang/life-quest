import Link from "next/link";
import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import { getThemesByYear } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const themes = await getThemesByYear(2026);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">📅 2026 Annual Themes</h1>
        <p className="text-[var(--text-muted)] text-sm mb-8">Your focus areas for the year</p>

        <div className="grid gap-4">
          {(themes as any[]).map((theme) => {
            const quests = theme.quests || [];
            const completed = quests.filter((q: any) => q.status === "completed").length;
            const inProgress = quests.filter((q: any) => q.status === "in_progress").length;
            const blocked = quests.filter((q: any) => q.status === "blocked").length;

            return (
              <Link
                key={theme.id}
                href={`/themes/${theme.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{theme.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{theme.title}</h3>
                      {theme.description && (
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">{theme.description}</p>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={theme.status} />
                </div>

                <div className="mt-4">
                  <ProgressBar completed={completed} total={quests.length} />
                </div>

                <div className="flex gap-4 mt-3 text-xs text-[var(--text-muted)]">
                  {inProgress > 0 && <span className="text-green-400">● {inProgress} in progress</span>}
                  {blocked > 0 && <span className="text-red-400">● {blocked} blocked</span>}
                  <span>{quests.length} quests total</span>
                  {theme.life_goals && (
                    <span>↗ {theme.life_goals.emoji} {theme.life_goals.title}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
