import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export function ExamBuilderPlaceholderPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Exam builder</h1>
      <div className="card p-8 text-center">
        <p className="text-slate-600">Exam design and builder will be implemented in a future section.</p>
        <Link to={ROUTES.TEACHER_DASHBOARD} className="btn-primary mt-6 inline-block">Back to dashboard</Link>
      </div>
    </div>
  );
}
