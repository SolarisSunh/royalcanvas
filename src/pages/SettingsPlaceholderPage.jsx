import { ROUTES } from '../constants/routes';
import { Link } from 'react-router-dom';

export function SettingsPlaceholderPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
      <div className="card p-8 text-center">
        <p className="text-slate-600">Settings will be implemented in a future phase.</p>
        <Link to={ROUTES.TEACHER_DASHBOARD} className="btn-primary mt-6 inline-block">Back to dashboard</Link>
      </div>
    </div>
  );
}
