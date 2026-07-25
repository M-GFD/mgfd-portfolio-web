'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import {
  animate,
  onScroll,
  type JSAnimation,
  type ScrollObserver,
} from 'animejs';
import { cn } from '@/lib/utils';

type OrbitIntensity = 'full' | 'soft';

type CircularScrollOrbitProps = {
  children: ReactNode;
  className?: string;
};

function orbitConfig(intensity: OrbitIntensity, narrow: boolean) {
  // Ángulos más suaves para no percibir tirones al cruzar secciones.
  if (intensity === 'soft') {
    return narrow
      ? { angle: 8, radius: 36, perspective: 1100 }
      : { angle: 12, radius: 56, perspective: 1400 };
  }
  return narrow
    ? { angle: 14, radius: 52, perspective: 1200 }
    : { angle: 22, radius: 96, perspective: 1600 };
}

function applyOrbitTransform(
  panel: HTMLElement,
  progress: number,
  angleMax: number,
  radius: number,
  perspective: number,
) {
  // progress 0 → entra abajo; 0.5 → frente al eje; 1 → sale arriba
  const angle = angleMax * (1 - 2 * progress);
  const rad = (angle * Math.PI) / 180;
  const x = Math.sin(rad) * radius;
  const z = (Math.cos(rad) - 1) * radius;

  panel.style.transform = `perspective(${perspective}px) translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${angle.toFixed(3)}deg)`;
}

/**
 * Recorrido circular ligado al scroll con anime.js:
 * cada panel orbita alrededor de un eje vertical central.
 */
export function CircularScrollOrbit({
  children,
  className,
}: CircularScrollOrbitProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (reducedMotion.matches) return;

    const observers: ScrollObserver[] = [];
    const animations: JSAnimation[] = [];
    const proxies: Array<{ p: number }> = [];

    const setup = () => {
      observers.splice(0).forEach((o) => o.revert());
      animations.splice(0).forEach((a) => a.revert());
      proxies.length = 0;

      const narrow = window.matchMedia('(max-width: 639px)').matches;
      const panels = stage.querySelectorAll<HTMLElement>('[data-orbit-panel]');

      panels.forEach((panel) => {
        const intensity =
          (panel.dataset.orbitIntensity as OrbitIntensity | undefined) ??
          'full';
        const { angle, radius, perspective } = orbitConfig(intensity, narrow);

        panel.style.willChange = 'transform';
        panel.style.transformOrigin = '50% 50%';
        applyOrbitTransform(panel, 0.5, angle, radius, perspective);

        const proxy = { p: 0.5 };
        proxies.push(proxy);

        const animation = animate(proxy, {
          p: [0, 1],
          ease: 'linear',
          autoplay: false,
          onRender: () => {
            applyOrbitTransform(panel, proxy.p, angle, radius, perspective);
          },
        });

        const observer = onScroll({
          target: panel,
          // Sync lineal con el scroll: evita “rubber-band” de catch-up.
          sync: true,
          enter: 'bottom bottom',
          leave: 'top top',
          repeat: true,
        }).link(animation);

        animations.push(animation);
        observers.push(observer);
      });
    };

    setup();

    const onResize = () => setup();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      observers.forEach((o) => o.revert());
      animations.forEach((a) => a.revert());
      stage
        .querySelectorAll<HTMLElement>('[data-orbit-panel]')
        .forEach((panel) => {
          panel.style.removeProperty('transform');
          panel.style.removeProperty('will-change');
          panel.style.removeProperty('transform-origin');
        });
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={cn('orbit-stage', className)}
      data-orbit-stage=""
    >
      {children}
    </div>
  );
}

export function OrbitPanel({
  children,
  className,
  intensity = 'full',
}: {
  children: ReactNode;
  className?: string;
  intensity?: OrbitIntensity;
}) {
  return (
    <div
      className={cn('orbit-panel', className)}
      data-orbit-panel=""
      data-orbit-intensity={intensity}
    >
      {children}
    </div>
  );
}
