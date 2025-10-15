import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

type ThemeName = 'sriwijaya' | 'oceanic' | 'sakura' | 'forest' | 'sunset';

interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    accentDark: string;
    background: string;
    contentBackground: string;
    textOnPrimary: string;
    textOnAccent: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  sriwijaya: {
    name: 'sriwijaya',
    colors: {
      primary: '#003366',
      primaryDark: '#002244',
      accent: '#FFD700',
      accentDark: '#e6c200',
      background: '#003366',
      contentBackground: '#f0f3f8',
      textOnPrimary: '#FFFFFF',
      textOnAccent: '#003366',
    },
  },
  oceanic: {
    name: 'oceanic',
    colors: {
      primary: '#005f73',
      primaryDark: '#003e4d',
      accent: '#00b4d8',
      accentDark: '#00a1c4',
      background: '#023047',
      contentBackground: '#e0f7fa',
      textOnPrimary: '#FFFFFF',
      textOnAccent: '#FFFFFF',
    },
  },
  sakura: {
    name: 'sakura',
    colors: {
      primary: '#c9184a',
      primaryDark: '#a4143d',
      accent: '#ffb3c1',
      accentDark: '#ff9cb0',
      background: '#590d22',
      contentBackground: '#fff0f3',
      textOnPrimary: '#FFFFFF',
      textOnAccent: '#590d22',
    },
  },
  forest: {
    name: 'forest',
    colors: {
      primary: '#1b4332',
      primaryDark: '#081c15',
      accent: '#40916c',
      accentDark: '#2d6a4f',
      background: '#081c15',
      contentBackground: '#f0fff4',
      textOnPrimary: '#FFFFFF',
      textOnAccent: '#FFFFFF',
    },
  },
  sunset: {
    name: 'sunset',
    colors: {
      primary: '#9d0208',
      primaryDark: '#6a040f',
      accent: '#fca311',
      accentDark: '#e3920c',
      background: '#370617',
      contentBackground: '#fffbea',
      textOnPrimary: '#FFFFFF',
      textOnAccent: '#000000',
    },
  },
};


interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeName;
    return savedTheme && themes[savedTheme] ? savedTheme : 'sriwijaya';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const activeTheme = themes[theme];
    
    root.style.setProperty('--color-primary', activeTheme.colors.primary);
    root.style.setProperty('--color-primary-dark', activeTheme.colors.primaryDark);
    root.style.setProperty('--color-accent', activeTheme.colors.accent);
    root.style.setProperty('--color-accent-dark', activeTheme.colors.accentDark);
    root.style.setProperty('--color-background', activeTheme.colors.background);
    root.style.setProperty('--color-content-background', activeTheme.colors.contentBackground);
    root.style.setProperty('--color-text-on-primary', activeTheme.colors.textOnPrimary);
    root.style.setProperty('--color-text-on-accent', activeTheme.colors.textOnAccent);
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};