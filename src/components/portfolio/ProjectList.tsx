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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map((project) => (
        <article
          key={project.id}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-6">
            <h4 className="text-2xl font-bold text-black mb-2">{project.title}</h4>
            <p className="text-sm md:text-base text-gray-500 mb-3">{project.subtitle}</p>
            <p className="text-gray-600 mb-5 leading-relaxed">{project.description}</p>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => onSeeMore(project)}
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              See more
              <ChevronRight size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
