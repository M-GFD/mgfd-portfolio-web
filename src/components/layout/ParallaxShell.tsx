'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

const PARALLAX_BG_GIF = `/images/${encodeURIComponent('red lines moves.gif')}`;

type DepthScrollRegistry = {
  registerSection: (el: HTMLElement) => () => void;
  reducedMotion: boolean;
};

const DepthRegistryContext = createContext<DepthScrollRegistry | null>(null);

/**
 * Una sola progresión por scroll para todo el bloque principal (todas las secciones a la vez).
 * 0 = adelante; 1 = hundido máximo en Z hacia el video.
 */
function computeGlobalScrollProgress(scrollY: number): number {
  if (typeof document === 'undefined') return 0;
  const doc = document.documentElement;
  const maxY = Math.max(1, doc.scrollHeight - window.innerHeight);
  const raw = scrollY / maxY;
  const clamped = Math.min(Math.max(raw, 0), 1);
  return Math.pow(clamped, 0.92);
}

function formatProgress(value: number): string {
  return value.toFixed(4);
}

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    const mqRafId = requestAnimationFrame(sync);
    mq.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(mqRafId);
      mq.removeEventListener('change', sync);
    };
  }, []);

  return reducedMotion;
}

/** Perspectiva 1200px; Header/Footer deben estar fuera. */
export function ParallaxPerspectiveStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('depth-perspective-shell', className)}>{children}</div>
  );
}

/** Fondo GIF + overlay + RAF: un solo --z-progress global según scroll. */
export function ParallaxRoot({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotionPreference();
  const sectionElsRef = useRef(new Set<HTMLElement>());
  const rafIdRef = useRef(0);
  const flushDepthCssRef = useRef<() => void>(() => {});

  const flushDepthCss = useCallback(() => {
    if (reducedMotion) {
      for (const el of sectionElsRef.current) {
        el.style.removeProperty('--z-progress');
      }
      return;
    }
    for (const el of sectionElsRef.current) {
      const p = computeGlobalScrollProgress(window.scrollY);
      el.style.setProperty('--z-progress', formatProgress(p));
    }
  }, [reducedMotion]);

  useLayoutEffect(() => {
    flushDepthCssRef.current = flushDepthCss;
  }, [flushDepthCss]);

  const scheduleFlush = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (rafIdRef.current !== 0) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = 0;
      flushDepthCssRef.current();
    });
  }, []);

  const registerSection = useCallback((el: HTMLElement) => {
    sectionElsRef.current.add(el);
    requestAnimationFrame(() => {
      flushDepthCssRef.current();
    });
    return () => {
      sectionElsRef.current.delete(el);
      el.style.removeProperty('--z-progress');
      scheduleFlush();
    };
  }, [scheduleFlush]);

  useEffect(() => {
    flushDepthCssRef.current();
    scheduleFlush();
  }, [reducedMotion, scheduleFlush]);

  useEffect(() => {
    flushDepthCssRef.current();
    window.addEventListener('scroll', scheduleFlush, { passive: true });
    window.addEventListener('resize', scheduleFlush);

    const vv = window.visualViewport;
    vv?.addEventListener('resize', scheduleFlush);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        scheduleFlush();
      });
      if (document.body) ro.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', scheduleFlush);
      window.removeEventListener('resize', scheduleFlush);
      vv?.removeEventListener('resize', scheduleFlush);
      ro?.disconnect();
      if (rafIdRef.current !== 0) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [scheduleFlush]);

  const value = useMemo<DepthScrollRegistry>(
    () => ({ registerSection, reducedMotion }),
    [registerSection, reducedMotion]
  );

  return (
    <DepthRegistryContext.Provider value={value}>
      <div className="relative min-h-screen overflow-x-clip">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${PARALLAX_BG_GIF}")` }}
          />
          <div
            className="absolute inset-0 bg-zinc-950/54 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            aria-hidden
          />
        </div>
        {children}
      </div>
    </DepthRegistryContext.Provider>
  );
}

/**
 * Sobre único para todo el contenido con profundidad (hero + sobre + obra).
 * Un solo elemento registrado ⇒ mismas máscaras scale/opacidad/Z.
 */
export function DepthEnvelope({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(DepthRegistryContext);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !ctx) return undefined;
    return ctx.registerSection(el);
  }, [ctx]);

  return (
    <div ref={ref} className={cn('depth-section-layer', className)}>
      {children}
    </div>
  );
}

/** @deprecated Usar DepthEnvelope */
export const DepthSection = DepthEnvelope;
