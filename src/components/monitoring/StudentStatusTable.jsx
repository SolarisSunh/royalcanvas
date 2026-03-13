import { Link } from 'react-router-dom';
import { getTeacherSessionDetailPath } from '../../constants/routes';
import { AlertBadge } from '../ui/AlertBadge';
import { MonitoringStatusBadge } from './MonitoringStatusBadge';

export function StudentStatusTable({ students = [], sessions = [] }) {
  const getSession = (studentId) => sessions.find((s) => s.studentId === studentId);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
            <th className="pb-3 font-medium">Student</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Connection</th>
            <th className="pb-3 font-medium">Alerts</th>
            <th className="pb-3 font-medium">Session</th>
            <th className="pb-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const session = getSession(s.id);
            return (
              <tr key={s.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="py-3">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{s.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{s.email}</span>
                </td>
                <td className="py-3">
                  <MonitoringStatusBadge status={s.status} />
                </td>
                <td className="py-3">
                  <MonitoringStatusBadge connectionStatus={s.connectionStatus} />
                </td>
                <td className="py-3">
                  {s.alertCount > 0 ? <AlertBadge severity="medium" count={s.alertCount} /> : '—'}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{session ? (session.health || '—') : '—'}</td>
                <td className="py-3">
                  {session && (
                    <Link
                      to={getTeacherSessionDetailPath(session.id)}
                      className="text-primary-600 dark:text-primary-300 hover:underline text-sm"
                    >
                      View
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
