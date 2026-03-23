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
      <main className="flex-1">
        <Hero />
        <Profile />
        <Technologies />
        <section
          id="works"
          className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="mb-16 text-center text-4xl font-bold text-black md:text-5xl">
                {t('projects.sectionTitle')}
              </h2>
              <ProjectList onSeeMore={handleSeeMore} projects={projectsWithLocale} loading={false} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </div>
  );
}