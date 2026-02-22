import { useEffect, useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

export type ThemeMode = 'dark' | 'light' | 'system';

export function useTheme() {
  const [themePreference, setThemePreference] = useLocalStorageState<ThemeMode>('doraa-theme-preference', 'dark');
  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const applyTheme = () => {
      let theme: 'dark' | 'light' = 'dark';

      if (themePreference === 'system') {
        // Detect system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = systemPrefersDark ? 'dark' : 'light';
      } else {
        theme = themePreference;
      }

      setEffectiveTheme(theme);

      // Apply theme to document root
      const root = document.documentElement;
      if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      } else {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      }
    };

    applyTheme();

    // Listen for system theme changes when in system mode
    if (themePreference === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themePreference]);

  return {
    themePreference,
    effectiveTheme,
    setTheme: setThemePreference,
  };
}
