'use client';

import { useMemo } from 'react';
import Header from '@/components/portfolio/Header';
import Hero from '@/components/portfolio/Hero';
import Profile from '@/components/portfolio/Profile';
import Technologies from '@/components/portfolio/Technologies';
import ProjectList from '@/components/portfolio/ProjectList';
import Footer from '@/components/portfolio/Footer';
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
    [t],
  );

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="relative z-0 flex flex-1 flex-col">
        <h1 className="sr-only">Portfolio web Mateo G. Fontana Dalmasso (MGFD)</h1>

        <Hero />
        <Profile />
        <Technologies />

        <section id="works" className="section-rhythm scroll-mt-24">
          <div className="content-wrap text-center">
            <h2 className="text-lift text-3xl font-bold tracking-tight text-[var(--text-strong)] md:text-5xl">
              {t('projects.sectionTitle')}
            </h2>
          </div>

          <div className="mt-[var(--space-5)]">
            <ProjectList projects={projectsWithLocale} loading={false} />
          </div>

          <div className="content-wrap mt-[var(--space-5)] flex justify-center">
            <a href="mailto:mgfd.design@gmail.com" className="btn-primary">
              {t('projects.cta')}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
