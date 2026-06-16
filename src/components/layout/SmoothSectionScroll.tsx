'use client';

import { useEffect } from 'react';
import {
  handleSwipeIntent,
  handleTouchScrollIntent,
  handleWheelIntent,
  isSectionScrollLocked,
  resetScrollIntent,
  shouldAllowNativeVerticalScroll,
  snapToNearestSection,
} from '@/lib/section-scroll';

export function SmoothSectionScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (reducedMotion.matches) return;

    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const scrollEndDelayMs = () => (coarsePointer.matches ? 320 : 160);

    let touchStartY = 0;
    let touchStartX = 0;
    let lastTouchY = 0;
    let touchTracking = false;
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
      const touch = e.touches[0];
      if (!touch) return;

      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
      lastTouchY = touch.clientY;
      touchTracking = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchTracking) return;

      if (isSectionScrollLocked()) {
        e.preventDefault();
        return;
      }

      const touch = e.touches[0];
      if (!touch) return;

      const deltaY = lastTouchY - touch.clientY;
      lastTouchY = touch.clientY;

      const totalDeltaY = touchStartY - touch.clientY;
      const totalDeltaX = touchStartX - touch.clientX;
      if (Math.abs(totalDeltaY) <= Math.abs(totalDeltaX)) return;

      if (shouldAllowNativeVerticalScroll(deltaY)) return;

      e.preventDefault();
      handleTouchScrollIntent(deltaY);
    };

    const onTouchEnd = (e: TouchEvent) => {
      touchTracking = false;

      if (isSectionScrollLocked()) return;

      const touch = e.changedTouches[0];
      if (touch) {
        const deltaY = touchStartY - touch.clientY;
        const deltaX = touchStartX - touch.clientX;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          handleSwipeIntent(deltaY);
        }
      }

      resetScrollIntent();
      void snapToNearestSection();
    };

    const onTouchCancel = () => {
      touchTracking = false;
      resetScrollIntent();
      void snapToNearestSection();
    };

    const onScroll = () => {
      if (isSectionScrollLocked()) return;
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        void snapToNearestSection();
      }, scrollEndDelayMs());
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
      window.removeEventListener('scroll', onScroll);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, []);

  return null;
}
