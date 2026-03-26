'use client';

import Image from 'next/image';
import {
  SELECTABLE_TECH_ORDER,
  technologies,
} from '@/constants/technologies';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { Technology } from '@/types/portfolio';
import { useEffect, useRef, useState } from 'react';

const SPIN_SPEED_RAD_S = 0.42;
/** Escala visual de cada ítem del carrusel respecto al diseño base */
const ITEM_SCALE = 1.5;
/** Altura del área 3D (menor = menos hueco vacío bajo el carrusel hacia Works) */
const CAROUSEL_VIEWPORT_MIN_REM = 8.5;
const CAROUSEL_VIEWPORT_PREFERRED_VW = 38;
const CAROUSEL_VIEWPORT_MAX_REM = 19;

const FADE_MS = 1000;
const SPOTLIGHT_MS = 7_000;

const ORDERED_DROPDOWN_TECH: Technology[] = SELECTABLE_TECH_ORDER.map((name) => {
  const tech = technologies.find((t) => t.name === name);
  if (!tech) {
    throw new Error(`Technology "${name}" falta en constants/technologies`);
  }
  return tech;
});

function techImageSrc(tech: Technology) {
  return `/images/${tech.name.toLowerCase()}.${tech.imageExt ?? 'png'}`;
}

function TechItem({ tech }: { tech: Technology }) {
  const side = `${3 * ITEM_SCALE}rem`;
  return (
    <div
      className="pointer-events-none flex items-center justify-center"
      style={{ width: side, height: side }}
    >
      <Image
        src={techImageSrc(tech)}
        alt={tech.name}
        width={Math.round(48 * ITEM_SCALE)}
        height={Math.round(48 * ITEM_SCALE)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default function Technologies() {
  const { t } = useLanguage();
  const n = technologies.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>(
    Array.from({ length: technologies.length }, () => null),
  );

  const spinRef = useRef(0);
  const radiusPxRef = useRef(260 * ITEM_SCALE);
  const [spotlight, setSpotlight] = useState<Technology | null>(null);
  const spotlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateRadius = () => {
      const w = el.getBoundingClientRect().width;
      radiusPxRef.current = Math.min(
        300 * ITEM_SCALE,
        Math.max(140 * ITEM_SCALE, w * 0.32 * ITEM_SCALE),
      );
    };

    const ro = new ResizeObserver(updateRadius);
    ro.observe(el);
    updateRadius();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (spotlightTimerRef.current) {
      clearTimeout(spotlightTimerRef.current);
      spotlightTimerRef.current = null;
    }
    if (!spotlight) return;

    spotlightTimerRef.current = setTimeout(() => {
      setSpotlight(null);
      spotlightTimerRef.current = null;
    }, SPOTLIGHT_MS);

    return () => {
      if (spotlightTimerRef.current) {
        clearTimeout(spotlightTimerRef.current);
        spotlightTimerRef.current = null;
      }
    };
  }, [spotlight]);

  useEffect(() => {
    if (spotlight) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064);
      last = now;

      spinRef.current += SPIN_SPEED_RAD_S * dt;
      const spin = spinRef.current;
      const radius = radiusPxRef.current;
      const spinDeg = spin * (180 / Math.PI);

      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const θ = (2 * Math.PI * i) / n;
        const rel = θ + spin;
        const c = Math.cos(rel);
        const opacity = Math.max(0, Math.min(1, (c + 1) / 2));
        const baseDeg = (360 / n) * i;
        const yawDeg = baseDeg + spinDeg;
        el.style.opacity = String(opacity);
        el.style.transform = `translate(-50%, -50%) rotateY(${yawDeg}deg) translateZ(${radius}px) rotateY(${-yawDeg}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n, spotlight]);

  const viewportHeight = `clamp(${CAROUSEL_VIEWPORT_MIN_REM * ITEM_SCALE}rem, ${CAROUSEL_VIEWPORT_PREFERRED_VW * ITEM_SCALE}vw, ${CAROUSEL_VIEWPORT_MAX_REM * ITEM_SCALE}rem)`;

  return (
    <section
      id="technologies"
      className="flex flex-col gap-6 overflow-x-clip px-4 pt-6 pb-0 sm:gap-8 sm:px-6 sm:pt-8 md:gap-10 md:pt-10"
    >
      <div className="container mx-auto max-w-6xl px-0">
        <h2 className="text-center text-2xl font-bold text-black dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
          {t('technologies.title')}
        </h2>
      </div>

      <div className="container mx-auto flex max-w-6xl justify-center px-0">
        <select
          id="technologies-select"
          aria-label={t('technologies.selectLabel')}
          value={spotlight?.name ?? ''}
          onChange={(e) => {
            const name = e.target.value;
            const tech = ORDERED_DROPDOWN_TECH.find((x) => x.name === name);
            if (tech) setSpotlight(tech);
          }}
          className="w-full max-w-[min(100%,18rem)] rounded-md border border-black/[0.12] bg-[#FFFFFF] px-2 py-1.5 text-xs text-black shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40 dark:border-white/15 dark:bg-[#000000] dark:text-white dark:focus-visible:outline-white/50 sm:w-auto sm:max-w-none sm:min-w-[15rem] sm:rounded-lg sm:px-3 sm:py-2.5 sm:text-sm md:min-w-[19rem] md:px-4 md:py-3 md:text-base lg:min-w-[21rem]"
        >
          <option value="">{t('technologies.selectLabel')}</option>
          {ORDERED_DROPDOWN_TECH.map((tech) => (
            <option key={tech.name} value={tech.name}>
              {tech.name}
            </option>
          ))}
        </select>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-full"
        style={{
          perspective: `min(${1100 * ITEM_SCALE}px, 100vw)`,
        }}
      >
        <div
          className="relative mx-auto w-full max-w-full origin-[50%_32%] scale-[0.62] overflow-visible min-[400px]:scale-[0.72] min-[480px]:scale-[0.8] sm:origin-[50%_36%] sm:scale-[0.88] md:origin-center md:scale-100"
          style={{ height: viewportHeight }}
        >
          <div
            className={cn(
              'absolute inset-0 transition-opacity ease-in-out',
              spotlight ? 'pointer-events-none opacity-0' : 'opacity-100',
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          >
            <div
              className="absolute left-1/2 top-20 -translate-x-1/2 min-[400px]:top-24 sm:top-28 md:top-32"
              style={{
                width: 0,
                height: 0,
                transformStyle: 'preserve-3d',
              }}
            >
              {technologies.map((tech, i) => (
                <div
                  key={tech.name}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: `${3 * ITEM_SCALE}rem`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                >
                  <TechItem tech={tech} />
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-opacity ease-in-out',
              spotlight ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={!spotlight}
          >
            {spotlight ? (
              <Image
                src={techImageSrc(spotlight)}
                alt={spotlight.name}
                width={192}
                height={192}
                className="h-28 w-28 object-contain sm:h-36 sm:w-36 md:h-44 md:w-44"
                priority
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
