import { Link } from 'react-router-dom';
import { getTeacherSessionDetailPath } from '../../constants/routes';
import { AlertBadge } from '../ui/AlertBadge';
import { MonitoringStatusBadge } from './MonitoringStatusBadge';

export function StudentStatusCard({ student, session }) {
  return (
    <div className="card p-4 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100">{student.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          <MonitoringStatusBadge status={student.status} />
          <MonitoringStatusBadge connectionStatus={student.connectionStatus} />
          {student.alertCount > 0 && <AlertBadge severity="medium" count={student.alertCount} />}
        </div>
      </div>
      {session && (
        <Link
          to={getTeacherSessionDetailPath(session.id)}
          className="mt-3 inline-block text-sm text-primary-600 dark:text-primary-300 hover:underline"
        >
          View session →
        </Link>
      )}
    </div>
  );
}
