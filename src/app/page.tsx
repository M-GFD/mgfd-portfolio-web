'use client';

import { useMemo } from 'react';
import Header from '@/components/portfolio/Header';
import Hero from '@/components/portfolio/Hero';
import Profile from '@/components/portfolio/Profile';
import Technologies from '@/components/portfolio/Technologies';
import ProjectList from '@/components/portfolio/ProjectList';
import Footer from '@/components/portfolio/Footer';
import { SnapSection } from '@/components/layout/SnapSection';
import { projects } from '@/data/projects';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  const projectsWithLocale = useMemo(
    () =>
      projects.map((p) => ({
        ...p,
        title: t(`projectsList.${p.id}.title`),
        subtitle: t(`projectsList.${p.id}.subtitle`),
        description: t(`projectsList.${p.id}.description`),
        fullDescription: t(`projectsList.${p.id}.fullDescription`),
      })),
    [t]
  );

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="relative z-0 flex min-h-0 flex-1 flex-col">
        <h1 className="sr-only">
          Portfolio web Mateo G. Fontana Dalmasso (MGFD)
        </h1>

        <Hero />

        <Profile />

        <Technologies />

        <SnapSection
          id="works"
          long
          className="flex flex-col px-4 pb-14 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-6 sm:pb-20 sm:pt-8 md:pb-28 md:pt-10"
        >
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-6 text-center text-2xl font-bold text-white sm:mb-8 sm:text-3xl md:mb-10 md:text-4xl lg:text-5xl">
              {t('projects.sectionTitle')}
            </h2>
            <ProjectList projects={projectsWithLocale} loading={false} />
            <div className="mt-10 flex justify-center sm:mt-14">
              <a
                href="mailto:mgfd.design@gmail.com"
                className="inline-flex w-auto items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black shadow-sm shadow-black/40 transition-colors hover:bg-neutral-200 sm:px-8 sm:py-3 sm:text-base"
              >
                {t('projects.cta')}
              </a>
            </div>
          </div>
        </SnapSection>
      </main>

      <Footer />
    </div>
  );
}
