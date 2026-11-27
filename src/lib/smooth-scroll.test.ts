import { expect, it } from 'vitest';
import { shouldUseSmoothScroll } from './smooth-scroll';

it('solo con puntero fino y sin reduced-motion', () => {
  expect(shouldUseSmoothScroll({ finePointer: true, reducedMotion: false })).toBe(true);
  expect(shouldUseSmoothScroll({ finePointer: false, reducedMotion: false })).toBe(false);
  expect(shouldUseSmoothScroll({ finePointer: true, reducedMotion: true })).toBe(false);
});
