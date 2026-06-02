'use client';

import { useEffect } from 'react';
import {
  handleSwipeIntent,
  handleWheelIntent,
  isSectionScrollLocked,
  snapToNearestSection,
} from '@/lib/section-scroll';

export function SmoothSectionScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (reducedMotion.matches) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      if (isSectionScrollLocked()) {
        e.preventDefault();
        return;
      }

      const handled = handleWheelIntent(e.deltaY);
      if (handled) e.preventDefault();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchStartX = e.touches[0]?.clientX ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isSectionScrollLocked()) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaY = touchStartY - touch.clientY;
      const deltaX = touchStartX - touch.clientX;

      if (Math.abs(deltaY) <= Math.abs(deltaX)) return;

      handleSwipeIntent(deltaY);
    };

    const onScroll = () => {
      if (isSectionScrollLocked()) return;
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        void snapToNearestSection();
      }, 160);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, []);

  return null;
}
