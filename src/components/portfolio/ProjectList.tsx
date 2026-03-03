'use client';

import { ChevronRight, Loader2 } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  onSeeMore: (project: Project) => void;
}

export default function ProjectList({ projects, loading, onSeeMore }: ProjectListProps) {
  const { t } = useLanguage();

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
          className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10"
        >
          <div className="relative aspect-video bg-gradient-to-br from-gray-100/80 to-gray-200/80">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="px-4 pt-3 pb-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('projects.gallery')}</p>
              <button
                type="button"
                onClick={() => onSeeMore(project)}
                className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin hover:opacity-90 transition-opacity"
                aria-label={`${t('projects.galleryAria')} ${project.title}`}
              >
                {project.galleryImages.slice(0, 6).map((src, i) => (
                  <span key={i} className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-white/20 bg-gray-100/80">
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </span>
                ))}
                {project.galleryImages.length > 6 && (
                  <span className="flex-shrink-0 w-14 h-14 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                    +{project.galleryImages.length - 6}
                  </span>
                )}
              </button>
            </div>
          )}

          <div className="p-6">
            <h4 className="text-2xl font-bold text-black dark:text-white mb-2">{project.title}</h4>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-3">{project.subtitle}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">{project.description}</p>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-full text-xs border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => onSeeMore(project)}
              className="inline-flex items-center gap-2 bg-black/80 dark:bg-white/20 text-white px-5 py-2.5 rounded-lg hover:bg-black dark:hover:bg-white/30 transition-colors border border-white/20 backdrop-blur-sm"
            >
              {t('projects.seeMore')}
              <ChevronRight size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
