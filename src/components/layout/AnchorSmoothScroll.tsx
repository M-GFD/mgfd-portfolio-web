'use client';

import { useEffect } from 'react';
import { scrollToSectionByHash } from '@/lib/section-scroll';

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
  if (document.querySelector(hash)) return true;
  // Contacto / anclas de la pila pueden resolverse aunque el id esté en capa absoluta.
  return Boolean(
    document.querySelector('[data-scroll-journey]') &&
      (hash === '#contact' ||
        hash === '#hero' ||
        hash === '#about' ||
        hash === '#works' ||
        hash === '#technologies'),
  );
}

export function AnchorSmoothScroll() {
  useEffect(() => {
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

    // Carga con /#about, /#works, etc.
    const initialHash = window.location.hash;
    if (initialHash.length > 1 && hashTargetExists(initialHash)) {
      void scrollToSectionByHash(initialHash);
    }

    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash.length > 1 && hashTargetExists(hash)) {
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
