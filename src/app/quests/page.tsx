import { createServiceClient } from "@/lib/supabase";
import { QuestsClient } from "./quests-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ theme_id?: string }>;
}

export default async function QuestsPage({ searchParams }: PageProps) {
  const { theme_id } = await searchParams;
  const supabase = createServiceClient();

  let query = supabase
    .from("quests")
    .select("*, annual_themes(id, title, emoji, life_goals(title, emoji))")
    .order("status")
    .order("created_at", { ascending: false });

  if (theme_id) query = query.eq("theme_id", theme_id);

  const { data: quests } = await query;

  // Get theme info if filtered
  let themeInfo = null;
  if (theme_id) {
    const { data } = await supabase
      .from("annual_themes")
      .select("*, life_goals(title, emoji)")
      .eq("id", theme_id)
      .single();
    themeInfo = data;
  }

  // Get all themes for the create form
  const { data: themes } = await supabase
    .from("annual_themes")
    .select("id, title, emoji")
    .eq("status", "active")
    .order("sort_order");

  return <QuestsClient quests={quests || []} themeInfo={themeInfo} themes={themes || []} />;
}
