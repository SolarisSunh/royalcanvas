/**
 * Auth service - mock only.
 * No real API. Simulates login/register with stored user in memory/localStorage.
 */

import { MOCK_USERS } from '../data/mockUsers';
import { ROLES } from '../constants/roles';

const STORAGE_KEY = 'royalcanvas_mock_user';

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export function mockLogin(email, password) {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return { success: false, error: 'User not found' };
  setStoredUser(user);
  return { success: true, user };
}

export function mockRegister(email, name, role = ROLES.STUDENT) {
  const existing = MOCK_USERS.find((u) => u.email === email);
  if (existing) return { success: false, error: 'Email already registered' };
  const user = { id: `u-${Date.now()}`, email, name, role, avatar: null };
  setStoredUser(user);
  return { success: true, user };
}

export function mockLogout() {
  setStoredUser(null);
  return { success: true };
}

export function mockForgotPassword(email) {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return { success: false, error: 'Email not found' };
  return { success: true, message: 'Reset link sent (simulated)' };
}
