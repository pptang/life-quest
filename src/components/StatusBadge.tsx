const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: "Not Started", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  in_progress: { label: "In Progress", color: "text-green-400", bg: "bg-green-400/10" },
  blocked: { label: "Blocked", color: "text-red-400", bg: "bg-red-400/10" },
  completed: { label: "Completed", color: "text-blue-400", bg: "bg-blue-400/10" },
  paused: { label: "Paused", color: "text-gray-400", bg: "bg-gray-400/10" },
  todo: { label: "To Do", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  doing: { label: "Doing", color: "text-green-400", bg: "bg-green-400/10" },
  done: { label: "Done", color: "text-blue-400", bg: "bg-blue-400/10" },
  skipped: { label: "Skipped", color: "text-gray-400", bg: "bg-gray-400/10" },
  active: { label: "Active", color: "text-green-400", bg: "bg-green-400/10" },
  dropped: { label: "Dropped", color: "text-red-400", bg: "bg-red-400/10" },
  carried_over: { label: "Carried Over", color: "text-purple-400", bg: "bg-purple-400/10" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: "text-gray-400", bg: "bg-gray-400/10" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  );
}
