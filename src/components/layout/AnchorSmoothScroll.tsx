'use client';

import { useEffect } from 'react';

/**
 * Como cierre suave de cajón: casi todo el recorrido con inercia y un tramo final
 * muy largo y “flotante” (decelera de forma casi exponencial hasta posarse).
 */
function easeSoftClose(t: number) {
  if (t >= 1) return 1;
  // Expo ease-out; exponente bajo = menos brusco al inicio y más “desliz” al final
  return 1 - 2 ** (-8 * t);
}

export function AnchorSmoothScroll() {
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!el || !(el instanceof HTMLAnchorElement)) return;

      const href = el.getAttribute('href');
      if (!href || href === '#') return;

      let hash: string;
      try {
        const url = new URL(href, window.location.href);
        if (url.pathname !== window.location.pathname) return;
        hash = url.hash;
      } catch {
        return;
      }
      if (!hash) return;

      const section = document.querySelector(hash);
      if (!section) return;

      e.preventDefault();

      const header = document.querySelector('header');
      const headerH = header?.getBoundingClientRect().height ?? 0;
      const gap = 8;
      const targetTop =
        section.getBoundingClientRect().top + window.scrollY - headerH - gap;
      const startY = window.scrollY;
      const distance = targetTop - startY;

      if (Math.abs(distance) < 1) {
        history.replaceState(null, '', hash);
        return;
      }

      const duration = Math.min(
        2400,
        Math.max(720, Math.pow(Math.abs(distance), 0.52) * 1.08),
      );

      let startTime: number | null = null;

      const step = (now: number) => {
        if (startTime === null) startTime = now;
        const linear = Math.min(1, (now - startTime) / duration);
        const eased = easeSoftClose(linear);
        window.scrollTo(0, startY + distance * eased);
        if (linear < 1) {
          requestAnimationFrame(step);
        } else {
          history.replaceState(null, '', hash);
        }
      };

      requestAnimationFrame(step);
    };

    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, []);

  return null;
}
