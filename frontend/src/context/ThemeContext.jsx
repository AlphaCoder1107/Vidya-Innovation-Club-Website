import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'vic_color_mode';
const ADMIN_STORAGE_KEY = 'vic_admin_color_mode';
const ThemeContext = createContext(null);

function getInitialMode(key, fallback) {
  const saved = localStorage.getItem(key);
  if (saved === 'light' || saved === 'dark') return saved;
  if (fallback === 'light' || fallback === 'dark') return fallback;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => getInitialMode(STORAGE_KEY));
  const [adminMode, setAdminMode] = useState(() => getInitialMode(ADMIN_STORAGE_KEY, mode));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, adminMode);
  }, [adminMode]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
      adminMode,
      isAdminDark: adminMode === 'dark',
      toggleAdminMode: () => setAdminMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }),
    [mode, adminMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside ThemeProvider');
  return ctx;
}
