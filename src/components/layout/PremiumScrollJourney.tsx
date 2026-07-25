'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate, onScroll } from 'animejs';
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
  /** Si false, no hay pin sticky (útil para secciones altas como Trabajos). */
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

/** Curva llegada → hold → salida. */
function segmentProgress(p: number): { phase: 'in' | 'hold' | 'out'; u: number } {
  if (p < 0.38) return { phase: 'in', u: smoothstep(p / 0.38) };
  if (p > 0.62) return { phase: 'out', u: smoothstep((p - 0.62) / 0.38) };
  return { phase: 'hold', u: 0 };
}

function sampleMotion(mode: ScrollMode, p: number, compact: boolean): MotionSample {
  const { phase, u } = segmentProgress(p);
  const depth = compact ? 0.55 : 1;
  const lateral = compact ? 0.45 : 1;

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
      x: swing * 28 * lateral,
      y: 0,
      z: -Math.abs(swing) * 60 * depth,
      rotateY: swing * -8 * lateral,
      rotateX: 0,
      scale: 1 - Math.abs(swing) * 0.03,
      opacity: 1,
    };
  }

  if (phase === 'hold') return identity;

  if (mode === 'depth-in') {
    if (phase === 'in') {
      return {
        x: 0,
        y: lerp(40, 0, u),
        z: lerp(-520 * depth, 0, u),
        rotateY: 0,
        rotateX: lerp(12, 0, u),
        scale: lerp(0.7, 1, u),
        opacity: lerp(0.2, 1, u),
      };
    }
    return {
      x: 0,
      y: lerp(0, -28, u),
      z: lerp(0, 260 * depth, u),
      rotateY: 0,
      rotateX: lerp(0, -8, u),
      scale: lerp(1, 1.06, u),
      opacity: lerp(1, 0.35, u),
    };
  }

  if (mode === 'horizontal') {
    const enterX = (compact ? 140 : 320) * lateral;
    const leaveX = (compact ? -120 : -280) * lateral;
    if (phase === 'in') {
      return {
        x: lerp(enterX, 0, u),
        y: 0,
        z: lerp(-120 * depth, 0, u),
        rotateY: lerp(28, 0, u),
        rotateX: 0,
        scale: lerp(0.88, 1, u),
        opacity: lerp(0.25, 1, u),
      };
    }
    return {
      x: lerp(0, leaveX, u),
      y: 0,
      z: lerp(0, -90 * depth, u),
      rotateY: lerp(0, -22, u),
      rotateX: 0,
      scale: lerp(1, 0.92, u),
      opacity: lerp(1, 0.3, u),
    };
  }

  if (mode === 'depth-out') {
    // Entra desde delante (z positivo) y se hunde hacia el fondo al salir.
    if (phase === 'in') {
      return {
        x: 0,
        y: lerp(-24, 0, u),
        z: lerp(340 * depth, 0, u),
        rotateY: 0,
        rotateX: lerp(-10, 0, u),
        scale: lerp(1.12, 1, u),
        opacity: lerp(0.15, 1, u),
      };
    }
    return {
      x: 0,
      y: lerp(0, 36, u),
      z: lerp(0, -480 * depth, u),
      rotateY: 0,
      rotateX: lerp(0, 14, u),
      scale: lerp(1, 0.68, u),
      opacity: lerp(1, 0.2, u),
    };
  }

  // helix: lateral + profundidad + giro
  const helixInX = (compact ? -110 : -260) * lateral;
  const helixOutX = (compact ? 100 : 240) * lateral;
  if (phase === 'in') {
    return {
      x: lerp(helixInX, 0, u),
      y: lerp(30, 0, u),
      z: lerp(-380 * depth, 0, u),
      rotateY: lerp(-36, 0, u),
      rotateX: lerp(8, 0, u),
      scale: lerp(0.78, 1, u),
      opacity: lerp(0.2, 1, u),
    };
  }
  return {
    x: lerp(0, helixOutX, u),
    y: lerp(0, -20, u),
    z: lerp(0, 220 * depth, u),
    rotateY: lerp(0, 30, u),
    rotateX: lerp(0, -6, u),
    scale: lerp(1, 0.9, u),
    opacity: lerp(1, 0.28, u),
  };
}

function applyStageMotion(el: HTMLElement, motion: MotionSample) {
  el.style.transform = `translate3d(${motion.x.toFixed(2)}px, ${motion.y.toFixed(2)}px, ${motion.z.toFixed(2)}px) rotateX(${motion.rotateX.toFixed(3)}deg) rotateY(${motion.rotateY.toFixed(3)}deg) scale(${motion.scale.toFixed(4)})`;
  el.style.opacity = motion.opacity.toFixed(3);
}

function applyLayerMotion(
  el: HTMLElement,
  p: number,
  factor: number,
  compact: boolean,
) {
  const swing = (p - 0.5) * 2;
  const z = -swing * 140 * factor * (compact ? 0.5 : 1);
  const y = swing * 24 * factor;
  const x = swing * 18 * factor * (compact ? 0.4 : 1);
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`;
}

function clearMotion(el: HTMLElement) {
  el.style.removeProperty('transform');
  el.style.removeProperty('opacity');
  el.style.removeProperty('will-change');
}

/**
 * Contenedor del viaje de scroll premium (anime.js + ejes no tradicionales).
 */
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

    const proxy = { p: 0.5 };
    const render = () => {
      const motion = sampleMotion(mode, proxy.p, compact);
      applyStageMotion(stage, motion);
      if (far) applyLayerMotion(far, proxy.p, 1.35, compact);
      if (mid) applyLayerMotion(mid, proxy.p, 0.75, compact);
    };

    render();

    const animation = animate(proxy, {
      p: [0, 1],
      ease: 'linear',
      autoplay: false,
      onRender: render,
    });

    const observer = onScroll({
      target: root,
      sync: compact ? 0.18 : 0.1,
      enter: 'top bottom',
      leave: 'bottom top',
      repeat: true,
    }).link(animation);

    return () => {
      observer.revert();
      animation.revert();
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
