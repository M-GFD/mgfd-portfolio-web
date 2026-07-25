'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MorphingText } from '@/components/ui/morphing-text';
import { PulsatingButton } from '@/components/ui/pulsating-button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  HERO_INTRO_COMPLETE_EVENT,
  hasHeroIntroCompleted,
  notifyHeroIntroComplete,
} from '@/lib/depth-stack';
import { scrollToSectionByHash } from '@/lib/section-scroll';

const CTA_AFTER_SUBTITLE_MS = 1100;
const MOBILE_REVEAL_MS = 700;

export default function Hero() {
  const { t, locale } = useLanguage();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const revealedRef = useRef(false);

  const morphTexts = useMemo(
    () =>
      t('hero.subtitle')
        .split('|')
        .map((part) => part.trim())
        .filter(Boolean),
    [t, locale],
  );

  useEffect(() => {
    let cancelled = false;
    let ctaTimer: number | undefined;
    let mobileTimer: number | undefined;
    let gateObserver: MutationObserver | undefined;

    const revealSequence = () => {
      if (cancelled || revealedRef.current) return;
      revealedRef.current = true;
      setShowSubtitle(true);
      ctaTimer = window.setTimeout(() => {
        if (!cancelled) setShowCta(true);
      }, CTA_AFTER_SUBTITLE_MS);
    };

    const onIntroComplete = () => revealSequence();
    window.addEventListener(HERO_INTRO_COMPLETE_EVENT, onIntroComplete);

    if (hasHeroIntroCompleted()) {
      revealSequence();
    } else if (!window.matchMedia('(min-width: 1024px)').matches) {
      const startMobileReveal = () => {
        if (cancelled || document.querySelector('[data-experience-gate]')) {
          return;
        }
        notifyHeroIntroComplete();
      };

      const armMobileReveal = () => {
        window.clearTimeout(mobileTimer);
        mobileTimer = window.setTimeout(startMobileReveal, MOBILE_REVEAL_MS);
      };

      if (document.querySelector('[data-experience-gate]')) {
        gateObserver = new MutationObserver(() => {
          if (!document.querySelector('[data-experience-gate]')) {
            gateObserver?.disconnect();
            armMobileReveal();
          }
        });
        gateObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      } else {
        armMobileReveal();
      }
    }

    return () => {
      cancelled = true;
      gateObserver?.disconnect();
      window.removeEventListener(HERO_INTRO_COMPLETE_EVENT, onIntroComplete);
      window.clearTimeout(ctaTimer);
      window.clearTimeout(mobileTimer);
    };
  }, []);

  return (
    <section
      id="hero"
      className="snap-section flex min-h-dvh w-full flex-col pt-[calc(5.5rem+env(safe-area-inset-top))] lg:min-h-full"
    >
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-14 sm:px-6 md:pb-16">
        <div className="mx-auto w-full max-w-7xl text-center">
          <div className="relative mx-auto mb-5 w-full max-w-4xl sm:mb-6">
            <img
              src="/images/title-image.svg"
              alt="Mateo G. Fontana Dalmasso (MGFD) — logotipo del portfolio"
              className="h-auto w-full object-contain invert brightness-0 contrast-200"
            />
          </div>

          <div
            className={`mx-auto mb-6 w-full max-w-3xl transition-opacity duration-700 sm:mb-8 ${
              showSubtitle ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!showSubtitle}
          >
            {showSubtitle ? (
              <MorphingText
                texts={morphTexts}
                className="h-8 max-w-full text-[clamp(0.7rem,2.4vw,1.35rem)] font-semibold tracking-tight text-neutral-300 [text-shadow:0_1px_3px_rgba(0,0,0,0.75)] md:h-10 md:text-xl lg:h-12 lg:text-2xl"
              />
            ) : null}
          </div>

          <div
            className={`transition-opacity duration-700 ${
              showCta ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!showCta}
          >
            {showCta ? (
              <PulsatingButton
                type="button"
                pulseColor="rgba(255,255,255,0.55)"
                duration="1.6s"
                distance="10px"
                className="mx-auto bg-white px-5 py-2.5 text-sm font-medium text-black shadow-sm shadow-black/30 hover:bg-neutral-200 sm:px-8 sm:py-3 sm:text-base"
                onClick={() => {
                  void scrollToSectionByHash('#works');
                }}
              >
                {t('hero.cta')}
              </PulsatingButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
