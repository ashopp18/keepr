// lib/LocaleProvider.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './i18n/en.json';
import es from './i18n/es.json';

export type Locale = 'en' | 'es';
type Dict = Record<string, any>;
const STRINGS: Record<Locale, Dict> = { en, es };

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const I18nCtx = createContext<Ctx>({ locale: 'es', setLocale: () => {} });

const STORAGE_KEY = 'keepr.locale';

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [hydrated, setHydrated] = useState(false);

  // cargar del almacenamiento
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'en' || saved === 'es') {
          setLocaleState(saved);
        }
      } catch {}
      setHydrated(true);
    })();
  }, []);

  // guardar cambios
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  // Evita parpadeo con idioma equivocado en el 1er render
  if (!hydrated) return null;

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useLocale() {
  return useContext(I18nCtx);
}

/** Traductor puro (NO usa hooks) */
export function translate(
  locale: Locale,
  key: string,
  fallback?: string
): string {
  const parts = key.split('.');
  let cur: any = STRINGS[locale];
  for (const p of parts) cur = cur?.[p];
  return (typeof cur === 'string' ? cur : undefined) ?? fallback ?? key;
}

/** Hook que devuelve una función traductora enlazada al locale actual */
export function useT() {
  const { locale } = useLocale();
  return (key: string, fallback?: string) => translate(locale, key, fallback);
}
