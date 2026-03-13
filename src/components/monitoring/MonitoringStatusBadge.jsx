const statusStyles = {
  active: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
  inactive: 'bg-slate-100 text-slate-600',
};

const connectionStyles = {
  connected: 'bg-emerald-100 text-emerald-800',
  reconnecting: 'bg-amber-100 text-amber-800',
  disconnected: 'bg-red-100 text-red-800',
};

export function MonitoringStatusBadge({ status, connectionStatus }) {
  const style = connectionStatus != null ? connectionStyles[connectionStatus] || connectionStyles.disconnected : statusStyles[status] || statusStyles.inactive;
  const label = connectionStatus != null ? (connectionStatus || 'unknown') : (status || '—');
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}
