'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AgXToneMapping, type Group } from 'three';
import { Laptop } from '@/components/three/devices/Laptop';
import { Tablet } from '@/components/three/devices/Tablet';
import { Phone } from '@/components/three/devices/Phone';
import { Studio } from '@/components/three/Studio';
import { screensFor } from '@/data/mockup-screens';

function Turntable({ children, speed = 0.25, x = 0 }: { children: React.ReactNode; speed?: number; x?: number }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.6;
  });
  return (
    <group ref={ref} position-x={x}>
      {children}
    </group>
  );
}

export default function DevicesLab() {
  const vertic = screensFor(6).devices;
  const novogas = screensFor(2).devices;
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), 2500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="h-dvh w-full bg-[#0b0b0d]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 11], fov: 30 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = AgXToneMapping;
        }}
      >
        <Suspense fallback={null}>
          <Studio quality="high" />
          <Turntable x={-3.3} speed={0.3}>
            <Phone screen={novogas.phone![0]} screens={novogas.phone} cycle={cycle} />
          </Turntable>
          <Turntable x={0} speed={0.2}>
            <Laptop screen={vertic.laptop![0]} />
          </Turntable>
          <Turntable x={3.4} speed={0.25}>
            <Tablet screen={vertic.tablet![0]} />
          </Turntable>
        </Suspense>
      </Canvas>
    </main>
  );
}
