import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("life_goals")
    .select("*, annual_themes(id, title, emoji, year, status)")
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
