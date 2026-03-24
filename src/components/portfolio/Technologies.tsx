'use client';

import Image from 'next/image';
import { technologies } from '@/constants/technologies';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef } from 'react';

const SPIN_SPEED_RAD_S = 0.525;
/** Escala visual de cada ítem del carrusel respecto al diseño base */
const ITEM_SCALE = 1.5;
/** Altura del área 3D (menor = menos hueco vacío bajo el carrusel hacia Works) */
const CAROUSEL_VIEWPORT_MIN_REM = 8.5;
const CAROUSEL_VIEWPORT_PREFERRED_VW = 38;
const CAROUSEL_VIEWPORT_MAX_REM = 19;

function techImageSrc(tech: (typeof technologies)[number]) {
  return `/images/${tech.name.toLowerCase()}.${tech.imageExt ?? 'png'}`;
}

function TechItem({ tech }: { tech: (typeof technologies)[number] }) {
  return (
    <div
      className="pointer-events-none flex flex-col items-center"
      style={{ width: `${7 * ITEM_SCALE}rem`, gap: `${0.75 * ITEM_SCALE}rem` }}
    >
      <div
        className="relative flex flex-shrink-0 items-center justify-center"
        style={{ width: `${3 * ITEM_SCALE}rem`, height: `${3 * ITEM_SCALE}rem` }}
      >
        <Image
          src={techImageSrc(tech)}
          alt={tech.name}
          width={Math.round(48 * ITEM_SCALE)}
          height={Math.round(48 * ITEM_SCALE)}
          className="h-full w-full object-contain"
        />
      </div>
      <h3
        className="text-center font-semibold leading-tight text-black dark:text-neutral-100"
        style={{
          maxWidth: `${6.5 * ITEM_SCALE}rem`,
          fontSize: `${0.875 * ITEM_SCALE}rem`,
        }}
      >
        {tech.name}
      </h3>
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
  }, [n]);

  return (
    <section
      id="technologies"
      className="flex flex-col gap-6 overflow-x-clip px-4 pt-6 pb-0 sm:gap-8 sm:px-6 sm:pt-8 sm:pb-0 md:gap-10 md:pt-10 md:pb-0"
    >
      <div className="container mx-auto max-w-6xl px-0">
        <h2 className="text-center text-2xl font-bold text-black dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
          {t('technologies.title')}
        </h2>
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
          style={{
            height: `clamp(${CAROUSEL_VIEWPORT_MIN_REM * ITEM_SCALE}rem, ${CAROUSEL_VIEWPORT_PREFERRED_VW * ITEM_SCALE}vw, ${CAROUSEL_VIEWPORT_MAX_REM * ITEM_SCALE}rem)`,
          }}
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
                  width: `${7 * ITEM_SCALE}rem`,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                }}
              >
                <TechItem tech={tech} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
