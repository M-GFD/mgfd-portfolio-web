'use client';

import { useEffect } from 'react';
import {
  handleSwipeIntent,
  handleTouchScrollIntent,
  handleWheelIntent,
  isCoarsePointerDevice,
  isSectionScrollLocked,
  resetScrollIntent,
  shouldAllowNativeVerticalScroll,
  shouldCaptureTouchForSections,
  snapToNearestSection,
  syncSectionScrollTouchMode,
} from '@/lib/section-scroll';

const TOUCH_OPTS = { passive: false, capture: true } as const;
const PASSIVE = { passive: true } as const;

export function SmoothSectionScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (reducedMotion.matches) return;

    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const scrollEndDelayMs = () => (coarsePointer.matches ? 280 : 160);

    let touchStartY = 0;
    let touchStartX = 0;
    let lastTouchY = 0;
    let touchCapturing = false;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    const syncMode = () => {
      syncSectionScrollTouchMode();
    };

    const onWheel = (e: WheelEvent) => {
      if (isSectionScrollLocked()) {
        e.preventDefault();
        return;
      }

      const handled = handleWheelIntent(e.deltaY);
      if (handled) e.preventDefault();
    };

    const onTouchStart = (e: TouchEvent) => {
      syncMode();

      const touch = e.touches[0];
      if (!touch) return;

      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
      lastTouchY = touch.clientY;
      touchCapturing = shouldCaptureTouchForSections();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchCapturing) return;

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

      if (shouldAllowNativeVerticalScroll(deltaY)) {
        touchCapturing = false;
        syncMode();
        return;
      }

      e.preventDefault();
      handleTouchScrollIntent(deltaY);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isSectionScrollLocked()) {
        touchCapturing = false;
        syncMode();
        return;
      }

      const touch = e.changedTouches[0];
      if (touch && touchCapturing) {
        const deltaY = touchStartY - touch.clientY;
        const deltaX = touchStartX - touch.clientX;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          handleSwipeIntent(deltaY);
        }
      }

      touchCapturing = false;
      resetScrollIntent();
      syncMode();
      void snapToNearestSection();
    };

    const onTouchCancel = () => {
      touchCapturing = false;
      resetScrollIntent();
      syncMode();
      void snapToNearestSection();
    };

    const onScroll = () => {
      syncMode();
      if (isSectionScrollLocked()) return;
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        void snapToNearestSection();
      }, scrollEndDelayMs());
    };

    syncMode();
    if (isCoarsePointerDevice()) {
      void snapToNearestSection();
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchstart', onTouchStart, PASSIVE);
    document.addEventListener('touchmove', onTouchMove, TOUCH_OPTS);
    document.addEventListener('touchend', onTouchEnd, PASSIVE);
    document.addEventListener('touchcancel', onTouchCancel, PASSIVE);
    window.addEventListener('scroll', onScroll, PASSIVE);
    window.addEventListener('resize', syncMode, PASSIVE);

    const gateObserver = new MutationObserver(syncMode);
    gateObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-experience-gate'],
    });

    return () => {
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove, TOUCH_OPTS);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncMode);
      gateObserver.disconnect();
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      document.documentElement.classList.remove(
        'section-scroll-touch-lock',
        'section-scroll-touch-native',
        'section-scroll-animating',
      );
    };
  }, []);

  return null;
}
