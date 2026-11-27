export const BACKGROUND_POSTER_SRC = '/images/bg_poster.webp';

/** 720p alcanza hasta ~1400 px físicos de ancho; por encima, 1080p. */
export function pickBackgroundSrc(viewportWidth: number, dpr: number) {
  return viewportWidth * dpr <= 1400 ? '/images/bg_720.mp4' : '/images/bg_1080.mp4';
}

let backgroundVideoEl: HTMLVideoElement | null = null;

export function registerBackgroundVideo(el: HTMLVideoElement | null) {
  backgroundVideoEl = el;
}

/** Debe llamarse de forma síncrona dentro del click/tap del usuario (Android/iOS). */
export function playBackgroundVideoFromGesture() {
  if (!backgroundVideoEl) return undefined;
  return tryPlayBackgroundVideo(backgroundVideoEl);
}

export function tryPlayBackgroundVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('x5-playsinline', '');
  video.setAttribute('x5-video-player-type', 'h5');
  video.setAttribute('x5-video-player-fullscreen', 'false');
  return video.play().catch(() => undefined);
}

export function primeBackgroundVideo() {
  const video = backgroundVideoEl;
  if (!video) return;
  if (video.readyState === 0) {
    video.load();
  }
}
