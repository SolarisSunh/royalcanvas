import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import '../components/home/pixelCanvas';

const sections = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    to: ROUTES.TEACHER_DASHBOARD,
    colors: '#0ea5e9,#38bdf8,#e0f2fe', // azul
  },
  {
    key: 'monitoring',
    label: 'Live monitoring',
    to: ROUTES.TEACHER_MONITORING,
    colors: '#22c55e,#4ade80,#bbf7d0', // verde
  },
  {
    key: 'alerts',
    label: 'Alerts',
    to: ROUTES.TEACHER_ALERTS,
    colors: '#f97316,#fdba74,#ffedd5', // naranja
  },
  {
    key: 'sessions',
    label: 'Sessions',
    to: ROUTES.TEACHER_SESSIONS,
    colors: '#6366f1,#a5b4fc,#e0e7ff', // índigo
  },
  {
    key: 'settings',
    label: 'Settings',
    to: ROUTES.SETTINGS,
    colors: '#6b7280,#9ca3af,#e5e7eb', // gris
  },
  {
    key: 'exam-builder',
    label: 'Exam builder',
    to: ROUTES.EXAM_BUILDER,
    colors: '#ec4899,#f472b6,#fed7e2', // rosa
  },
];

export function TeacherHomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Inicio</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Selecciona una sección para ir directamente a ese módulo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => navigate(section.to)}
            className="group home-section-card focus-visible:outline-none"
          >
            <pixel-canvas
              data-gap="8"
              data-speed="30"
              data-colors={section.colors}
            ></pixel-canvas>
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-between py-6 px-4">
              <div className="flex flex-1 items-center justify-center">
                <div className="home-section-card-icon flex items-center justify-center">
                  <div className="h-8 w-8 rounded-md border border-slate-700" />
                </div>
              </div>
              <div className="mt-6 flex w-full flex-col items-center gap-1">
                <span className="text-sm font-medium text-slate-200">{section.label}</span>
                <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                  Ir a sección →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

