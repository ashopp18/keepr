// lib/i18n/index.ts
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
export * from './LocaleProvider';


// Diccionarios ANIDADOS (i18n-js usa '.' como separador, por eso anidamos)
const en = {
  brand: 'Keepr',
  tabs: {
    home: 'Home',
    progress: 'Progress',
    treatments: 'Treatments',
    settings: 'Settings',
  },
  welcome: {
    title: 'Welcome to Keepr',
    subtitle: 'Build a simple, steady hair routine.',
  },
  cta: {
    getStarted: 'Get started',
  },
  home: {
    today: 'Today',
    streak: 'Streak',
    quote: 'Small steps, big changes.',
    tasksTitle: 'Today’s checklist',
    done: 'Done',
    skip: 'Skip',
  },
  progress: {
    title: 'Progress',
    subtitle: 'Your photo timeline will live here.',
  },
  treatments: {
    title: 'Treatments',
    subtitle: 'Add your meds and reminders here.',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    english: 'English',
    spanish: 'Español',
  },
};

const es = {
  brand: 'Keepr',
  tabs: {
    home: 'Inicio',
    progress: 'Progreso',
    treatments: 'Tratamientos',
    settings: 'Ajustes',
  },
  welcome: {
    title: 'Bienvenido a Keepr',
    subtitle: 'Construye una rutina capilar simple y constante.',
  },
  cta: {
    getStarted: 'Empezar',
  },
  home: {
    today: 'Hoy',
    streak: 'Racha',
    quote: 'Pequeños pasos, grandes cambios.',
    tasksTitle: 'Lista de hoy',
    done: 'Hecho',
    skip: 'Saltar',
  },
  progress: {
    title: 'Progreso',
    subtitle: 'Aquí verás tu línea temporal de fotos.',
  },
  treatments: {
    title: 'Tratamientos',
    subtitle: 'Añade tus medicaciones y recordatorios aquí.',
  },
  settings: {
    title: 'Ajustes',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
  },
};

const i18n = new I18n({ en, es });

// Config estable
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Idioma del dispositivo -> 'en' | 'es'
const deviceLang =
  Localization.getLocales?.()[0]?.languageCode?.toLowerCase() || 'en';
i18n.locale = deviceLang === 'es' ? 'es' : 'en';

export default i18n;

// Permite cambiar el idioma desde la app (Settings)
export const setLocale = (locale: 'en' | 'es') => {
  i18n.locale = locale;
};
