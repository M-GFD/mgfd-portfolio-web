'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/portfolio/ThemeToggle';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm dark:border-white/10 dark:bg-black/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              src="images/_mgfd_logo.svg"
              alt="mgfd design portfolio"
              className="h-8 w-auto dark:invert dark:brightness-0 dark:contrast-200"
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
              className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                locale === 'es'
                  ? 'bg-neutral-100 text-black dark:bg-white/15 dark:text-white'
                  : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
              aria-pressed={locale === 'es'}
              aria-label="Español"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                locale === 'en'
                  ? 'bg-neutral-100 text-black dark:bg-white/15 dark:text-white'
                  : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
              aria-pressed={locale === 'en'}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-neutral-800 dark:text-neutral-200"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-neutral-100 px-6 py-4 dark:border-white/10 md:hidden">
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
          <div className="mt-3 flex flex-col gap-2 border-t border-neutral-100 pt-3 dark:border-white/10">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Idioma / Language</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setLocale('es');
                  handleNavClick();
                }}
                className={`rounded px-3 py-1.5 text-sm font-medium ${
                  locale === 'es'
                    ? 'bg-neutral-100 text-black dark:bg-white/15 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocale('en');
                  handleNavClick();
                }}
                className={`rounded px-3 py-1.5 text-sm font-medium ${
                  locale === 'en'
                    ? 'bg-neutral-100 text-black dark:bg-white/15 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
