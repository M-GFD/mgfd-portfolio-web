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

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi);
}

/**
 * Una sola progresión para todo el DepthEnvelope:
 * — al frente (p=0) mientras emerge por debajo / el borde superior no ha llegado al margen superior.
 * — hundimiento (p↑) cuando rect.top corta la banda superior del viewport por scroll ascendente del contenido.
 */
function computeEnvelopeDepthProgress(rect: DOMRect): number {
  const vh = Math.max(window.innerHeight || 1, 1);
  if (rect.height < 24) return 0;

  const topInset = Math.max(16, vh * 0.04);

  if (rect.top > topInset) {
    return 0;
  }

  const span = Math.max(vh * 0.78, 1);
  let p = Math.pow(clamp((topInset - rect.top) / span, 0, 1), 0.9);

  const lowerBand = vh * 0.62;
  if (rect.bottom > lowerBand) {
    const emerg = clamp((rect.bottom - lowerBand) / (vh * 0.38), 0, 1);
    p *= 1 - 0.62 * emerg;
  }

  return clamp(p, 0, 1);
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

/** Fondo GIF + overlay + RAF: rect del sobre único → --z-progress (margen superior). */
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
      const rect = el.getBoundingClientRect();
      const p = computeEnvelopeDepthProgress(rect);
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
