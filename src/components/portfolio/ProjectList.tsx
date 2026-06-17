'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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
    queueMicrotask(() => {
      setPortalTarget(document.body);
    });
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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] sm:p-4"
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
          className="absolute right-[max(0.5rem,env(safe-area-inset-right))] top-[max(0.5rem,env(safe-area-inset-top))] z-[102] rounded-full bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25 sm:right-3 sm:top-3 sm:p-2"
          aria-label={closeAriaLabel}
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
        </button>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goLightbox(-1);
              }}
              className="absolute left-[max(0.25rem,env(safe-area-inset-left))] top-1/2 z-[102] -translate-y-1/2 rounded-full bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25 sm:left-2 sm:p-2 md:left-4"
              aria-label={prevLabel}
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goLightbox(1);
              }}
              className="absolute right-[max(0.25rem,env(safe-area-inset-right))] top-1/2 z-[102] -translate-y-1/2 rounded-full bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25 sm:right-2 sm:p-2 md:right-4"
              aria-label={nextLabel}
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden />
            </button>
          </>
        )}
        <img
          src={images[lightboxIndex]}
          alt={count === 1 ? title : `${title} — ${lightboxIndex + 1}/${count}`}
          className="max-h-[min(90vh,100dvh)] max-w-full object-contain sm:max-h-[90vh]"
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
                className="absolute left-0 top-1/2 z-[2] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35 sm:h-8 sm:w-8"
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
                className="absolute right-0 top-1/2 z-[2] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35 sm:h-8 sm:w-8"
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
                  i === index
                    ? 'w-4 bg-white'
                    : 'w-1.5 bg-white/35 hover:bg-white/55'
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
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const depthRafRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const slides = () =>
      slideRefs.current.filter(Boolean) as HTMLElement[];

    const updateSlideDepth = () => {
      depthRafRef.current = null;

      if (reducedMotion) return;

      const trackEl = trackRef.current;
      const items = slides();
      if (!trackEl || items.length === 0) return;

      const trackRect = trackEl.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      const falloff = Math.max(trackRect.width * 0.42, 1);

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < items.length; i++) {
        const slide = items[i];
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const offset = slideCenter - centerX;
        const distance = Math.abs(offset);
        const t = Math.min(1, distance / falloff);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }

        const rotateY = (offset / falloff) * -38;
        const translateZ = -t * 220;
        const scale = 1 - t * 0.14;
        const opacity = 1 - t * 0.72;

        slide.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
        slide.style.opacity = String(opacity);
        slide.style.zIndex = String(100 - Math.round(t * 90));
      }

      setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex));
    };

    const scheduleDepthUpdate = () => {
      if (depthRafRef.current != null) return;
      depthRafRef.current = requestAnimationFrame(updateSlideDepth);
    };

    scheduleDepthUpdate();
    track.addEventListener('scroll', scheduleDepthUpdate, { passive: true });
    window.addEventListener('resize', scheduleDepthUpdate, { passive: true });

    return () => {
      track.removeEventListener('scroll', scheduleDepthUpdate);
      window.removeEventListener('resize', scheduleDepthUpdate);
      if (depthRafRef.current != null) {
        cancelAnimationFrame(depthRafRef.current);
      }
    };
  }, [projects.length, loading]);

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div
      className="works-carousel flex h-full min-h-0 flex-col"
      aria-label={t('projects.sectionTitle')}
    >
      <div className="works-carousel__scene">
        <div ref={trackRef} className="works-carousel__track">
        {projects.map((project, index) => {
          const extra = project.galleryImages ?? [];
          const coverImages =
            extra.length > 0 ? [project.image, ...extra] : [project.image];

          return (
            <article
              key={project.id}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="works-carousel__slide glass-card"
            >
              <div className="works-carousel__card-media glass-card__media relative min-h-0 p-2 sm:p-3">
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

              <div className="works-carousel__card-body p-3 sm:p-4">
                <h4 className="mb-1 text-base font-bold text-white sm:text-lg">
                  {project.title}
                </h4>
                <p className="mb-1.5 line-clamp-1 text-xs text-neutral-400 sm:text-sm">
                  {project.subtitle}
                </p>
                <p className="line-clamp-2 text-xs leading-relaxed text-neutral-300 sm:text-sm">
                  {project.description}
                </p>
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block max-w-full truncate text-xs text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-neutral-200 hover:decoration-white/70 sm:text-sm"
                  >
                    {project.websiteUrl}
                  </a>
                )}
              </div>
            </article>
          );
        })}
        </div>
      </div>

      {projects.length > 1 && (
        <div
          className="works-carousel__dots"
          role="tablist"
          aria-label={t('projects.sectionTitle')}
        >
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${project.title} (${index + 1}/${projects.length})`}
              onClick={() => scrollToSlide(index)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 ease-out',
                index === activeIndex
                  ? 'w-7 bg-white'
                  : 'w-1.5 bg-white/35 hover:bg-white/55',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
