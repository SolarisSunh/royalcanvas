import { useState } from 'react';
import { IncidentTimeline } from '../components/alerts/IncidentTimeline';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { ALERT_SEVERITY, ALERT_EVENT_LABELS } from '../constants/alerts';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { MOCK_STUDENTS } from '../data/mockStudents';

export function AlertsTimelinePage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const incidents = MOCK_ALERTS.map((a) => ({
    ...a,
    studentName: MOCK_STUDENTS.find((s) => s.id === a.studentId)?.name,
    evidenceId: a.id,
  }));

  const filtered = incidents.filter((i) => {
    const matchSearch = !search || (i.studentName || '').toLowerCase().includes(search.toLowerCase());
    const matchSeverity = !severityFilter || i.severity === severityFilter;
    const matchEvent = !eventFilter || i.eventType === eventFilter;
    return matchSearch && matchSeverity && matchEvent;
  });

  const severityOptions = Object.values(ALERT_SEVERITY).map((v) => ({ value: v, label: v }));
  const eventOptions = Object.entries(ALERT_EVENT_LABELS).slice(0, 8).map(([k, v]) => ({ value: k, label: v }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Alerts timeline</h1>
      <SearchFilterBar
        searchPlaceholder="Search by student..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { id: 'severity', placeholder: 'Severity', value: severityFilter, options: severityOptions },
          { id: 'event', placeholder: 'Event type', value: eventFilter, options: eventOptions },
        ]}
        onFilterChange={(id, value) => (id === 'severity' ? setSeverityFilter(value) : setEventFilter(value))}
      />
      <div className="card p-6">
        <IncidentTimeline incidents={filtered} onSelectIncident={setSelectedIncident} />
      </div>
      {selectedIncident && (
        <div className="fixed bottom-6 right-6 card p-4 max-w-sm shadow-lg">
          <p className="font-medium text-slate-800">Selected: {selectedIncident.studentName}</p>
          <p className="text-sm text-slate-600">{selectedIncident.eventType} · {selectedIncident.severity}</p>
          <button type="button" className="btn-ghost mt-2 text-sm" onClick={() => setSelectedIncident(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
