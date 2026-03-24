'use client';

import { useEffect, useRef, useState } from 'react';
import { BACKGROUND_VIDEO_SOURCES } from '@/constants/backgroundVideos';

/**
 * Fondo de vídeo en bucle (abstracto, tratado en escala de grises + overlay).
 * Se desactiva si el usuario pide reducir movimiento.
 */
export function PageBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      void v.play().catch(() => {});
    };
    v.addEventListener('loadeddata', tryPlay);
    tryPlay();
    return () => v.removeEventListener('loadeddata', tryPlay);
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-neutral-100 dark:bg-neutral-950"
        aria-hidden
      />
    );
  }

  const src = BACKGROUND_VIDEO_SOURCES[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-110 object-cover opacity-[0.42] contrast-110 grayscale brightness-95 dark:opacity-[0.32] dark:brightness-75"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Velo para legibilidad; deja ver textura sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/93 via-white/88 to-white/94 dark:from-black/92 dark:via-black/88 dark:to-black/94" />
      {/* Ligero grano CSS */}
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
