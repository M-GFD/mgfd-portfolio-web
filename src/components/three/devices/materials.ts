import { createContext, useContext } from 'react';
import {
  AdditiveBlending,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three';

export type DeviceMaterials = {
  aluminum: MeshPhysicalMaterial;
  graphite: MeshPhysicalMaterial;
  frame: MeshPhysicalMaterial;
  keys: MeshStandardMaterial;
  well: MeshStandardMaterial;
  trackpad: MeshPhysicalMaterial;
  glass: MeshPhysicalMaterial;
  lens: MeshPhysicalMaterial;
};

let cached: DeviceMaterials | null = null;

/**
 * Crea un juego de materiales. Con `fadeable`, todos quedan transparentes desde el inicio
 * (un solo programa de shader) para poder desvanecer una escena entera por opacidad.
 */
export function createDeviceMaterials(fadeable = false): DeviceMaterials {
  const set = buildMaterials();
  if (fadeable) {
    for (const mat of Object.values(set)) mat.transparent = true;
  }
  return set;
}

/** Juego de materiales de la escena actual (o el compartido si no hay proveedor). */
export const DeviceMaterialsContext = createContext<DeviceMaterials | null>(null);
export function useDeviceMaterials(): DeviceMaterials {
  return useContext(DeviceMaterialsContext) ?? deviceMaterials();
}

/** Opacidad global de la escena (0..1) que la pantalla multiplica por su fundido propio. */
export const DeviceFadeContext = createContext<{ current: number } | null>(null);

/**
 * Materiales compartidos por todos los equipos (una sola instancia por material).
 * El vidrio es un dieléctrico negro con mezcla aditiva: solo suma el reflejo especular
 * (Fresnel) sobre la pantalla, como un cristal real, sin velarla.
 */
export function deviceMaterials(): DeviceMaterials {
  if (cached) return cached;
  cached = buildMaterials();
  return cached;
}

function buildMaterials(): DeviceMaterials {
  return {
    aluminum: new MeshPhysicalMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.32, clearcoat: 0.3, clearcoatRoughness: 0.25 }),
    graphite: new MeshPhysicalMaterial({ color: '#2b2d31', metalness: 1, roughness: 0.32, clearcoat: 0.3, clearcoatRoughness: 0.25 }),
    frame: new MeshPhysicalMaterial({ color: '#050506', metalness: 0, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
    keys: new MeshStandardMaterial({ color: '#0c0c0e', metalness: 0, roughness: 0.62 }),
    well: new MeshStandardMaterial({ color: '#17181b', metalness: 0.3, roughness: 0.5 }),
    trackpad: new MeshPhysicalMaterial({ color: '#b8bbc1', metalness: 1, roughness: 0.2, clearcoat: 0.5, clearcoatRoughness: 0.1 }),
    glass: new MeshPhysicalMaterial({
      color: '#000000',
      metalness: 0,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      transmission: 0,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
    lens: new MeshPhysicalMaterial({ color: '#07080b', metalness: 0.2, roughness: 0.08, clearcoat: 1 }),
  };
}
