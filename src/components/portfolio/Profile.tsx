'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="mb-10 px-4 py-10 sm:mb-12 sm:px-6 sm:py-12 md:mb-16 md:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8 sm:gap-10 md:flex-row md:gap-12">
          <div className="flex h-44 w-44 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFFFFF] ring-1 ring-black/[0.08] dark:bg-[#000000] dark:ring-white/12 sm:h-52 sm:w-52 md:h-72 md:w-72 lg:h-80 lg:w-80">
            <img
              src="/images/profile.png"
              alt="MGFD - Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-left sm:text-justify md:text-left">
            <h3 className="mb-3 text-2xl font-bold text-black dark:text-white sm:mb-4 sm:text-3xl md:text-4xl">
              {t('about.title')}
            </h3>
            {(['p1', 'p2', 'p3', 'p4'] as const).map((key, i) => (
              <p
                key={key}
                className={`text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base ${
                  i < 3 ? 'mb-4 sm:mb-5' : ''
                }`}
              >
                {t(`about.${key}`)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}