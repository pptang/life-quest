import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const year = req.nextUrl.searchParams.get("year") || "2026";

  const { data, error } = await supabase
    .from("annual_themes")
    .select("*, life_goals(title, emoji), quests(id, status)")
    .eq("year", parseInt(year))
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
