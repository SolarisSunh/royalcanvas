import { useParams, useNavigate } from 'react-router-dom';
import { DeviceTable } from '../components/sessions/DeviceTable';
import { EvidencePreviewCard } from '../components/sessions/EvidencePreviewCard';
import { AlertFeed } from '../components/monitoring/AlertFeed';
import { MOCK_SESSIONS } from '../data/mockSessions';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { MOCK_DEVICES } from '../data/mockDevices';
import { MOCK_EVIDENCE } from '../data/mockEvidence';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { ROUTES } from '../constants/routes';

export function StudentSessionDetailPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = MOCK_SESSIONS.find((s) => s.id === sessionId);
  const student = session ? MOCK_STUDENTS.find((s) => s.id === session.studentId) : null;
  const devices = MOCK_DEVICES.filter((d) => d.sessionId === sessionId);
  const evidence = MOCK_EVIDENCE.filter((e) => e.sessionId === sessionId);
  const alerts = MOCK_ALERTS.filter((a) => a.studentId === session?.studentId).map((a) => ({
    ...a,
    studentName: student?.name,
  }));

  if (!session) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-600">Session not found</p>
        <button type="button" className="btn-primary mt-4" onClick={() => navigate(ROUTES.TEACHER_SESSIONS)}>Back to sessions</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Session: {student?.name}</h1>
        <button type="button" className="btn-secondary" onClick={() => navigate(ROUTES.TEACHER_SESSIONS)}>Back to sessions</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Student & session</h3>
          <p className="font-medium text-slate-800">{student?.name}</p>
          <p className="text-sm text-slate-500">{student?.email}</p>
          <p className="text-sm text-slate-600 mt-2">Started: {new Date(session.startedAt).toLocaleString()}</p>
          <p className="text-sm text-slate-600">Health: {session.health}</p>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Alerts for this session</h3>
          <AlertFeed items={alerts} maxItems={10} />
        </div>
      </div>
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Devices (UI-only actions)</h3>
        <DeviceTable devices={devices} onRemoveDevice={() => {}} onForceLogout={() => {}} />
      </div>
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Evidence placeholders</h3>
        <div className="space-y-2">
          {evidence.length === 0 ? <p className="text-sm text-slate-500">No evidence records</p> : evidence.map((ev) => <EvidencePreviewCard key={ev.id} {...ev} />)}
        </div>
      </div>
    </div>
  );
}
