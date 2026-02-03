'use client';

import { useState } from 'react';
import Header from '@/components/portfolio/Header';
import Hero from '@/components/portfolio/Hero';
import Profile from '@/components/portfolio/Profile';
import Technologies from '@/components/portfolio/Technologies';
import ProjectList from '@/components/portfolio/ProjectList';
import ProjectModal from '@/components/portfolio/ProjectModal';
import Footer from '@/components/portfolio/Footer';
import { Project } from '@/types/portfolio';

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
        <section id="projects" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
                Projects
              </h2>
              <ProjectList onSeeMore={handleSeeMore} projects={[]} loading={false} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </div>
  );
}