'use client';

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { AgXToneMapping, DefaultLoadingManager } from 'three';
import { setSceneInvalidate } from './scene-bus';

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
    </Canvas>
  );
}
