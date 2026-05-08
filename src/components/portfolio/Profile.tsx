'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="mb-10 px-4 py-10 sm:mb-12 sm:px-6 sm:py-12 md:mb-16 md:py-16"
    >
      <div className="w-full">
        <div className="flex flex-col items-center gap-8 sm:gap-10 md:flex-row md:items-start md:gap-12">
          <div className="flex h-44 w-44 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-white/12 sm:h-52 sm:w-52 md:h-72 md:w-72 lg:h-80 lg:w-80">
            <img
              src="/images/profile.png"
              alt="MGFD - Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <article
            className="glass-card min-w-0 w-full flex-1 p-5 text-left sm:p-7 sm:text-justify md:w-auto md:p-8 md:text-left"
            aria-labelledby="about-heading"
          >
            <h3
              id="about-heading"
              className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl md:text-4xl"
            >
              {t('about.title')}
            </h3>
            {(['p1', 'p2', 'p3', 'p4'] as const).map((key, i) => (
              <p
                key={key}
                className={`text-sm leading-relaxed text-neutral-300 sm:text-base ${
                  i < 3 ? 'mb-4 sm:mb-5' : ''
                }`}
              >
                {t(`about.${key}`)}
              </p>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}