import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Sync endpoint: called by Kai (OpenClaw agent) to sync Things 3 tasks with Life Quest
// POST /api/sync/things
// Body: { tasks: [{ things3_uuid, title, status, project?, notes? }] }
// This will:
// 1. Find existing quest_tasks with matching things3_uuid and update their status
// 2. Return unmatched Things tasks for potential linking

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const { tasks } = await req.json();

  if (!tasks || !Array.isArray(tasks)) {
    return NextResponse.json({ error: "tasks array required" }, { status: 400 });
  }

  const results = { updated: 0, unmatched: [] as any[] };

  for (const task of tasks) {
    if (!task.things3_uuid) {
      results.unmatched.push(task);
      continue;
    }

    // Check if we have a quest_task linked to this Things UUID
    const { data: existing } = await supabase
      .from("quest_tasks")
      .select("id, status")
      .eq("things3_uuid", task.things3_uuid)
      .maybeSingle();

    if (existing) {
      // Map Things status to quest_task status
      const newStatus = task.status === "completed" ? "done"
        : task.status === "canceled" ? "skipped"
        : task.status === "incomplete" ? (existing.status === "done" ? "todo" : existing.status)
        : existing.status;

      if (newStatus !== existing.status) {
        await supabase
          .from("quest_tasks")
          .update({
            status: newStatus,
            completed_at: newStatus === "done" ? new Date().toISOString() : null,
          })
          .eq("id", existing.id);
        results.updated++;
      }
    } else {
      results.unmatched.push(task);
    }
  }

  return NextResponse.json(results);
}

// GET /api/sync/things — get all quest_tasks that have a things3_uuid
export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("quest_tasks")
    .select("id, title, status, things3_uuid, quest_id, quests(title, annual_themes(title, emoji))")
    .not("things3_uuid", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
