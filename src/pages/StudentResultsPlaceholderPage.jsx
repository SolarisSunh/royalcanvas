import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export function StudentResultsPlaceholderPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Results</h1>
      <div className="card p-8 text-center">
        <p className="text-slate-600">Results are not available in this frontend-only phase.</p>
        <p className="text-sm text-slate-500 mt-2">Scores and feedback would be loaded from the backend.</p>
        <Link to={ROUTES.STUDENT_ACCESS} className="btn-primary mt-6 inline-block">Back to my exams</Link>
      </div>
    </div>
  );
}
