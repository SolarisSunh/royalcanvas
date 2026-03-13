export const MOCK_ALERTS_OVER_TIME = {
  labels: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15'],
  datasets: [
    { label: 'Alerts', data: [2, 5, 8, 6, 4, 3], borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true },
  ],
};

export const MOCK_ALERTS_BY_TYPE = {
  labels: ['Tab switch', 'Window blur', 'Duplicate session', 'Connection loss', 'Fullscreen exit'],
  datasets: [{ label: 'Count', data: [12, 8, 3, 5, 4], backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'] }],
};

export const MOCK_ACTIVE_STUDENTS = {
  labels: ['09:00', '09:20', '09:40', '10:00', '10:20', '10:40'],
  datasets: [{ label: 'Active students', data: [5, 12, 18, 22, 20, 18], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }],
};

export const MOCK_SUSPICIOUS_DISTRIBUTION = {
  labels: ['Low', 'Medium', 'High'],
  datasets: [{ label: 'Severity', data: [15, 8, 3], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }],
};

export const MOCK_COMPLETION_PROGRESS = {
  labels: ['Not started', 'In progress', 'Submitted'],
  datasets: [{ label: 'Students', data: [2, 18, 5], backgroundColor: ['#94a3b8', '#3b82f6', '#10b981'] }],
};

export const MOCK_SESSIONS_BY_STATUS = {
  labels: ['Healthy', 'Warning', 'Critical'],
  datasets: [{ label: 'Sessions', data: [18, 4, 2], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }],
};
