import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin, mockRegister } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import './AuthPage.css';

export function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const isRegister = mode === 'register';

  const [loginEmail, setLoginEmail] = useState('teacher@example.com');
  const [loginPassword, setLoginPassword] = useState('demo');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState(ROLES.STUDENT);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const redirectAfterLogin = (user) => {
    const role = user?.role;
    if (role === ROLES.TEACHER) navigate(ROUTES.TEACHER_HOME);
    else if (role === ROLES.STUDENT) navigate(ROUTES.STUDENT_ACCESS);
    else if (role === ROLES.ADMIN) navigate(ROUTES.ADMIN);
    else navigate(ROUTES.LOGIN);
  };

  const canSubmit = useMemo(() => {
    if (isRegister) return Boolean(regName && regEmail);
    return Boolean(loginEmail);
  }, [isRegister, regName, regEmail, loginEmail]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiLogin(loginEmail, loginPassword);
      if (result.success) {
        login(result.user);
        redirectAfterLogin(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    // password is UI-only in this mock; keep to match template UX
    void regPassword;
    const result = mockRegister(regEmail, regName, regRole);
    if (result.success) {
      login(result.user);
      redirectAfterLogin(result.user);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="ls-root">
      <div className="ls-page">
        <div className={`ls-container ${isRegister ? 'ls-active' : ''}`}>
          <div className="ls-formBox ls-login">
            <form className="ls-form" onSubmit={handleLoginSubmit}>
              <h1>Login</h1>
              <div className="ls-inputBox">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <i className="bx bxs-user" />
              </div>
              <div className="ls-inputBox">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <i className="bx bxs-lock-alt" />
              </div>
              <div className="ls-forgotLink">
                <Link to={ROUTES.FORGOT_PASSWORD}>Forgot Password?</Link>
              </div>
              {error && !isRegister && <div className="ls-error">{error}</div>}
              <button type="submit" className="ls-btn" disabled={!canSubmit || loading}>
                {loading ? 'Connecting…' : 'Login'}
              </button>
              <p>or login with social platforms</p>
              <div className="ls-socialIcons">
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="Google">
                  <i className="bx bxl-google" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook">
                  <i className="bx bxl-facebook" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="GitHub">
                  <i className="bx bxl-github" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                  <i className="bx bxl-linkedin" />
                </a>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
                Try: teacher@example.com / student@example.com / admin@example.com
              </p>
            </form>
          </div>

          <div className="ls-formBox ls-register">
            <form className="ls-form" onSubmit={handleRegisterSubmit}>
              <h1>Registration</h1>
              <div className="ls-inputBox">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
                <i className="bx bxs-user" />
              </div>
              <div className="ls-inputBox">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                <i className="bx bxs-envelope" />
              </div>
              <div className="ls-inputBox">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <i className="bx bxs-lock-alt" />
              </div>
              <div className="ls-inputBox">
                <select value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                  <option value={ROLES.STUDENT}>Student</option>
                  <option value={ROLES.TEACHER}>Teacher</option>
                </select>
                <i className="bx bxs-id-card" />
              </div>
              {error && isRegister && <div className="ls-error">{error}</div>}
              <button type="submit" className="ls-btn" disabled={!canSubmit}>
                Register
              </button>
              <p>or register with social platforms</p>
              <div className="ls-socialIcons">
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="Google">
                  <i className="bx bxl-google" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook">
                  <i className="bx bxl-facebook" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="GitHub">
                  <i className="bx bxl-github" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                  <i className="bx bxl-linkedin" />
                </a>
              </div>
            </form>
          </div>

          <div className="ls-toggleBox">
            <div className="ls-togglePanel ls-left">
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button type="button" className="ls-btn" onClick={() => setMode('register')}>
                Register
              </button>
            </div>

            <div className="ls-togglePanel ls-right">
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button type="button" className="ls-btn" onClick={() => setMode('login')}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

