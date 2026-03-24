'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="mb-12 px-6 pb-0 pt-28 md:mb-16">
      <div className="max-w-7xl mx-auto text-center">
        <div className="relative w-full max-w-4xl mx-auto mb-6">
          <img
            src="/images/title-image.svg"
            alt="portfolio_mgfd_design"
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-neutral-600 dark:text-neutral-400">
          {t('hero.subtitle')}
        </p>
        <a
          href="mailto:mgfd.design@gmail.com"
          className="inline-block rounded-lg bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {t('hero.cta')}
        </a>
      </div>
    </section>
  );
}