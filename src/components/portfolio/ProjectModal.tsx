'use client';

import { X, ChevronRight } from 'lucide-react';
import { Project } from '@/types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold text-black dark:text-white">{project.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">{project.subtitle}</p>

        <div className="relative aspect-video bg-gray-100/80 dark:bg-gray-800/50 rounded-xl overflow-hidden mb-6 border border-white/20">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {project.fullDescription.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {project.sectionImages && project.sectionImages.length > 0 &&
          project.sectionImages.map((section, idx) => (
            <div key={idx} className="mt-8">
              <h4 className="text-lg font-semibold text-black dark:text-white mb-3">{section.sectionTitle}</h4>
              <div className="flex flex-wrap gap-4">
                {section.images.map((imgSrc, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-white/20 aspect-video max-w-xs">
                    <img src={imgSrc} alt={`${section.sectionTitle} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}

        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-black dark:text-white mb-3">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-white/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-black dark:text-white mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-black/80 dark:bg-white/20 text-white rounded-full text-sm border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-8 inline-flex items-center gap-2 bg-black/80 dark:bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-black dark:hover:bg-white/30 transition-colors border border-white/20 backdrop-blur-sm"
        >
          Close
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}