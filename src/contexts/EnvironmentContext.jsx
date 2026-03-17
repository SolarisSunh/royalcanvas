import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const ENVIRONMENTS = /** @type {const} */ (['royal', 'institucion', 'improvisaciones']);

const STORAGE_KEY = 'royalcanvas_environment';
const PREVIEW_KEY = 'royalcanvas_environment_preview';

function normalizeEnv(value, fallback = 'royal') {
  if (!value) return fallback;
  const v = String(value).toLowerCase();
  return ENVIRONMENTS.includes(v) ? v : fallback;
}

const EnvironmentContext = createContext(null);

export function EnvironmentProvider({ children }) {
  const [environment, setEnvironmentState] = useState(() => normalizeEnv(localStorage.getItem(STORAGE_KEY)));
  const [previewEnvironment, setPreviewEnvironmentState] = useState(() =>
    normalizeEnv(localStorage.getItem(PREVIEW_KEY), '')
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, environment);
  }, [environment]);

  useEffect(() => {
    if (previewEnvironment) localStorage.setItem(PREVIEW_KEY, previewEnvironment);
    else localStorage.removeItem(PREVIEW_KEY);
  }, [previewEnvironment]);

  const value = useMemo(() => {
    const effectiveEnvironment = previewEnvironment || environment;
    return {
      environment,
      previewEnvironment,
      effectiveEnvironment,
      setEnvironment: (env) => setEnvironmentState(normalizeEnv(env)),
      setPreviewEnvironment: (env) => setPreviewEnvironmentState(normalizeEnv(env, '')),
      clearPreview: () => setPreviewEnvironmentState(''),
    };
  }, [environment, previewEnvironment]);

  return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>;
}

export function useEnvironment() {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error('useEnvironment must be used within EnvironmentProvider');
  return ctx;
}

