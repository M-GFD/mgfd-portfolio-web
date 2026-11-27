'use client';

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { invalidate, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useTexture, View } from '@react-three/drei';
import { MathUtils, type Group, type PerspectiveCamera as PerspectiveCameraImpl } from 'three';
import { Laptop } from '@/components/three/devices/Laptop';
import { Tablet } from '@/components/three/devices/Tablet';
import { Phone } from '@/components/three/devices/Phone';
import {
  createDeviceMaterials,
  DeviceFadeContext,
  DeviceMaterialsContext,
} from '@/components/three/devices/materials';
import { Studio } from '@/components/three/Studio';
import { mockupScreens, screensFor, type DeviceKind } from '@/data/mockup-screens';
import { poseAt, SCENE_PHASES, slotsFor, type Slot } from '@/lib/scene-motion';

// Todas las capturas se piden en paralelo al cargar este módulo (el lienzo se monta 150vh antes de
// Trabajos). Sin esto cada equipo suspende por turno y las primeras escenas quedaban montándose (y
// subiendo texturas) recién al llegar a ellas.
for (const project of mockupScreens) {
  for (const urls of Object.values(project.devices)) urls?.forEach((url) => useTexture.preload(url));
}

const DEVICE_ORDER: DeviceKind[] = ['laptop', 'tablet', 'phone'];
/** Medio ancho / medio alto de cada equipo (unidades de mundo) para encuadrar la composición. */
const HALF_EXTENTS: Record<DeviceKind, [number, number]> = {
  laptop: [1.52, 1.04],
  tablet: [0.9, 1.24],
  phone: [0.36, 0.75],
};
const FOV = 28;
/** mcm de 1, 2 y 3 pantallas: un único escalón entero sirve para ciclar todas. */
const CYCLE_STEPS = 6;

type Progress = { current: number };

function compositionBounds(slots: Slot[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const s of slots) {
    const [hw, hh] = HALF_EXTENTS[s.device];
    minX = Math.min(minX, s.rest.x - hw);
    maxX = Math.max(maxX, s.rest.x + hw);
    minY = Math.min(minY, s.rest.y - hh);
    maxY = Math.max(maxY, s.rest.y + hh);
  }
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, halfW: (maxX - minX) / 2, halfH: (maxY - minY) / 2, minY };
}

function DeviceRig({ projectId, progress, quality }: { projectId: number; progress: Progress; quality: 'high' | 'low' }) {
  const { devices } = screensFor(projectId);
  const slots = useMemo(
    () => slotsFor(DEVICE_ORDER.filter((k) => (screensFor(projectId).devices[k]?.length ?? 0) > 0)),
    [projectId],
  );
  const bounds = useMemo(() => compositionBounds(slots), [slots]);
  const materials = useMemo(() => createDeviceMaterials(true), []);
  const fade = useRef(1);
  const groups = useRef<(Group | null)[]>([]);
  const camRef = useRef<PerspectiveCameraImpl>(null);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);

  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  // frameloop="demand": al montar (texturas ya resueltas por Suspense) hace falta pedir un cuadro.
  // Se usa el invalidate global: el del portal de <View> no agenda cuadros en la raíz.
  useEffect(() => {
    invalidate(undefined, 2);
    const id = window.setTimeout(() => invalidate(undefined, 2), 120);
    return () => window.clearTimeout(id);
  }, []);

  useFrame(() => {
    const p = progress.current;
    let opacity = 1;
    slots.forEach((slot, i) => {
      const g = groups.current[i];
      if (!g) return;
      const pose = poseAt(slot, p);
      g.position.set(pose.x, pose.y, 0);
      g.rotation.set(pose.rotX, pose.rotY, 0);
      opacity = pose.opacity;
    });
    fade.current = opacity;
    for (const m of Object.values(materials)) m.opacity = opacity;

    // En el reposo, las pantallas recorren sus capturas en orden.
    const hold = (p - SCENE_PHASES.enterEnd) / (SCENE_PHASES.holdEnd - SCENE_PHASES.enterEnd);
    const next = Math.floor(MathUtils.clamp(hold, 0, 0.9999) * CYCLE_STEPS);
    if (next !== stepRef.current) {
      stepRef.current = next;
      setStep(next);
    }

    // Encuadre: la composición entra completa en la vista, sea cual sea su proporción.
    const cam = camRef.current;
    if (cam) {
      const t = Math.tan(MathUtils.degToRad(FOV / 2));
      const dist = Math.max(bounds.halfW / (t * cam.aspect), bounds.halfH / t) * 1.06 + 0.5;
      cam.position.set(bounds.cx, bounds.cy + dist * 0.06, dist);
      cam.lookAt(bounds.cx, bounds.cy, 0);
    }
  });

  return (
    <DeviceMaterialsContext.Provider value={materials}>
      <DeviceFadeContext.Provider value={fade}>
        <PerspectiveCamera ref={camRef} makeDefault fov={FOV} near={0.1} far={100} position={[0, 0, 12]} />
        <Studio quality={quality} floorY={bounds.minY - 0.08} />
        {slots.map((slot, i) => {
          const list = devices[slot.device]!;
          const cycle = Math.floor((step / CYCLE_STEPS) * list.length);
          const common = {
            screen: list[0],
            screens: list,
            cycle,
            ref: (g: Group | null) => {
              groups.current[i] = g;
            },
          };
          if (slot.device === 'laptop') return <Laptop key="laptop" {...common} />;
          if (slot.device === 'tablet') return <Tablet key="tablet" {...common} />;
          return <Phone key="phone" {...common} />;
        })}
      </DeviceFadeContext.Provider>
    </DeviceMaterialsContext.Provider>
  );
}

/**
 * Compila los shaders de la escena apenas se monta (el lienzo se monta 150vh antes de Trabajos), en
 * paralelo con KHR_parallel_shader_compile. Sin esto, ANGLE/D3D11 compila en el primer cuadro visible y
 * congela el scroll hasta ~3 s.
 */
function Precompile() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    let alive = true;
    gl.compileAsync(scene, camera)
      .then(() => {
        if (alive) invalidate();
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [gl, scene, camera]);
  return null;
}

/** Región del lienzo compartido para una escena: se coloca en el DOM y sigue su rectángulo. */
export default function DeviceRigView({
  projectId,
  progress,
  quality,
  className,
}: {
  projectId: number;
  progress: Progress;
  quality: 'high' | 'low';
  className?: string;
}) {
  return (
    <View className={className}>
      <Suspense fallback={null}>
        <DeviceRig projectId={projectId} progress={progress} quality={quality} />
        <Precompile />
      </Suspense>
    </View>
  );
}
