import { expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { mockupScreens, screensFor } from './mockup-screens';

const MIN = { laptop: [1600, 1000], tablet: [900, 1300], phone: [500, 1000] } as const;

it('cubre los 5 proyectos en orden', () => {
  expect(mockupScreens.map((s) => s.projectId)).toEqual([6, 5, 1, 2, 3]);
});

it('asigna los equipos del spec', () => {
  expect(Object.keys(screensFor(6).devices).sort()).toEqual(['laptop', 'phone', 'tablet']);
  expect(Object.keys(screensFor(5).devices).sort()).toEqual(['laptop', 'phone', 'tablet']);
  expect(Object.keys(screensFor(1).devices).sort()).toEqual(['laptop', 'phone']);
  expect(Object.keys(screensFor(2).devices).sort()).toEqual(['laptop', 'phone']);
  expect(Object.keys(screensFor(3).devices)).toEqual(['laptop']);
});

it('todas las pantallas existen en disco como webp', () => {
  for (const s of mockupScreens)
    for (const list of Object.values(s.devices))
      for (const src of list!) {
        expect(src).toMatch(/^\/images\/mockups\/.+\.webp$/);
        expect(existsSync(`public${src}`)).toBe(true);
      }
});

it('las capturas de Vertic y FEG tienen resolución 2x', async () => {
  for (const id of [6, 5])
    for (const [kind, list] of Object.entries(screensFor(id).devices)) {
      const m = await sharp(`public${list![0]}`).metadata();
      const [w, h] = MIN[kind as keyof typeof MIN];
      expect(m.width).toBeGreaterThanOrEqual(w);
      expect(m.height).toBeGreaterThanOrEqual(h);
    }
});

it('screensFor lanza con id desconocido', () => {
  expect(() => screensFor(999)).toThrow();
});
