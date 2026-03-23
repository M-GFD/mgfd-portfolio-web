'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();
  return (
    <section id="about" className="bg-gray-50 px-6 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src="/images/profile.png"
              alt="MGFD - Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-justify md:text-left">
            <h3 className="text-4xl font-bold text-black mb-4">{t('about.title')}</h3>
            <p className="text-justify text-gray-600 mb-6">
              {t('about.p1')}
            </p>
            <p className="text-justify text-gray-600">
              {t('about.p2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}