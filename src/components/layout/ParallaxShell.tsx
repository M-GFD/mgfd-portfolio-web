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

export type ParallaxDepth = 'deep' | 'mid' | 'shallow' | 'front';

/** Mayor ratio → esa capa retrocede más en profundidad al bajar scroll. */
const TRANSLATE_Z_MULT: Record<ParallaxDepth, number> = {
  front: 0.62,
  shallow: 0.82,
  mid: 1,
  deep: 1.22,
};

const Z_PER_SCROLL = 0.11;
/** Límite de “profundidad” para no desaparecer todo el contenido en scroll largos. */
const MAX_SINK_Z = 460;

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

/** Escenario con perspectiva: el contenido retrocede (translateZ) al bajar scroll. Mantener fuera al header si es `fixed`. */
export function ParallaxPerspectiveStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(className)}
      style={{
        perspective: '1400px',
        perspectiveOrigin: '50% 18%',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

/** Contenedor principal: GIF + overlay + proveedor de scroll. */
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

  return (
    <ParallaxContext.Provider value={value}>
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
    </ParallaxContext.Provider>
  );
}

/** Retroceso/profundidad al bajar scroll; subiendo vuelve hacia la cámara. */
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
  const mult = TRANSLATE_Z_MULT[depth];

  let transform: string | undefined;
  if (!reducedMotion) {
    const raw = scrollY * Z_PER_SCROLL * mult;
    const z = -Math.min(raw, MAX_SINK_Z);
    transform = `translateZ(${z}px)`;
  }

  return (
    <div
      className={cn('[transform-style:preserve-3d]', className)}
      style={transform ? { transform, transformStyle: 'preserve-3d' } : undefined}
    >
      {children}
    </div>
  );
}