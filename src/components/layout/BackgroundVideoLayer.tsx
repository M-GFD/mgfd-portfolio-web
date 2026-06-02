'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BACKGROUND_VIDEO_SRC,
  primeBackgroundVideo,
  registerBackgroundVideo,
  tryPlayBackgroundVideo,
} from '@/lib/background-media';

export function BackgroundVideoLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    queueMicrotask(() => setPortalTarget(document.body));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    registerBackgroundVideo(video);
    return () => registerBackgroundVideo(null);
  }, [portalTarget]);

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
  }, [portalTarget]);

  if (!portalTarget) return null;

  return createPortal(
    <div aria-hidden className="bg-video-layer">
      <video
        ref={videoRef}
        className="bg-video-layer__media"
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
    </div>,
    portalTarget,
  );
}
