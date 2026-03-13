import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-4xl font-bold text-slate-800">404</h1>
      <p className="text-slate-600 mt-2">Page not found</p>
      <Link to={ROUTES.LOGIN} className="btn-primary mt-6">Go to login</Link>
    </div>
  );
}
