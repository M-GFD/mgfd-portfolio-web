'use client';

import { ChevronRight, Loader2 } from 'lucide-react';
import { Project } from '@/types/portfolio';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  onSeeMore: (project: Project) => void;
}

export default function ProjectList({ projects, loading, onSeeMore }: ProjectListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`flex flex-col ${project.reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}
        >
          {/* Project Image */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
              <img
                src={`/project-${project.id}.png`}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Project Info */}
          <div className="w-full md:w-1/2">
            <h4 className="text-3xl font-bold text-black mb-2">{project.title}</h4>
            <p className="text-lg text-gray-500 mb-4">{project.subtitle}</p>
            <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

            <button
              onClick={() => onSeeMore(project)}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              See more
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}