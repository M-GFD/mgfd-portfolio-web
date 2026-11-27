import { expect, it } from 'vitest';
import { poseAt, sceneProgress, sceneRestScrollY, slotsFor, SCENE_PHASES } from './scene-motion';

const slot = slotsFor(['laptop', 'phone'])[1];

it('entra desde fuera y con opacidad 0', () => {
  const p = poseAt(slot, 0);
  expect(p.opacity).toBe(0);
  expect(Math.abs(p.x - slot.rest.x) + Math.abs(p.y - slot.rest.y)).toBeGreaterThan(2);
});
it('reposo exacto en todo el tramo de hold', () => {
  for (const t of [SCENE_PHASES.enterEnd, 0.5, SCENE_PHASES.holdEnd]) expect(poseAt(slot, t)).toEqual(slot.rest);
});
it('sale con opacidad 0 al final', () => {
  expect(poseAt(slot, 1).opacity).toBe(0);
});
it('recorta el progreso fuera de rango (fling / salto)', () => {
  expect(poseAt(slot, -3)).toEqual(poseAt(slot, 0));
  expect(poseAt(slot, 7)).toEqual(poseAt(slot, 1));
});
it('sceneProgress mapea el tramo fijado a 0..1', () => {
  expect(sceneProgress({ top: 0, height: 2200 }, 1000)).toBe(0);
  expect(sceneProgress({ top: -1200, height: 2200 }, 1000)).toBe(1);
  expect(sceneProgress({ top: -600, height: 2200 }, 1000)).toBeCloseTo(0.5);
  expect(sceneProgress({ top: 500, height: 2200 }, 1000)).toBe(0);
});
it('sceneRestScrollY cae en el centro del reposo', () => {
  expect(sceneRestScrollY(3000, 2200, 1000)).toBeCloseTo(3000 + 1200 * 0.55);
});
it('slotsFor da un slot por equipo y composiciones distintas', () => {
  expect(slotsFor(['laptop']).length).toBe(1);
  expect(slotsFor(['laptop', 'tablet', 'phone']).map((s) => s.device)).toEqual(['laptop', 'tablet', 'phone']);
});
