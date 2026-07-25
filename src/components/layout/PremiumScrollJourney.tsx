'use client';

import {
  Children,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { animate } from 'animejs';
import { cn } from '@/lib/utils';

export type ScrollMode = 'depth-in';

type PremiumScrollJourneyProps = {
  children: ReactNode;
  className?: string;
};

type ScrollChapterProps = {
  children: ReactNode;
  /** @deprecated Todas las capas usan el mismo viaje en profundidad. */
  mode?: ScrollMode;
  pin?: boolean;
  runway?: 'short' | 'medium' | 'long';
  className?: string;
};

type MotionSample = {
  y: number;
  z: number;
  rotateX: number;
  scale: number;
  opacity: number;
  interactive: boolean;
};

/** Fracción local: emerger hasta aquí; la última sección se detiene en hold. */
const EMERGE_END = 0.62;
const HOLD_END = 0.78;
/** Unidades de scroll por sección (1 = un “slot” de la pila). */
const UNITS_PER_SECTION = 1;
const SCROLL_VH_PER_UNIT = 1.15;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function smoothstep(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function deepPark(compact: boolean, queue: number): MotionSample {
  const depth = compact ? 0.85 : 1;
  const step = 220 * depth;
  return {
    y: 48,
    z: -1000 * depth - Math.max(0, queue) * step,
    rotateX: 26,
    scale: 0.42,
    opacity: 0,
    interactive: false,
  };
}

function exitedPark(compact: boolean): MotionSample {
  const depth = compact ? 0.85 : 1;
  return {
    y: -36,
    z: 520 * depth,
    rotateX: -12,
    scale: 1.08,
    opacity: 0,
    interactive: false,
  };
}

/**
 * local: posición de la capa en el eje de la pila (0 = empieza a emerger).
 * isLast: la última no sale hacia adelante; se queda en pantalla.
 */
function sampleLayer(
  local: number,
  isLast: boolean,
  compact: boolean,
): MotionSample {
  const depth = compact ? 0.85 : 1;

  if (local < 0) {
    return deepPark(compact, -local);
  }

  if (local <= EMERGE_END) {
    const u = smoothstep(local / EMERGE_END);
    return {
      y: lerp(48, 0, u),
      z: lerp(-1000 * depth, 0, u),
      rotateX: lerp(26, 0, u),
      scale: lerp(0.42, 1, u),
      opacity: lerp(0, 1, u),
      interactive: u > 0.55,
    };
  }

  if (isLast || local <= HOLD_END) {
    return {
      y: 0,
      z: 0,
      rotateX: 0,
      scale: 1,
      opacity: 1,
      interactive: true,
    };
  }

  if (local >= UNITS_PER_SECTION) {
    return exitedPark(compact);
  }

  const u = smoothstep((local - HOLD_END) / (UNITS_PER_SECTION - HOLD_END));
  return {
    y: lerp(0, -36, u),
    z: lerp(0, 520 * depth, u),
    rotateX: lerp(0, -12, u),
    scale: lerp(1, 1.08, u),
    opacity: lerp(1, 0, u),
    interactive: u < 0.35,
  };
}

function applyLayerMotion(el: HTMLElement, motion: MotionSample) {
  el.style.transform = [
    `translate3d(0px, ${motion.y.toFixed(2)}px, ${motion.z.toFixed(2)}px)`,
    `rotateX(${motion.rotateX.toFixed(3)}deg)`,
    `scale(${motion.scale.toFixed(4)})`,
  ].join(' ');
  el.style.opacity = motion.opacity.toFixed(3);
  el.style.pointerEvents = motion.interactive ? 'auto' : 'none';
  el.setAttribute('aria-hidden', motion.opacity < 0.08 ? 'true' : 'false');
}

function journeyProgress(root: HTMLElement, viewH: number): number {
  const rect = root.getBoundingClientRect();
  const scrollable = Math.max(root.offsetHeight - viewH, 1);
  // Exacto en 0 cuando el top del runway está en el top del viewport.
  return clamp01(-rect.top / scrollable);
}

function maxUnit(sectionCount: number) {
  // Termina cuando la última acaba de emerger y queda en hold (sin fase out).
  return Math.max(sectionCount - 1, 0) * UNITS_PER_SECTION + HOLD_END;
}

export function PremiumScrollJourney({
  children,
  className,
}: PremiumScrollJourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => Children.toArray(children), [children]);
  const count = items.length;

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!root || !viewport || count === 0) return;

    const layers = Array.from(
      viewport.querySelectorAll<HTMLElement>('[data-depth-panel]'),
    );
    if (layers.length === 0) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) {
      root.classList.add('depth-stack--flat');
      layers.forEach((el) => {
        el.style.removeProperty('transform');
        el.style.removeProperty('opacity');
        el.style.pointerEvents = 'auto';
        el.removeAttribute('aria-hidden');
      });
      return;
    }

    const compact =
      window.matchMedia('(max-width: 1023px)').matches ||
      window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const footerH = () => {
      const footer = document.getElementById('contact');
      return footer?.offsetHeight ?? 84;
    };

    const layout = () => {
      const viewH = window.innerHeight || 1;
      const pinH = Math.max(viewH - footerH(), 240);
      const unitPx = viewH * SCROLL_VH_PER_UNIT;
      const scrollable = unitPx * maxUnit(count);
      root.style.setProperty('--depth-pin-h', `${pinH}px`);
      root.style.height = `${pinH + scrollable}px`;
    };

    layout();

    const proxy = { u: 0 };
    let smoothAnim: ReturnType<typeof animate> | null = null;

    const paint = () => {
      const u = proxy.u;
      const painted = layers.map((el, i) => {
        const local = u - i * UNITS_PER_SECTION;
        const motion = sampleLayer(local, i === count - 1, compact);
        applyLayerMotion(el, motion);
        return { el, z: motion.z };
      });
      // Orden de pintura por cercanía a la cámara (no por orden del DOM).
      [...painted]
        .sort((a, b) => a.z - b.z)
        .forEach((item, rank) => {
          item.el.style.zIndex = String(rank + 1);
        });
    };

    // Estado inicial forzado: pila en 0% emergido (antes de cualquier scroll).
    proxy.u = 0;
    paint();

    const driveTo = (next: number) => {
      const target = Math.max(0, Math.min(maxUnit(count), next));
      if (Math.abs(target - proxy.u) < 0.0015) {
        proxy.u = target;
        paint();
        return;
      }
      if (smoothAnim) smoothAnim.pause();
      smoothAnim = animate(proxy, {
        u: target,
        duration: compact ? 120 : 180,
        ease: 'out(2)',
        onRender: paint,
      });
    };

    let rafId: number | null = null;
    const sync = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const viewH = window.innerHeight || 1;
        const p = journeyProgress(root, viewH);
        driveTo(p * maxUnit(count));
      });
    };

    const onResize = () => {
      layout();
      sync();
    };

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    sync();

    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', onResize);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (smoothAnim) smoothAnim.pause();
      root.classList.remove('depth-stack--flat');
      layers.forEach((el) => {
        el.style.removeProperty('transform');
        el.style.removeProperty('opacity');
        el.style.removeProperty('pointer-events');
        el.style.removeProperty('will-change');
        el.removeAttribute('aria-hidden');
      });
    };
  }, [count]);

  return (
    <div
      ref={rootRef}
      className={cn(
        'depth-stack scroll-journey scroll-journey--with-fixed-footer',
        className,
      )}
      data-scroll-journey=""
      data-depth-count={count}
    >
      <div ref={viewportRef} className="depth-stack__viewport">
        <div
          className="depth-stack__glow depth-stack__glow--far"
          aria-hidden
        />
        <div
          className="depth-stack__glow depth-stack__glow--mid"
          aria-hidden
        />
        {items.map((child, index) => (
          <div
            key={index}
            className="depth-stack__layer"
            data-depth-panel=""
            data-depth-index={index}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Capa de contenido dentro de la pila en profundidad. */
export function ScrollChapter({ children, className }: ScrollChapterProps) {
  return (
    <div className={cn('depth-stack__chapter', className)} data-scroll-mode="depth-in">
      {children}
    </div>
  );
}
