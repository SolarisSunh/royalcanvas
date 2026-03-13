export function ConnectionStatus({ status = 'connected' }) {
  const config = {
    connected: { label: 'Connected', class: 'text-emerald-600 bg-emerald-50' },
    reconnecting: { label: 'Reconnecting...', class: 'text-amber-600 bg-amber-50' },
    disconnected: { label: 'Disconnected', class: 'text-red-600 bg-red-50' },
  };
  const { label, class: className } = config[status] || config.connected;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse' : status === 'reconnecting' ? 'bg-amber-500' : 'bg-red-500'}`} />
      {label}
    </span>
  );
}
