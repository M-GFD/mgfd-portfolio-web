export const BACKGROUND_VIDEO_SRC = '/images/portfolio_vid_bg.mp4';

/** Evento disparado al pulsar «Ingresar» (gesto de usuario → play en iOS). */
export const EXPERIENCE_ENTER_EVENT = 'mgfd:experience-enter';

export function dispatchExperienceEnter() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EXPERIENCE_ENTER_EVENT));
}

export function tryPlayBackgroundVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  return video.play().catch(() => undefined);
}
