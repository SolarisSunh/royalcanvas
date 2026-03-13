const states = {
  granted: { label: 'Temporary permissions active', class: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  partial: { label: 'Some permissions limited', class: 'bg-amber-50 border-amber-200 text-amber-800' },
  denied: { label: 'Permissions denied', class: 'bg-red-50 border-red-200 text-red-800' },
  expired: { label: 'Permissions ended (exam over)', class: 'bg-slate-100 border-slate-200 text-slate-600' },
  required: { label: 'Permissions required to start exam', class: 'bg-blue-50 border-blue-200 text-blue-800' },
};

export function PermissionStatusBanner({ state = 'required' }) {
  const config = states[state] || states.required;
  return (
    <div className={`rounded-lg border p-3 text-sm ${config.class}`}>
      <p className="font-medium">{config.label}</p>
      <p className="text-xs mt-1 opacity-90">
        {state === 'granted' && 'Permissions apply only during this exam session and end automatically when you submit.'}
        {state === 'expired' && 'Recordings and evidence are temporary and have been removed.'}
        {state === 'required' && 'Camera and screen sharing may be requested for this exam. All access is temporary.'}
      </p>
    </div>
  );
}
