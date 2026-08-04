import { isMobile } from './state.js';

export function initFluidHero() {
  if (isMobile) return;
  const container = document.getElementById('canvasContainer');
  const webglCanvas = document.getElementById('webglCanvas');
  if (!container || !webglCanvas || !window.THREE) return;
  const THREE = window.THREE;

  // Re-enable canvas for desktop (hidden by default via CSS for mobile).
  webglCanvas.style.display = 'block';

  const renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, alpha: true, premultipliedAlpha: false, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  let fluidRT_A, fluidRT_B;
  let simScene, simCamera, simQuad;
  let fluidRes = new THREE.Vector2(512, 512);
  const mouse = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, inside: false };
  let lastMoveTime = performance.now();
  let idleActive = false;
  const IDLE_DELAY = 2000;
  const SWEEP_PAUSE = 4000;
  let scanVirtualX = 0.0, scanVirtualY = 0.0, scanDirX = 1, scanDirY = 1, scanPauseUntil = 0, scanComplete = true;
  const SCAN_SPEED_X = 3.5, SCAN_SPEED_Y = 0.5;
  const loader = new THREE.TextureLoader();
  let imagesLoaded = 0, animationStarted = false;

  function initFluid() {
    simScene = new THREE.Scene();
    simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    simCamera.position.z = 1;
    const format = THREE.RGBAFormat, type = THREE.FloatType;
    fluidRT_A = new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, { format, type, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    fluidRT_B = new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, { format, type, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });

    const simVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;
    const simFrag = `precision highp float; varying vec2 vUv; uniform sampler2D uPrevFrame; uniform vec2 uMouse; uniform vec2 uVelocity; uniform vec2 uTexelSize; uniform bool uMouseDown; void main() { vec2 uv = vUv; vec4 prev = texture2D(uPrevFrame, uv); float inkPrev = prev.r; vec2 velPrev = (prev.gb - 0.5) * 2.0; float advecScale = 1.2; vec2 advectedUV = uv - velPrev * uTexelSize * advecScale; vec4 advected = texture2D(uPrevFrame, advectedUV); vec2 velAdvected = (advected.gb - 0.5) * 2.0; float inkAdvected = advected.r; vec2 diff = uv - uMouse; float dist = length(diff); float inkRadius = 0.04; float inkInject = exp(-dist * dist / (inkRadius * inkRadius)) * (uMouseDown ? 1.0 : 0.0); float velRadius = 0.04; float velWeight = exp(-dist * dist / (velRadius * velRadius)) * (uMouseDown ? 1.0 : 0.0); vec2 injectedVel = mix(vec2(0.0), uVelocity, velWeight); float velDecay = 1.0; vec2 newVel = velAdvected * velDecay + injectedVel * 0.8; float inkDecay = 0.98; float inkNew = inkAdvected * inkDecay + inkInject * 0.9; vec4 n = texture2D(uPrevFrame, uv + vec2(uTexelSize.x, 0.0)); vec4 s = texture2D(uPrevFrame, uv - vec2(uTexelSize.x, 0.0)); vec4 e = texture2D(uPrevFrame, uv + vec2(0.0, uTexelSize.y)); vec4 w = texture2D(uPrevFrame, uv - vec2(0.0, uTexelSize.y)); float inkDiffuse = (inkAdvected + n.r + s.r + e.r + w.r) * 0.2; inkNew = mix(inkNew, inkDiffuse, 0.02); gl_FragColor = vec4(inkNew, newVel * 0.5 + 0.5, 1.0); }`;

    const simMat = new THREE.ShaderMaterial({
      uniforms: {
        uPrevFrame: { value: fluidRT_A.texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uTexelSize: { value: new THREE.Vector2(1 / fluidRes.x, 1 / fluidRes.y) },
        uMouseDown: { value: false }
      },
      vertexShader: simVert, fragmentShader: simFrag
    });
    simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat);
    simScene.add(simQuad);
    renderer.setRenderTarget(fluidRT_A); renderer.clear();
    renderer.setRenderTarget(fluidRT_B); renderer.clear();
    renderer.setRenderTarget(null);
  }

  function resizeFluid() {
    const rect = container.getBoundingClientRect();
    const aspect = rect.width / rect.height;
    const h = 512;
    const w = Math.floor(h * aspect);
    fluidRes.set(w, h);
    fluidRT_A.setSize(w, h);
    fluidRT_B.setSize(w, h);
    simQuad.material.uniforms.uTexelSize.value.set(1 / w, 1 / h);
  }

  initFluid();
  window.addEventListener('resize', resizeFluid);

  const mainVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
  const mainFrag = `precision highp float; varying vec2 vUv; uniform sampler2D uBarong; uniform sampler2D uToga; uniform sampler2D uFluidMask; uniform float uAspect; uniform float uBarongAspect; uniform float uTogaAspect; uniform vec2 uCursor; uniform float uParallaxStrength; vec2 coverUV(vec2 uv, float imageAspect, float canvasAspect) { vec2 newUV = uv - 0.5; if (canvasAspect > imageAspect) { newUV.x *= canvasAspect / imageAspect; } else { newUV.y *= imageAspect / canvasAspect; } newUV += 0.5; return clamp(newUV, 0.0, 1.0); } void main() { vec2 centerOffset = uCursor - 0.5; vec2 offsetBarong = -centerOffset * uParallaxStrength * 0.5; vec2 offsetToga = -centerOffset * uParallaxStrength * 0.5; vec2 uvBarong = coverUV(vUv + offsetBarong, uBarongAspect, uAspect); vec2 uvToga = coverUV(vUv + offsetToga, uTogaAspect, uAspect); float water = texture2D(uFluidMask, vUv).r; float blend = smoothstep(0.18, 0.22, water); vec4 barongColor = texture2D(uBarong, uvBarong); vec4 togaColor = texture2D(uToga, uvToga); vec3 mixedRGB = mix(barongColor.rgb, togaColor.rgb, blend); float mixedAlpha = mix(barongColor.a, togaColor.a, blend); gl_FragColor = vec4(mixedRGB, mixedAlpha); }`;

  const mainUniforms = {
    uBarong: { value: null }, uToga: { value: null }, uFluidMask: { value: fluidRT_A.texture },
    uAspect: { value: 1.0 }, uBarongAspect: { value: 1.0 }, uTogaAspect: { value: 1.0 },
    uCursor: { value: new THREE.Vector2(0.5, 0.5) }, uParallaxStrength: { value: 0.025 }
  };
  const mainMat = new THREE.ShaderMaterial({ uniforms: mainUniforms, vertexShader: mainVert, fragmentShader: mainFrag, transparent: true, depthWrite: false, depthTest: false });
  const mainQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mainMat);
  scene.add(mainQuad);

  function imageLoaded(tex, which) {
    imagesLoaded++;
    if (tex.image) {
      if (which === 'barong') {
        mainUniforms.uBarongAspect.value = tex.image.width / tex.image.height;
        container.style.aspectRatio = `${tex.image.width} / ${tex.image.height}`;
      } else {
        mainUniforms.uTogaAspect.value = tex.image.width / tex.image.height;
      }
    }
    if (imagesLoaded === 2 && !animationStarted) {
      animationStarted = true;
      resizeAll();
      animate();
      window.hideLoadingScreen?.();
    }
  }
  loader.load(
    '/images/profile/barong.png',
    (tex) => { mainUniforms.uBarong.value = tex; imageLoaded(tex, 'barong'); },
    undefined,
    (err) => console.error('Fluid hero: failed to load /images/profile/barong.png — check the file exists in public/images/profile/.', err)
  );
  loader.load(
    '/images/profile/toga.png',
    (tex) => { mainUniforms.uToga.value = tex; imageLoaded(tex, 'toga'); },
    undefined,
    (err) => console.error('Fluid hero: failed to load /images/profile/toga.png — check the file exists in public/images/profile/.', err)
  );

  function updateMouse(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    const newX = (clientX - rect.left) / rect.width;
    const newY = 1.0 - (clientY - rect.top) / rect.height;
    mouse.prevX = mouse.x; mouse.prevY = mouse.y;
    mouse.x = newX; mouse.y = newY;
    lastMoveTime = performance.now();
    idleActive = false;
    scanComplete = true;
  }
  webglCanvas.addEventListener('mousemove', (e) => { updateMouse(e.clientX, e.clientY); mouse.inside = true; });
  webglCanvas.addEventListener('mouseenter', () => { mouse.inside = true; });
  webglCanvas.addEventListener('mouseleave', () => { mouse.inside = false; });
  webglCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); const t = e.touches[0]; updateMouse(t.clientX, t.clientY); mouse.inside = true; }, { passive: false });
  webglCanvas.addEventListener('touchend', () => { mouse.inside = false; });

  function updateFluid(dt) {
    const now = performance.now();
    const simMat = simQuad.material;
    if (!idleActive && (now - lastMoveTime) > IDLE_DELAY) {
      idleActive = true; scanComplete = false;
      if (Math.random() < 0.5) { scanVirtualX = 0.0; scanDirX = 1; } else { scanVirtualX = 1.0; scanDirX = -1; }
      scanVirtualY = 0.0; scanDirY = 1; scanPauseUntil = 0;
    }
    if (idleActive) {
      if (scanComplete) {
        if (now > scanPauseUntil) {
          scanComplete = false;
          if (Math.random() < 0.5) { scanVirtualX = 0.0; scanDirX = 1; } else { scanVirtualX = 1.0; scanDirX = -1; }
          scanVirtualY = 0.0; scanDirY = 1;
        }
      } else {
        scanVirtualX += scanDirX * SCAN_SPEED_X * dt;
        scanVirtualY += scanDirY * SCAN_SPEED_Y * dt;
        if (scanVirtualX >= 1.0) { scanVirtualX = 1.0; scanDirX = -1; }
        else if (scanVirtualX <= 0.0) { scanVirtualX = 0.0; scanDirX = 1; }
        if (scanVirtualY >= 1.0) {
          scanVirtualY = 1.0;
          scanVirtualX = scanVirtualX < 0.5 ? 0.0 : 1.0;
          scanComplete = true;
          scanPauseUntil = now + SWEEP_PAUSE;
        }
      }
      simMat.uniforms.uMouse.value.set(scanVirtualX, 1.0 - scanVirtualY);
      simMat.uniforms.uMouseDown.value = true;
      simMat.uniforms.uVelocity.value.set(0, 0);
    } else {
      simMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
      const sensitivity = 10.0;
      const velX = ((mouse.x - mouse.prevX) / Math.max(0.016, dt)) * sensitivity;
      const velY = ((mouse.y - mouse.prevY) / Math.max(0.016, dt)) * sensitivity;
      simMat.uniforms.uVelocity.value.set(velX, velY);
      const movingThreshold = 0.01;
      simMat.uniforms.uMouseDown.value = (Math.abs(velX) > movingThreshold || Math.abs(velY) > movingThreshold) && mouse.inside;
    }
    mainUniforms.uCursor.value.set(mouse.x, mouse.y);
    simMat.uniforms.uPrevFrame.value = fluidRT_A.texture;
    renderer.setRenderTarget(fluidRT_B);
    renderer.render(simScene, simCamera);
    renderer.setRenderTarget(null);
    const temp = fluidRT_A; fluidRT_A = fluidRT_B; fluidRT_B = temp;
    mainUniforms.uFluidMask.value = fluidRT_A.texture;
  }

  function resizeAll() {
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    mainUniforms.uAspect.value = rect.width / rect.height;
    resizeFluid();
    mainUniforms.uFluidMask.value = fluidRT_A.texture;
  }

  let lastTime = 0;
  function animate(time) {
    if (!animationStarted) return;
    requestAnimationFrame(animate);
    const dt = lastTime ? (time - lastTime) * 0.001 : 0.016;
    lastTime = time;
    updateFluid(dt);
    renderer.render(scene, camera);
  }
  // Animation starts once both textures load (see imageLoaded above).
}
