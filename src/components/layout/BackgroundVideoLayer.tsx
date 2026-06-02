'use client';

import { useEffect, useRef } from 'react';
import {
  BACKGROUND_VIDEO_SRC,
  primeBackgroundVideo,
  registerBackgroundVideo,
  tryPlayBackgroundVideo,
} from '@/lib/background-media';

export function BackgroundVideoLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    registerBackgroundVideo(video);
    return () => registerBackgroundVideo(null);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const kick = () => {
      void tryPlayBackgroundVideo(video);
    };

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
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 [transform:translateZ(0)]"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center [transform:translateZ(0)]"
        src={BACKGROUND_VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      />
      <div
        className="absolute inset-0 bg-zinc-950/54 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        aria-hidden
      />
    </div>
  );
}
