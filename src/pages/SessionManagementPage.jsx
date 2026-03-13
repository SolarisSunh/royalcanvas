import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherSessionDetailPath } from '../constants/routes';
import { MOCK_SESSIONS } from '../data/mockSessions';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { MOCK_DEVICES } from '../data/mockDevices';
import { MonitoringStatusBadge } from '../components/monitoring/MonitoringStatusBadge';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';

export function SessionManagementPage() {
  const [search, setSearch] = useState('');

  const sessionsWithStudent = MOCK_SESSIONS.map((s) => ({
    ...s,
    student: MOCK_STUDENTS.find((st) => st.id === s.studentId),
    deviceCount: MOCK_DEVICES.filter((d) => d.sessionId === s.id).length,
  }));

  const filtered = sessionsWithStudent.filter((s) => {
    const name = s.student?.name || '';
    return !search || name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Session management</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">View and manage active exam sessions. Device/session actions are UI-only (no real enforcement).</p>
      <SearchFilterBar searchPlaceholder="Search by student..." searchValue={search} onSearchChange={setSearch} />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 text-left text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Started</th>
              <th className="px-4 py-3 font-medium">Devices</th>
              <th className="px-4 py-3 font-medium">Health</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{s.student?.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{s.student?.email}</span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(s.startedAt).toLocaleString()}</td>
                <td className="px-4 py-3">{s.deviceCount}</td>
                <td className="px-4 py-3"><MonitoringStatusBadge status={s.health} /></td>
                <td className="px-4 py-3">
                  <Link to={getTeacherSessionDetailPath(s.id)} className="text-primary-600 dark:text-primary-300 hover:underline text-sm">View detail</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
