'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { LightRays } from './LightRays';
import { FluidCanvas } from './FluidCanvas';

interface SceneProps {
  imageA: string;
  imageB: string;
}

/**
 * Desktop-only hero visual: animated light rays behind an interactive
 * fluid-blended portrait. Intended to be lazy-loaded with `next/dynamic`
 * (`ssr: false`) and only mounted when NOT on mobile / reduced-motion.
 */
export function Scene({ imageA, imageB }: SceneProps) {
  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
      camera={{ position: [0, 0, 1], zoom: 1 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <LightRays />
        <FluidCanvas imageA={imageA} imageB={imageB} />
      </Suspense>
    </Canvas>
  );
}
