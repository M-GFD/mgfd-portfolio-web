'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate } from 'animejs';
import { cn } from '@/lib/utils';

/** Todas las secciones usan el mismo viaje en profundidad (rueda Z). */
export type ScrollMode = 'depth-in';

type PremiumScrollJourneyProps = {
  children: ReactNode;
  className?: string;
};

type ScrollChapterProps = {
  children: ReactNode;
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
};

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

function segmentProgress(p: number): { phase: 'in' | 'hold' | 'out'; u: number } {
  if (p < 0.42) return { phase: 'in', u: smoothstep(p / 0.42) };
  if (p > 0.66) return { phase: 'out', u: smoothstep((p - 0.66) / 0.34) };
  return { phase: 'hold', u: 0 };
}

/** Misma rueda de profundidad para cada sección: desde el fondo → pantalla → sale. */
function sampleMotion(p: number, compact: boolean): MotionSample {
  const { phase, u } = segmentProgress(p);
  const depth = compact ? 0.82 : 1;

  if (phase === 'hold') {
    return { y: 0, z: 0, rotateX: 0, scale: 1, opacity: 1 };
  }

  if (phase === 'in') {
    return {
      y: lerp(56, 0, u),
      z: lerp(-980 * depth, 0, u),
      rotateX: lerp(24, 0, u),
      scale: lerp(0.46, 1, u),
      opacity: lerp(0.04, 1, u),
    };
  }

  return {
    y: lerp(0, -40, u),
    z: lerp(0, 460 * depth, u),
    rotateX: lerp(0, -14, u),
    scale: lerp(1, 1.1, u),
    opacity: lerp(1, 0.12, u),
  };
}

function applyStageMotion(el: HTMLElement, motion: MotionSample) {
  // Sin translateX / rotateY: el eje óptico queda centrado en el viewport.
  el.style.transform = [
    `translate3d(0px, ${motion.y.toFixed(2)}px, ${motion.z.toFixed(2)}px)`,
    `rotateX(${motion.rotateX.toFixed(3)}deg)`,
    `scale(${motion.scale.toFixed(4)})`,
  ].join(' ');
  el.style.opacity = motion.opacity.toFixed(3);
}

function applyLayerMotion(
  el: HTMLElement,
  p: number,
  factor: number,
  compact: boolean,
) {
  const swing = (p - 0.5) * 2;
  const z = -swing * 220 * factor * (compact ? 0.55 : 1);
  const y = swing * 36 * factor;
  el.style.transform = `translate3d(0px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`;
}

function clearMotion(el: HTMLElement) {
  el.style.removeProperty('transform');
  el.style.removeProperty('opacity');
  el.style.removeProperty('will-change');
}

/**
 * Progreso 0→1 del capítulo sticky:
 * 0 = top del runway en el top del viewport,
 * 1 = bottom del runway en el bottom del viewport.
 */
function chapterProgress(root: HTMLElement): number {
  const viewH = window.innerHeight || 1;
  const rect = root.getBoundingClientRect();
  const scrollable = rect.height - viewH;

  if (scrollable > 1) {
    return clamp01(-rect.top / scrollable);
  }

  const traveled = viewH - rect.top;
  const distance = viewH + rect.height;
  return clamp01(traveled / Math.max(distance, 1));
}

export function PremiumScrollJourney({
  children,
  className,
}: PremiumScrollJourneyProps) {
  return (
    <div className={cn('scroll-journey', className)} data-scroll-journey="">
      {children}
    </div>
  );
}

export function ScrollChapter({
  children,
  mode: _mode = 'depth-in',
  pin = true,
  runway = 'medium',
  className,
}: ScrollChapterProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) {
      root.classList.add('scroll-chapter--flat');
      return;
    }

    const stage = root.querySelector<HTMLElement>('[data-scroll-stage]');
    const far = root.querySelector<HTMLElement>('[data-depth-layer="far"]');
    const mid = root.querySelector<HTMLElement>('[data-depth-layer="mid"]');
    if (!stage) return;

    const compact =
      window.matchMedia('(max-width: 1023px)').matches ||
      window.matchMedia('(hover: none), (pointer: coarse)').matches;

    stage.style.willChange = 'transform, opacity';
    if (far) far.style.willChange = 'transform';
    if (mid) mid.style.willChange = 'transform';

    const proxy = { p: chapterProgress(root) };
    let smoothAnim: ReturnType<typeof animate> | null = null;

    const paint = () => {
      const motion = sampleMotion(proxy.p, compact);
      applyStageMotion(stage, motion);
      if (far) applyLayerMotion(far, proxy.p, 1.4, compact);
      if (mid) applyLayerMotion(mid, proxy.p, 0.8, compact);
    };

    paint();

    const driveTo = (next: number) => {
      const target = clamp01(next);
      if (Math.abs(target - proxy.p) < 0.002) {
        proxy.p = target;
        paint();
        return;
      }
      if (smoothAnim) smoothAnim.pause();
      smoothAnim = animate(proxy, {
        p: target,
        duration: compact ? 140 : 200,
        ease: 'out(2)',
        onRender: paint,
      });
    };

    let rafId: number | null = null;
    const sync = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        driveTo(chapterProgress(root));
      });
    };

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();

    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (smoothAnim) smoothAnim.pause();
      clearMotion(stage);
      if (far) clearMotion(far);
      if (mid) clearMotion(mid);
      root.classList.remove('scroll-chapter--flat');
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn(
        'scroll-chapter',
        pin && 'scroll-chapter--pin',
        pin && `scroll-chapter--runway-${runway}`,
        className,
      )}
      data-scroll-mode="depth-in"
    >
      <div className={cn(pin ? 'scroll-chapter__pin' : 'scroll-chapter__flow')}>
        <div
          className="scroll-chapter__depth scroll-chapter__depth--far"
          data-depth-layer="far"
          aria-hidden
        />
        <div
          className="scroll-chapter__depth scroll-chapter__depth--mid"
          data-depth-layer="mid"
          aria-hidden
        />
        <div className="scroll-chapter__stage" data-scroll-stage="">
          {children}
        </div>
      </div>
    </section>
  );
}
