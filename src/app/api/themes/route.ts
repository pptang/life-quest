import { createServiceClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createServiceClient();
  const year = request.nextUrl.searchParams.get("year") || new Date().getFullYear().toString();

  const { data, error } = await supabase
    .from("annual_themes")
    .select("*, life_goals(title, emoji), quests(id, status)")
    .eq("year", parseInt(year))
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const themes = (data || []).map((theme) => ({
    ...theme,
    quest_count: theme.quests?.length || 0,
    quests: undefined,
  }));

  return NextResponse.json(themes);
}
