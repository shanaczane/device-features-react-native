import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { EntriesProvider } from '@/context/EntriesContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutInner() {
  const { isDark } = useTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <EntriesProvider>
        <RootLayoutInner />
      </EntriesProvider>
    </ThemeProvider>
  );
}
