'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 rayPos;
  uniform vec2 rayDir;
  uniform vec3 raysColor;
  uniform vec2 mousePos;
  uniform float mouseInfluence;

  float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    vec2 dirNorm = normalize(sourceToCoord);
    float cosAngle = dot(dirNorm, rayRefDirection);
    float spreadFactor = pow(max(cosAngle, 0.0), 1.0);
    float distance = length(sourceToCoord);
    float maxDistance = iResolution.x * 2.0;
    float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
    float fadeFalloff = clamp((iResolution.x - distance) / iResolution.x, 0.5, 1.0);
    float baseStrength = clamp(
      (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
      (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)), 0.0, 1.0);
    return baseStrength * lengthFalloff * fadeFalloff * spreadFactor;
  }

  void main() {
    vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
    vec2 finalRayDir = rayDir;
    if (mouseInfluence > 0.0) {
      vec2 mouseScreenPos = mousePos * iResolution;
      vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
      finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
    }
    vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5);
    vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1);
    vec4 color = rays1 * 0.5 + rays2 * 0.4;
    float brightness = 1.0 - (coord.y / iResolution.y);
    color.x *= 0.1 + brightness * 0.8;
    color.y *= 0.3 + brightness * 0.6;
    color.z *= 0.5 + brightness * 0.5;
    color.rgb *= raysColor;
    gl_FragColor = color;
  }
`;

/**
 * Animated cyan light-ray backdrop rendered behind the fluid portrait.
 * Rays originate from top-center and gently follow the cursor.
 */
export function LightRays() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, mouse } = useThree();

  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(size.width, size.height) },
    rayPos: { value: new THREE.Vector2(size.width / 2, -size.height * 0.2) },
    rayDir: { value: new THREE.Vector2(0, 1) },
    raysColor: { value: new THREE.Vector3(0.4, 0.91, 0.976) },
    mousePos: { value: new THREE.Vector2(0.5, 0.5) },
    mouseInfluence: { value: 0.1 },
  });

  useFrame((state) => {
    const u = uniforms.current;
    u.iTime.value = state.clock.elapsedTime;
    u.iResolution.value.set(size.width, size.height);
    u.rayPos.value.set(size.width / 2, -size.height * 0.2);
    // r3f normalized mouse is -1..1, convert to 0..1
    const targetX = (mouse.x + 1) / 2;
    const targetY = 1 - (mouse.y + 1) / 2;
    u.mousePos.value.lerp(new THREE.Vector2(targetX, targetY), 0.08);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
