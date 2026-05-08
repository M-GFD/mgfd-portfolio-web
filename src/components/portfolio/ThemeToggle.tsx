'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';

const pillClass = (active: boolean) =>
  `inline-flex items-center justify-center rounded px-2 py-1 text-sm font-medium transition-colors ${
    active
      ? 'bg-neutral-100 text-black dark:bg-white/15 dark:text-white'
      : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
  }`;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1" aria-hidden>
        <span className="inline-flex h-8 w-8 rounded px-2 py-1" />
        <span className="inline-flex h-8 w-8 rounded px-2 py-1" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={t('nav.themeHint')}
    >
      <button
        type="button"
        className={pillClass(!isDark)}
        aria-pressed={!isDark}
        aria-label={t('nav.themeLight')}
        title={t('nav.themeLight')}
        onClick={() => setTheme('light')}
      >
        <Sun className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        className={pillClass(isDark)}
        aria-pressed={isDark}
        aria-label={t('nav.themeDark')}
        title={t('nav.themeDark')}
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
