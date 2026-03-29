const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: "Not Started", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  in_progress: { label: "In Progress", color: "text-green-400", bg: "bg-green-400/10" },
  blocked: { label: "Blocked", color: "text-red-400", bg: "bg-red-400/10" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  paused: { label: "Paused", color: "text-zinc-400", bg: "bg-zinc-400/10" },
  todo: { label: "To Do", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  doing: { label: "Doing", color: "text-blue-400", bg: "bg-blue-400/10" },
  done: { label: "Done", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  skipped: { label: "Skipped", color: "text-zinc-400", bg: "bg-zinc-400/10" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: "text-zinc-400", bg: "bg-zinc-400/10" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  );
}

export function StatusDot({ status }: { status: string }) {
  const dotColor: Record<string, string> = {
    not_started: "bg-yellow-400",
    in_progress: "bg-green-400",
    blocked: "bg-red-400",
    completed: "bg-emerald-400",
    paused: "bg-zinc-400",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${dotColor[status] || "bg-zinc-400"}`} />;
}
