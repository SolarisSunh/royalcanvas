// Route paths - single source of truth for navigation
export const ROUTES = {
  // Public / Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Teacher
  TEACHER: '/teacher',
  TEACHER_HOME: '/teacher/home',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_MONITORING: '/teacher/monitoring',
  TEACHER_ALERTS: '/teacher/alerts',
  TEACHER_SESSIONS: '/teacher/sessions',
  TEACHER_SESSION_DETAIL: '/teacher/sessions/:sessionId',

  // Student
  STUDENT: '/student',
  STUDENT_ACCESS: '/student/access',
  STUDENT_EXAM: '/student/exam/:examId',
  STUDENT_RESULTS: '/student/results',

  // Placeholders
  EXAM_BUILDER: '/exam-builder',
  SETTINGS: '/settings',
  ADMIN: '/admin',

  // Post-registro
  ALTERNAR_ROYAL_A_NORMAL: '/alternar-royal-a-normal',

  // Impro lab
  IMPRO_LAB_EXAM_BUILDER: '/lab/exam-builder',
};

export const getTeacherSessionDetailPath = (sessionId) =>
  `/teacher/sessions/${sessionId}`;
export const getStudentExamPath = (examId) => `/student/exam/${examId}`;
