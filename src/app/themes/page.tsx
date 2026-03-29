import { createServiceClient } from "@/lib/supabase";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const supabase = createServiceClient();

  const { data: themes } = await supabase
    .from("annual_themes")
    .select("*, life_goals(title, emoji), quests(id, status)")
    .eq("year", 2026)
    .order("sort_order");

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">2026 Themes</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">Annual focus areas</p>
      </div>

      <div className="space-y-4">
        {(themes || []).map((theme) => {
          const quests = theme.quests || [];
          const total = quests.length;
          const completed = quests.filter((q: { status: string }) => q.status === "completed").length;
          const inProgress = quests.filter((q: { status: string }) => q.status === "in_progress").length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <Link
              key={theme.id}
              href={`/quests?theme_id=${theme.id}`}
              className="block bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--primary)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-3xl">{theme.emoji}</span>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{theme.title}</h2>
                    {theme.description && (
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">{theme.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
                      <span>{theme.life_goals?.emoji} {theme.life_goals?.title}</span>
                      <span>·</span>
                      <span>{total} quests</span>
                      {inProgress > 0 && <span>· {inProgress} active</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)] mt-1 block">{progress}%</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
