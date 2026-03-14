import React, { createContext, useState, useEffect, useContext } from 'react';
import { COLORS } from '../constants/colors';
import { saveTheme, getTheme } from '../services/storageService';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await getTheme();
    setIsDark(savedTheme === 'dark');
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await saveTheme(newTheme ? 'dark' : 'light');
  };

  const colors = isDark ? COLORS.dark : COLORS.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
