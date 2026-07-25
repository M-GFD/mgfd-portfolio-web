'use client';

import { useEffect, useMemo, useState } from 'react';
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
import {
  CircularScrollOrbit,
  OrbitPanel,
} from '@/components/layout/CircularScrollOrbit';
import { projects } from '@/data/projects';
import { useLanguage } from '@/contexts/LanguageContext';

const DESKTOP_MQ = '(min-width: 1024px)';

export default function HomePage() {
  const { t } = useLanguage();
  /** null = aún no hidratado: no montar secciones (evita flash de todas a la vez). */
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

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

  const worksBlock = (
    <section
      id="works"
      className="scroll-mt-[calc(5.5rem+env(safe-area-inset-top))] pt-2 sm:pt-4 lg:flex lg:h-full lg:min-h-0 lg:w-full lg:max-w-full lg:flex-col lg:justify-center lg:overflow-hidden lg:px-0"
    >
      <div className="container mx-auto max-w-6xl px-4 pb-2 text-center sm:px-6 sm:pb-3 lg:shrink-0 lg:pb-1">
        <h2 className="mb-4 text-2xl font-bold text-white sm:mb-5 sm:text-3xl md:text-4xl lg:mb-3">
          {t('projects.sectionTitle')}
        </h2>
      </div>

      <div className="lg:flex lg:min-h-0 lg:w-full lg:max-w-full lg:flex-1 lg:flex-col lg:justify-center">
        <ProjectList projects={projectsWithLocale} loading={false} />

        <div className="container mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:shrink-0 lg:pt-4">
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
  );

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="relative z-0 flex min-h-0 flex-1 flex-col">
        <h1 className="sr-only">
          Portfolio web Mateo G. Fontana Dalmasso (MGFD)
        </h1>

        {isDesktop === null && (
          <div
            className="min-h-dvh w-full"
            aria-busy="true"
            aria-label="Cargando"
          />
        )}

        {isDesktop === false && (
          <CircularScrollOrbit className="flex min-h-0 flex-1 flex-col">
            <OrbitPanel>
              <Hero />
            </OrbitPanel>

            <OrbitPanel>
              <Profile />
            </OrbitPanel>

            <OrbitPanel>
              <Technologies />
            </OrbitPanel>

            <OrbitPanel intensity="soft">
              {worksBlock}
              <Footer />
            </OrbitPanel>
          </CircularScrollOrbit>
        )}

        {isDesktop === true && (
          <>
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

              <ScrollChapter>{worksBlock}</ScrollChapter>
            </PremiumScrollJourney>
            <Footer fixed />
          </>
        )}
      </main>
    </div>
  );
}
