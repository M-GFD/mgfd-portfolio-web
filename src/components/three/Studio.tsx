'use client';

import { ContactShadows, Environment, Lightformer } from '@react-three/drei';

/**
 * Estudio de luz sin HDRI: Lightformers (key, fill, rim) generan el mapa de entorno
 * que da los reflejos del aluminio y del cristal; una sombra de contacto ancla los equipos.
 */
export function Studio({ quality, floorY = -1.5 }: { quality: 'high' | 'low'; floorY?: number }) {
  const high = quality === 'high';
  return (
    <>
      <Environment resolution={high ? 256 : 64} frames={1}>
        <color attach="background" args={['#050506']} />
        <Lightformer form="rect" intensity={3} position={[-5, 5, 4]} scale={[9, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1} position={[6, 0.5, 3]} scale={[3, 7, 1]} target={[0, 0, 0]} />
        {high ? (
          <Lightformer form="rect" intensity={2} position={[0, 3, -6]} scale={[12, 2, 1]} target={[0, 0, 0]} />
        ) : null}
        {/* Caja cenital: da el brillo plateado de las superficies superiores. */}
        <Lightformer form="rect" intensity={1.4} position={[0, 7, 1]} scale={[14, 8, 1]} target={[0, 0, 0]} />
        {/* Tiras laterales: filos de luz sobre biseles y marcos. */}
        <Lightformer form="rect" intensity={2.2} position={[-7, 1, -1]} scale={[1.5, 9, 1]} target={[0, 0, 0]} />
        {high ? (
          <Lightformer form="rect" intensity={1.2} position={[7, 2, -2]} scale={[1.2, 8, 1]} target={[0, 0, 0]} />
        ) : null}
        <Lightformer form="rect" intensity={0.35} position={[0, -5, 2]} scale={[10, 2, 1]} target={[0, 0, 0]} />
      </Environment>
      <ContactShadows
        position={[0, floorY, 0]}
        opacity={0.55}
        blur={2.6}
        far={4}
        scale={16}
        resolution={high ? 1024 : 512}
        color="#000000"
      />
    </>
  );
}
