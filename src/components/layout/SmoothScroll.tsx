'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { scrollToHash, setLenis, shouldUseSmoothScroll } from '@/lib/smooth-scroll';

/**
 * Scroll suave (Lenis) en escritorio con puntero fino; nativo en táctil y reduced-motion.
 * También intercepta los links `#hash` para respetar el header y los destinos registrados.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let instance: Lenis | null = null;
    let raf = 0;

    const start = () => {
      stop();
      if (!shouldUseSmoothScroll({ finePointer: fine.matches, reducedMotion: reduced.matches })) {
        return;
      }
      instance = new Lenis({ lerp: 0.085, smoothWheel: true });
      setLenis(instance);
      const loop = (time: number) => {
        instance?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement | null)?.closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      e.preventDefault();
      scrollToHash(url.hash);
    };

    start();
    fine.addEventListener('change', start);
    reduced.addEventListener('change', start);
    document.addEventListener('click', onClick);

    // Llegada con hash (/#works): esperar a que el layout se asiente.
    if (window.location.hash) {
      const hash = window.location.hash;
      window.setTimeout(() => scrollToHash(hash), 400);
    }

    return () => {
      fine.removeEventListener('change', start);
      reduced.removeEventListener('change', start);
      document.removeEventListener('click', onClick);
      stop();
    };
  }, []);

  return null;
}
