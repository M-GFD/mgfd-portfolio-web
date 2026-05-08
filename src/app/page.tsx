'use client';

import { useMemo } from 'react';
import Header from '@/components/portfolio/Header';
import Hero from '@/components/portfolio/Hero';
import Profile from '@/components/portfolio/Profile';
import Technologies from '@/components/portfolio/Technologies';
import ProjectList from '@/components/portfolio/ProjectList';
import Footer from '@/components/portfolio/Footer';
import {
  ParallaxLayer,
  ParallaxRoot,
} from '@/components/layout/ParallaxShell';
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
    <ParallaxRoot>
      <div className="relative z-0 flex min-h-screen flex-col bg-transparent">
        <Header />
        <main className="relative z-0 flex flex-1 flex-col">
          <h1 className="sr-only">
            Portfolio web Mateo G. Fontana Dalmasso (MGFD)
          </h1>
          <ParallaxLayer depth="front">
            <Hero />
          </ParallaxLayer>
          <ParallaxLayer depth="shallow">
            <Profile />
            <Technologies />
          </ParallaxLayer>
          <ParallaxLayer depth="mid">
            <section
              id="works"
              className="px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-8 md:pb-28 md:pt-10"
            >
              <div className="container mx-auto max-w-6xl">
                <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:mb-8 sm:text-3xl md:mb-10 md:text-4xl lg:text-5xl">
                  {t('projects.sectionTitle')}
                </h2>
                <ProjectList projects={projectsWithLocale} loading={false} />
                <div className="mt-10 flex justify-center sm:mt-14">
                  <a
                    href="mailto:mgfd.design@gmail.com"
                    className="inline-flex w-auto items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-black/20 transition-colors hover:bg-neutral-800 sm:px-8 sm:py-3 sm:text-base dark:bg-white dark:text-black dark:shadow-black/40 dark:hover:bg-neutral-200"
                  >
                    {t('projects.cta')}
                  </a>
                </div>
              </div>
            </section>
          </ParallaxLayer>
        </main>
        <ParallaxLayer depth="deep">
          <Footer />
        </ParallaxLayer>
      </div>
    </ParallaxRoot>
  );
}
