import { SRGBColorSpace, type Texture } from 'three';

const prepared = new WeakSet<Texture>();

/**
 * Configura las capturas para pantalla (sRGB, anisotropía) y las marca para subir a la GPU UNA vez.
 * drei llama a `onLoad` de `useTexture` en cada render en que cambia la identidad del callback; si cada
 * llamada pusiera `needsUpdate`, cada cambio de captura re-subiría todas las imágenes (cientos de ms).
 * Devuelve solo las texturas preparadas en esta llamada.
 */
export function prepareScreenTextures(loaded: Texture | Texture[], anisotropy: number): Texture[] {
  const fresh: Texture[] = [];
  for (const t of Array.isArray(loaded) ? loaded : [loaded]) {
    if (prepared.has(t)) continue;
    prepared.add(t);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = anisotropy;
    t.needsUpdate = true;
    fresh.push(t);
  }
  return fresh;
}
