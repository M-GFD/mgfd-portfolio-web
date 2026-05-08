'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/** Velocidades bajas para limitar cortes entre secciones por el transform fuera del flujo visual. */
const BG_SCROLL_FACTOR = 0.016;

export type ParallaxDepth = 'deep' | 'mid' | 'shallow' | 'front';

const DEPTH_FACTOR: Record<ParallaxDepth, number> = {
  deep: 0.032,
  mid: 0.046,
  shallow: 0.058,
  front: 0.072,
};

const PARALLAX_BG_GIF = `/images/${encodeURIComponent('red lines moves.gif')}`;

type ParallaxContextValue = {
  scrollY: number;
  reducedMotion: boolean;
};

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

export function useParallax() {
  const ctx = useContext(ParallaxContext);
  if (!ctx) {
    throw new Error('useParallax must be used within ParallaxRoot');
  }
  return ctx;
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

/** Contenedor principal: GIF fijo casi quieto + overlay para legibilidad + proveedor de scroll. */
export function ParallaxRoot({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const reducedMotion = useReducedMotionPreference();
  const scrollRafRef = useRef<number | null>(null);

  const scheduleScrollRead = useCallback(() => {
    if (scrollRafRef.current != null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    scheduleScrollRead();
    window.addEventListener('scroll', scheduleScrollRead, { passive: true });
    return () => {
      if (scrollRafRef.current != null) cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
      window.removeEventListener('scroll', scheduleScrollRead);
    };
  }, [scheduleScrollRead]);

  const value = useMemo(
    () => ({ scrollY, reducedMotion }),
    [scrollY, reducedMotion]
  );

  const bgOffset = reducedMotion ? 0 : scrollY * BG_SCROLL_FACTOR;

  return (
    <ParallaxContext.Provider value={value}>
      <div className="relative min-h-screen overflow-x-clip">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={
            reducedMotion
              ? undefined
              : {
                  transform: `translate3d(0, ${bgOffset}px, 0)`,
                  willChange: 'transform',
                }
          }
        >
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
    </ParallaxContext.Provider>
  );
}

/** Capa de contenido con desplazamiento vertical ligado al scroll (profundidades distintas). */
export function ParallaxLayer({
  depth,
  children,
  className,
}: {
  depth: ParallaxDepth;
  children: ReactNode;
  className?: string;
}) {
  const { scrollY, reducedMotion } = useParallax();
  const factor = DEPTH_FACTOR[depth];
  const offset = reducedMotion ? 0 : scrollY * factor;

  return (
    <div
      className={className}
      style={
        reducedMotion
          ? undefined
          : { transform: `translate3d(0, ${offset}px, 0)` }
      }
    >
      {children}
    </div>
  );
}
