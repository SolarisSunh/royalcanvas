import { ROUTES } from '../constants/routes';

export function NotFoundPage() {
  const goToLogin = () => {
    // Works even if router is misconfigured or static hosting doesn't rewrite.
    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    // Prefer HashRouter-style navigation; fallback to path navigation.
    try {
      window.location.assign(`${normalizedBase}#${ROUTES.LOGIN}`);
    } catch {
      window.location.hash = ROUTES.LOGIN;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-4xl font-bold text-slate-800">404</h1>
      <p className="text-slate-600 mt-2">Page not found</p>
      <button type="button" onClick={goToLogin} className="btn-primary mt-6">
        Go to login
      </button>
    </div>
  );
}
