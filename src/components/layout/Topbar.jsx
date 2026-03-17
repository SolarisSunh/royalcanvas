import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { useTheme } from '../../contexts/ThemeContext';

export function Topbar({ onOpenDoNotDisturb, environment = 'royal', children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="h-14 border-b border-white/10 bg-black/25 backdrop-blur flex items-center justify-between px-4">
      <div className="text-sm text-white/70">
        {user?.name} · {user?.role}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <button
          type="button"
          onClick={onOpenDoNotDisturb}
          className="btn-ghost text-sm text-white/80"
        >
          Modo No molestar
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-ghost text-sm text-white/80"
        >
          {theme === 'dark' ? 'Fondo blanco' : 'Fondo negro'}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-ghost text-sm text-white/80"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
