export const BACKGROUND_VIDEO_SRC = '/images/portfolio_vid_bg.mp4';

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
