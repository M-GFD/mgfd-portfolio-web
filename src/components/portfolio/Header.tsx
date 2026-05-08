'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/portfolio/ThemeToggle';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

const localePillClass = (active: boolean) =>
  `rounded px-2 py-1 text-sm font-medium transition-colors ${
    active
      ? 'bg-neutral-100 text-black dark:bg-white/15 dark:text-white'
      : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
  }`;

export default function Header({ onMenuToggle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  const handleMenuToggle = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    onMenuToggle?.(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.12] bg-white/82 pt-[env(safe-area-inset-top)] shadow-sm shadow-black/5 backdrop-blur-md dark:border-white/12 dark:bg-zinc-950/82 dark:shadow-black/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
        <div className="flex min-w-0 flex-1 items-center pr-2">
          <a href="/" className="flex min-w-0 items-center">
            <img
              src="images/_mgfd_logo.svg"
              alt="Mateo G. Fontana Dalmasso (MGFD) — portfolio web"
              className="h-7 w-auto sm:h-8 dark:invert dark:brightness-0 dark:contrast-200"
            />
          </a>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#about"
            className="text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            {t('nav.about')}
          </a>
          <a
            href="#contact"
            className="text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            {t('nav.contact')}
          </a>
          <a
            href="#works"
            className="text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            {t('nav.works')}
          </a>
          <div className="flex items-center gap-1 border-l border-neutral-200 pl-6 dark:border-white/15">
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-1 border-l border-neutral-200 pl-6 dark:border-white/15">
            <button
              type="button"
              onClick={() => setLocale('es')}
              className={localePillClass(locale === 'es')}
              aria-pressed={locale === 'es'}
              aria-label="Español"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={localePillClass(locale === 'en')}
              aria-pressed={locale === 'en'}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:hidden">
          <ThemeToggle />
          <div className="flex items-center gap-1 border-l border-neutral-200 pl-1.5 dark:border-white/15 sm:pl-2">
            <button
              type="button"
              onClick={() => setLocale('es')}
              className={localePillClass(locale === 'es')}
              aria-pressed={locale === 'es'}
              aria-label="Español"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={localePillClass(locale === 'en')}
              aria-pressed={locale === 'en'}
              aria-label="English"
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="ml-0.5 text-neutral-800 dark:text-neutral-200"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-neutral-100 px-3 py-3 sm:px-6 sm:py-4 dark:border-white/10 md:hidden">
          <a
            href="#about"
            className="block py-2 text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
            onClick={handleNavClick}
          >
            {t('nav.about')}
          </a>
          <a
            href="#contact"
            className="block py-2 text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
            onClick={handleNavClick}
          >
            {t('nav.contact')}
          </a>
          <a
            href="#works"
            className="block py-2 text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
            onClick={handleNavClick}
          >
            {t('nav.works')}
          </a>
        </nav>
      )}
    </header>
  );
}
