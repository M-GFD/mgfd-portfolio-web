'use client';

import { useEffect } from 'react';

/**
 * Scroll libre nativo: sin snap de sección ni hijack del wheel.
 * Los anclas (#about, etc.) siguen usando animateScrollTo en AnchorSmoothScroll.
 */
export function SmoothSectionScroll() {
  useEffect(() => {
    document.documentElement.classList.remove('section-scroll-snap');
    return () => {
      document.documentElement.classList.remove('section-scroll-snap');
    };
  }, []);

  return null;
}
