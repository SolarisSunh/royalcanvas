import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockRegister } from '../services/authService';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES.STUDENT);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = mockRegister(email, name, role);
    if (result.success) {
      login(result.user);
      if (result.user.role === ROLES.TEACHER) navigate(ROUTES.TEACHER_DASHBOARD);
      else navigate(ROUTES.STUDENT_ACCESS);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-slate-800 text-center mb-6">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value={ROLES.STUDENT}>Student</option>
              <option value={ROLES.TEACHER}>Teacher</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        <p className="text-sm text-center mt-4">
          <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
