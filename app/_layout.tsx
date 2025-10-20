// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { LocaleProvider } from '@lib/LocaleProvider';
import { AuthProvider, useAuth } from '@lib/auth/AuthProvider';

function AppStack() {
  const { userId, loading } = useAuth();

  // Puedes mostrar un splash si quieres
  if (loading) return null;

  // Cambiamos la key cuando cambia el estado de auth para resetear el árbol
  const stackKey = userId ? 'authd' : 'guest';

  return (
    <Stack key={stackKey} screenOptions={{ headerShown: false }}>
      {userId ? (
        // App autenticada (tabs)
        <Stack.Screen name="(tabs)" />
      ) : (
        // Sólo la pantalla de login cuando no hay sesión
        <Stack.Screen name="auth/signin" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <LocaleProvider>
          <AppStack />
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
