'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MathUtils, SRGBColorSpace, type MeshBasicMaterial, type Texture } from 'three';
import { squirclePlane } from '../geometry/squircle';
import { deviceMaterials } from './materials';

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
  const textures = useTexture(urls) as Texture[];
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const [initial] = useState(active);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);

  useLayoutEffect(() => {
    const aniso = gl.capabilities.getMaxAnisotropy();
    for (const t of textures) {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = aniso;
      t.needsUpdate = true;
    }
    invalidate();
  }, [textures, gl, invalidate]);

  const screenGeo = useMemo(() => squirclePlane(width, height, radius), [width, height, radius]);
  const glassGeo = useMemo(
    () => squirclePlane(glass?.width ?? width, glass?.height ?? height, glass?.radius ?? radius),
    [glass?.width, glass?.height, glass?.radius, width, height, radius],
  );

  useFrame((_, dt) => {
    let moving = false;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const target = i === active ? 1 : 0;
      if (m.opacity === target) return;
      const next = MathUtils.damp(m.opacity, target, 7, dt);
      m.opacity = Math.abs(next - target) < 0.003 ? target : next;
      moving = true;
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
      <mesh geometry={glassGeo} material={deviceMaterials().glass} position-z={0.002} renderOrder={20} />
    </group>
  );
}
