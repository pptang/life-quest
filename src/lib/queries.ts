import { createServiceClient } from "./supabase";
import type { DashboardData, LifeGoal, AnnualTheme, Quest } from "./types";

const supabase = createServiceClient();

export async function getDashboardData(): Promise<DashboardData> {
  const { data: goals, error: goalsError } = await supabase
    .from("life_goals")
    .select("*, annual_themes(*, quests(id, status))")
    .order("sort_order");

  if (goalsError) throw goalsError;

  const { data: allQuests, error: questsError } = await supabase
    .from("quests")
    .select("id, status");

  if (questsError) throw questsError;

  const stats = {
    total_quests: allQuests.length,
    in_progress: allQuests.filter((q) => q.status === "in_progress").length,
    blocked: allQuests.filter((q) => q.status === "blocked").length,
    completed: allQuests.filter((q) => q.status === "completed").length,
    not_started: allQuests.filter((q) => q.status === "not_started").length,
    paused: allQuests.filter((q) => q.status === "paused").length,
  };

  const enrichedGoals = (goals as any[]).map((goal) => ({
    ...goal,
    themes: (goal.annual_themes || [])
      .filter((t: any) => t.status === "active")
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((theme: any) => {
        const quests = theme.quests || [];
        return {
          ...theme,
          quest_count: quests.length,
          quests_in_progress: quests.filter((q: any) => q.status === "in_progress").length,
          quests_completed: quests.filter((q: any) => q.status === "completed").length,
          quests: undefined,
        };
      }),
  }));

  return { goals: enrichedGoals, stats };
}

export async function getThemeWithQuests(themeId: string) {
  const { data: theme, error: themeError } = await supabase
    .from("annual_themes")
    .select("*, life_goals(*), quests(*, quest_tasks(id, status))")
    .eq("id", themeId)
    .single();

  if (themeError) throw themeError;
  return theme;
}

export async function getQuestDetail(questId: string) {
  const { data: quest, error } = await supabase
    .from("quests")
    .select("*, annual_themes(*, life_goals(*)), quest_tasks(*), progress_log(*)")
    .eq("id", questId)
    .single();

  if (error) throw error;

  // Sort tasks and logs
  if (quest.quest_tasks) {
    quest.quest_tasks.sort((a: any, b: any) => {
      const order = { doing: 0, todo: 1, done: 2, skipped: 3 };
      return (order[a.status as keyof typeof order] ?? 1) - (order[b.status as keyof typeof order] ?? 1);
    });
  }
  if (quest.progress_log) {
    quest.progress_log.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return quest;
}

export async function getAllGoals() {
  const { data, error } = await supabase
    .from("life_goals")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data as LifeGoal[];
}

export async function getThemesByYear(year: number) {
  const { data, error } = await supabase
    .from("annual_themes")
    .select("*, life_goals(title, emoji), quests(id, status)")
    .eq("year", year)
    .order("sort_order");
  if (error) throw error;
  return data;
}
