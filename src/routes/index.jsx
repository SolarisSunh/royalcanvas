import { Navigate, Outlet, useLocation, useParams, useRoutes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { AppShell } from '../components/layout/AppShell';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import { ENV_PREFIX, envToPrefix, prefixToEnv, withEnvPrefix } from '../utils/envRouting';

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
import { AlternarRoyalANormalPage } from '../pages/AlternarRoyalANormalPage';
import { ExamBuilderPage } from '../pages/impro/ExamBuilderPage';

function EnvAppShell() {
  const params = useParams();
  const { effectiveEnvironment } = useEnvironment();
  const envPrefix = params.envPrefix || '';
  const location = useLocation();

  // Validate envPrefix and redirect if invalid
  if (!Object.values(ENV_PREFIX).includes(`/${envPrefix}`)) {
    // Keep same rest-of-path when possible
    const rest = location.pathname.replace(/^\/[^/]+/, '');
    return <Navigate to={`${envToPrefix(effectiveEnvironment)}${rest || ''}`} replace />;
  }

  const environment = prefixToEnv(`/${envPrefix}`);
  return <AppShell environment={environment} />;
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, loading, postRegister } = useAuth();
  const { effectiveEnvironment } = useEnvironment();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (user) {
    if (postRegister) return <Navigate to={ROUTES.ALTERNAR_ROYAL_A_NORMAL} replace />;
    if (user.role === ROLES.TEACHER) return <Navigate to={withEnvPrefix(effectiveEnvironment, ROUTES.TEACHER_HOME)} replace />;
    if (user.role === ROLES.STUDENT) return <Navigate to={withEnvPrefix(effectiveEnvironment, ROUTES.STUDENT_ACCESS)} replace />;
    return <Navigate to={withEnvPrefix(effectiveEnvironment, ROUTES.ADMIN)} replace />;
  }
  return children;
}

export function AppRoutes() {
  const { effectiveEnvironment } = useEnvironment();
  const routes = useRoutes([
    { path: ROUTES.LOGIN, element: <PublicOnly><LoginPage /></PublicOnly> },
    { path: ROUTES.REGISTER, element: <PublicOnly><RegisterPage /></PublicOnly> },
    { path: ROUTES.FORGOT_PASSWORD, element: <PublicOnly><ForgotPasswordPage /></PublicOnly> },
    // Redirect legacy role roots to environment-prefixed paths
    { path: ROUTES.TEACHER, element: <Navigate to={withEnvPrefix(effectiveEnvironment, ROUTES.TEACHER_HOME)} replace /> },
    { path: ROUTES.STUDENT, element: <Navigate to={withEnvPrefix(effectiveEnvironment, ROUTES.STUDENT_ACCESS)} replace /> },
    { path: ROUTES.ADMIN, element: <Navigate to={withEnvPrefix(effectiveEnvironment, ROUTES.ADMIN)} replace /> },
    // Redirect legacy nested routes too
    { path: '/teacher/*', element: <Navigate to={`${envToPrefix(effectiveEnvironment)}/teacher`} replace /> },
    { path: '/student/*', element: <Navigate to={`${envToPrefix(effectiveEnvironment)}/student`} replace /> },
    { path: '/admin/*', element: <Navigate to={`${envToPrefix(effectiveEnvironment)}/admin`} replace /> },
    { path: '/settings', element: <Navigate to={`${envToPrefix(effectiveEnvironment)}/settings`} replace /> },
    { path: '/exam-builder', element: <Navigate to={`${envToPrefix(effectiveEnvironment)}/exam-builder`} replace /> },
    // Environment-prefixed app shells
    {
      path: '/:envPrefix',
      element: <ProtectedRoute><EnvAppShell /></ProtectedRoute>,
      children: [
        {
          path: 'teacher',
          element: <ProtectedRoute allowedRoles={[ROLES.TEACHER]}><Outlet /></ProtectedRoute>,
          children: [
            { index: true, element: <Navigate to="home" replace /> },
            { path: 'home', element: <TeacherHomePage /> },
            { path: 'dashboard', element: <TeacherDashboardPage /> },
            { path: 'monitoring', element: <LiveMonitoringPage /> },
            { path: 'alerts', element: <AlertsTimelinePage /> },
            { path: 'sessions', element: <SessionManagementPage /> },
            { path: 'sessions/:sessionId', element: <StudentSessionDetailPage /> },
          ],
        },
        {
          path: 'student',
          element: <ProtectedRoute allowedRoles={[ROLES.STUDENT]}><Outlet /></ProtectedRoute>,
          children: [
            { index: true, element: <Navigate to="access" replace /> },
            { path: 'access', element: <ExamAccessPage /> },
            { path: 'exam/:examId', element: <ExamSessionPage /> },
            { path: 'results', element: <StudentResultsPlaceholderPage /> },
          ],
        },
        {
          path: 'settings',
          element: <ProtectedRoute><SettingsPlaceholderPage /></ProtectedRoute>,
        },
        {
          path: 'admin',
          element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminPlaceholderPage /></ProtectedRoute>,
        },
        // Keep existing placeholder for now (will be replaced in Impro lab)
        {
          path: 'exam-builder',
          element: <ProtectedRoute><ExamBuilderPlaceholderPage /></ProtectedRoute>,
        },

        // Impro-only lab routes
        {
          path: 'lab/exam-builder',
          element: <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.ADMIN]}><ExamBuilderPage /></ProtectedRoute>,
        },
      ],
    },
    {
      path: ROUTES.ALTERNAR_ROYAL_A_NORMAL,
      element: <ProtectedRoute><AlternarRoyalANormalPage /></ProtectedRoute>,
    },
    { path: '/', element: <Navigate to={ROUTES.LOGIN} replace /> },
    { path: '*', element: <NotFoundPage /> },
  ]);
  return routes;
}
