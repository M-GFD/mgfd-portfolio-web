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
          className="flex min-h-0 flex-col overflow-hidden pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-8"
        >
          <div className="container mx-auto max-w-6xl shrink-0 px-4 pb-2 sm:px-6 sm:pb-3">
            <h2 className="mb-4 text-center text-2xl font-bold text-white sm:mb-5 sm:text-3xl md:text-4xl">
              {t('projects.sectionTitle')}
            </h2>
          </div>

          <div className="min-h-0 flex-1">
            <ProjectList projects={projectsWithLocale} loading={false} />
          </div>

          <Footer embedded showCta />
        </SnapSection>
      </main>
    </div>
  );
}
