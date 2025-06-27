// context/ModeContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const themePresets = {
  default: {
    light: {},
    dark: {},
  },
  blue: {
    light: {
      primary: 'text-blue-600',
      gradientBtn: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
      bgWhite: 'bg-white',
    },
    dark: {
      primary: 'text-blue-300',
      gradientBtn: 'bg-gradient-to-r from-blue-700 to-blue-900 text-white',
      bgWhite: 'bg-[#0f172a]',
    },
  },
  green: {
    light: {
      primary: 'text-green-600',
      gradientBtn: 'bg-gradient-to-r from-green-500 to-green-700 text-white',
      bgWhite: 'bg-white',
    },
    dark: {
      primary: 'text-green-300',
      gradientBtn: 'bg-gradient-to-r from-green-700 to-green-900 text-white',
      bgWhite: 'bg-[#0f172a]',
    },
  },
  brown: {
    light: {
      primary: 'text-amber-800',
      gradientBtn: 'bg-gradient-to-r from-amber-500 to-yellow-700 text-white',
      bgWhite: 'bg-white',
    },
    dark: {
      primary: 'text-amber-300',
      gradientBtn: 'bg-gradient-to-r from-amber-700 to-yellow-900 text-white',
      bgWhite: 'bg-[#1c1917]',
    },
  },
  pink: {
    light: {
      primary: 'text-pink-600',
      gradientBtn: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
      bgWhite: 'bg-white',
    },
    dark: {
      primary: 'text-pink-300',
      gradientBtn: 'bg-gradient-to-r from-pink-700 to-rose-700 text-white',
      bgWhite: 'bg-[#23141c]',
    },
  },
  cyan: {
    light: {
      primary: 'text-cyan-600',
      gradientBtn: 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white',
      bgWhite: 'bg-white',
    },
    dark: {
      primary: 'text-cyan-300',
      gradientBtn: 'bg-gradient-to-r from-cyan-700 to-sky-700 text-white',
      bgWhite: 'bg-[#0f1b2a]',
    },
  },
};

export const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [theme, setTheme] = useState('default');
    useEffect(() => {
      const storedTheme = localStorage.getItem('theme') || 'default';
      const storedMode = localStorage.getItem('mode') || 'light';
      setTheme(storedTheme);
      setMode(storedMode);
    }, []);

    useEffect(() => {
      localStorage.setItem('theme', theme);
    }, [theme]);
    useEffect(() => {
    localStorage.setItem('mode', mode);
    }, [mode]);
  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const value = {
    mode,
    toggleMode,
    theme,
    setTheme,
    themePresets,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

export const useMode = () => useContext(ModeContext);
