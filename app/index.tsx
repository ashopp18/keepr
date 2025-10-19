// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@lib/auth/AuthProvider';

export default function Index() {
  const { userId, loading } = useAuth();
  if (loading) return null;
  return <Redirect href={userId ? '/(tabs)/home' : '/auth/signin'} />;
}
