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

      if (!document.querySelector(hash)) return;

      e.preventDefault();
      void scrollToSectionByHash(hash);
    };

    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, []);

  return null;
}
