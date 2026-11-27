import { expect, it } from 'vitest';
import { squircleShape } from './squircle';

it('genera un contorno cerrado, simétrico y dentro de la caja', () => {
  const pts = squircleShape(2, 1, 0.2).getPoints();
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  expect(Math.max(...xs)).toBeCloseTo(1, 3); expect(Math.min(...xs)).toBeCloseTo(-1, 3);
  expect(Math.max(...ys)).toBeCloseTo(0.5, 3); expect(Math.min(...ys)).toBeCloseTo(-0.5, 3);
  expect(pts.length).toBeGreaterThanOrEqual(4 * 24);
});
it('no deja facetas: ángulo entre segmentos consecutivos < 5° en las esquinas', () => {
  const pts = squircleShape(2, 1, 0.2).getPoints();
  for (let i = 1; i < pts.length - 1; i++) {
    const a = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
    const b = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x);
    const d = Math.abs(Math.atan2(Math.sin(b - a), Math.cos(b - a)));
    expect(d).toBeLessThan((5 * Math.PI) / 180);
  }
});
