import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("progress_log")
    .insert({
      quest_id: body.quest_id || null,
      theme_id: body.theme_id || null,
      entry_type: body.entry_type || "progress",
      entry: body.entry,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
