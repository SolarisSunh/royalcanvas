import { useState } from 'react';
import { StudentStatusTable } from '../components/monitoring/StudentStatusTable';
import { StudentStatusCard } from '../components/monitoring/StudentStatusCard';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { SessionDrawer } from '../components/sessions/SessionDrawer';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { MOCK_SESSIONS } from '../data/mockSessions';
import { MOCK_DEVICES } from '../data/mockDevices';
import { MOCK_EVIDENCE } from '../data/mockEvidence';
import { getTeacherSessionDetailPath } from '../constants/routes';
import { Link } from 'react-router-dom';

export function LiveMonitoringPage() {
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [drawerSession, setDrawerSession] = useState(null);

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const sess = MOCK_SESSIONS.find((sess) => sess.studentId === s.id);
    const matchSession = !sessionFilter || sess?.health === sessionFilter;
    return matchSearch && matchSession;
  });

  const sessionOptions = [
    { value: 'good', label: 'Good' },
    { value: 'warning', label: 'Warning' },
    { value: 'critical', label: 'Critical' },
  ];

  const openDrawer = (session) => {
    setDrawerSession(session);
  };

  const studentForSession = drawerSession ? MOCK_STUDENTS.find((s) => s.id === drawerSession.studentId) : null;
  const devicesForSession = drawerSession ? MOCK_DEVICES.filter((d) => d.sessionId === drawerSession.id) : [];
  const evidenceForSession = drawerSession ? MOCK_EVIDENCE.filter((e) => e.sessionId === drawerSession.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-800">Live monitoring</h1>
        <div className="flex gap-2">
          <button type="button" className={view === 'table' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('table')}>Table</button>
          <button type="button" className={view === 'grid' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('grid')}>Grid</button>
        </div>
      </div>
      <SearchFilterBar
        searchPlaceholder="Search students..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[{ id: 'health', placeholder: 'Session health', value: sessionFilter, options: sessionOptions }]}
        onFilterChange={(id, value) => setSessionFilter(value)}
      />
      {view === 'table' ? (
        <div className="card p-4">
          <StudentStatusTable students={filtered} sessions={MOCK_SESSIONS} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const session = MOCK_SESSIONS.find((sess) => sess.studentId === s.id);
            return (
              <div key={s.id}>
                <StudentStatusCard student={s} session={session} />
                {session && (
                  <div className="mt-2 flex gap-2">
                    <Link to={getTeacherSessionDetailPath(session.id)} className="text-sm text-primary-600 hover:underline">View detail</Link>
                    <button type="button" className="text-sm text-slate-500 hover:underline" onClick={() => openDrawer(session)}>Quick drawer</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <SessionDrawer
        open={!!drawerSession}
        onClose={() => setDrawerSession(null)}
        session={drawerSession}
        student={studentForSession}
        devices={devicesForSession}
        evidence={evidenceForSession}
      />
    </div>
  );
}
