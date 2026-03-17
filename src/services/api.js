/**
 * API client for RoyalCanvas backend.
 * Uses VITE_API_URL from .env (empty = no API, use mocks).
 */

const BASE = import.meta.env.VITE_API_URL || '';

export function getApiUrl() {
  return BASE.replace(/\/$/, '');
}

export function getApiUrlPath(path) {
  const base = getApiUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : '';
}

/**
 * Call the backend API. Adds Authorization header if token is provided.
 * @param {string} path - e.g. '/api/auth/login'
 * @param {RequestInit & { body?: object }} options - method, body (object, will be JSON stringified), headers, etc.
 * @param {string|null} token - optional JWT
 */
export async function apiRequest(path, options = {}, token = null) {
  const url = getApiUrlPath(path);
  if (!url) throw new Error('VITE_API_URL is not set');

  const { body, headers = {}, ...rest } = options;
  const h = { 'Content-Type': 'application/json', ...headers };
  if (token) h.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    ...rest,
    headers: h,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
