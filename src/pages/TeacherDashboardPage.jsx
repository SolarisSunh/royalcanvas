import { useState, useEffect } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { AlertFeed } from '../components/monitoring/AlertFeed';
import { StudentStatusCard } from '../components/monitoring/StudentStatusCard';
import { EmptyState } from '../components/ui/EmptyState';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { MOCK_SESSIONS } from '../data/mockSessions';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { MOCK_EXAMS } from '../data/mockExams';
import { MOCK_ALERTS_OVER_TIME, MOCK_ALERTS_BY_TYPE, MOCK_SUSPICIOUS_DISTRIBUTION } from '../data/mockChartData';
import { socketService } from '../services/socketService';
import { useMockSocketEvents } from '../hooks/useMockSocketEvents';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const chartOptions = { responsive: true, maintainAspectRatio: false };

export function TeacherDashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  useMockSocketEvents(true);

  useEffect(() => {
    socketService.connect();
    const unsub = socketService.on('alert', (data) => {
      setAlerts((prev) => [{ ...data, id: `a-${Date.now()}` }, ...prev].slice(0, 20));
    });
    return () => {
      unsub?.();
      socketService.disconnect();
    };
  }, []);

  const alertsWithNames = alerts.map((a) => ({
    ...a,
    studentName: MOCK_STUDENTS.find((s) => s.id === a.studentId)?.name || a.studentId,
  }));
  const activeSessions = MOCK_SESSIONS.length;
  const highRisk = MOCK_SESSIONS.filter((s) => s.health === 'critical').length;
  const activeStudents = MOCK_STUDENTS.filter((s) => s.connectionStatus === 'connected').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active exams" value={MOCK_EXAMS.filter((e) => e.status === 'active').length} />
        <StatCard title="Ongoing sessions" value={activeSessions} subtitle="Students in exam" />
        <StatCard title="Active alerts" value={alerts.filter((a) => a.status === 'pending').length} />
        <StatCard title="High-risk sessions" value={highRisk} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Alerts over time" subtitle="Simulated data">
            <Line data={MOCK_ALERTS_OVER_TIME} options={chartOptions} />
          </ChartCard>
          <ChartCard title="Alerts by type" subtitle="Mock distribution">
            <Bar data={MOCK_ALERTS_BY_TYPE} options={chartOptions} />
          </ChartCard>
        </div>
        <div className="space-y-6">
          <ChartCard title="Severity distribution" subtitle="Mock">
            <Doughnut data={MOCK_SUSPICIOUS_DISTRIBUTION} options={chartOptions} />
          </ChartCard>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent incidents</h3>
            <AlertFeed items={alertsWithNames} maxItems={8} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Students · Quick view</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_STUDENTS.map((s) => (
              <div key={s.id} onClick={() => setSelectedStudent(s)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelectedStudent(s)}>
                <StudentStatusCard student={s} session={MOCK_SESSIONS.find((sess) => sess.studentId === s.id)} />
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Selected student insight</h3>
          {selectedStudent ? (
            <div>
              <p className="font-medium text-slate-800">{selectedStudent.name}</p>
              <p className="text-sm text-slate-500">{selectedStudent.email}</p>
              <p className="text-sm text-slate-600 mt-2">Alerts: {selectedStudent.alertCount} · Connection: {selectedStudent.connectionStatus}</p>
            </div>
          ) : (
            <EmptyState title="Select a student" description="Click a student card to see details here." />
          )}
        </div>
      </div>
    </div>
  );
}
