'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex h-6 w-[4.75rem] items-center gap-2" aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-2" title={t('nav.themeHint')}>
      <Sun className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" aria-hidden />
      <Switch
        checked={isDark}
        onCheckedChange={(on) => setTheme(on ? 'dark' : 'light')}
        aria-label={t('nav.themeToggle')}
      />
      <Moon className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" aria-hidden />
    </div>
  );
}
