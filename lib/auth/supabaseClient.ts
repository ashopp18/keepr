// lib/auth/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const expo = Constants.expoConfig || Constants.manifest; // compatibilidad
const SUPABASE_URL = expo?.extra?.supabaseUrl as string;
const SUPABASE_ANON = expo?.extra?.supabaseAnonKey as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.warn('[supabase] Falta supabaseUrl o supabaseAnonKey en app.json -> expo.extra');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});
