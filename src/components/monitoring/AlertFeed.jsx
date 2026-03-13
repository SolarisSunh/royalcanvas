import { AlertBadge } from '../ui/AlertBadge';
import { ALERT_EVENT_LABELS } from '../../constants/alerts';

export function AlertFeed({ items = [], maxItems = 10 }) {
  const list = items.slice(0, maxItems);
  return (
    <ul className="space-y-2">
      {list.length === 0 ? (
        <li className="text-sm text-slate-500 py-2">No recent alerts</li>
      ) : (
        list.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
            <div>
              <span className="font-medium text-slate-700">{item.studentName || item.studentId}</span>
              <span className="text-slate-500 ml-2">{ALERT_EVENT_LABELS[item.eventType] || item.eventType}</span>
            </div>
            <AlertBadge severity={item.severity} />
            <span className="text-xs text-slate-400">{formatTime(item.timestamp)}</span>
          </li>
        ))
      )}
    </ul>
  );
}

function formatTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
