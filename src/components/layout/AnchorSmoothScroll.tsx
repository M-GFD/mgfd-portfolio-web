'use client';

import { useEffect } from 'react';
import { scrollToSectionByHash } from '@/lib/section-scroll';

/** Anclas que disparan recorrido de la pila (clic o URL con hash). */
const DEPTH_NAV_HASHES = new Set(['#about', '#works', '#technologies']);

function resolveHashFromHref(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.startsWith('#')) {
    return trimmed.length > 1 ? trimmed : null;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    // En home: scroll suave. Desde /blog u otra ruta: navegación normal a /#sección.
    if (url.pathname !== window.location.pathname) return null;
    return url.hash.length > 1 ? url.hash : null;
  } catch {
    return null;
  }
}

function hashTargetExists(hash: string): boolean {
  if (hash === '#contact') return false;
  if (document.querySelector(hash)) return true;
  return Boolean(
    document.querySelector('[data-scroll-journey]') && DEPTH_NAV_HASHES.has(hash),
  );
}

export function AnchorSmoothScroll() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const onClickCapture = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const el = (e.target as HTMLElement | null)?.closest?.('a');
      if (!el || !(el instanceof HTMLAnchorElement)) return;

      const href = el.getAttribute('href');
      if (!href) return;

      const hash = resolveHashFromHref(href);
      if (!hash) return;

      if (!hashTargetExists(hash)) return;

      e.preventDefault();
      void scrollToSectionByHash(hash);
    };

    document.addEventListener('click', onClickCapture, true);

    const initialHash = window.location.hash;
    // Solo honrar hash de navegación intencional; nunca auto-recorrer en "/" limpio.
    if (DEPTH_NAV_HASHES.has(initialHash) && hashTargetExists(initialHash)) {
      void scrollToSectionByHash(initialHash);
    } else if (initialHash === '#contact' || !initialHash) {
      window.scrollTo(0, 0);
      if (initialHash === '#contact') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    const onHashChange = () => {
      const hash = window.location.hash;
      if (DEPTH_NAV_HASHES.has(hash) && hashTargetExists(hash)) {
        void scrollToSectionByHash(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      document.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return null;
}
