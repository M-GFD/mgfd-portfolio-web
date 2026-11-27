import { expect, it } from 'vitest';
import { createFrameBudget } from './frame-budget';

const feed = (check: (dt: number) => boolean, dts: number[]) => dts.map(check).filter(Boolean).length;

it('pide bajar la resolución una sola vez tras dos ventanas seguidas por encima del presupuesto', () => {
  const check = createFrameBudget();
  expect(feed(check, Array(30).fill(0.04))).toBe(0);
  expect(feed(check, Array(30).fill(0.04))).toBe(1);
  expect(feed(check, Array(90).fill(0.05))).toBe(0);
});

it('no pide nada si los cuadros entran en el presupuesto', () => {
  const check = createFrameBudget();
  expect(feed(check, Array(120).fill(0.012))).toBe(0);
});

it('una ventana buena corta la racha', () => {
  const check = createFrameBudget();
  expect(feed(check, [...Array(30).fill(0.04), ...Array(30).fill(0.01), ...Array(30).fill(0.04)])).toBe(0);
});

it('ignora reposos entre ráfagas y tirones aislados de carga (> 100 ms)', () => {
  const check = createFrameBudget();
  const hitches = Array(40).fill(0.9);
  expect(feed(check, [...Array(59).fill(0.008), ...hitches, ...Array(10).fill(0.008)])).toBe(0);
  const fresh = createFrameBudget();
  expect(feed(fresh, [...Array(59).fill(0.04), 1.5, 0.3, 0.12])).toBe(0);
  expect(fresh(0.04)).toBe(true);
});
