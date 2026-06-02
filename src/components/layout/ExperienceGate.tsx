'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useExperience } from '@/contexts/ExperienceContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const FADE_MS = 1000;

const musicPillClass = (active: boolean) =>
  cn(
    'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:py-2.5 sm:text-base',
    active
      ? 'bg-white/15 text-white'
      : 'text-neutral-400 hover:text-white',
  );

export function ExperienceGate() {
  const { t } = useLanguage();
  const {
    showGate,
    isFadingOut,
    musicEnabled,
    setMusicEnabled,
    enterExperience,
    onGateFadeComplete,
    primeMedia,
  } = useExperience();

  const [reducedMotion, setReducedMotion] = useState(false);
  const didEnterRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isFadingOut) return;

    if (reducedMotion) {
      onGateFadeComplete();
      return;
    }

    const timer = window.setTimeout(onGateFadeComplete, FADE_MS);
    return () => window.clearTimeout(timer);
  }, [isFadingOut, reducedMotion, onGateFadeComplete]);

  const runEnter = useCallback(() => {
    if (didEnterRef.current || isFadingOut) return;
    didEnterRef.current = true;
    enterExperience();
  }, [enterExperience, isFadingOut]);

  if (!showGate) return null;

  const fadeClass = cn(
    !reducedMotion && 'transition-opacity ease-out',
    isFadingOut ? 'pointer-events-none opacity-0' : 'opacity-100',
  );

  const fadeStyle =
    isFadingOut && !reducedMotion
      ? { transitionDuration: `${FADE_MS}ms` }
      : undefined;

  return (
    <div
      data-experience-gate=""
      className={cn(
        'fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/95 px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur-sm',
        fadeClass,
      )}
      style={fadeStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-gate-title"
    >
      <div className="mx-auto w-full max-w-md text-center">
        <h2
          id="experience-gate-title"
          className="mb-8 text-xl font-bold tracking-tight text-white sm:mb-10 sm:text-2xl md:text-3xl"
        >
          {t('experience.title')}
        </h2>

        <div className="mb-8 sm:mb-10">
          <p className="mb-3 text-xs uppercase tracking-wider text-neutral-500 sm:text-sm">
            {t('experience.musicLabel')}
          </p>
          <div
            className="flex rounded-lg border border-white/10 bg-white/5 p-1"
            role="group"
            aria-label={t('experience.musicLabel')}
          >
            <button
              type="button"
              className={musicPillClass(!musicEnabled)}
              aria-pressed={!musicEnabled}
              onClick={() => setMusicEnabled(false)}
            >
              {t('experience.withoutMusic')}
            </button>
            <button
              type="button"
              className={musicPillClass(musicEnabled)}
              aria-pressed={musicEnabled}
              onClick={() => setMusicEnabled(true)}
            >
              {t('experience.withMusic')}
            </button>
          </div>
        </div>

        <button
          type="button"
          onPointerDown={(e) => {
            primeMedia();
            if (e.pointerType === 'touch' || e.pointerType === 'pen') {
              runEnter();
            }
          }}
          onClick={runEnter}
          disabled={isFadingOut}
          className="inline-flex w-full max-w-xs touch-manipulation items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-black shadow-sm shadow-black/40 transition-colors hover:bg-neutral-200 disabled:opacity-60 sm:text-base"
        >
          {t('experience.enter')}
        </button>
      </div>
    </div>
  );
}
