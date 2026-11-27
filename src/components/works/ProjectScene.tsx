'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/portfolio';
import type { LayoutMode } from '@/lib/layout-mode';
import { sceneProgress, textPoseAt } from '@/lib/scene-motion';
import { cn } from '@/lib/utils';
import { requestSceneRender } from './scene-bus';
import StaticComposition from './StaticComposition';

const DeviceRigView = dynamic(() => import('./DeviceRig'), { ssr: false });

type Props = {
  project: Project;
  index: number;
  total: number;
  mode: LayoutMode;
  /** El lienzo 3D está montado y disponible. */
  threeReady: boolean;
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** Entrada al viewport en la versión apilada: 0 al asomar, 0.5 (reposo) al quedar visible. */
function stackedProgress(rect: DOMRect, vh: number) {
  const t = (vh - rect.top) / (vh * 0.9);
  return 0.5 * Math.min(1, Math.max(0, t));
}

export default function ProjectScene({ project, index, total, mode, threeReady }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progress = useRef(mode === 'static' ? 0.5 : 0);

  useEffect(() => {
    const el = containerRef.current;
    const text = textRef.current;
    if (!el || !text) return;
    if (mode === 'static') {
      progress.current = 0.5;
      text.style.opacity = '';
      text.style.transform = '';
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const p = mode === 'pinned' ? sceneProgress(rect, vh) : stackedProgress(rect, vh);
      progress.current = p;
      if (mode === 'pinned') {
        const { opacity, y } = textPoseAt(p);
        text.style.opacity = String(opacity);
        text.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      } else {
        text.style.opacity = '';
        text.style.transform = '';
      }
      requestSceneRender();
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [mode]);

  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const textFirst = index % 2 === 0;

  const article = (
    <article className="surface-1 rim-light relative rounded-[28px] p-[clamp(24px,2.6vw,40px)]">
      <p className="mb-[var(--space-2)] text-xs font-semibold tracking-[0.22em] text-[var(--text-muted)] tabular-nums">
        {counter}
      </p>
      <h3 className="text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.1] font-bold tracking-tight text-pretty text-[var(--text-strong)]">
        {project.title}
      </h3>
      <p className="mt-[var(--space-1)] text-sm leading-snug font-medium text-pretty text-[var(--text-muted)]">
        {project.subtitle}
      </p>
      <p className="mt-[var(--space-3)] text-base leading-[1.7] text-pretty text-[var(--text-body)]">
        {project.description}
      </p>
      {project.websiteUrl ? (
        <a
          href={project.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-[var(--space-4)] inline-flex items-center gap-2"
        >
          {hostOf(project.websiteUrl)}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      ) : null}
    </article>
  );

  const stage =
    mode === 'static' || !threeReady ? (
      mode === 'static' ? <StaticComposition projectId={project.id} /> : null
    ) : (
      <DeviceRigView
        projectId={project.id}
        progress={progress}
        quality={mode === 'pinned' ? 'high' : 'low'}
        className="absolute inset-0"
      />
    );

  if (mode === 'pinned') {
    return (
      <section ref={containerRef} id={`project-${project.id}`} aria-label={project.title} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="content-wrap grid h-full grid-cols-12 items-center gap-x-[var(--space-4)] pt-[72px]">
            <div
              ref={textRef}
              className={cn('relative z-[1] col-span-4 will-change-[opacity,transform]', textFirst ? 'order-1' : 'order-2')}
            >
              {article}
            </div>
            <div className={cn('relative col-span-8 h-[74vh]', textFirst ? 'order-2' : 'order-1')}>{stage}</div>
          </div>
        </div>
      </section>
    );
  }

  // Apilada (móvil) y estática: flujo normal, el escenario arriba y el texto debajo.
  return (
    <section
      ref={containerRef}
      id={`project-${project.id}`}
      aria-label={project.title}
      className="flex min-h-[90vh] flex-col justify-center gap-[var(--space-4)] py-[var(--space-5)] lg:grid lg:min-h-0 lg:grid-cols-12 lg:items-center lg:gap-x-[var(--space-4)]"
    >
      <div className="content-wrap w-full lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-[var(--space-4)]">
        <div className="relative h-[clamp(260px,52vh,520px)] w-full lg:order-2 lg:col-span-8">{stage}</div>
        <div ref={textRef} className="relative z-[1] mt-[var(--space-4)] lg:order-1 lg:col-span-4 lg:mt-0">
          {article}
        </div>
      </div>
    </section>
  );
}
