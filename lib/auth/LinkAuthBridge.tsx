// lib/auth/LinkAuthBridge.tsx
import React, { useEffect } from 'react';
import { supabase } from '@lib/auth/supabaseClient';   // 👈 ruta EXACTA ya creada antes
import { setAuthUser } from '@lib/store/linkAuth';

export default function LinkAuthBridge() {
  useEffect(() => {
    let mounted = true;

    // Sesión al montar
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const uid = data.session?.user?.id ?? null;
      setAuthUser(uid);
    });

    // Cambios de sesión (login/logout/refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setAuthUser(uid);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  return null;
}
