// lib/store/linkAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clave actual para “namespacing” del almacenamiento por usuario.
 * Formato: 'anon' | `user-${uid}`
 */
let currentKey = 'anon';

// Suscriptores para notificar cambios (login/logout)
const subs = new Set<(k: string) => void>();

/** Devuelve la clave actual. Si no está en memoria, intenta cargarla de AsyncStorage. */
export async function getCurrentAuthKey(): Promise<string> {
  if (currentKey) return currentKey;
  const k = (await AsyncStorage.getItem('keepr-auth-key')) || 'anon';
  currentKey = k;
  return currentKey;
}

/**
 * Establece el usuario actual. Pasa `null` para sesión anónima (logout).
 * Guarda la clave en AsyncStorage y notifica a los suscriptores.
 */
export async function setAuthUser(userId: string | null): Promise<void> {
  const next = userId ? `user-${userId}` : 'anon';
  currentKey = next;
  await AsyncStorage.setItem('keepr-auth-key', next);
  subs.forEach((cb) => cb(next));
}

/** Suscripción a cambios de la clave. Devuelve función para desuscribir. */
export function subscribeAuthKey(cb: (k: string) => void): () => void {
  subs.add(cb);
  return () => subs.delete(cb);
}
