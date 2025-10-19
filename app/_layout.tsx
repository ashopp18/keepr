// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { LocaleProvider } from '@lib/LocaleProvider';
import { AuthProvider } from '@lib/auth/AuthProvider';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <LocaleProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
