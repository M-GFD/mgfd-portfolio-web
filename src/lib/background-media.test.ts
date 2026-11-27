import { expect, it } from 'vitest';
import { pickBackgroundSrc } from './background-media';

it('elige resolución por píxeles físicos', () => {
  expect(pickBackgroundSrc(375, 3)).toBe('/images/bg_720.mp4');
  expect(pickBackgroundSrc(1280, 1)).toBe('/images/bg_720.mp4');
  expect(pickBackgroundSrc(1536, 1.25)).toBe('/images/bg_1080.mp4');
});
