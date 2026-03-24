'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="mb-10 px-4 pb-0 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:mb-12 sm:px-6 sm:pt-28 md:mb-16 md:pt-28">
      <div className="mx-auto max-w-7xl text-center">
        <div className="relative mx-auto mb-5 w-full max-w-4xl sm:mb-6">
          <img
            src="/images/title-image.svg"
            alt="portfolio_mgfd_design"
            className="h-auto w-full object-contain dark:invert dark:brightness-0 dark:contrast-200"
          />
        </div>
        <p className="mx-auto mb-6 max-w-2xl px-1 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:mb-8 sm:text-lg md:text-xl">
          {t('hero.subtitle')}
        </p>
        <a
          href="mailto:mgfd.design@gmail.com"
          className="inline-flex w-full max-w-xs items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 sm:w-auto sm:max-w-none sm:px-8 sm:text-base dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {t('hero.cta')}
        </a>
      </div>
    </section>
  );
}