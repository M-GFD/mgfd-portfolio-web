'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="mb-12 bg-neutral-50 px-6 py-12 dark:bg-neutral-950 md:mb-16 md:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div className="flex h-64 w-64 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900 md:h-80 md:w-80">
            <img
              src="/images/profile.png"
              alt="MGFD - Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-justify md:text-left">
            <h3 className="mb-4 text-4xl font-bold text-black dark:text-white">{t('about.title')}</h3>
            <p className="mb-6 text-justify text-neutral-600 dark:text-neutral-400">
              {t('about.p1')}
            </p>
            <p className="text-justify text-neutral-600 dark:text-neutral-400">
              {t('about.p2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}