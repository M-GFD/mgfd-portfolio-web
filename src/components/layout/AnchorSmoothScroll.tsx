'use client';

import { useEffect } from 'react';

/**
 * ease-out fuerte: algo de avance al inicio, luego frena muy suave hasta parar.
 * (t=0 derivada alta → sensación de respuesta inmediata; final casi plano → llegada suave)
 */
function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4;
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
        1100,
        Math.max(420, Math.pow(Math.abs(distance), 0.62) * 0.72),
      );

      let startTime: number | null = null;

      const step = (now: number) => {
        if (startTime === null) startTime = now;
        const linear = Math.min(1, (now - startTime) / duration);
        const eased = easeOutQuart(linear);
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
