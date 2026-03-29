import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("quest_tasks")
    .insert({
      quest_id: body.quest_id,
      title: body.title,
      notes: body.notes || null,
      status: body.status || "todo",
      recurrence: body.recurrence || null,
      due_date: body.due_date || null,
      things3_uuid: body.things3_uuid || null,
    })
    .select()
    .single();

  // If things3_uuid provided, also create in Things 3 (handled by agent, not here)
  // The things3_uuid is set when agent creates the task in both systems

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
