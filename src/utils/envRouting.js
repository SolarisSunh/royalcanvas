import { ENVIRONMENTS } from '../contexts/EnvironmentContext';

export const ENV_PREFIX = {
  royal: '/royal',
  institucion: '/institucion',
  improvisaciones: '/impro',
};

export function isEnvPathPrefix(prefix) {
  return Object.values(ENV_PREFIX).includes(prefix);
}

export function normalizeEnvironment(env) {
  if (!env) return 'royal';
  const v = String(env).toLowerCase();
  return ENVIRONMENTS.includes(v) ? v : 'royal';
}

export function envToPrefix(env) {
  const e = normalizeEnvironment(env);
  return ENV_PREFIX[e] || '/royal';
}

export function prefixToEnv(prefix) {
  const entry = Object.entries(ENV_PREFIX).find(([, p]) => p === prefix);
  return entry ? entry[0] : 'royal';
}

export function withEnvPrefix(env, path) {
  const prefix = envToPrefix(env);
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${p}`;
}

