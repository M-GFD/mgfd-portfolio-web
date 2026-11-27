import { expect, it } from 'vitest';
import { layoutModeFor } from './layout-mode';

it('elige modo por ancho y reduced-motion', () => {
  expect(layoutModeFor(1536, false)).toBe('pinned');
  expect(layoutModeFor(1024, false)).toBe('pinned');
  expect(layoutModeFor(1023, false)).toBe('stacked');
  expect(layoutModeFor(375, false)).toBe('stacked');
  expect(layoutModeFor(1536, true)).toBe('static');
});
