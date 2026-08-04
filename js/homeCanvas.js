// homeCanvas.js – initializes the Three.js lightrays and fluid effect on the home section
export function initHomeCanvas() {
    // Skip on mobile or reduced motion
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = document.getElementById('canvasContainer');
    if (!container) return;

    // Remove any existing canvases to avoid duplicates
    document.querySelectorAll('#lightraysCanvas, #webglCanvas').forEach(c => c.remove());

    // Create canvases
    const lightraysCanvas = document.createElement('canvas');
    lightraysCanvas.id = 'lightraysCanvas';
    const fluidCanvas = document.createElement('canvas');
    fluidCanvas.id = 'webglCanvas';
    container.appendChild(lightraysCanvas);
    container.appendChild(fluidCanvas);

    // ====================================================================
    //  LIGHTRAYS (Three.js)
    // ====================================================================
    (function initLightrays() {
        const canvas = lightraysCanvas;
        const config = {
            raysOrigin: 'top-center',
            raysColor: '#67e8f9',
            raysSpeed: 1,
            lightSpread: 1,
            rayLength: 2,
            pulsating: false,
            fadeDistance: 1.0,
            saturation: 1.0,
            followMouse: true,
            mouseInfluence: 0.1,
            noiseAmount: 0.0,
            distortion: 0.0
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
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2() },
            rayPos: { value: new THREE.Vector2() },
            rayDir: { value: new THREE.Vector2() },
            raysColor: { value: new THREE.Vector3(...hexToRgb(config.raysColor)) },
            raysSpeed: { value: config.raysSpeed },
            lightSpread: { value: config.lightSpread },
            rayLength: { value: config.rayLength },
            pulsating: { value: config.pulsating ? 1.0 : 0.0 },
            fadeDistance: { value: config.fadeDistance },
            saturation: { value: config.saturation },
            mousePos: { value: new THREE.Vector2(0.5, 0.5) },
            mouseInfluence: { value: config.mouseInfluence },
            noiseAmount: { value: config.noiseAmount },
            distortion: { value: config.distortion }
        };

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;
        const fragmentShader = `
            precision highp float;
            varying vec2 vUv;
            uniform float iTime;
            uniform vec2 iResolution;
            uniform vec2 rayPos;
            uniform vec2 rayDir;
            uniform vec3 raysColor;
            uniform float raysSpeed;
            uniform float lightSpread;
            uniform float rayLength;
            uniform float pulsating;
            uniform float fadeDistance;
            uniform float saturation;
            uniform vec2 mousePos;
            uniform float mouseInfluence;
            uniform float noiseAmount;
            uniform float distortion;

            float noise(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
                vec2 sourceToCoord = coord - raySource;
                vec2 dirNorm = normalize(sourceToCoord);
                float cosAngle = dot(dirNorm, rayRefDirection);
                float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
                float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
                float distance = length(sourceToCoord);
                float maxDistance = iResolution.x * rayLength;
                float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
                float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
                float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
                float baseStrength = clamp((0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) + (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)), 0.0, 1.0);
                return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
            }

            void main() {
                vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
                vec2 finalRayDir = rayDir;
                if (mouseInfluence > 0.0) {
                    vec2 mouseScreenPos = mousePos * iResolution;
                    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
                    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
                }
                vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
                vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
                vec4 color = rays1 * 0.5 + rays2 * 0.4;
                if (noiseAmount > 0.0) {
                    float n = noise(coord * 0.01 + iTime * 0.1);
                    color.rgb *= (1.0 - noiseAmount + noiseAmount * n);
                }
                float brightness = 1.0 - (coord.y / iResolution.y);
                color.x *= 0.1 + brightness * 0.8;
                color.y *= 0.3 + brightness * 0.6;
                color.z *= 0.5 + brightness * 0.5;
                if (saturation != 1.0) {
                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.514));
                    color.rgb = mix(vec3(gray), color.rgb, saturation);
                }
                color.rgb *= raysColor;
                gl_FragColor = color;
            }
        `;

        const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        const mouse = { x: 0.5, y: 0.5 };
        const smoothMouse = { x: 0.5, y: 0.5 };

        function onMouseMove(e) {
            const rect = container.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) / rect.width;
            mouse.y = (e.clientY - rect.top) / rect.height;
        }
        function onTouchMove(e) {
            if (e.touches.length > 0) {
                const rect = container.getBoundingClientRect();
                mouse.x = (e.touches[0].clientX - rect.left) / rect.width;
                mouse.y = (e.touches[0].clientY - rect.top) / rect.height;
            }
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove, { passive: true });

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
    })();

    // ====================================================================
    //  FLUID (Three.js)
    // ====================================================================
    (function initFluid() {
        const canvas = fluidCanvas;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false, antialias: true });
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
        let imagesLoaded = 0;
        let animationStarted = false;
        let renderLoopId = null;

        function initFluid() {
            simScene = new THREE.Scene();
            simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
            simCamera.position.z = 1;
            const format = THREE.RGBAFormat, type = THREE.FloatType;
            fluidRT_A = new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, { format, type, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
            fluidRT_B = new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, { format, type, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });

            const simVert = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `;
            const simFrag = `
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
                    float inkPrev = prev.r;
                    vec2 velPrev = (prev.gb - 0.5) * 2.0;
                    float advecScale = 1.2;
                    vec2 advectedUV = uv - velPrev * uTexelSize * advecScale;
                    vec4 advected = texture2D(uPrevFrame, advectedUV);
                    vec2 velAdvected = (advected.gb - 0.5) * 2.0;
                    float inkAdvected = advected.r;

                    vec2 diff = uv - uMouse;
                    float dist = length(diff);
                    float inkRadius = 0.04;
                    float inkInject = exp(-dist * dist / (inkRadius * inkRadius)) * (uMouseDown ? 1.0 : 0.0);
                    float velRadius = 0.04;
                    float velWeight = exp(-dist * dist / (velRadius * velRadius)) * (uMouseDown ? 1.0 : 0.0);
                    vec2 injectedVel = mix(vec2(0.0), uVelocity, velWeight);

                    float velDecay = 1.0;
                    vec2 newVel = velAdvected * velDecay + injectedVel * 0.8;

                    float inkDecay = 0.98;
                    float inkNew = inkAdvected * inkDecay + inkInject * 0.9;

                    vec4 n = texture2D(uPrevFrame, uv + vec2(uTexelSize.x, 0.0));
                    vec4 s = texture2D(uPrevFrame, uv - vec2(uTexelSize.x, 0.0));
                    vec4 e = texture2D(uPrevFrame, uv + vec2(0.0, uTexelSize.y));
                    vec4 w = texture2D(uPrevFrame, uv - vec2(0.0, uTexelSize.y));
                    float inkDiffuse = (inkAdvected + n.r + s.r + e.r + w.r) * 0.2;
                    inkNew = mix(inkNew, inkDiffuse, 0.02);

                    gl_FragColor = vec4(inkNew, newVel * 0.5 + 0.5, 1.0);
                }
            `;

            const simMat = new THREE.ShaderMaterial({
                uniforms: {
                    uPrevFrame: { value: fluidRT_A.texture },
                    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                    uVelocity: { value: new THREE.Vector2(0, 0) },
                    uTexelSize: { value: new THREE.Vector2(1 / fluidRes.x, 1 / fluidRes.y) },
                    uMouseDown: { value: false }
                },
                vertexShader: simVert,
                fragmentShader: simFrag
            });
            simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat);
            simScene.add(simQuad);

            renderer.setRenderTarget(fluidRT_A);
            renderer.clear();
            renderer.setRenderTarget(fluidRT_B);
            renderer.clear();
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

        const mainVert = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const mainFrag = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uBarong;
            uniform sampler2D uToga;
            uniform sampler2D uFluidMask;
            uniform float uAspect;
            uniform float uBarongAspect;
            uniform float uTogaAspect;
            uniform vec2 uCursor;
            uniform float uParallaxStrength;

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
                vec2 offsetBarong = -centerOffset * uParallaxStrength * 0.5;
                vec2 offsetToga = -centerOffset * uParallaxStrength * 0.5;
                vec2 uvBarong = coverUV(vUv + offsetBarong, uBarongAspect, uAspect);
                vec2 uvToga = coverUV(vUv + offsetToga, uTogaAspect, uAspect);

                float water = texture2D(uFluidMask, vUv).r;
                float blend = smoothstep(0.18, 0.22, water);

                vec4 barongColor = texture2D(uBarong, uvBarong);
                vec4 togaColor = texture2D(uToga, uvToga);
                vec3 mixedRGB = mix(barongColor.rgb, togaColor.rgb, blend);
                float mixedAlpha = mix(barongColor.a, togaColor.a, blend);
                gl_FragColor = vec4(mixedRGB, mixedAlpha);
            }
        `;

        const mainUniforms = {
            uBarong: { value: null },
            uToga: { value: null },
            uFluidMask: { value: fluidRT_A.texture },
            uAspect: { value: 1.0 },
            uBarongAspect: { value: 1.0 },
            uTogaAspect: { value: 1.0 },
            uCursor: { value: new THREE.Vector2(0.5, 0.5) },
            uParallaxStrength: { value: 0.025 }
        };

        const mainMat = new THREE.ShaderMaterial({
            uniforms: mainUniforms,
            vertexShader: mainVert,
            fragmentShader: mainFrag,
            transparent: true,
            depthWrite: false,
            depthTest: false
        });
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
                renderLoopId = requestAnimationFrame(animateFluid);
            }
        }

        loader.load('images/profile/barong.png', (tex) => { mainUniforms.uBarong.value = tex; imageLoaded(tex, 'barong'); });
        loader.load('images/profile/toga.png', (tex) => { mainUniforms.uToga.value = tex; imageLoaded(tex, 'toga'); });

        function updateMouse(clientX, clientY) {
            const rect = container.getBoundingClientRect();
            const newX = (clientX - rect.left) / rect.width;
            const newY = 1.0 - (clientY - rect.top) / rect.height;
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;
            mouse.x = newX;
            mouse.y = newY;
            lastMoveTime = performance.now();
            idleActive = false;
            scanComplete = true;
        }

        canvas.addEventListener('mousemove', (e) => { updateMouse(e.clientX, e.clientY); mouse.inside = true; });
        canvas.addEventListener('mouseenter', () => { mouse.inside = true; });
        canvas.addEventListener('mouseleave', () => { mouse.inside = false; });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); const t = e.touches[0]; updateMouse(t.clientX, t.clientY); mouse.inside = true; }, { passive: false });
        canvas.addEventListener('touchend', () => { mouse.inside = false; });

        function updateFluid(dt) {
            const now = performance.now();
            const simMat = simQuad.material;

            if (!idleActive && (now - lastMoveTime) > IDLE_DELAY) {
                idleActive = true;
                scanComplete = false;
                if (Math.random() < 0.5) { scanVirtualX = 0.0; scanDirX = 1; } else { scanVirtualX = 1.0; scanDirX = -1; }
                scanVirtualY = 0.0;
                scanDirY = 1;
                scanPauseUntil = 0;
            }

            if (idleActive) {
                if (scanComplete) {
                    if (now > scanPauseUntil) {
                        scanComplete = false;
                        if (Math.random() < 0.5) { scanVirtualX = 0.0; scanDirX = 1; } else { scanVirtualX = 1.0; scanDirX = -1; }
                        scanVirtualY = 0.0;
                        scanDirY = 1;
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
            const temp = fluidRT_A;
            fluidRT_A = fluidRT_B;
            fluidRT_B = temp;
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
        function animateFluid(time) {
            if (!animationStarted) return;
            renderLoopId = requestAnimationFrame(animateFluid);
            const dt = lastTime ? (time - lastTime) * 0.001 : 0.016;
            lastTime = time;
            updateFluid(dt);
            renderer.render(scene, camera);
        }

        // Cleanup function to stop animation when leaving home
        window.addEventListener('beforeunload', () => {
            if (renderLoopId) cancelAnimationFrame(renderLoopId);
        });

        // Also stop when navigating away (called from main.js)
        window.cleanupFluid = function() {
            if (renderLoopId) {
                cancelAnimationFrame(renderLoopId);
                renderLoopId = null;
                animationStarted = false;
            }
        };

        // Expose cleanup to be called from main
        window.__fluidCleanup = window.cleanupFluid;

        // If images already loaded (cached), they may fire before this code runs, but we handle it.
        // Start if images already loaded.
        if (imagesLoaded === 2 && !animationStarted) {
            animationStarted = true;
            resizeAll();
            renderLoopId = requestAnimationFrame(animateFluid);
        }
    })();

    // Cleanup function for the whole home canvas (called from main when navigating away)
    return function cleanup() {
        if (window.__fluidCleanup) window.__fluidCleanup();
        // Remove event listeners? Not necessary for SPA as the canvases are removed.
    };
}