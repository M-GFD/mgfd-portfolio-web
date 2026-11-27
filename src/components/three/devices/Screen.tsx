'use client';

import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { invalidate, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MathUtils, type MeshBasicMaterial, type Texture } from 'three';
import { prepareScreenTextures } from './prepare-texture';
import { squirclePlane } from '../geometry/squircle';
import { DeviceFadeContext, useDeviceMaterials } from './materials';

type ScreenProps = {
  urls: string[];
  active: number;
  width: number;
  height: number;
  radius: number;
  /** Tamaño del cristal (cubre los biseles); por defecto, el de la pantalla. */
  glass?: { width: number; height: number; radius: number };
};

/** Pantalla emisiva con fundido entre capturas y cristal reflectante encima. */
export function Screen({ urls, active, width, height, radius, glass }: ScreenProps) {
  const gl = useThree((s) => s.gl);
  // drei sube cada textura a la GPU apenas se monta (initTexture); acá solo se configura una vez.
  const onLoad = useCallback(
    (loaded: Texture | Texture[]) => void prepareScreenTextures(loaded, gl.capabilities.getMaxAnisotropy()),
    [gl],
  );
  const textures = useTexture(urls, onLoad) as Texture[];
  const [initial] = useState(active);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const mix = useRef<number[]>([]);
  const fade = useContext(DeviceFadeContext);
  const glassMat = useDeviceMaterials().glass;

  useLayoutEffect(() => {
    invalidate();
  }, [textures]);

  const screenGeo = useMemo(() => squirclePlane(width, height, radius), [width, height, radius]);
  const glassGeo = useMemo(
    () => squirclePlane(glass?.width ?? width, glass?.height ?? height, glass?.radius ?? radius),
    [glass?.width, glass?.height, glass?.radius, width, height, radius],
  );

  useFrame((_, dt) => {
    const f = fade ? fade.current : 1;
    let moving = false;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const target = i === active ? 1 : 0;
      let w = mix.current[i] ?? (i === initial ? 1 : 0);
      if (w !== target) {
        const next = MathUtils.damp(w, target, 7, dt);
        w = Math.abs(next - target) < 0.003 ? target : next;
        moving = true;
      }
      mix.current[i] = w;
      m.opacity = w * f;
    });
    if (moving) invalidate();
  });

  return (
    <group>
      {textures.map((tex, i) => (
        <mesh key={urls[i]} geometry={screenGeo} position-z={i * 0.0004} renderOrder={1 + i}>
          <meshBasicMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            map={tex}
            toneMapped={false}
            transparent
            depthWrite={false}
            opacity={i === initial ? 1 : 0}
          />
        </mesh>
      ))}
      <mesh geometry={glassGeo} material={glassMat} position-z={0.002} renderOrder={20} />
    </group>
  );
}
