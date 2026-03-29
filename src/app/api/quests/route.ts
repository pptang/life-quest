import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const themeId = req.nextUrl.searchParams.get("theme_id");

  let query = supabase.from("quests").select("*, quest_tasks(id, status)");
  if (themeId) query = query.eq("theme_id", themeId);

  const { data, error } = await query.order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("quests")
    .insert({
      theme_id: body.theme_id,
      title: body.title,
      description: body.description || null,
      horizon: body.horizon || "mid",
      status: body.status || "not_started",
      target_date: body.target_date || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
