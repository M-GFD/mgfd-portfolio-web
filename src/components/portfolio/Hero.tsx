'use client';

import { useEffect, useMemo, useState } from 'react';
import { MorphingText } from '@/components/ui/morphing-text';
import { useLanguage } from '@/contexts/LanguageContext';
import { scrollToHash } from '@/lib/smooth-scroll';
import { cn } from '@/lib/utils';

const SUBTITLE_AFTER_TITLE_MS = 650;
const CTA_AFTER_SUBTITLE_MS = 900;

/** Espera a que se cierre el Experience Gate (si está abierto) antes de revelar el Hero. */
function whenGateClosed(cb: () => void): () => void {
  if (!document.querySelector('[data-experience-gate]')) {
    cb();
    return () => {};
  }
  const observer = new MutationObserver(() => {
    if (!document.querySelector('[data-experience-gate]')) {
      observer.disconnect();
      cb();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

export default function Hero() {
  const { t, locale } = useLanguage();
  const [stage, setStage] = useState(0); // 0 nada · 1 título · 2 subtítulo · 3 CTA

  const morphTexts = useMemo(
    () =>
      t('hero.subtitle')
        .split('|')
        .map((part) => part.trim())
        .filter(Boolean),
    [t, locale],
  );

  useEffect(() => {
    const timers: number[] = [];
    const stopWaiting = whenGateClosed(() => {
      setStage(1);
      timers.push(window.setTimeout(() => setStage(2), SUBTITLE_AFTER_TITLE_MS));
      timers.push(
        window.setTimeout(() => setStage(3), SUBTITLE_AFTER_TITLE_MS + CTA_AFTER_SUBTITLE_MS),
      );
    });
    return () => {
      stopWaiting();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const reveal = (visible: boolean) =>
    cn(
      'transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
      visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
    );

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh w-full flex-col pt-[calc(5.5rem+env(safe-area-inset-top))]"
    >
      <div className="content-wrap flex flex-1 flex-col items-center justify-center pb-[var(--space-6)] text-center">
        <div className={cn('relative mx-auto mb-[var(--space-3)] w-full max-w-4xl', reveal(stage >= 1))}>
          <img
            src="/images/title-image.svg"
            alt="Mateo G. Fontana Dalmasso (MGFD) — logotipo del portfolio"
            className="h-auto w-full object-contain invert brightness-0 contrast-200 [filter:invert(1)_brightness(2)_drop-shadow(0_10px_40px_rgb(0_0_0/0.55))]"
          />
        </div>

        <div
          className={cn('mx-auto mb-[var(--space-4)] w-full max-w-3xl', reveal(stage >= 2))}
          aria-hidden={stage < 2}
        >
          {stage >= 2 ? (
            <MorphingText
              texts={morphTexts}
              className="text-lift h-8 max-w-full text-[clamp(0.8rem,2.4vw,1.35rem)] font-semibold tracking-tight text-[var(--text-body)] md:h-10 md:text-xl lg:h-12 lg:text-2xl"
            />
          ) : null}
        </div>

        <div className={reveal(stage >= 3)} aria-hidden={stage < 3}>
          <button type="button" className="btn-primary" onClick={() => scrollToHash('#works')}>
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}
