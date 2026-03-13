export function EvidencePreviewCard({ id, status, timestamp, retentionUntil, compact }) {
  const statusLabels = { available: 'Available', processing: 'Processing', expired: 'Expired' };
  const statusClass = status === 'available' ? 'text-emerald-600' : status === 'processing' ? 'text-amber-600' : 'text-slate-500';

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 rounded-lg p-2">
        <span className="text-slate-400 dark:text-slate-500">Evidence placeholder</span>
        <span className={statusClass}>{statusLabels[status] || status}</span>
        {timestamp && <span>{new Date(timestamp).toLocaleTimeString()}</span>}
      </div>
    );
  }

  return (
    <div className="card p-3 flex items-center gap-3">
      <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
        Preview
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Recording moment</p>
        <p className={`text-xs ${statusClass}`}>{statusLabels[status] || status}</p>
        {timestamp && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(timestamp).toLocaleString()}</p>}
        {retentionUntil && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Retention until {new Date(retentionUntil).toLocaleDateString()}</p>
        )}
      </div>
      <button type="button" className="btn-ghost text-xs text-primary-600 dark:text-primary-300">Play (placeholder)</button>
    </div>
  );
}
