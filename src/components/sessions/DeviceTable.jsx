export function DeviceTable({ devices = [], onRemoveDevice, onForceLogout }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
            <th className="pb-3 font-medium">Device</th>
            <th className="pb-3 font-medium">Last active</th>
            <th className="pb-3 font-medium">Primary</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-white/5">
              <td className="py-3 font-medium text-slate-800 dark:text-slate-100">{d.label}</td>
              <td className="py-3 text-slate-600 dark:text-slate-300">{formatTime(d.lastActive)}</td>
              <td className="py-3">{d.isPrimary ? 'Yes' : 'No'}</td>
              <td className="py-3">
                <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">(UI only)</span>
                <button type="button" className="btn-ghost text-xs text-amber-600 mr-2" onClick={() => onRemoveDevice?.(d)}>
                  Remove device
                </button>
                <button type="button" className="btn-ghost text-xs text-red-600" onClick={() => onForceLogout?.(d)}>
                  Force logout
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}
