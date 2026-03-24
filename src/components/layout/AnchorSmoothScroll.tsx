'use client';

import { useEffect } from 'react';

function getMaxScrollY(): number {
  const el = document.documentElement;
  const body = document.body;
  const height = Math.max(el.scrollHeight, el.offsetHeight, body.scrollHeight, body.offsetHeight);
  return Math.max(0, height - window.innerHeight);
}

/** ScrollY para alinear el borde superior del ancla justo bajo el header (sin hueco extra). */
function computeTargetScrollY(section: Element, header: Element | null, maxY: number): number {
  const headerH = header?.getBoundingClientRect().height ?? 0;
  const raw = section.getBoundingClientRect().top + window.scrollY - headerH;
  return Math.min(Math.max(0, raw), maxY);
}

function finishScroll(hash: string) {
  const section = document.querySelector(hash);
  if (!section) {
    history.replaceState(null, '', hash);
    return;
  }
  const headerEl = document.querySelector('header');
  const maxY = getMaxScrollY();
  const y = Math.round(computeTargetScrollY(section, headerEl, maxY));
  window.scrollTo(0, y);
  history.replaceState(null, '', hash);
}

/**
 * λ adaptativo: respuesta clara con mucho recorrido, y amortiguación muy suave
 * al acercarse al destino (velocidad → 0 sin “último fotograma” brusco).
 */
function lambdaForRemaining(absRemaining: number): number {
  if (absRemaining > 520) return 3.5;
  if (absRemaining > 280) return 2.9;
  if (absRemaining > 140) return 2.25;
  if (absRemaining > 72) return 1.75;
  if (absRemaining > 36) return 1.35;
  if (absRemaining > 18) return 1.05;
  if (absRemaining > 9) return 0.82;
  if (absRemaining > 4) return 0.62;
  return 0.48;
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
    let rafId = 0;

    const cancelScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

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
      cancelScroll();

      const header = document.querySelector('header');
      const maxY = getMaxScrollY();
      const clampedTarget = computeTargetScrollY(section, header, maxY);

      const startY = window.scrollY;
      const distance = clampedTarget - startY;

      if (Math.abs(distance) < 0.35) {
        finishScroll(hash);
        return;
      }

      let prevTime = performance.now();
      const t0 = prevTime;
      const maxDuration = 6500;

      const step = (now: number) => {
        const dt = Math.min((now - prevTime) / 1000, 0.05);
        prevTime = now;

        const maxYNow = getMaxScrollY();
        const headerNow = document.querySelector('header');
        const target = computeTargetScrollY(section, headerNow, maxYNow);
        const current = window.scrollY;
        const remaining = target - current;
        const absR = Math.abs(remaining);

        // Umbral bajo: el cierre exacto lo hace finishScroll (relectura DOM + redondeo)
        if (absR < 0.35) {
          rafId = 0;
          finishScroll(hash);
          return;
        }

        if (now - t0 > maxDuration) {
          rafId = 0;
          finishScroll(hash);
          return;
        }

        const lambda = lambdaForRemaining(absR);
        const alpha = 1 - Math.exp(-lambda * dt);
        let next = current + remaining * alpha;
        next = Math.min(Math.max(0, next), maxYNow);

        window.scrollTo(0, next);
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
    };

    document.addEventListener('click', onClickCapture, true);
    return () => {
      cancelScroll();
      document.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  return null;
}
