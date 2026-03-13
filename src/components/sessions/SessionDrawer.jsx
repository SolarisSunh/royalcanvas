import { DeviceTable } from './DeviceTable';
import { EvidencePreviewCard } from './EvidencePreviewCard';

export function SessionDrawer({ open, onClose, session, student, devices = [], evidence = [] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="relative ml-auto w-full max-w-lg bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Session detail</h2>
          <button type="button" onClick={onClose} className="btn-ghost p-2">×</button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {student && (
            <section>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Student</h3>
              <p className="font-medium text-slate-800">{student.name}</p>
              <p className="text-sm text-slate-500">{student.email}</p>
            </section>
          )}
          {session && (
            <section>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Session</h3>
              <p className="text-sm text-slate-600">Started: {new Date(session.startedAt).toLocaleString()}</p>
              <p className="text-sm text-slate-600">Health: {session.health}</p>
            </section>
          )}
          {devices.length > 0 && (
            <section>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Devices</h3>
              <DeviceTable devices={devices} />
            </section>
          )}
          {evidence.length > 0 && (
            <section>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Evidence (placeholder)</h3>
              <div className="space-y-2">
                {evidence.map((ev) => (
                  <EvidencePreviewCard key={ev.id} {...ev} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
