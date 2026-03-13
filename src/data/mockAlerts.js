import { ALERT_SEVERITY, ALERT_EVENT_TYPES } from '../constants/alerts';

export const MOCK_ALERTS = [
  { id: 'a1', studentId: 's1', examId: 'exam1', severity: ALERT_SEVERITY.MEDIUM, eventType: ALERT_EVENT_TYPES.TAB_SWITCH, timestamp: '2025-03-10T09:32:00Z', status: 'acknowledged' },
  { id: 'a2', studentId: 's5', examId: 'exam1', severity: ALERT_SEVERITY.HIGH, eventType: ALERT_EVENT_TYPES.DUPLICATE_SESSION, timestamp: '2025-03-10T09:28:00Z', status: 'pending' },
  { id: 'a3', studentId: 's3', examId: 'exam1', severity: ALERT_SEVERITY.LOW, eventType: ALERT_EVENT_TYPES.CONNECTION_LOSS, timestamp: '2025-03-10T09:25:00Z', status: 'resolved' },
  { id: 'a4', studentId: 's4', examId: 'exam1', severity: ALERT_SEVERITY.MEDIUM, eventType: ALERT_EVENT_TYPES.WINDOW_BLUR, timestamp: '2025-03-10T09:20:00Z', status: 'acknowledged' },
  { id: 'a5', studentId: 's1', examId: 'exam1', severity: ALERT_SEVERITY.LOW, eventType: ALERT_EVENT_TYPES.FULLSCREEN_EXIT, timestamp: '2025-03-10T09:15:00Z', status: 'resolved' },
  { id: 'a6', studentId: 's5', examId: 'exam1', severity: ALERT_SEVERITY.HIGH, eventType: ALERT_EVENT_TYPES.REPEATED_WARNING, timestamp: '2025-03-10T09:10:00Z', status: 'pending' },
];
