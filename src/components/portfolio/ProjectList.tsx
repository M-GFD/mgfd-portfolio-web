'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Project } from '@/types/portfolio';

interface ProjectListProps {
  onSeeMore: (project: Project) => void;
}

export default function ProjectList({ onSeeMore }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {projects.map((project, index) => (
        <div
          key={project.id}
          id={`project-${project.id}`}
          className={`grid md:grid-cols-2 gap-8 items-center ${
            project.reversed ? 'md:grid-flow-col-dense' : ''
          }`}
        >
          {/* Image placeholder */}
          <div
            className={`aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center ${
              project.reversed ? 'md:order-2' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-2">📱</div>
              <p className="text-gray-600 font-medium">{project.title}</p>
            </div>
          </div>

          {/* Project Content */}
          <div
            className={`space-y-4 ${project.reversed ? 'md:order-1' : ''}`}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-black">
              {project.title}
            </h3>
            <p className="text-xl text-gray-500">{project.subtitle}</p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {project.description}
            </p>
            <button
              onClick={() => onSeeMore(project)}
              className="inline-flex items-center gap-2 text-black font-medium hover:text-gray-700 transition-colors group"
            >
              See More
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}