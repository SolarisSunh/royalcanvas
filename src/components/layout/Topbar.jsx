import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { useTheme } from '../../contexts/ThemeContext';

export function Topbar({ onOpenDoNotDisturb }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black flex items-center justify-between px-4">
      <div className="text-sm text-slate-500 dark:text-slate-300">
        {user?.name} · {user?.role}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenDoNotDisturb}
          className="btn-ghost text-sm text-slate-600 dark:text-slate-200"
        >
          Modo No molestar
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-ghost text-sm text-slate-600 dark:text-slate-200"
        >
          {theme === 'dark' ? 'Fondo blanco' : 'Fondo negro'}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-ghost text-sm text-slate-600 dark:text-slate-200"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
