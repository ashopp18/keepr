// lib/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import { rehydrateForUser } from '@lib/store/useTreatments';

type AuthCtx = {
  userId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Error | null>;
  signUp: (email: string, password: string) => Promise<Error | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  userId: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      setLoading(false);
      await rehydrateForUser(uid);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      setLoading(false);
      await rehydrateForUser(uid);
    });

    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const signIn: AuthCtx['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ?? null;
  };
  const signUp: AuthCtx['signUp'] = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ?? null;
  };
  const signOut = async () => { await supabase.auth.signOut(); };

  const value = useMemo(() => ({ userId, loading, signIn, signUp, signOut }), [userId, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
