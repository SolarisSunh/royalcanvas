import { ALERT_SEVERITY } from '../../constants/alerts';

const severityStyles = {
  [ALERT_SEVERITY.LOW]: 'bg-amber-100 text-amber-800',
  [ALERT_SEVERITY.MEDIUM]: 'bg-orange-100 text-orange-800',
  [ALERT_SEVERITY.HIGH]: 'bg-red-100 text-red-800',
};

export function AlertBadge({ severity, count, label }) {
  const style = severityStyles[severity] || severityStyles[ALERT_SEVERITY.LOW];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label || severity}
      {count != null && <span className="ml-1">({count})</span>}
    </span>
  );
}
