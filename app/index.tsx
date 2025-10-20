// app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@lib/auth/AuthProvider';

export default function Index() {
  const { userId, loading } = useAuth();

  if (loading) return null; // splash opcional

  // Con sesión → Home; sin sesión → Sign In
  return <Redirect href={userId ? '/(tabs)/home' : '/auth/signin'} />;
}
