export type LayoutMode = 'pinned' | 'stacked' | 'static';

export const DESKTOP_MIN_WIDTH = 1024;

/** static con reduced-motion; pinned en escritorio (≥ 1024 px); stacked por debajo. */
export function layoutModeFor(width: number, reducedMotion: boolean): LayoutMode {
  if (reducedMotion) return 'static';
  return width >= DESKTOP_MIN_WIDTH ? 'pinned' : 'stacked';
}
