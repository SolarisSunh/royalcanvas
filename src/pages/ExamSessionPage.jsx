import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionRenderer } from '../components/exams/QuestionRenderer';
import { QuestionNavigator } from '../components/exams/QuestionNavigator';
import { ExamTimer } from '../components/exams/ExamTimer';
import { ProgressHeader } from '../components/exams/ProgressHeader';
import { ConnectionStatus } from '../components/exams/ConnectionStatus';
import { WarningBanner } from '../components/exams/WarningBanner';
import { PermissionStatusBanner } from '../components/permissions/PermissionStatusBanner';
import { PermissionRequestModal } from '../components/permissions/PermissionRequestModal';
import { MOCK_EXAMS } from '../data/mockExams';
import { MOCK_QUESTIONS } from '../data/mockQuestions';
import { ROUTES } from '../constants/routes';

export function ExamSessionPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = MOCK_EXAMS.find((e) => e.id === examId);
  const questions = MOCK_QUESTIONS.slice(0, exam?.totalQuestions || 10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [answers, setAnswers] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [autosaveStatus, setAutosaveStatus] = useState('saved');

  useEffect(() => {
    const t = setInterval(() => setAutosaveStatus((s) => (s === 'saved' ? 'saving...' : 'saved')), 5000);
    return () => clearInterval(t);
  }, []);

  if (!exam) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-600">Exam not found</p>
        <button type="button" className="btn-primary mt-4" onClick={() => navigate(ROUTES.STUDENT_ACCESS)}>Back to exams</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex - 1];
  const handleAnswer = (value) => setAnswers((a) => ({ ...a, [currentIndex]: value }));

  const handleSubmit = () => {
    if (window.confirm('Submit exam? This cannot be undone.')) {
      navigate(ROUTES.STUDENT_RESULTS);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PermissionRequestModal
        open={showPermissionModal && !permissionGranted}
        onGrant={() => setPermissionGranted(true)}
        onClose={() => setShowPermissionModal(false)}
      />
      <div className="card p-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-slate-800">{exam.title}</h1>
        <div className="flex items-center gap-4">
          <ExamTimer durationMinutes={exam.durationMinutes} onExpire={() => navigate(ROUTES.STUDENT_RESULTS)} />
          <ConnectionStatus status={connectionStatus} />
          <span className="text-xs text-slate-500">Autosave: {autosaveStatus}</span>
        </div>
      </div>
      <PermissionStatusBanner state={permissionGranted ? 'granted' : 'required'} />
      <WarningBanner variant="info" title="Fullscreen" message="This is a placeholder. Real exams may require fullscreen mode." />
      <ProgressHeader current={currentIndex} total={questions.length} />
      <div className="card p-6">
        <QuestionRenderer
          question={currentQuestion}
          answer={answers[currentIndex]}
          onAnswerChange={handleAnswer}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <QuestionNavigator
          total={questions.length}
          current={currentIndex}
          answers={answers}
          onSelect={setCurrentIndex}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary"
            disabled={currentIndex <= 1}
            onClick={() => setCurrentIndex((i) => Math.max(1, i - 1))}
          >
            Previous
          </button>
          {currentIndex < questions.length ? (
            <button type="button" className="btn-primary" onClick={() => setCurrentIndex((i) => i + 1)}>Next</button>
          ) : (
            <button type="button" className="btn-primary" onClick={handleSubmit}>Submit exam</button>
          )}
        </div>
      </div>
    </div>
  );
}
