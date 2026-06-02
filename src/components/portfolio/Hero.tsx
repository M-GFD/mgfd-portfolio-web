'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section
      id="hero"
      className="snap-section flex min-h-dvh flex-col pt-[calc(5.5rem+env(safe-area-inset-top))]"
    >
      {/* Primera vista: sólo SVG + tagline + CTA, centrados; el resto de la página queda tras scroll */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-14 sm:px-6 md:pb-16">
        <div className="mx-auto w-full max-w-7xl text-center">
          <div className="relative mx-auto mb-5 w-full max-w-4xl sm:mb-6">
            <img
              src="/images/title-image.svg"
              alt="Mateo G. Fontana Dalmasso (MGFD) — logotipo del portfolio"
              className="h-auto w-full object-contain invert brightness-0 contrast-200"
            />
          </div>
          <p className="mx-auto mb-6 max-w-2xl px-1 text-[calc(1rem-3pt)] leading-snug tracking-tight text-neutral-300 [text-shadow:0_1px_3px_rgba(0,0,0,0.75)] sm:mb-8 sm:text-lg sm:leading-relaxed sm:tracking-normal md:text-xl">
            {t('hero.subtitle')}
          </p>
          <a
            href="#works"
            className="mx-auto inline-flex w-auto items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black shadow-sm shadow-black/30 transition-colors hover:bg-neutral-200 sm:px-8 sm:py-3 sm:text-base"
          >
            {t('hero.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}