'use client';

import { CircleGeometry } from 'three';
import { squircleBody, squirclePlane } from '../geometry/squircle';
import { useDeviceMaterials } from './materials';
import { Screen } from './Screen';
import { screenState, type DeviceProps } from './shared';

const W = 1.79;
const H = 2.47;
const D = 0.06;
const R = 0.18;
const SCREEN_W = 1.65;
const SCREEN_H = 2.36;

/** Tablet de aluminio con bisel negro uniforme y cámara frontal. */
/** Geometrías de dimensiones fijas: se construyen una vez y las comparten todas las escenas. */
let cache: ReturnType<typeof build> | null = null;
function build() {
  return {
    body: squircleBody(W, H, R, D),
    bezel: squirclePlane(W - 0.03, H - 0.03, R - 0.015),
    camera: new CircleGeometry(0.009, 24),
  };
}
function geometries() {
  return (cache ??= build());
}

export function Tablet({ screen, screens, cycle, ...group }: DeviceProps) {
  const m = useDeviceMaterials();
  const { urls, active } = screenState({ screen, screens, cycle });
  const geo = geometries();
  const front = D / 2;
  return (
    <group {...group}>
      <mesh geometry={geo.body} material={m.aluminum} />
      <mesh geometry={geo.bezel} material={m.frame} position-z={front + 0.0015} />
      <group position-z={front + 0.003}>
        <Screen
          urls={urls}
          active={active}
          width={SCREEN_W}
          height={SCREEN_H}
          radius={0.11}
          glass={{ width: W - 0.03, height: H - 0.03, radius: R - 0.015 }}
        />
      </group>
      <mesh geometry={geo.camera} material={m.lens} position={[0, SCREEN_H / 2 + 0.028, front + 0.0022]} />
    </group>
  );
}
