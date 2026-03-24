'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
}

/** Portada de la card: una imagen o carrusel (portada + galleryImages si existen). Clic en la imagen abre vista ampliada. */
function ProjectCoverMedia({
  images,
  title,
  dotsAriaLabel,
  prevLabel,
  nextLabel,
  expandAriaLabel,
  lightboxAriaLabel,
  closeAriaLabel,
}: {
  images: string[];
  title: string;
  dotsAriaLabel: string;
  prevLabel: string;
  nextLabel: string;
  expandAriaLabel: string;
  lightboxAriaLabel: string;
  closeAriaLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const lightboxIndexRef = useRef(0);

  const count = images.length;

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + count) % count);
  };

  const goLightbox = useCallback(
    (delta: number) => {
      setLightboxIndex((i) => {
        const next = (i + delta + count) % count;
        lightboxIndexRef.current = next;
        return next;
      });
    },
    [count]
  );

  const openLightbox = () => {
    setLightboxIndex(index);
    lightboxIndexRef.current = index;
    setLightboxOpen(true);
  };

  const closeLightboxAndSync = useCallback(() => {
    setIndex(lightboxIndexRef.current);
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightboxAndSync();
      if (count > 1 && e.key === 'ArrowLeft') goLightbox(-1);
      if (count > 1 && e.key === 'ArrowRight') goLightbox(1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, count, closeLightboxAndSync, goLightbox]);

  const lightbox =
    lightboxOpen &&
    portalTarget &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4"
        role="dialog"
        aria-modal="true"
        aria-label={lightboxAriaLabel}
        onClick={closeLightboxAndSync}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            closeLightboxAndSync();
          }}
          className="absolute right-3 top-3 z-[102] rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
          aria-label={closeAriaLabel}
        >
          <X className="h-6 w-6" aria-hidden />
        </button>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goLightbox(-1);
              }}
              className="absolute left-2 top-1/2 z-[102] -translate-y-1/2 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25 md:left-4"
              aria-label={prevLabel}
            >
              <ChevronLeft className="h-8 w-8" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goLightbox(1);
              }}
              className="absolute right-2 top-1/2 z-[102] -translate-y-1/2 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25 md:right-4"
              aria-label={nextLabel}
            >
              <ChevronRight className="h-8 w-8" aria-hidden />
            </button>
          </>
        )}
        <img
          src={images[lightboxIndex]}
          alt={count === 1 ? title : `${title} — ${lightboxIndex + 1}/${count}`}
          className="max-h-[90vh] max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {count > 1 && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/75">
            {lightboxIndex + 1} / {count}
          </span>
        )}
      </div>,
      portalTarget
    );

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <div className="relative min-h-0 flex-1">
          <button
            type="button"
            onClick={openLightbox}
            className="group absolute inset-0 z-[1] cursor-zoom-in rounded-none border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            aria-label={expandAriaLabel}
          />
          <img
            src={images[index]}
            alt={count === 1 ? title : `${title} — ${index + 1}/${count}`}
            className="pointer-events-none h-full w-full object-contain object-center select-none"
            loading={index === 0 ? 'lazy' : 'eager'}
            draggable={false}
          />
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-0 top-1/2 z-[2] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 dark:bg-white/20 dark:hover:bg-white/35"
                aria-label={prevLabel}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-0 top-1/2 z-[2] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 dark:bg-white/20 dark:hover:bg-white/35"
                aria-label={nextLabel}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </>
          )}
        </div>
        {count > 1 && (
          <div
            className="relative z-[2] flex flex-shrink-0 flex-wrap justify-center gap-1.5 pt-2"
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
      {lightbox}
    </>
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
                expandAriaLabel={t('projects.expandImageAria')}
                lightboxAriaLabel={t('projects.lightboxAria')}
                closeAriaLabel={t('projects.closeAria')}
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
