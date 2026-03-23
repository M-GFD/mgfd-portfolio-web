'use client';

import Image from 'next/image';
import { technologies } from '@/constants/technologies';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef } from 'react';

const SPIN_SPEED_RAD_S = 0.525;

function techImageSrc(tech: (typeof technologies)[number]) {
  return `/images/${tech.name.toLowerCase()}.${tech.imageExt ?? 'png'}`;
}

function TechItem({ tech }: { tech: (typeof technologies)[number] }) {
  return (
    <div className="pointer-events-none flex w-[7rem] flex-col items-center gap-3">
      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
        <Image
          src={techImageSrc(tech)}
          alt={tech.name}
          width={48}
          height={48}
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="max-w-[6.5rem] text-center text-sm font-semibold leading-tight text-black">
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
  const radiusPxRef = useRef(260);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateRadius = () => {
      const w = el.getBoundingClientRect().width;
      radiusPxRef.current = Math.min(300, Math.max(140, w * 0.32));
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
    <section id="technologies" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-bold text-black md:text-5xl">
            {t('technologies.title')}
          </h2>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full py-6"
        style={{ perspective: 'min(1100px, 100vw)' }}
      >
        <div
          className="relative mx-auto w-full overflow-visible"
          style={{ height: 'min(380px, 52vw)' }}
        >
          <div
            className="absolute left-1/2 top-1/2"
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
                className="absolute left-1/2 top-1/2 w-[7rem]"
                style={{
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
