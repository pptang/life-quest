import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const body = await req.json();

  const updates: any = {};
  if (body.status !== undefined) {
    updates.status = body.status;
    if (body.status === "done") updates.completed_at = new Date().toISOString();
  }
  if (body.title !== undefined) updates.title = body.title;
  if (body.notes !== undefined) updates.notes = body.notes;

  const { data, error } = await supabase
    .from("quest_tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
