'use client';

import { useEffect } from 'react';
import {
  checkReleaseSectionSnapOnScroll,
  handleWheelIntent,
  isSectionScrollLocked,
  isSectionSnapReleased,
  snapToNearestSection,
  syncNativeSectionSnap,
  usesAnimatedSectionScroll,
} from '@/lib/section-scroll';

export function SmoothSectionScroll() {
  useEffect(() => {
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    const syncSections = () => {
      syncNativeSectionSnap();
    };

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const enableWheelScroll = !reducedMotion.matches;

    const onWheel = (e: WheelEvent) => {
      if (!enableWheelScroll || !usesAnimatedSectionScroll()) return;

      if (isSectionScrollLocked()) {
        e.preventDefault();
        return;
      }

      const handled = handleWheelIntent(e.deltaY);
      if (handled) e.preventDefault();
    };

    const onScroll = () => {
      checkReleaseSectionSnapOnScroll();

      if (!enableWheelScroll || !usesAnimatedSectionScroll()) return;
      if (isSectionScrollLocked() || isSectionSnapReleased()) return;

      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        void snapToNearestSection();
      }, 160);
    };

    syncSections();
    requestAnimationFrame(() => {
      requestAnimationFrame(syncSections);
    });

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncSections, { passive: true });
    window.addEventListener('orientationchange', syncSections, {
      passive: true,
    });
    window.addEventListener('load', syncSections, { passive: true });

    const gateObserver = new MutationObserver(syncSections);
    gateObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-experience-gate'],
    });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncSections);
      window.removeEventListener('orientationchange', syncSections);
      window.removeEventListener('load', syncSections);
      gateObserver.disconnect();
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      document.documentElement.classList.remove('section-scroll-snap');
    };
  }, []);

  return null;
}
