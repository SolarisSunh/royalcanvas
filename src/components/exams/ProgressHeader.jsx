export function ProgressHeader({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label || `Question ${current} of ${total}`}</span>
        <span className="text-slate-500">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
