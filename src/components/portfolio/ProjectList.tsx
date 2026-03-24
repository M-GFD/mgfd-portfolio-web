'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
}

/** Portada de la card: una imagen o carrusel (portada + galleryImages si existen). */
function ProjectCoverMedia({
  images,
  title,
  dotsAriaLabel,
  prevLabel,
  nextLabel,
}: {
  images: string[];
  title: string;
  dotsAriaLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = (delta: number) => {
    setIndex((i) => (i + delta + count) % count);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <img
          src={images[index]}
          alt={count === 1 ? title : `${title} — ${index + 1}/${count}`}
          className="h-full w-full object-contain object-center"
          loading={index === 0 ? 'lazy' : 'eager'}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 dark:bg-white/20 dark:hover:bg-white/35"
              aria-label={prevLabel}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 dark:bg-white/20 dark:hover:bg-white/35"
              aria-label={nextLabel}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div
          className="flex flex-shrink-0 flex-wrap justify-center gap-1.5 pt-2"
          role="tablist"
          aria-label={dotsAriaLabel}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1} / ${count}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/55'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectList({ projects, loading }: ProjectListProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {projects.map((project) => {
        const extra = project.galleryImages ?? [];
        const coverImages = extra.length > 0 ? [project.image, ...extra] : [project.image];

        return (
          <article
            key={project.id}
            className="overflow-hidden rounded-2xl border border-white/20 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-[#000000] dark:backdrop-blur-none"
          >
            <div className="relative aspect-video bg-[#000000] p-4 md:p-5">
              <ProjectCoverMedia
                images={coverImages}
                title={project.title}
                dotsAriaLabel={t('projects.gallery')}
                prevLabel={t('projects.previousAria')}
                nextLabel={t('projects.nextAria')}
              />
            </div>

            <div className="p-6">
              <h4 className="mb-2 text-2xl font-bold text-black dark:text-white">{project.title}</h4>
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 md:text-base">{project.subtitle}</p>
              <p className="mb-5 leading-relaxed text-gray-600 dark:text-gray-300">{project.description}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-white/20 bg-white/50 px-3 py-1 text-xs text-gray-700 dark:bg-white/10 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
