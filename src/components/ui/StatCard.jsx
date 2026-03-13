export function StatCard({ title, value, subtitle, trend, icon, variant = 'default' }) {
  const trendColors = {
    up: 'text-accent-success',
    down: 'text-accent-danger',
    neutral: 'text-slate-500',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
          {trend && <p className={`text-xs mt-1 ${trendColors[trend.direction] || trendColors.neutral}`}>{trend.label}</p>}
        </div>
        {icon && <div className="text-slate-300 dark:text-slate-600 text-2xl">{icon}</div>}
      </div>
    </div>
  );
}
