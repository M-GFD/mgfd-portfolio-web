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
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          {t('hero.subtitle')}
        </p>
        <a
          href="mailto:mgfd.design@gmail.com"
          className="inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {t('hero.cta')}
        </a>
      </div>
    </section>
  );
}