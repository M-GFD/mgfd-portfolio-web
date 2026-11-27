'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { BoxGeometry, CylinderGeometry, Matrix4, type InstancedMesh } from 'three';
import { squircleBody, squirclePlane } from '../geometry/squircle';
import { useDeviceMaterials } from './materials';
import { Screen } from './Screen';
import { screenState, type DeviceProps } from './shared';

const W = 3.04;
const LID_H = 2.0;
const LID_D = 0.05;
const BASE_DEPTH = 2.1;
const BASE_T = 0.1;
const R = 0.12;
const BASE_Y = -0.98; // centro de la base: así el origen del grupo queda en el centro visual
const LID_TILT = -0.2; // tapa abierta, inclinada hacia atrás
const SCREEN_W = 2.88;
const SCREEN_H = 1.8;

const KEY_COLS = 14;
const KEY_ROWS = 5;
const KEY_W = 0.162;

/** Notebook de aluminio: base con teclado y trackpad, bisagra y tapa con pantalla. */
export function Laptop({ screen, screens, cycle, ...group }: DeviceProps) {
  const m = useDeviceMaterials();
  const { urls, active } = screenState({ screen, screens, cycle });
  const keysRef = useRef<InstancedMesh>(null);

  const geo = useMemo(
    () => ({
      lid: squircleBody(W, LID_H, R, LID_D),
      base: squircleBody(W, BASE_DEPTH, R, BASE_T),
      bezel: squirclePlane(W - 0.05, LID_H - 0.05, R - 0.025),
      notch: squirclePlane(0.18, 0.04, 0.018, 6),
      well: squirclePlane(2.62, 0.96, 0.05),
      trackpad: squirclePlane(1.18, 0.74, 0.06),
      hinge: new CylinderGeometry(0.045, 0.045, 2.5, 32),
      key: new BoxGeometry(KEY_W, 0.012, 0.15),
    }),
    [],
  );

  const keyCount = KEY_COLS * KEY_ROWS;
  useLayoutEffect(() => {
    const mesh = keysRef.current;
    if (!mesh) return;
    const mat = new Matrix4();
    const pitchX = 2.52 / KEY_COLS;
    const pitchZ = 0.86 / KEY_ROWS;
    let i = 0;
    for (let row = 0; row < KEY_ROWS; row++) {
      for (let col = 0; col < KEY_COLS; col++) {
        const x = -1.26 + pitchX * (col + 0.5);
        const z = -0.93 + pitchZ * (row + 0.5);
        // Barra espaciadora: las teclas centrales de la última fila se funden en una ancha.
        const isSpace = row === KEY_ROWS - 1 && col >= 4 && col <= 9;
        if (isSpace && col !== 4) {
          mat.makeScale(0, 0, 0);
        } else if (isSpace) {
          mat.makeScale((6 * pitchX - (pitchX - KEY_W)) / KEY_W, 1, 1).setPosition(x + pitchX * 2.5, 0, z);
        } else {
          mat.makeTranslation(x, 0, z);
        }
        mesh.setMatrixAt(i++, mat);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  const top = BASE_Y + BASE_T / 2;
  const hingeZ = -BASE_DEPTH / 2 + 0.03;

  return (
    <group {...group}>
      {/* Base */}
      <mesh geometry={geo.base} material={m.aluminum} position-y={BASE_Y} rotation-x={-Math.PI / 2} />
      <mesh geometry={geo.well} material={m.well} position={[0, top + 0.0012, -0.5]} rotation-x={-Math.PI / 2} />
      <instancedMesh ref={keysRef} args={[geo.key, m.keys, keyCount]} position={[0, top + 0.0075, 0]} />
      <mesh geometry={geo.trackpad} material={m.trackpad} position={[0, top + 0.0012, 0.52]} rotation-x={-Math.PI / 2} />
      <mesh geometry={geo.hinge} material={m.graphite} position={[0, top, hingeZ]} rotation-z={Math.PI / 2} />

      {/* Tapa: pivota en el borde trasero de la base */}
      <group position={[0, top, hingeZ]} rotation-x={LID_TILT}>
        <group position={[0, LID_H / 2 + 0.02, 0]}>
          <mesh geometry={geo.lid} material={m.aluminum} />
          <mesh geometry={geo.bezel} material={m.frame} position-z={LID_D / 2 + 0.0015} />
          <group position={[0, -0.005, LID_D / 2 + 0.003]}>
            <Screen
              urls={urls}
              active={active}
              width={SCREEN_W}
              height={SCREEN_H}
              radius={0.035}
              glass={{ width: W - 0.05, height: LID_H - 0.05, radius: R - 0.025 }}
            />
            <mesh
              geometry={geo.notch}
              material={m.frame}
              position={[0, SCREEN_H / 2 - 0.018, 0.0012]}
              renderOrder={15}
            />
          </group>
        </group>
      </group>
    </group>
  );
}
