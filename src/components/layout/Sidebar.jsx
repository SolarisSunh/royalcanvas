import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { useAuth } from '../../contexts/AuthContext';
import { envToPrefix } from '../../utils/envRouting';

const BASE_URL = import.meta.env.BASE_URL || '/';
const asset = (p) => {
  const path = p.startsWith('/') ? p.slice(1) : p;
  const base = BASE_URL.replace(/\/$/, '');
  return `${base}/${path}`;
};

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

export function Sidebar({ environment = 'royal' }) {
  const { user } = useAuth();
  const isTeacher = user?.role === ROLES.TEACHER;
  const isStudent = user?.role === ROLES.STUDENT;
  const isAdmin = user?.role === ROLES.ADMIN;

  const links = isTeacher ? teacherNav : isStudent ? studentNav : [];
  const prefix = envToPrefix(environment);
  const home = isTeacher
    ? `${prefix}${ROUTES.TEACHER_HOME}`
    : isStudent
      ? `${prefix}${ROUTES.STUDENT_ACCESS}`
      : `${prefix}${ROUTES.ADMIN}`;

  const brand =
    environment === 'royal'
      ? { title: 'Royal', subtitle: 'Canvas', logo: asset('/AlternarRoyalANormal/royal.png') }
      : environment === 'institucion'
        ? { title: 'Institución', subtitle: 'Canvas', logo: asset('/AlternarRoyalANormal/escuela.png') }
        : { title: 'Impro', subtitle: 'Lab', logo: asset('/AlternarRoyalANormal/improvisaciones.png') };

  return (
    <aside className="w-64 border-r border-white/10 bg-black/30 backdrop-blur flex flex-col">
      <div className="p-4 border-b border-white/10">
        <NavLink
          to={home}
          className="flex items-center gap-3"
        >
          <img
            src={brand.logo}
            alt=""
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/15"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">{brand.title}</div>
            <div className="text-xs text-white/60">{brand.subtitle}</div>
          </div>
        </NavLink>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ to, label }) => (
          <NavLink
            key={`${prefix}${to}`}
            to={`${prefix}${to}`}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        {isTeacher && (
          <NavLink
            to={`${prefix}${ROUTES.EXAM_BUILDER}`}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/60 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/10'
              }`
            }
          >
            Exam builder (placeholder)
          </NavLink>
        )}

        {environment === 'improvisaciones' && (isTeacher || isAdmin) && (
          <NavLink
            to={`${prefix}${ROUTES.IMPRO_LAB_EXAM_BUILDER}`}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            Exam builder (Lab)
          </NavLink>
        )}
        <NavLink
          to={`${prefix}${ROUTES.SETTINGS}`}
          className="block px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10"
        >
          Settings (placeholder)
        </NavLink>
        {isAdmin && (
          <NavLink
            to={`${prefix}${ROUTES.ADMIN}`}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10"
          >
            Admin (placeholder)
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
