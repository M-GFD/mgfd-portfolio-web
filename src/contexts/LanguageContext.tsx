'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

const LOCALE_KEY = 'mgfd-locale';

export type Locale = 'es' | 'en';

/** Idioma del navegador cuando no hay preferencia guardada. */
function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  const list =
    navigator.languages?.length > 0 ? navigator.languages : [navigator.language];
  for (const tag of list) {
    const base = tag.toLowerCase().split('-')[0];
    if (base === 'es') return 'es';
    if (base === 'en') return 'en';
  }
  return 'es';
}

type Messages = Record<string, unknown>;

const messages: Record<Locale, Messages> = {
  es: esMessages as Messages,
  en: enMessages as Messages,
};

function getMessage(obj: Messages, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const defaultValue: LanguageContextValue = {
  locale: 'es',
  setLocale: () => {},
  t: (key) => key,
};

const LanguageContext = createContext<LanguageContextValue>(defaultValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored === 'es' || stored === 'en') {
      setLocaleState(stored);
    } else {
      const detected = detectBrowserLocale();
      setLocaleState(detected);
      document.documentElement.lang = detected;
      localStorage.setItem(LOCALE_KEY, detected);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_KEY, next);
      document.documentElement.lang = next;
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
  }, [locale, mounted]);

  const t = useCallback(
    (key: string): string => {
      if (!mounted) {
        const fallback = getMessage(messages.es, key);
        return fallback ?? key;
      }
      const value = getMessage(messages[locale], key);
      if (value !== undefined) return value;
      const fallback = getMessage(messages.es, key);
      return fallback ?? key;
    },
    [locale, mounted]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
