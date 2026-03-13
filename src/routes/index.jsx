import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { TeacherHomePage } from '../pages/TeacherHomePage';
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage';
import { LiveMonitoringPage } from '../pages/LiveMonitoringPage';
import { AlertsTimelinePage } from '../pages/AlertsTimelinePage';
import { SessionManagementPage } from '../pages/SessionManagementPage';
import { StudentSessionDetailPage } from '../pages/StudentSessionDetailPage';

import { ExamAccessPage } from '../pages/ExamAccessPage';
import { ExamSessionPage } from '../pages/ExamSessionPage';
import { StudentResultsPlaceholderPage } from '../pages/StudentResultsPlaceholderPage';

import { ExamBuilderPlaceholderPage } from '../pages/ExamBuilderPlaceholderPage';
import { SettingsPlaceholderPage } from '../pages/SettingsPlaceholderPage';
import { AdminPlaceholderPage } from '../pages/AdminPlaceholderPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (user) {
    if (user.role === ROLES.TEACHER) return <Navigate to={ROUTES.TEACHER_HOME} replace />;
    if (user.role === ROLES.STUDENT) return <Navigate to={ROUTES.STUDENT_ACCESS} replace />;
    return <Navigate to={ROUTES.ADMIN} replace />;
  }
  return children;
}

export function AppRoutes() {
  const routes = useRoutes([
    { path: ROUTES.LOGIN, element: <PublicOnly><LoginPage /></PublicOnly> },
    { path: ROUTES.REGISTER, element: <PublicOnly><RegisterPage /></PublicOnly> },
    { path: ROUTES.FORGOT_PASSWORD, element: <PublicOnly><ForgotPasswordPage /></PublicOnly> },
    {
      path: ROUTES.TEACHER,
      element: <ProtectedRoute allowedRoles={[ROLES.TEACHER]}><AppShell /></ProtectedRoute>,
      children: [
        { index: true, element: <Navigate to={ROUTES.TEACHER_HOME} replace /> },
        { path: 'home', element: <TeacherHomePage /> },
        { path: 'dashboard', element: <TeacherDashboardPage /> },
        { path: 'monitoring', element: <LiveMonitoringPage /> },
        { path: 'alerts', element: <AlertsTimelinePage /> },
        { path: 'sessions', element: <SessionManagementPage /> },
        { path: 'sessions/:sessionId', element: <StudentSessionDetailPage /> },
      ],
    },
    {
      path: ROUTES.STUDENT,
      element: <ProtectedRoute allowedRoles={[ROLES.STUDENT]}><AppShell /></ProtectedRoute>,
      children: [
        { index: true, element: <Navigate to={ROUTES.STUDENT_ACCESS} replace /> },
        { path: 'access', element: <ExamAccessPage /> },
        { path: 'exam/:examId', element: <ExamSessionPage /> },
        { path: 'results', element: <StudentResultsPlaceholderPage /> },
      ],
    },
    {
      path: ROUTES.EXAM_BUILDER,
      element: <ProtectedRoute><AppShell /></ProtectedRoute>,
      children: [{ index: true, element: <ExamBuilderPlaceholderPage /> }],
    },
    {
      path: ROUTES.SETTINGS,
      element: <ProtectedRoute><AppShell /></ProtectedRoute>,
      children: [{ index: true, element: <SettingsPlaceholderPage /> }],
    },
    {
      path: ROUTES.ADMIN,
      element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AppShell /></ProtectedRoute>,
      children: [{ index: true, element: <AdminPlaceholderPage /> }],
    },
    { path: '/', element: <Navigate to={ROUTES.LOGIN} replace /> },
    { path: '*', element: <NotFoundPage /> },
  ]);
  return routes;
}
