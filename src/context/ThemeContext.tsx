import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'day' | 'night';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('profolio-theme');
    if (saved === 'day' || saved === 'night') return saved;
    return 'day';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'night') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      root.style.backgroundColor = '#090A0C';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      root.style.backgroundColor = '#F2E9DA';
    }
    localStorage.setItem('profolio-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
