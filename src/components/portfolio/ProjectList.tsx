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
    [count],
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
      portalTarget,
    );

  return (
    <>
      <div className="works-carousel__card-viewport relative aspect-video w-full">
        <button
          type="button"
          onClick={openLightbox}
          className="group absolute inset-0 z-[1] cursor-zoom-in rounded-none border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          aria-label={expandAriaLabel}
        />
        <img
          src={images[index]}
          alt={count === 1 ? title : `${title} — ${index + 1}/${count}`}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center select-none"
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
          className="relative z-[2] mt-2 flex flex-shrink-0 flex-wrap justify-center gap-1.5"
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
      {lightbox}
    </>
  );
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** Duración del relleno del dot activo antes de avanzar a la siguiente card. */
const DOT_TIMER_MS = 5500;

export default function ProjectList({ projects, loading }: ProjectListProps) {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotProgress, setDotProgress] = useState(0);
  const depthRafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const animRafRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const activeIndexRef = useRef(0);
  const projectsLenRef = useRef(projects.length);
  const timerPausedRef = useRef(false);
  const timerProgressRef = useRef(0);
  const timerLastTsRef = useRef<number | null>(null);
  const timerRafRef = useRef<number | null>(null);
  const goToNextSlideRef = useRef<() => void>(() => {});

  activeIndexRef.current = activeIndex;
  projectsLenRef.current = projects.length;

  const isInteractiveDragTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest('a, button, input, textarea, select, label'));
  };

  const getSnapOffset = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return 0;

    const trackCenter = track.clientWidth / 2;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    return trackCenter - slideCenter;
  }, []);

  const applyRowOffset = useCallback((offset: number) => {
    offsetRef.current = offset;
    if (rowRef.current) {
      rowRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
  }, []);

  const updateSlideDepth = useCallback(() => {
    depthRafRef.current = null;

    const trackEl = trackRef.current;
    const items = slideRefs.current.filter(Boolean) as HTMLElement[];
    if (!trackEl || items.length === 0) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

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

      if (reducedMotion) {
        slide.style.transform = '';
        slide.style.opacity = '1';
        slide.style.zIndex = '';
        continue;
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
  }, []);

  const scheduleDepthUpdate = useCallback(() => {
    if (depthRafRef.current != null) return;
    depthRafRef.current = requestAnimationFrame(updateSlideDepth);
  }, [updateSlideDepth]);

  const findNearestSnapIndex = useCallback(() => {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < slideRefs.current.length; i++) {
      const snapOffset = getSnapOffset(i);
      const distance = Math.abs(offsetRef.current - snapOffset);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }

    return bestIndex;
  }, [getSnapOffset]);

  const animateToOffset = useCallback(
    (targetOffset: number, durationMs = 420) => {
      if (animRafRef.current != null) {
        cancelAnimationFrame(animRafRef.current);
        animRafRef.current = null;
      }

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (reducedMotion || durationMs <= 0) {
        applyRowOffset(targetOffset);
        scheduleDepthUpdate();
        return;
      }

      const startOffset = offsetRef.current;
      const distance = targetOffset - startOffset;
      if (Math.abs(distance) < 0.5) {
        applyRowOffset(targetOffset);
        scheduleDepthUpdate();
        return;
      }

      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        applyRowOffset(startOffset + distance * easeOutCubic(t));
        scheduleDepthUpdate();

        if (t < 1) {
          animRafRef.current = requestAnimationFrame(step);
        } else {
          animRafRef.current = null;
        }
      };

      animRafRef.current = requestAnimationFrame(step);
    },
    [applyRowOffset, scheduleDepthUpdate],
  );

  const snapToIndex = useCallback(
    (index: number, durationMs = 420) => {
      const clamped = Math.max(
        0,
        Math.min(index, Math.max(0, projectsLenRef.current - 1)),
      );
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      animateToOffset(getSnapOffset(clamped), durationMs);
    },
    [animateToOffset, getSnapOffset],
  );

  const snapToNearest = useCallback(() => {
    const nearest = findNearestSnapIndex();
    snapToIndex(nearest);
  }, [findNearestSnapIndex, snapToIndex]);

  const setTimerPaused = useCallback((paused: boolean) => {
    timerPausedRef.current = paused;
    if (paused) {
      timerLastTsRef.current = null;
    }
  }, []);

  const restartDotTimer = useCallback(() => {
    timerProgressRef.current = 0;
    timerLastTsRef.current = null;
    setDotProgress(0);
  }, []);

  const goToNextSlide = useCallback(() => {
    const len = projectsLenRef.current;
    if (len < 2) return;
    const next = (activeIndexRef.current + 1) % len;
    restartDotTimer();
    snapToIndex(next);
  }, [restartDotTimer, snapToIndex]);

  goToNextSlideRef.current = goToNextSlide;

  useEffect(() => {
    if (loading || projects.length < 2) return;

    const tick = (now: number) => {
      if (!timerPausedRef.current && document.visibilityState === 'visible') {
        if (timerLastTsRef.current == null) {
          timerLastTsRef.current = now;
        } else {
          const delta = now - timerLastTsRef.current;
          timerLastTsRef.current = now;
          const nextProgress = Math.min(
            1,
            timerProgressRef.current + delta / DOT_TIMER_MS,
          );
          timerProgressRef.current = nextProgress;
          setDotProgress(nextProgress);

          if (nextProgress >= 1) {
            // Evita reentradas en el mismo frame tras completar el ciclo.
            timerProgressRef.current = 0;
            timerLastTsRef.current = null;
            setDotProgress(0);
            goToNextSlideRef.current();
          }
        }
      } else {
        timerLastTsRef.current = null;
      }

      timerRafRef.current = requestAnimationFrame(tick);
    };

    timerRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (timerRafRef.current != null) {
        cancelAnimationFrame(timerRafRef.current);
        timerRafRef.current = null;
      }
    };
  }, [loading, projects.length]);

  useEffect(() => {
    const onVisibility = () => {
      setTimerPaused(
        document.visibilityState !== 'visible' || isDraggingRef.current,
      );
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [setTimerPaused]);

  useEffect(() => {
    restartDotTimer();
  }, [activeIndex, restartDotTimer]);

  useEffect(() => {
    const syncLayout = () => {
      snapToIndex(findNearestSnapIndex(), 0);
      scheduleDepthUpdate();
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(syncLayout);
    });
    window.addEventListener('resize', syncLayout);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', syncLayout);
    };
  }, [
    projects.length,
    loading,
    snapToIndex,
    findNearestSnapIndex,
    scheduleDepthUpdate,
  ]);

  useEffect(() => {
    scheduleDepthUpdate();
    return () => {
      if (depthRafRef.current != null) {
        cancelAnimationFrame(depthRafRef.current);
      }
      if (animRafRef.current != null) {
        cancelAnimationFrame(animRafRef.current);
      }
    };
  }, [scheduleDepthUpdate]);

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isInteractiveDragTarget(e.target)) return;

    const scene = sceneRef.current;
    if (!scene) return;

    if (animRafRef.current != null) {
      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = null;
    }

    isDraggingRef.current = true;
    setTimerPaused(true);
    dragPointerIdRef.current = e.pointerId;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    scene.classList.add('is-dragging');
    scene.setPointerCapture(e.pointerId);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      !isDraggingRef.current ||
      dragPointerIdRef.current !== e.pointerId
    ) {
      return;
    }

    const dx = e.clientX - dragStartXRef.current;
    applyRowOffset(dragStartOffsetRef.current + dx);
    scheduleDepthUpdate();
  };

  const endTrackDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || dragPointerIdRef.current !== e.pointerId) {
      return;
    }

    isDraggingRef.current = false;
    dragPointerIdRef.current = null;
    sceneRef.current?.classList.remove('is-dragging');

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // iOS a veces ya liberó la captura
    }

    snapToNearest();
    setTimerPaused(document.visibilityState !== 'visible');
    restartDotTimer();
  };

  const scrollToSlide = (index: number) => {
    snapToIndex(index);
    restartDotTimer();
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
      className="works-carousel flex flex-col"
      aria-label={t('projects.sectionTitle')}
    >
      <div
        ref={sceneRef}
        className="works-carousel__scene"
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={endTrackDrag}
        onPointerCancel={endTrackDrag}
        onLostPointerCapture={endTrackDrag}
      >
        <div ref={trackRef} className="works-carousel__track">
          <div ref={rowRef} className="works-carousel__row">
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
                  className="works-carousel__slide"
                >
                  <div className="works-carousel__slide-inner glass-card">
                    <div className="works-carousel__card-media glass-card__media p-2 sm:p-3">
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
                      <p className="mb-1.5 text-xs text-neutral-400 sm:text-sm">
                        {project.subtitle}
                      </p>
                      <p className="text-xs leading-relaxed text-neutral-300 sm:text-sm">
                        {project.description}
                      </p>
                      {project.websiteUrl && (
                        <a
                          href={project.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block break-all text-xs text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-neutral-200 hover:decoration-white/70 sm:text-sm"
                        >
                          {project.websiteUrl}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {projects.length > 1 && (
        <div
          className="works-carousel__dots"
          role="tablist"
          aria-label={t('projects.sectionTitle')}
        >
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`${project.title} (${index + 1}/${projects.length})`}
                onClick={() => scrollToSlide(index)}
                className={cn(
                  'works-carousel__dot',
                  isActive && 'works-carousel__dot--active',
                )}
              >
                {isActive && (
                  <span
                    className="works-carousel__dot-fill"
                    style={{ transform: `scaleX(${dotProgress})` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
