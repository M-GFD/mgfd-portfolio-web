'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate } from 'animejs';
import { cn } from '@/lib/utils';

export type ScrollMode =
  | 'depth-in'
  | 'horizontal'
  | 'depth-out'
  | 'helix'
  | 'drift';

type PremiumScrollJourneyProps = {
  children: ReactNode;
  className?: string;
};

type ScrollChapterProps = {
  children: ReactNode;
  mode: ScrollMode;
  pin?: boolean;
  runway?: 'short' | 'medium' | 'long';
  className?: string;
};

type MotionSample = {
  x: number;
  y: number;
  z: number;
  rotateY: number;
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
  if (p < 0.45) return { phase: 'in', u: smoothstep(p / 0.45) };
  if (p > 0.68) return { phase: 'out', u: smoothstep((p - 0.68) / 0.32) };
  return { phase: 'hold', u: 0 };
}

function sampleMotion(mode: ScrollMode, p: number, compact: boolean): MotionSample {
  const { phase, u } = segmentProgress(p);
  const depth = compact ? 0.8 : 1;
  const lateral = compact ? 0.75 : 1;

  const identity: MotionSample = {
    x: 0,
    y: 0,
    z: 0,
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    opacity: 1,
  };

  if (mode === 'drift') {
    const swing = Math.sin((p - 0.5) * Math.PI);
    return {
      x: swing * 48 * lateral,
      y: 0,
      z: -Math.abs(swing) * 110 * depth,
      rotateY: swing * -14 * lateral,
      rotateX: 0,
      scale: 1 - Math.abs(swing) * 0.05,
      opacity: 1,
    };
  }

  if (phase === 'hold') return identity;

  if (mode === 'depth-in') {
    if (phase === 'in') {
      return {
        x: 0,
        y: lerp(72, 0, u),
        z: lerp(-980 * depth, 0, u),
        rotateY: 0,
        rotateX: lerp(22, 0, u),
        scale: lerp(0.48, 1, u),
        opacity: lerp(0.05, 1, u),
      };
    }
    return {
      x: 0,
      y: lerp(0, -48, u),
      z: lerp(0, 420 * depth, u),
      rotateY: 0,
      rotateX: lerp(0, -14, u),
      scale: lerp(1, 1.12, u),
      opacity: lerp(1, 0.18, u),
    };
  }

  if (mode === 'horizontal') {
    const enterX = (compact ? 240 : 520) * lateral;
    const leaveX = (compact ? -220 : -460) * lateral;
    if (phase === 'in') {
      return {
        x: lerp(enterX, 0, u),
        y: 0,
        z: lerp(-260 * depth, 0, u),
        rotateY: lerp(52, 0, u),
        rotateX: 0,
        scale: lerp(0.76, 1, u),
        opacity: lerp(0.08, 1, u),
      };
    }
    return {
      x: lerp(0, leaveX, u),
      y: 0,
      z: lerp(0, -160 * depth, u),
      rotateY: lerp(0, -40, u),
      rotateX: 0,
      scale: lerp(1, 0.86, u),
      opacity: lerp(1, 0.14, u),
    };
  }

  if (mode === 'depth-out') {
    if (phase === 'in') {
      return {
        x: 0,
        y: lerp(-42, 0, u),
        z: lerp(620 * depth, 0, u),
        rotateY: 0,
        rotateX: lerp(-18, 0, u),
        scale: lerp(1.28, 1, u),
        opacity: lerp(0.06, 1, u),
      };
    }
    return {
      x: 0,
      y: lerp(0, 56, u),
      z: lerp(0, -780 * depth, u),
      rotateY: 0,
      rotateX: lerp(0, 20, u),
      scale: lerp(1, 0.52, u),
      opacity: lerp(1, 0.1, u),
    };
  }

  const helixInX = (compact ? -200 : -400) * lateral;
  const helixOutX = (compact ? 180 : 360) * lateral;
  if (phase === 'in') {
    return {
      x: lerp(helixInX, 0, u),
      y: lerp(48, 0, u),
      z: lerp(-640 * depth, 0, u),
      rotateY: lerp(-56, 0, u),
      rotateX: lerp(14, 0, u),
      scale: lerp(0.64, 1, u),
      opacity: lerp(0.08, 1, u),
    };
  }
  return {
    x: lerp(0, helixOutX, u),
    y: lerp(0, -34, u),
    z: lerp(0, 360 * depth, u),
    rotateY: lerp(0, 44, u),
    rotateX: lerp(0, -12, u),
    scale: lerp(1, 0.84, u),
    opacity: lerp(1, 0.14, u),
  };
}

function applyStageMotion(el: HTMLElement, motion: MotionSample) {
  el.style.transform = [
    `translate3d(${motion.x.toFixed(2)}px, ${motion.y.toFixed(2)}px, ${motion.z.toFixed(2)}px)`,
    `rotateX(${motion.rotateX.toFixed(3)}deg)`,
    `rotateY(${motion.rotateY.toFixed(3)}deg)`,
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
  const y = swing * 40 * factor;
  const x = swing * 32 * factor * (compact ? 0.45 : 1);
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`;
}

function clearMotion(el: HTMLElement) {
  el.style.removeProperty('transform');
  el.style.removeProperty('opacity');
  el.style.removeProperty('will-change');
}

/**
 * Progreso 0→1 del capítulo.
 * Con runway sticky: 0 cuando el top del capítulo llega al top del viewport,
 * 1 cuando el bottom del capítulo llega al bottom del viewport.
 */
function chapterProgress(root: HTMLElement): number {
  const viewH = window.innerHeight || 1;
  const rect = root.getBoundingClientRect();
  const scrollable = rect.height - viewH;

  if (scrollable > 1) {
    return clamp01(-rect.top / scrollable);
  }

  // Capítulos sin pin (altura ≈ contenido): tránsito por el viewport.
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
  mode,
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
      const motion = sampleMotion(mode, proxy.p, compact);
      applyStageMotion(stage, motion);
      if (far) applyLayerMotion(far, proxy.p, 1.4, compact);
      if (mid) applyLayerMotion(mid, proxy.p, 0.8, compact);
    };

    paint();

    const driveTo = (next: number) => {
      const target = clamp01(next);
      // Si el salto es mínimo, pintar directo (evita lag al inicio).
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
  }, [mode]);

  return (
    <section
      ref={rootRef}
      className={cn(
        'scroll-chapter',
        pin && 'scroll-chapter--pin',
        pin && `scroll-chapter--runway-${runway}`,
        className,
      )}
      data-scroll-mode={mode}
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
