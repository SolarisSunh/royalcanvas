import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockForgotPassword } from '../services/authService';
import { ROUTES } from '../constants/routes';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = mockForgotPassword(email);
    if (result.success) setSent(true);
    else setError(result.error || 'Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-slate-800 text-center mb-6">Forgot password</h1>
        {sent ? (
          <p className="text-sm text-slate-600 text-center">Reset link sent (simulated). Check your email.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">Send reset link</button>
          </form>
        )}
        <p className="text-sm text-center mt-4">
          <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
