import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export function AdminPlaceholderPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Admin</h1>
      <div className="card p-8 text-center">
        <p className="text-slate-600">Admin area is a placeholder. Full admin features will be added later.</p>
        <Link to={ROUTES.LOGIN} className="btn-primary mt-6 inline-block">Back to login</Link>
      </div>
    </div>
  );
}
