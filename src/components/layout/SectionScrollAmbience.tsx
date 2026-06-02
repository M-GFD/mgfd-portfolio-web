'use client';

import { useEffect } from 'react';

export function SectionScrollAmbience() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (reducedMotion.matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.snap-section'),
    );
    if (sections.length === 0) return;

    const syncSectionVisibility = (section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      const visibleHeight =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const ratio =
        visibleHeight / Math.min(rect.height, window.innerHeight || 1);
      section.classList.toggle('section-in-view', ratio >= 0.42);
    };

    for (const section of sections) syncSectionVisibility(section);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle(
            'section-in-view',
            entry.isIntersecting && entry.intersectionRatio >= 0.42,
          );
        }
      },
      { threshold: [0.15, 0.42, 0.65] },
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return null;
}
