export function PermissionRequestModal({ open, onGrant, onDeny, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Exam monitoring permissions</h2>
        <p className="text-sm text-slate-600 mb-4">
          This exam may request temporary access to your camera and screen for supervision. All permissions are:
        </p>
        <ul className="text-sm text-slate-600 list-disc list-inside mb-6 space-y-1">
          <li>Active only during the exam session</li>
          <li>Removed automatically when you submit or time expires</li>
          <li>Used only for exam integrity (no permanent storage in this prototype)</li>
        </ul>
        <p className="text-xs text-slate-500 mb-6">
          This is a frontend-only prototype. No real device access is requested.
        </p>
        <div className="flex gap-3 justify-end">
          <button type="button" className="btn-secondary" onClick={onDeny || onClose}>
            Deny
          </button>
          <button type="button" className="btn-primary" onClick={() => { onGrant?.(); onClose?.(); }}>
            Grant (simulated)
          </button>
        </div>
      </div>
    </div>
  );
}
