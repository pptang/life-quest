import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("quests")
    .select("*, annual_themes(*, life_goals(*)), quest_tasks(*), progress_log(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const body = await req.json();

  const updates: any = { updated_at: new Date().toISOString() };
  if (body.status !== undefined) updates.status = body.status;
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.horizon !== undefined) updates.horizon = body.horizon;
  if (body.target_date !== undefined) updates.target_date = body.target_date;
  if (body.blocked_by !== undefined) updates.blocked_by = body.blocked_by;

  const { data, error } = await supabase
    .from("quests")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
