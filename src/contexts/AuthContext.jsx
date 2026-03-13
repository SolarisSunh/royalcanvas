import { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, setStoredUser, mockLogout } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = (userData) => {
    setStoredUser(userData);
    setUser(userData);
  };

  const logout = () => {
    mockLogout();
    setUser(null);
  };

  const value = { user, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
