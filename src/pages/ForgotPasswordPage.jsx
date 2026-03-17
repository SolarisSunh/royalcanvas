import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockForgotPassword } from '../services/authService';
import { ROUTES } from '../constants/routes';
import './AuthPage.css';

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
    <div className="ls-root">
      <div className="ls-page">
        <div className="ls-container" style={{ maxWidth: 480, width: '100%' }}>
          <div className="ls-formBox" style={{ position: 'relative', width: '100%' }}>
            <form className="ls-form" onSubmit={handleSubmit}>
              <h1>Forgot password</h1>
              <p>Enter your email to receive a reset link (simulado).</p>
              {sent ? (
                <p className="text-sm" style={{ marginTop: 16 }}>
                  Reset link sent. Please check your email.
                </p>
              ) : (
                <>
                  <div className="ls-inputBox">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <i className="bx bxs-envelope" />
                  </div>
                  {error && <div className="ls-error">{error}</div>}
                  <button type="submit" className="ls-btn">
                    Send reset link
                  </button>
                </>
              )}
              <p style={{ marginTop: 20 }}>
                <Link to={ROUTES.LOGIN}>Back to login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
