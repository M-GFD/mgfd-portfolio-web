'use client';

import { useEffect } from 'react';

function getMaxScrollY(): number {
  const el = document.documentElement;
  const body = document.body;
  const height = Math.max(el.scrollHeight, el.offsetHeight, body.scrollHeight, body.offsetHeight);
  return Math.max(0, height - window.innerHeight);
}

/**
 * Cierre tipo cajón amortiguado: expo ease-out + tramo final fundido hacia 1
 * para que en pasos discretos (rAF) no quede un “saltito” al llegar.
 */
function easeSoftClose(t: number) {
  if (t >= 1) return 1;
  const k = 7.5;
  const expo = 1 - 2 ** (-k * t);
  const blendStart = 0.86;
  if (t <= blendStart) return expo;
  const u = (t - blendStart) / (1 - blendStart);
  const e0 = 1 - 2 ** (-k * blendStart);
  // Último ~14% del tiempo: transición suave hasta 1 (sin asintota infinita)
  return e0 + (1 - e0) * (1 - (1 - u) ** 2.2);
}

function resolveHashFromHref(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.startsWith('#')) {
    return trimmed.length > 1 ? trimmed : null;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname !== window.location.pathname) return null;
    return url.hash.length > 1 ? url.hash : null;
  } catch {
    return null;
  }
}

export function AnchorSmoothScroll() {
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = (e.target as HTMLElement | null)?.closest?.('a');
      if (!el || !(el instanceof HTMLAnchorElement)) return;

      const href = el.getAttribute('href');
      if (!href) return;

      const hash = resolveHashFromHref(href);
      if (!hash) return;

      const section = document.querySelector(hash);
      if (!section) return;

      e.preventDefault();

      const header = document.querySelector('header');
      const headerH = header?.getBoundingClientRect().height ?? 0;
      const gap = 8;

      const rawTarget =
        section.getBoundingClientRect().top + window.scrollY - headerH - gap;
      const maxY = getMaxScrollY();
      const clampedTarget = Math.min(Math.max(0, rawTarget), maxY);

      const startY = window.scrollY;
      const distance = clampedTarget - startY;

      if (Math.abs(distance) < 1) {
        window.scrollTo(0, clampedTarget);
        history.replaceState(null, '', hash);
        return;
      }

      const duration = Math.min(
        2600,
        Math.max(760, Math.pow(Math.abs(distance), 0.5) * 1.12),
      );

      let startTime: number | null = null;
      let lastY = startY;

      const step = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const linear = Math.min(1, elapsed / duration);
        const eased = easeSoftClose(linear);

        let y = startY + distance * eased;
        if (linear >= 1) {
          y = clampedTarget;
        }
        y = Math.min(Math.max(0, y), maxY);

        window.scrollTo(0, y);
        lastY = y;

        if (linear < 1) {
          requestAnimationFrame(step);
        } else {
          if (Math.abs(lastY - clampedTarget) > 0.5) {
            window.scrollTo(0, clampedTarget);
          }
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
