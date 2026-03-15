import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => null,
  setTheme: () => null,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Initialize theme from MongoDB/localStorage on mount
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('http://localhost:5000/api/users/settings', {
            headers: {
              'x-auth-token': token,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.darkMode) {
              setTheme('dark');
            } else {
              setTheme('light');
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch user theme setting:', err);
      }
    };
    fetchTheme();
  }, []);

  // Update HTML class whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
