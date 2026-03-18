import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState<ThemeMode | null>(null);

  const theme: ThemeMode = manualTheme ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = useCallback(() => {
    setManualTheme((prev) => {
      if (prev === null) {
        return systemScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
