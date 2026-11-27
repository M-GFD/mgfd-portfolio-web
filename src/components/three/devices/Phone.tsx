'use client';

import { CylinderGeometry } from 'three';
import { squircleBody, squirclePlane } from '../geometry/squircle';
import { useDeviceMaterials } from './materials';
import { Screen } from './Screen';
import { screenState, type DeviceProps } from './shared';

const W = 0.72;
const H = 1.5;
const D = 0.08;
const R = 0.13;
const SCREEN_W = 0.66;
const SCREEN_H = 1.43;

/** Celular con marco de grafito, isla de cámara, botones laterales y módulo trasero. */
/** Geometrías de dimensiones fijas: se construyen una vez y las comparten todas las escenas. */
let cache: ReturnType<typeof build> | null = null;
function build() {
  return {
    body: squircleBody(W, H, R, D),
    front: squirclePlane(W - 0.016, H - 0.016, R - 0.008),
    island: squirclePlane(0.19, 0.055, 0.0275, 10),
    button: squircleBody(0.016, 0.12, 0.007, 0.03, 0.004),
    buttonShort: squircleBody(0.016, 0.06, 0.007, 0.03, 0.004),
    camModule: squircleBody(0.3, 0.3, 0.075, 0.018, 0.006),
    lens: new CylinderGeometry(0.048, 0.05, 0.016, 40),
  };
}
function geometries() {
  return (cache ??= build());
}

export function Phone({ screen, screens, cycle, ...group }: DeviceProps) {
  const m = useDeviceMaterials();
  const { urls, active } = screenState({ screen, screens, cycle });
  const geo = geometries();
  const front = D / 2;
  const sideX = W / 2 + 0.002;
  return (
    <group {...group}>
      <mesh geometry={geo.body} material={m.graphite} />
      <mesh geometry={geo.front} material={m.frame} position-z={front + 0.0015} />
      <group position-z={front + 0.003}>
        <Screen
          urls={urls}
          active={active}
          width={SCREEN_W}
          height={SCREEN_H}
          radius={0.1}
          glass={{ width: W - 0.016, height: H - 0.016, radius: R - 0.008 }}
        />
        <mesh
          geometry={geo.island}
          material={m.frame}
          position={[0, SCREEN_H / 2 - 0.05, 0.0012]}
          renderOrder={15}
        />
      </group>

      {/* Botones laterales */}
      <mesh geometry={geo.buttonShort} material={m.graphite} position={[-sideX, 0.42, 0]} rotation-y={Math.PI / 2} />
      <mesh geometry={geo.button} material={m.graphite} position={[-sideX, 0.24, 0]} rotation-y={Math.PI / 2} />
      <mesh geometry={geo.button} material={m.graphite} position={[-sideX, 0.08, 0]} rotation-y={Math.PI / 2} />
      <mesh geometry={geo.button} material={m.graphite} position={[sideX, 0.22, 0]} rotation-y={Math.PI / 2} />

      {/* Módulo de cámaras trasero */}
      <group position={[-W / 2 + 0.2, H / 2 - 0.2, -front - 0.009]}>
        <mesh geometry={geo.camModule} material={m.graphite} />
        <mesh geometry={geo.lens} material={m.lens} position={[-0.06, 0.06, -0.012]} rotation-x={Math.PI / 2} />
        <mesh geometry={geo.lens} material={m.lens} position={[0.06, -0.06, -0.012]} rotation-x={Math.PI / 2} />
      </group>
    </group>
  );
}
