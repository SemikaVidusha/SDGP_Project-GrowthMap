import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => null,
  setTheme: () => null,
});

export function ThemeProvider({ children }) {
  // Read from localStorage immediately to avoid flicker
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('growthmap_theme') || 'light';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('growthmap_theme', newTheme);
  };

  // Initialize theme from localStorage, then try backend on mount
  useEffect(() => {
    const saved = localStorage.getItem('growthmap_theme');
    if (saved) {
      setThemeState(saved);
    }

    const fetchTheme = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('http://localhost:5000/api/users/settings', {
            headers: { 'x-auth-token': token },
          });
          if (res.ok) {
            const data = await res.json();
            const backendTheme = data.darkMode ? 'dark' : 'light';
            setTheme(backendTheme);
          }
        }
      } catch (err) {
        // Silently fall back to localStorage value
      }
    };
    fetchTheme();
  }, []);

  // Apply theme class to <html> whenever it changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
