import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { useAuth } from '../../contexts/AuthContext';

const teacherNav = [
  { to: ROUTES.TEACHER_HOME, label: 'Inicio' },
  { to: ROUTES.TEACHER_DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.TEACHER_MONITORING, label: 'Live monitoring' },
  { to: ROUTES.TEACHER_ALERTS, label: 'Alerts' },
  { to: ROUTES.TEACHER_SESSIONS, label: 'Sessions' },
];

const studentNav = [
  { to: ROUTES.STUDENT_ACCESS, label: 'My exams' },
  { to: ROUTES.STUDENT_RESULTS, label: 'Results' },
];

export function Sidebar() {
  const { user } = useAuth();
  const isTeacher = user?.role === ROLES.TEACHER;
  const isStudent = user?.role === ROLES.STUDENT;
  const isAdmin = user?.role === ROLES.ADMIN;

  const links = isTeacher ? teacherNav : isStudent ? studentNav : [];

  return (
    <aside className="w-56 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black flex flex-col">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <NavLink
          to={isTeacher ? ROUTES.TEACHER_HOME : ROUTES.STUDENT_ACCESS || '/'}
          className="text-lg font-semibold text-slate-800 dark:text-slate-100"
        >
          Royal Canvas
        </NavLink>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-slate-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        {isTeacher && (
          <NavLink
            to={ROUTES.EXAM_BUILDER}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-500 ${
                isActive
                  ? 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'
                  : 'hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/10'
              }`
            }
          >
            Exam builder (placeholder)
          </NavLink>
        )}
        <NavLink
          to={ROUTES.SETTINGS}
          className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/10"
        >
          Settings (placeholder)
        </NavLink>
        {isAdmin && (
          <NavLink
            to={ROUTES.ADMIN}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/10"
          >
            Admin (placeholder)
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
