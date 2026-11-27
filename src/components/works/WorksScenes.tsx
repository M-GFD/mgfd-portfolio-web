'use client';

import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Project } from '@/types/portfolio';
import { DESKTOP_MIN_WIDTH, layoutModeFor, type LayoutMode } from '@/lib/layout-mode';
import { sceneRestScrollY } from '@/lib/scene-motion';
import { getLenis, headerOffset, registerHashTarget } from '@/lib/smooth-scroll';
import { canUseWebGL } from '@/lib/webgl';
import ProjectScene from './ProjectScene';

const SceneCanvas = dynamic(() => import('./SceneCanvas'), { ssr: false });

const DESKTOP_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px)`;
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function readMode(): LayoutMode {
  return layoutModeFor(window.innerWidth, window.matchMedia(REDUCED_QUERY).matches);
}

/** scrollY absoluto donde una escena se ve en reposo (fijada) o con su borde superior bajo el header. */
function restYFor(el: HTMLElement, mode: LayoutMode): number {
  const top = el.getBoundingClientRect().top + window.scrollY;
  if (mode === 'pinned') return sceneRestScrollY(top, el.offsetHeight, window.innerHeight);
  return Math.max(0, top - headerOffset());
}

function jumpTo(y: number) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
}

/** Proyectos como escenas: fijadas en escritorio, apiladas en móvil, estáticas sin WebGL o con reduced-motion. */
export default function WorksScenes({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<LayoutMode | null>(null);
  const [webglOk, setWebglOk] = useState(() => canUseWebGL());
  const [near, setNear] = useState(false);
  const modeRef = useRef<LayoutMode | null>(null);
  const restoreRef = useRef<string | null>(null);

  // Modo según ancho y reduced-motion; al cruzar el breakpoint conserva la escena visible.
  useEffect(() => {
    const apply = () => {
      const next = readMode();
      if (next === modeRef.current) return;
      if (modeRef.current && rootRef.current) {
        const mid = window.innerHeight / 2;
        const scenes = Array.from(rootRef.current.querySelectorAll<HTMLElement>('[id^="project-"]'));
        const active = scenes.find((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= mid && r.bottom >= mid;
        });
        restoreRef.current = active?.id ?? null;
      }
      modeRef.current = next;
      setMode(next);
    };
    apply();
    const queries = [window.matchMedia(DESKTOP_QUERY), window.matchMedia(REDUCED_QUERY)];
    queries.forEach((q) => q.addEventListener('change', apply));
    return () => queries.forEach((q) => q.removeEventListener('change', apply));
  }, []);

  useLayoutEffect(() => {
    const id = restoreRef.current;
    restoreRef.current = null;
    if (!id || !mode) return;
    const el = document.getElementById(id);
    if (el) jumpTo(restYFor(el, mode));
  }, [mode]);

  // El lienzo se monta cuando Works está a menos de 150vh (y queda montado).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '150% 0px 150% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  // "Trabajos" (header / Hero) aterriza en el reposo de la primera escena.
  useEffect(
    () =>
      registerHashTarget('#works', () => {
        const first = rootRef.current?.querySelector<HTMLElement>('[id^="project-"]');
        if (!first || modeRef.current !== 'pinned') return null;
        return restYFor(first, 'pinned');
      }),
    [],
  );

  const resolved: LayoutMode = mode ?? 'stacked';
  const threeOn = mode !== null && resolved !== 'static' && webglOk;
  const effective: LayoutMode = mode !== null && !webglOk ? 'static' : resolved;

  return (
    <div ref={rootRef} className="relative">
      {threeOn && near ? (
        <SceneCanvas dpr={resolved === 'pinned' ? [1, 2] : [1, 1.5]} onContextLost={() => setWebglOk(false)} />
      ) : null}
      {projects.map((project, i) => (
        <ProjectScene
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
          mode={effective}
          threeReady={threeOn && near}
        />
      ))}
    </div>
  );
}
