export interface LifeGoal {
  id: string;
  title: string;
  description: string | null;
  emoji: string;
  sort_order: number;
  created_at: string;
  themes?: AnnualTheme[];
}

export interface AnnualTheme {
  id: string;
  life_goal_id: string;
  year: number;
  title: string;
  emoji: string | null;
  description: string | null;
  status: "active" | "completed" | "carried_over" | "dropped";
  sort_order: number;
  created_at: string;
  life_goals?: LifeGoal;
  quest_count?: number;
  quests?: Quest[];
}

export interface Quest {
  id: string;
  theme_id: string;
  title: string;
  description: string | null;
  horizon: "short" | "mid" | "long";
  status: "not_started" | "in_progress" | "blocked" | "completed" | "paused";
  blocked_by: string[] | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
  annual_themes?: AnnualTheme;
  quest_tasks?: QuestTask[];
  progress_log?: ProgressLog[];
}

export interface QuestTask {
  id: string;
  quest_id: string;
  title: string;
  notes: string | null;
  status: "todo" | "doing" | "done" | "skipped";
  recurrence: "daily" | "weekly" | null;
  due_date: string | null;
  things3_uuid: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ProgressLog {
  id: string;
  quest_id: string | null;
  theme_id: string | null;
  entry_type: "progress" | "reflection" | "blocker" | "retro";
  entry: string;
  created_at: string;
}

export interface DashboardData {
  goals: (LifeGoal & { themes: (AnnualTheme & { quest_count: number; quests_in_progress: number; quests_completed: number })[] })[];
  stats: {
    total_quests: number;
    in_progress: number;
    blocked: number;
    completed: number;
    not_started: number;
    paused: number;
  };
}
