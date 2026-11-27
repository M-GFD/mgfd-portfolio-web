import { expect, it } from 'vitest';
import { canUseWebGL } from '@/lib/webgl';

it('false si no hay contexto', () => {
  expect(canUseWebGL(() => ({ getContext: () => null }) as unknown as HTMLCanvasElement)).toBe(false);
  expect(canUseWebGL(() => null)).toBe(false);
});
it('true con contexto webgl2', () => {
  expect(canUseWebGL(() => ({ getContext: (k: string) => (k === 'webgl2' ? {} : null) }) as unknown as HTMLCanvasElement)).toBe(true);
});
it('false con solo WebGL1: three (r163+) exige WebGL2', () => {
  expect(canUseWebGL(() => ({ getContext: (k: string) => (k === 'webgl' ? {} : null) }) as unknown as HTMLCanvasElement)).toBe(false);
});
