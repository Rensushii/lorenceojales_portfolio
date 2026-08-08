'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const simVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const simFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrevFrame;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform vec2 uTexelSize;
  uniform bool uMouseDown;

  void main() {
    vec2 uv = vUv;
    vec4 prev = texture2D(uPrevFrame, uv);
    vec2 velPrev = (prev.gb - 0.5) * 2.0;
    vec2 advectedUV = uv - velPrev * uTexelSize * 1.2;
    vec4 advected = texture2D(uPrevFrame, advectedUV);
    vec2 velAdvected = (advected.gb - 0.5) * 2.0;
    float inkAdvected = advected.r;

    vec2 diff = uv - uMouse;
    float dist = length(diff);
    float inkRadius = 0.04;
    float inkInject = exp(-dist * dist / (inkRadius * inkRadius)) * (uMouseDown ? 1.0 : 0.0);
    float velWeight = exp(-dist * dist / (inkRadius * inkRadius)) * (uMouseDown ? 1.0 : 0.0);
    vec2 injectedVel = mix(vec2(0.0), uVelocity, velWeight);

    vec2 newVel = velAdvected + injectedVel * 0.8;
    float inkNew = inkAdvected * 0.98 + inkInject * 0.9;

    vec4 n = texture2D(uPrevFrame, uv + vec2(uTexelSize.x, 0.0));
    vec4 s = texture2D(uPrevFrame, uv - vec2(uTexelSize.x, 0.0));
    vec4 e = texture2D(uPrevFrame, uv + vec2(0.0, uTexelSize.y));
    vec4 w = texture2D(uPrevFrame, uv - vec2(0.0, uTexelSize.y));
    float inkDiffuse = (inkAdvected + n.r + s.r + e.r + w.r) * 0.2;
    inkNew = mix(inkNew, inkDiffuse, 0.02);

    gl_FragColor = vec4(inkNew, newVel * 0.5 + 0.5, 1.0);
  }
`;

const mainVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const mainFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uImageA;
  uniform sampler2D uImageB;
  uniform sampler2D uFluidMask;
  uniform float uAspect;
  uniform float uAspectA;
  uniform float uAspectB;
  uniform vec2 uCursor;

  vec2 coverUV(vec2 uv, float imageAspect, float canvasAspect) {
    vec2 newUV = uv - 0.5;
    if (canvasAspect > imageAspect) {
      newUV.x *= canvasAspect / imageAspect;
    } else {
      newUV.y *= imageAspect / canvasAspect;
    }
    newUV += 0.5;
    return clamp(newUV, 0.0, 1.0);
  }

  void main() {
    vec2 centerOffset = uCursor - 0.5;
    vec2 offset = -centerOffset * 0.025;
    vec2 uvA = coverUV(vUv + offset, uAspectA, uAspect);
    vec2 uvB = coverUV(vUv + offset, uAspectB, uAspect);
    float water = texture2D(uFluidMask, vUv).r;
    float blend = smoothstep(0.18, 0.22, water);
    vec4 colorA = texture2D(uImageA, uvA);
    vec4 colorB = texture2D(uImageB, uvB);
    vec3 mixedRGB = mix(colorA.rgb, colorB.rgb, blend);
    float mixedAlpha = mix(colorA.a, colorB.a, blend);
    gl_FragColor = vec4(mixedRGB, mixedAlpha);
  }
`;

interface FluidCanvasProps {
  imageA: string;
  imageB: string;
}

/**
 * Renders two portrait images (imageA / imageB) blended by an interactive
 * fluid-ink simulation mask that reacts to cursor movement.
 */
export function FluidCanvas({ imageA, imageB }: FluidCanvasProps) {
  const { gl, size, mouse } = useThree();
  const [texA, texB] = useTexture([imageA, imageB]);

  const fluidRes = useMemo(() => new THREE.Vector2(512, 512), []);
  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10), []);

  const [rtA, rtB] = useMemo(() => {
    const opts = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    };
    return [
      new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, opts),
      new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, opts),
    ];
  }, [fluidRes]);

  const targets = useRef({ a: rtA, b: rtB });

  const simMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uPrevFrame: { value: rtA.texture },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uVelocity: { value: new THREE.Vector2(0, 0) },
          uTexelSize: { value: new THREE.Vector2(1 / fluidRes.x, 1 / fluidRes.y) },
          uMouseDown: { value: false },
        },
        vertexShader: simVertex,
        fragmentShader: simFragment,
      }),
    [rtA, fluidRes]
  );

  const simQuad = useMemo(() => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    simScene.add(mesh);
    return mesh;
  }, [simMaterial, simScene]);

  const aspectA = texA.image ? texA.image.width / texA.image.height : 1;
  const aspectB = texB.image ? texB.image.width / texB.image.height : 1;

  const mainUniforms = useRef({
    uImageA: { value: texA },
    uImageB: { value: texB },
    uFluidMask: { value: rtA.texture },
    uAspect: { value: size.width / size.height },
    uAspectA: { value: aspectA },
    uAspectB: { value: aspectB },
    uCursor: { value: new THREE.Vector2(0.5, 0.5) },
  });

  const prevMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const lastMoveTime = useRef(Date.now());
  const idle = useRef(false);

  useFrame((state, delta) => {
    const targetX = (mouse.x + 1) / 2;
    const targetY = (mouse.y + 1) / 2;
    const moved = Math.abs(targetX - prevMouse.current.x) > 0.0005 || Math.abs(targetY - prevMouse.current.y) > 0.0005;
    if (moved) {
      lastMoveTime.current = Date.now();
      idle.current = false;
    }
    const isIdle = Date.now() - lastMoveTime.current > 2500;

    const velX = (targetX - prevMouse.current.x) * 12;
    const velY = (targetY - prevMouse.current.y) * 12;

    if (isIdle) {
      // Gentle ambient sweep so the effect stays alive without input
      const t = state.clock.elapsedTime * 0.15;
      const sweepX = 0.5 + Math.sin(t) * 0.4;
      const sweepY = 0.5 + Math.cos(t * 0.7) * 0.25;
      simMaterial.uniforms.uMouse.value.set(sweepX, sweepY);
      simMaterial.uniforms.uMouseDown.value = true;
      simMaterial.uniforms.uVelocity.value.set(0, 0);
    } else {
      simMaterial.uniforms.uMouse.value.set(targetX, targetY);
      simMaterial.uniforms.uVelocity.value.set(velX, velY);
      simMaterial.uniforms.uMouseDown.value = Math.abs(velX) > 0.01 || Math.abs(velY) > 0.01;
    }

    mainUniforms.current.uCursor.value.set(targetX, targetY);
    prevMouse.current.set(targetX, targetY);

    // Ping-pong fluid simulation render
    simMaterial.uniforms.uPrevFrame.value = targets.current.a.texture;
    gl.setRenderTarget(targets.current.b);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    const tmp = targets.current.a;
    targets.current.a = targets.current.b;
    targets.current.b = tmp;
    mainUniforms.current.uFluidMask.value = targets.current.a.texture;

    mainUniforms.current.uAspect.value = size.width / size.height;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={mainVertex}
        fragmentShader={mainFragment}
        uniforms={mainUniforms.current}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
