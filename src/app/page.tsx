'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/portfolio/Header';
import Hero from '@/components/portfolio/Hero';
import Profile from '@/components/portfolio/Profile';
import Technologies from '@/components/portfolio/Technologies';
import ProjectList from '@/components/portfolio/ProjectList';
import ProjectModal from '@/components/portfolio/ProjectModal';
import Footer from '@/components/portfolio/Footer';
import { Project } from '@/types/portfolio';
import { projects } from '@/data/projects';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const handleSeeMore = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex flex-1 flex-col gap-12 md:gap-16">
        <Hero />
        <Profile />
        <div className="flex flex-col gap-6 md:gap-8">
          <Technologies />
          <section
            id="works"
            className="bg-gradient-to-b from-gray-50 to-white px-6 pb-20 pt-0 md:pb-28"
          >
            <div className="container mx-auto max-w-6xl">
              <h2 className="mb-8 text-center text-4xl font-bold text-black md:mb-10 md:text-5xl">
                {t('projects.sectionTitle')}
              </h2>
              <ProjectList onSeeMore={handleSeeMore} projects={projectsWithLocale} loading={false} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </div>
  );
}