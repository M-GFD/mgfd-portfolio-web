'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, Volume2, VolumeX, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExperience } from '@/contexts/ExperienceContext';
import { AudioWaveIndicator } from '@/components/portfolio/AudioWaveIndicator';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

/** Volver a `true` cuando el Blog deba mostrarse otra vez en el nav. */
const SHOW_BLOG_NAV = false;

const localePillClass = (active: boolean) =>
  `rounded px-2 py-1 text-sm font-medium transition-colors ${
    active
      ? 'bg-white/15 text-white'
      : 'text-neutral-400 hover:text-white'
  }`;

function MusicControls() {
  const { t } = useLanguage();
  const { hasEntered, musicEnabled, isPlaying, togglePlayback } = useExperience();

  if (!hasEntered || !musicEnabled) return null;

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => void togglePlayback()}
        className="text-neutral-400 transition-colors hover:text-white"
        aria-label={isPlaying ? t('experience.pauseMusic') : t('experience.playMusic')}
        aria-pressed={isPlaying}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5" aria-hidden />
        ) : (
          <VolumeX className="h-5 w-5" aria-hidden />
        )}
      </button>
      <AudioWaveIndicator active={isPlaying} />
    </div>
  );
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    let rafId: number | null = null;
    let pendingY = window.scrollY;

    const apply = () => {
      rafId = null;
      const y = pendingY;
      const prev = lastScrollYRef.current;
      const delta = y - prev;

      if (mobileMenuOpen || y < 24) {
        setHeaderHidden(false);
      } else if (delta > 10) {
        setHeaderHidden(true);
      } else if (delta < -10) {
        setHeaderHidden(false);
      }

      lastScrollYRef.current = y;
    };

    const onScroll = () => {
      pendingY = window.scrollY;
      if (rafId != null) return;
      rafId = requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [mobileMenuOpen]);

  const handleMenuToggle = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    if (newState) setHeaderHidden(false);
    onMenuToggle?.(newState);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    onMenuToggle?.(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[120] pt-[env(safe-area-inset-top)] transition-[transform,background-color] duration-300 ease-out',
        mobileMenuOpen
          ? 'bg-zinc-950/92 backdrop-blur-[12px] md:bg-transparent md:backdrop-blur-none'
          : 'bg-transparent',
        headerHidden && !mobileMenuOpen && '-translate-y-full',
      )}
    >
      <div className="flex w-full items-center justify-between px-3 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
        <div className="flex min-w-0 flex-1 items-center pr-2">
          <a href="/" className="flex min-w-0 items-center">
            <img
              src="/images/_mgfd_logo.svg"
              alt="Mateo G. Fontana Dalmasso (MGFD) — portfolio web"
              className="h-7 w-auto invert brightness-0 contrast-200 sm:h-8"
            />
          </a>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/#about"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            {t('nav.about')}
          </a>
          <a
            href="/#contact"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            {t('nav.contact')}
          </a>
          <a
            href="/#works"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            {t('nav.works')}
          </a>
          {SHOW_BLOG_NAV && (
            <a
              href="/blog"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              {t('nav.blog')}
            </a>
          )}
          <div className="flex items-center gap-3 border-l border-white/15 pl-6">
            <MusicControls />
            <div className="flex items-center gap-1">
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
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:hidden">
          <MusicControls />
          <div className="flex items-center gap-1 pl-1 sm:pl-2">
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
            className="ml-0.5 text-neutral-200"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-white/10 bg-transparent px-3 py-3 sm:px-6 sm:py-4 md:hidden">
          <a
            href="/#about"
            className="block py-2 text-neutral-400 transition-colors hover:text-white"
            onClick={handleNavClick}
          >
            {t('nav.about')}
          </a>
          <a
            href="/#contact"
            className="block py-2 text-neutral-400 transition-colors hover:text-white"
            onClick={handleNavClick}
          >
            {t('nav.contact')}
          </a>
          <a
            href="/#works"
            className="block py-2 text-neutral-400 transition-colors hover:text-white"
            onClick={handleNavClick}
          >
            {t('nav.works')}
          </a>
          {SHOW_BLOG_NAV && (
            <a
              href="/blog"
              className="block py-2 text-neutral-400 transition-colors hover:text-white"
              onClick={handleNavClick}
            >
              {t('nav.blog')}
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
