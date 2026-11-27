'use client';

import { useEffect, useRef } from 'react';
import {
  BACKGROUND_POSTER_SRC,
  pickBackgroundSrc,
  primeBackgroundVideo,
  registerBackgroundVideo,
  tryPlayBackgroundVideo,
} from '@/lib/background-media';

function syncVisualViewport(container: HTMLElement) {
  const vv = window.visualViewport;

  if (vv) {
    container.style.top = `${vv.offsetTop}px`;
    container.style.left = `${vv.offsetLeft}px`;
    container.style.width = `${vv.width}px`;
    container.style.height = `${vv.height}px`;
    return;
  }

  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = `${window.innerHeight}px`;
}

export function BackgroundVideoLayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    registerBackgroundVideo(video);
    return () => registerBackgroundVideo(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sync = () => syncVisualViewport(container);

    sync();
    window.visualViewport?.addEventListener('resize', sync);
    window.visualViewport?.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);

    return () => {
      window.visualViewport?.removeEventListener('resize', sync);
      window.visualViewport?.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const kick = () => {
      void tryPlayBackgroundVideo(video);
    };

    // La resolución depende de los píxeles físicos del cliente: se elige aquí, no en el render del servidor.
    if (!video.getAttribute('src')) {
      video.src = pickBackgroundSrc(window.innerWidth, window.devicePixelRatio || 1);
    }

    kick();
    primeBackgroundVideo();
    video.addEventListener('loadeddata', kick);
    video.addEventListener('canplay', kick);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') kick();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      video.removeEventListener('loadeddata', kick);
      video.removeEventListener('canplay', kick);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden className="bg-video-layer">
      <video
        ref={videoRef}
        className="bg-video-layer__media"
        poster={BACKGROUND_POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      />
      <div className="bg-video-layer__scrim" aria-hidden />
      <div className="bg-video-layer__grain" aria-hidden />
    </div>
  );
}
