'use client';

import { useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { AgXToneMapping, DefaultLoadingManager } from 'three';
import { createFrameBudget } from './frame-budget';
import { setSceneInvalidate } from './scene-bus';

/** En GPUs que no llegan al presupuesto mientras se scrollea, baja el DPR a 1 (una vez, sin oscilar). */
function DprGovernor() {
  const setDpr = useThree((s) => s.setDpr);
  const check = useMemo(() => createFrameBudget(), []);
  useFrame((state, dt) => {
    if (check(dt) && state.viewport.dpr > 1) setDpr(1);
  });
  return null;
}

/**
 * Único lienzo WebGL, fijo detrás de las escenas. Cada escena dibuja su región con un <View>.
 * frameloop="demand": solo renderiza cuando el scroll (o un fundido de pantalla) lo pide.
 */
export default function SceneCanvas({
  dpr,
  onContextLost,
}: {
  dpr: [number, number];
  onContextLost: () => void;
}) {
  useEffect(() => () => setSceneInvalidate(null), []);

  return (
    <Canvas
      aria-hidden
      frameloop="demand"
      dpr={dpr}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}
      onCreated={({ gl, invalidate }) => {
        gl.toneMapping = AgXToneMapping;
        // Leer el log de cada programa obliga a esperar su compilación de forma síncrona (1.5 s en ANGLE)
        // y anula compileAsync. Los shaders son los de three: el chequeo queda solo en desarrollo.
        gl.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
        setSceneInvalidate(invalidate);
        // Cada textura que termina de cargar pide un cuadro (no hay bucle continuo).
        DefaultLoadingManager.onLoad = () => invalidate();
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onContextLost();
        });
      }}
    >
      <View.Port />
      <DprGovernor />
    </Canvas>
  );
}
