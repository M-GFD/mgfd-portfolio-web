'use client';

import { useMemo } from 'react';
import Header from '@/components/portfolio/Header';
import Hero from '@/components/portfolio/Hero';
import Profile from '@/components/portfolio/Profile';
import Technologies from '@/components/portfolio/Technologies';
import ProjectList from '@/components/portfolio/ProjectList';
import Footer from '@/components/portfolio/Footer';
import {
  PremiumScrollJourney,
  ScrollChapter,
} from '@/components/layout/PremiumScrollJourney';
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

        <PremiumScrollJourney>
          <ScrollChapter>
            <Hero />
          </ScrollChapter>

          <ScrollChapter>
            <Profile />
          </ScrollChapter>

          <ScrollChapter>
            <Technologies />
          </ScrollChapter>

          <ScrollChapter>
            <section
              id="works"
              className="scroll-mt-[calc(5.5rem+env(safe-area-inset-top))] flex h-full min-h-0 w-full max-w-full flex-col justify-center overflow-hidden px-0 pt-2 sm:pt-4"
            >
              <div className="container mx-auto w-full max-w-6xl shrink-0 px-4 pb-1 text-center sm:px-6 sm:pb-2">
                <h2 className="mb-2 text-2xl font-bold text-white sm:mb-3 sm:text-3xl md:text-4xl">
                  {t('projects.sectionTitle')}
                </h2>
              </div>

              <div className="flex min-h-0 w-full max-w-full flex-1 flex-col justify-center">
                <ProjectList projects={projectsWithLocale} loading={false} />

                <div className="container mx-auto max-w-6xl shrink-0 px-4 pt-3 sm:px-6 sm:pt-4">
                  <div className="flex justify-center">
                    <a
                      href="mailto:mgfd.design@gmail.com"
                      className="inline-flex w-auto items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-medium text-black shadow-sm shadow-black/40 transition-colors hover:bg-neutral-200 sm:px-7 sm:py-2.5"
                    >
                      {t('projects.cta')}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </ScrollChapter>
        </PremiumScrollJourney>
      </main>

      <Footer fixed />
    </div>
  );
}
