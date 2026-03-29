export default function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct === 100 ? "var(--green)" : "var(--accent)",
          }}
        />
      </div>
      <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{completed}/{total}</span>
    </div>
  );
}
