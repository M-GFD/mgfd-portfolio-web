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
import {
  DEPTH_EMERGE_END,
  DEPTH_HOLD_END,
  DEPTH_SCROLL_VH_PER_UNIT,
  DEPTH_UNITS_PER_SECTION,
  depthMaxUnit,
} from '@/lib/depth-stack';

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
  atRest: boolean;
};

const SMOOTH_MS = 160;

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

function viewHeight() {
  return window.visualViewport?.height || window.innerHeight || 1;
}

function deepPark(queue: number): MotionSample {
  const step = 220;
  return {
    y: 48,
    z: -1000 - Math.max(0, queue) * step,
    rotateX: 26,
    scale: 0.42,
    opacity: 0,
    interactive: false,
    atRest: false,
  };
}

function exitedPark(): MotionSample {
  return {
    y: -36,
    z: 520,
    rotateX: -12,
    scale: 0.9,
    opacity: 0,
    interactive: false,
    atRest: false,
  };
}

function restMotion(): MotionSample {
  return {
    y: 0,
    z: 0,
    rotateX: 0,
    scale: 1,
    opacity: 1,
    interactive: true,
    atRest: true,
  };
}

function emergeMotion(local: number): MotionSample {
  const u = smoothstep(local / DEPTH_EMERGE_END);
  return {
    y: lerp(48, 0, u),
    z: lerp(-1000, 0, u),
    rotateX: lerp(26, 0, u),
    scale: lerp(0.42, 1, u),
    opacity: lerp(0, 1, u),
    interactive: u > 0.55,
    atRest: false,
  };
}

function sampleLayer(local: number, isLast: boolean): MotionSample {
  if (local < 0) {
    return deepPark(-local);
  }

  if (isLast) {
    if (local >= DEPTH_EMERGE_END) return restMotion();
    return emergeMotion(local);
  }

  if (local <= DEPTH_EMERGE_END) {
    return emergeMotion(local);
  }

  if (local <= DEPTH_HOLD_END) {
    return restMotion();
  }

  if (local >= DEPTH_UNITS_PER_SECTION) {
    return exitedPark();
  }

  const u = smoothstep(
    (local - DEPTH_HOLD_END) / (DEPTH_UNITS_PER_SECTION - DEPTH_HOLD_END),
  );
  return {
    y: lerp(0, -36, u),
    z: lerp(0, 520, u),
    rotateX: lerp(0, -12, u),
    scale: lerp(1, 0.9, u),
    opacity: lerp(1, 0, u),
    interactive: u < 0.35,
    atRest: false,
  };
}

function applyLayerMotion(el: HTMLElement, motion: MotionSample) {
  if (motion.atRest) {
    el.style.transform = 'none';
    el.style.opacity = '1';
    el.style.transformStyle = 'flat';
    el.style.pointerEvents = 'auto';
    el.setAttribute('aria-hidden', 'false');
    return;
  }

  const scale = Math.min(1, Math.max(0.42, motion.scale));
  el.style.transformStyle = 'preserve-3d';
  el.style.transform = [
    `translate3d(0px, ${motion.y.toFixed(2)}px, ${motion.z.toFixed(2)}px)`,
    `rotateX(${motion.rotateX.toFixed(3)}deg)`,
    `scale(${scale.toFixed(4)})`,
  ].join(' ');
  el.style.opacity = clamp01(motion.opacity).toFixed(3);
  el.style.pointerEvents = motion.interactive ? 'auto' : 'none';
  el.setAttribute('aria-hidden', motion.opacity < 0.08 ? 'true' : 'false');
}

function journeyProgress(root: HTMLElement, viewH: number): number {
  const rect = root.getBoundingClientRect();
  const scrollable = Math.max(root.offsetHeight - viewH, 1);
  return clamp01(-rect.top / scrollable);
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
        el.style.removeProperty('transform-style');
        el.style.pointerEvents = 'auto';
        el.removeAttribute('aria-hidden');
      });
      return;
    }

    const footerH = () => {
      const footer = document.getElementById('contact');
      return footer?.offsetHeight ?? 84;
    };

    const layout = () => {
      const viewH = viewHeight();
      const pinH = Math.max(viewH - footerH(), 240);
      const unitPx = viewH * DEPTH_SCROLL_VH_PER_UNIT;
      const scrollable = unitPx * depthMaxUnit(count);
      root.style.setProperty('--depth-pin-h', `${pinH}px`);
      root.style.height = `${pinH + scrollable}px`;
    };

    layout();

    const proxy = { u: 0 };
    let smoothAnim: ReturnType<typeof animate> | null = null;

    const paint = () => {
      const u = proxy.u;
      const painted = layers.map((el, i) => {
        const local = u - i * DEPTH_UNITS_PER_SECTION;
        const motion = sampleLayer(local, i === count - 1);
        applyLayerMotion(el, motion);
        return { el, z: motion.atRest ? 0 : motion.z };
      });
      [...painted]
        .sort((a, b) => a.z - b.z)
        .forEach((item, rank) => {
          item.el.style.zIndex = String(rank + 1);
        });
    };

    proxy.u = 0;
    paint();

    const driveTo = (next: number) => {
      const target = Math.max(0, Math.min(depthMaxUnit(count), next));
      if (Math.abs(target - proxy.u) < 0.0015) {
        proxy.u = target;
        paint();
        return;
      }
      if (smoothAnim) smoothAnim.pause();
      smoothAnim = animate(proxy, {
        u: target,
        duration: SMOOTH_MS,
        ease: 'linear',
        onRender: paint,
      });
    };

    let rafId: number | null = null;
    const sync = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const viewH = viewHeight();
        const p = journeyProgress(root, viewH);
        driveTo(p * depthMaxUnit(count));
      });
    };

    const onResize = () => {
      layout();
      sync();
    };

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.visualViewport?.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('scroll', sync);
    sync();

    // Permite que la navegación por anclas espere al layout inicial.
    root.dataset.depthReady = 'true';
    window.dispatchEvent(new CustomEvent('depth-stack-ready'));

    return () => {
      delete root.dataset.depthReady;
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('scroll', sync);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (smoothAnim) smoothAnim.pause();
      root.classList.remove('depth-stack--flat');
      layers.forEach((el) => {
        el.style.removeProperty('transform');
        el.style.removeProperty('opacity');
        el.style.removeProperty('pointer-events');
        el.style.removeProperty('will-change');
        el.style.removeProperty('transform-style');
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
