'use client';

import Image from 'next/image';
import { technologies } from '@/constants/technologies';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef } from 'react';

const SCROLL_SPEED_PX_S = 140;

function techImageSrc(tech: (typeof technologies)[number]) {
  return `/images/${tech.name.toLowerCase()}.${tech.imageExt ?? 'png'}`;
}

function TechItem({ tech }: { tech: (typeof technologies)[number] }) {
  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-3 px-5">
      <div className="flex h-[5.25rem] w-[5.25rem] flex-shrink-0 items-center justify-center rounded-full bg-gray-50 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ring-1 ring-gray-200/90">
        <div className="relative h-12 w-12">
          <Image
            src={techImageSrc(tech)}
            alt={tech.name}
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <h3 className="max-w-[6.5rem] text-center text-sm font-semibold leading-tight text-black">
        {tech.name}
      </h3>
    </div>
  );
}

export default function Technologies() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const setEl = setRef.current;
    if (!setEl) return;

    const ro = new ResizeObserver(() => {
      setWidthRef.current = setEl.offsetWidth;
    });
    ro.observe(setEl);
    setWidthRef.current = setEl.offsetWidth;
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064);
      last = now;

      const W = setWidthRef.current;
      const track = trackRef.current;
      if (W > 0 && track) {
        offsetRef.current += velocityRef.current * dt;
        while (offsetRef.current >= W) offsetRef.current -= W;
        while (offsetRef.current < 0) offsetRef.current += W;
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const mid = rect.width / 2;
    velocityRef.current = x < mid ? SCROLL_SPEED_PX_S : -SCROLL_SPEED_PX_S;
  };

  return (
    <section id="technologies" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            {t('technologies.title')}
          </h2>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full cursor-ew-resize select-none py-4"
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseLeave={() => {
          velocityRef.current = 0;
        }}
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <div ref={setRef} className="flex items-start">
              {technologies.map((tech) => (
                <TechItem key={`${tech.name}-a`} tech={tech} />
              ))}
            </div>
            <div className="flex items-start" aria-hidden>
              {technologies.map((tech) => (
                <TechItem key={`${tech.name}-b`} tech={tech} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
