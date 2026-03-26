'use client';

import Image from 'next/image';
import { technologies } from '@/constants/technologies';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Technology } from '@/types/portfolio';
import { useEffect, useRef, useState } from 'react';

const SPIN_SPEED_RAD_S = 0.42;
/** Pixels horizontales → radianes al arrastrar (menor = giro más suave) */
const DRAG_RAD_PER_PX = 0.0032;
/** Escala visual de cada ítem del carrusel respecto al diseño base */
const ITEM_SCALE = 1.5;

const FADE_MS = 1000;

function getFrontIndex(spin: number, n: number): number {
  let best = 0;
  let bestCos = -2;
  for (let i = 0; i < n; i++) {
    const θ = (2 * Math.PI * i) / n;
    const c = Math.cos(θ + spin);
    if (c > bestCos) {
      bestCos = c;
      best = i;
    }
  }
  return best;
}

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
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastFrontIdxRef = useRef(getFrontIndex(0, n));
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [displayName, setDisplayName] = useState(() => technologies[lastFrontIdxRef.current].name);
  const [nameOpacity, setNameOpacity] = useState(1);

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
    const queueLabelForIndex = (idx: number) => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      setNameOpacity(0);
      fadeTimeoutRef.current = setTimeout(() => {
        setDisplayName(technologies[idx].name);
        fadeTimeoutRef.current = null;
        requestAnimationFrame(() => setNameOpacity(1));
      }, FADE_MS / 2);
    };

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064);
      last = now;

      if (!isDraggingRef.current) {
        spinRef.current += SPIN_SPEED_RAD_S * dt;
      }

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

      const fi = getFrontIndex(spin, n);
      if (fi !== lastFrontIdxRef.current) {
        lastFrontIdxRef.current = fi;
        queueLabelForIndex(fi);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [n]);

  /** Móvil: menos alto y menos ancho visual; md+: valores anteriores */
  const carouselHeightClass =
    'max-md:h-[clamp(9.375rem,39vw,18rem)] md:h-[clamp(12.75rem,57vw,28.5rem)]';

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

      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-full max-md:max-w-[min(100%,18.5rem)] md:max-w-full"
        style={{
          perspective: `min(${1100 * ITEM_SCALE}px, 100vw)`,
        }}
      >
        <div
          className={`relative mx-auto w-full max-w-full origin-[50%_32%] scale-[0.50] overflow-visible min-[400px]:scale-[0.64] min-[480px]:scale-[0.76] sm:origin-[50%_36%] sm:scale-[0.88] md:origin-center md:scale-100 ${carouselHeightClass}`}
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            isDraggingRef.current = true;
            lastPointerXRef.current = e.clientX;
          }}
          onPointerMove={(e) => {
            if (!isDraggingRef.current) return;
            const dx = e.clientX - lastPointerXRef.current;
            lastPointerXRef.current = e.clientX;
            spinRef.current += dx * DRAG_RAD_PER_PX;
          }}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            isDraggingRef.current = false;
          }}
          onPointerCancel={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            isDraggingRef.current = false;
          }}
          className="cursor-grab active:cursor-grabbing select-none"
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

          <p
            className="pointer-events-none absolute bottom-1 left-0 right-0 text-center text-sm font-semibold text-black transition-opacity ease-in-out dark:text-white sm:bottom-2 sm:text-base md:text-lg"
            style={{
              transitionDuration: `${FADE_MS}ms`,
              opacity: nameOpacity,
            }}
            aria-live="polite"
          >
            {displayName}
          </p>
        </div>
      </div>
    </section>
  );
}
