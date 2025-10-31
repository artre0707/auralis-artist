import { useEffect, useState } from 'react';
export type Theme = 'light' | 'dark';

export function useTheme() {
  const getInitial = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved && (saved === 'light' || saved === 'dark')) return saved;
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefers ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    const root = document.body; // NOTE: use BODY, not HTML
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  }, [theme]);

  return { theme, setTheme };
}