import { isMobile } from './state.js';

export function initLightRays() {
  if (isMobile) return;
  const container = document.getElementById('canvasContainer');
  const canvas = document.getElementById('lightraysCanvas');
  if (!container || !canvas || !window.THREE) return;
  const THREE = window.THREE;

  const config = {
    raysOrigin: 'top-center', raysColor: '#67e8f9', raysSpeed: 1, lightSpread: 1,
    rayLength: 2, pulsating: false, fadeDistance: 1.0, saturation: 1.0,
    followMouse: true, mouseInfluence: 0.1, noiseAmount: 0.0, distortion: 0.0
  };

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  };

  const getAnchorAndDir = (origin, w, h) => {
    const outside = 0.2;
    switch (origin) {
      case 'top-left': return { anchor: [0, -outside * h], dir: [0, 1] };
      case 'top-right': return { anchor: [w, -outside * h], dir: [0, 1] };
      case 'left': return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
      case 'right': return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
      case 'bottom-left': return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-center': return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-right': return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
      default: return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
  };

  const uniforms = {
    iTime: { value: 0 }, iResolution: { value: new THREE.Vector2() },
    rayPos: { value: new THREE.Vector2() }, rayDir: { value: new THREE.Vector2() },
    raysColor: { value: new THREE.Vector3(...hexToRgb(config.raysColor)) },
    raysSpeed: { value: config.raysSpeed }, lightSpread: { value: config.lightSpread },
    rayLength: { value: config.rayLength }, pulsating: { value: config.pulsating ? 1.0 : 0.0 },
    fadeDistance: { value: config.fadeDistance }, saturation: { value: config.saturation },
    mousePos: { value: new THREE.Vector2(0.5, 0.5) }, mouseInfluence: { value: config.mouseInfluence },
    noiseAmount: { value: config.noiseAmount }, distortion: { value: config.distortion }
  };

  const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;

  const fragmentShader = `precision highp float; varying vec2 vUv; uniform float iTime; uniform vec2 iResolution; uniform vec2 rayPos; uniform vec2 rayDir; uniform vec3 raysColor; uniform float raysSpeed; uniform float lightSpread; uniform float rayLength; uniform float pulsating; uniform float fadeDistance; uniform float saturation; uniform vec2 mousePos; uniform float mouseInfluence; uniform float noiseAmount; uniform float distortion; float noise(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); } float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) { vec2 sourceToCoord = coord - raySource; vec2 dirNorm = normalize(sourceToCoord); float cosAngle = dot(dirNorm, rayRefDirection); float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2; float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001)); float distance = length(sourceToCoord); float maxDistance = iResolution.x * rayLength; float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0); float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0); float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0; float baseStrength = clamp((0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) + (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)), 0.0, 1.0); return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse; } void main() { vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y); vec2 finalRayDir = rayDir; if (mouseInfluence > 0.0) { vec2 mouseScreenPos = mousePos * iResolution; vec2 mouseDirection = normalize(mouseScreenPos - rayPos); finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence)); } vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed); vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed); vec4 color = rays1 * 0.5 + rays2 * 0.4; if (noiseAmount > 0.0) { float n = noise(coord * 0.01 + iTime * 0.1); color.rgb *= (1.0 - noiseAmount + noiseAmount * n); } float brightness = 1.0 - (coord.y / iResolution.y); color.x *= 0.1 + brightness * 0.8; color.y *= 0.3 + brightness * 0.6; color.z *= 0.5 + brightness * 0.5; if (saturation != 1.0) { float gray = dot(color.rgb, vec3(0.299, 0.587, 0.514)); color.rgb = mix(vec3(gray), color.rgb, saturation); } color.rgb *= raysColor; gl_FragColor = color; }`;

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const mouse = { x: 0.5, y: 0.5 }, smoothMouse = { x: 0.5, y: 0.5 };
  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });
  window.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.touches.length > 0) {
      mouse.x = (e.touches[0].clientX - rect.left) / rect.width;
      mouse.y = (e.touches[0].clientY - rect.top) / rect.height;
    }
  }, { passive: true });

  function resize() {
    const rect = container.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    renderer.setSize(w, h);
    const dpr = renderer.getPixelRatio();
    uniforms.iResolution.value.set(w * dpr, h * dpr);
    const { anchor, dir } = getAnchorAndDir(config.raysOrigin, w * dpr, h * dpr);
    uniforms.rayPos.value.set(anchor[0], anchor[1]);
    uniforms.rayDir.value.set(dir[0], dir[1]);
  }
  window.addEventListener('resize', resize);
  resize();

  function animate(time) {
    requestAnimationFrame(animate);
    uniforms.iTime.value = time * 0.001;
    if (config.followMouse && config.mouseInfluence > 0) {
      const smoothing = 0.92;
      smoothMouse.x = smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
      smoothMouse.y = smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
      uniforms.mousePos.value.set(smoothMouse.x, smoothMouse.y);
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}
