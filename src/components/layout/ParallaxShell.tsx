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
import { cn } from '@/lib/utils';

const PARALLAX_BG_GIF = `/images/${encodeURIComponent('red lines moves.gif')}`;

/** Fondo casi estable; apenas se mueve con el scroll. */
const BG_SCROLL_FACTOR = 0.02;

export type ParallaxDepth = 'near' | 'mid' | 'far';

/** Factores sutiles translateY(scroll): capa “cerca” se desplaza un poco más. */
const DEPTH_FACTOR: Record<ParallaxDepth, number> = {
  near: 0.066,
  mid: 0.044,
  far: 0.03,
};

type ParallaxContextValue = {
  scrollY: number;
  reducedMotion: boolean;
};

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

export function useParallax() {
  const ctx = useContext(ParallaxContext);
  if (!ctx) {
    throw new Error('useParallax debe usarse dentro de ParallaxRoot');
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
    window.addEventListener('resize', scheduleScrollRead);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', scheduleScrollRead);
    return () => {
      window.removeEventListener('scroll', scheduleScrollRead);
      window.removeEventListener('resize', scheduleScrollRead);
      vv?.removeEventListener('resize', scheduleScrollRead);
      if (scrollRafRef.current != null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [scheduleScrollRead]);

  const value = useMemo(
    () => ({ scrollY, reducedMotion }),
    [scrollY, reducedMotion]
  );

  const bgOffset =
    reducedMotion ? 0 : scrollY * BG_SCROLL_FACTOR;

  return (
    <ParallaxContext.Provider value={value}>
      <div className="relative min-h-screen overflow-x-clip">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={
              reducedMotion || bgOffset === 0
                ? { backgroundImage: `url("${PARALLAX_BG_GIF}")` }
                : {
                    backgroundImage: `url("${PARALLAX_BG_GIF}")`,
                    transform: `translate3d(0, ${bgOffset}px, 0)`,
                    willChange: 'transform',
                  }
            }
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

/** Parallax liviano sólo translateY ligado al scroll (sin perspective / scale / opacity). */
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
  const f = DEPTH_FACTOR[depth];
  const y = reducedMotion ? 0 : scrollY * f;

  return (
    <div
      className={cn(className)}
      style={
        y === 0
          ? undefined
          : { transform: `translate3d(0, ${y}px, 0)` }
      }
    >
      {children}
    </div>
  );
}
