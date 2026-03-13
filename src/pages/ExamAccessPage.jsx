import { useNavigate } from 'react-router-dom';
import { getStudentExamPath } from '../constants/routes';
import { MOCK_EXAMS } from '../data/mockExams';

export function ExamAccessPage() {
  const navigate = useNavigate();
  const available = MOCK_EXAMS.filter((e) => e.status === 'active');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">My exams</h1>
      <p className="text-sm text-slate-500">Select an exam to start. You may be asked for temporary monitoring permissions.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {available.map((exam) => (
          <div key={exam.id} className="card p-5 hover:shadow-card-hover transition-shadow">
            <h3 className="font-semibold text-slate-800">{exam.title}</h3>
            <p className="text-sm text-slate-500">{exam.course} · {exam.durationMinutes} min</p>
            <p className="text-xs text-slate-400 mt-2">{exam.totalQuestions} questions</p>
            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() => navigate(getStudentExamPath(exam.id))}
            >
              Enter exam
            </button>
          </div>
        ))}
      </div>
      {available.length === 0 && (
        <p className="text-slate-500">No exams available at the moment.</p>
      )}
    </div>
  );
}
