import { AlertBadge } from '../ui/AlertBadge';
import { ALERT_EVENT_LABELS } from '../../constants/alerts';
import { EvidencePreviewCard } from '../sessions/EvidencePreviewCard';

export function IncidentTimeline({ incidents = [], onSelectIncident }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
      <ul className="space-y-0">
        {incidents.map((inc) => (
          <li key={inc.id} className="relative pl-12 pb-6">
            <div className="absolute left-2.5 w-3 h-3 rounded-full bg-white border-2 border-primary-500" />
            <div
              className="card p-4 cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => onSelectIncident?.(inc)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectIncident?.(inc)}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-medium text-slate-800">{inc.studentName || inc.studentId}</span>
                <AlertBadge severity={inc.severity} />
                <span className="text-xs text-slate-400">{formatDateTime(inc.timestamp)}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {ALERT_EVENT_LABELS[inc.eventType] || inc.eventType}
              </p>
              {inc.status && (
                <p className="text-xs text-slate-500 mt-2">Status: {inc.status}</p>
              )}
              {inc.evidenceId && (
                <div className="mt-3">
                  <EvidencePreviewCard
                    id={inc.evidenceId}
                    status="available"
                    timestamp={inc.timestamp}
                    compact
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString();
}
