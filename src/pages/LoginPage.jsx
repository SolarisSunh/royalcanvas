import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockLogin } from '../services/authService';
import { ROUTES } from '../constants/routes';

export function LoginPage() {
  const [email, setEmail] = useState('teacher@example.com');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = mockLogin(email, password);
    if (result.success) {
      login(result.user);
      const role = result.user.role;
      if (role === 'teacher') navigate(ROUTES.TEACHER_DASHBOARD);
      else if (role === 'student') navigate(ROUTES.STUDENT_ACCESS);
      else if (role === 'admin') navigate(ROUTES.ADMIN);
      else navigate(ROUTES.TEACHER_DASHBOARD);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-slate-800 text-center mb-6">Royal Canvas</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Sign in (mock — no real auth)</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>
        <p className="text-sm text-slate-500 text-center mt-4">
          Try: teacher@example.com / student@example.com / admin@example.com
        </p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <Link to={ROUTES.REGISTER} className="text-primary-600 hover:underline">Register</Link>
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary-600 hover:underline">Forgot password</Link>
        </div>
      </div>
    </div>
  );
}
