export function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>}
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{subtitle}</p>}
      <div className="min-h-[200px]">{children}</div>
    </div>
  );
}
