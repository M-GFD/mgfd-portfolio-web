import { expect, it } from 'vitest';
import { SRGBColorSpace, Texture } from 'three';
import { prepareScreenTextures } from './prepare-texture';

it('marca cada textura para subir una sola vez aunque se llame en cada render', () => {
  const tex = new Texture();
  expect(prepareScreenTextures([tex], 8)).toEqual([tex]);
  expect(prepareScreenTextures([tex], 8)).toEqual([]);
  prepareScreenTextures(tex, 8);
  expect(tex.version).toBe(1);
  expect(tex.colorSpace).toBe(SRGBColorSpace);
  expect(tex.anisotropy).toBe(8);
});
