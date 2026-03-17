/**
 * Auth service: real API when VITE_API_URL is set, otherwise mock.
 */

import { apiRequest, getApiUrl } from './api.js';
import { MOCK_USERS } from '../data/mockUsers';
import { ROLES } from '../constants/roles';

const STORAGE_KEY = 'royalcanvas_auth';

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  return getStoredAuth()?.user ?? null;
}

export function getStoredToken() {
  return getStoredAuth()?.token ?? null;
}

export function setStoredUser(user) {
  if (user) {
    const prev = getStoredAuth();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token: prev?.token ?? null }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function setStoredAuth(payload) {
  if (payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Login: uses real API if VITE_API_URL is set, otherwise mock.
 */
export async function login(email, password) {
  if (getApiUrl()) {
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (data.success && data.user) {
        setStoredAuth({ user: data.user, token: data.token ?? null });
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      const message = err.data?.error || err.message || 'Connection error';
      return { success: false, error: message };
    }
  }
  const result = mockLogin(email, password);
  if (result.success) setStoredAuth({ user: result.user, token: null });
  return result;
}

export function mockLogin(email, password) {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return { success: false, error: 'User not found' };
  setStoredAuth({ user, token: null });
  return { success: true, user };
}

export function mockRegister(email, name, role = ROLES.STUDENT) {
  const existing = MOCK_USERS.find((u) => u.email === email);
  if (existing) return { success: false, error: 'Email already registered' };
  const user = { id: `u-${Date.now()}`, email, name, role, avatar: null };
  setStoredAuth({ user, token: null });
  return { success: true, user };
}

export function mockLogout() {
  setStoredAuth(null);
  return { success: true };
}

export function mockForgotPassword(email) {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return { success: false, error: 'Email not found' };
  return { success: true, message: 'Reset link sent (simulated)' };
}
