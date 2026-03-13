import { useEffect } from 'react';
import { publishMockEvent } from '../services/socketService';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { ALERT_SEVERITY } from '../constants/alerts';
import { ALERT_EVENT_TYPES } from '../constants/alerts';

/**
 * Simulates real-time socket events for the teacher dashboard.
 * Call this hook from TeacherDashboardPage or a layout that wraps teacher views.
 */
export function useMockSocketEvents(enable = true) {
  useEffect(() => {
    if (!enable) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const student = MOCK_STUDENTS[Math.floor(Math.random() * MOCK_STUDENTS.length)];
        const events = [ALERT_EVENT_TYPES.TAB_SWITCH, ALERT_EVENT_TYPES.WINDOW_BLUR, ALERT_EVENT_TYPES.FULLSCREEN_EXIT];
        const eventType = events[Math.floor(Math.random() * events.length)];
        publishMockEvent('alert', {
          studentId: student.id,
          studentName: student.name,
          examId: 'exam1',
          severity: ALERT_SEVERITY.MEDIUM,
          eventType,
          timestamp: new Date().toISOString(),
          status: 'pending',
        });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [enable]);
}
