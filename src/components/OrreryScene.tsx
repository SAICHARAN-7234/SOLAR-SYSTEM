import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface OrrerySceneProps {
  selectedId: string;
  onSelectTarget: (id: string) => void;
  speedMultiplier: number;
  isPaused: boolean;
  showAsteroids: boolean;
  showKuiper: boolean;
  showProbes: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  lightIntensity: number;
  isCinematic: boolean;
  onResetCamera?: () => void;
  onHoverTarget?: (info: { name: string; dist: string; x: number; y: number } | null) => void;
}

interface PlanetMeshObject {
  id: string;
  name: string;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  anchor: THREE.Group;
  orbitSpeed: number;
  rotSpeed: number;
  dist: number;
  size: number;
}

export default function OrreryScene({
  selectedId,
  onSelectTarget,
  speedMultiplier,
  isPaused,
  showAsteroids,
  showKuiper,
  showProbes,
  showOrbits,
  showLabels,
  lightIntensity,
  isCinematic,
  onHoverTarget,
}: OrrerySceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<PlanetMeshObject[]>([]);
  const asteroidBeltRef = useRef<THREE.Points | null>(null);
  const kuiperBeltRef = useRef<THREE.Points | null>(null);
  const probeMeshesRef = useRef<THREE.Object3D[]>([]);
  const probeLinesRef = useRef<THREE.Line[]>([]);
  const orbitLinesRef = useRef<THREE.Line[]>([]);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const glowMeshRef = useRef<THREE.Mesh | null>(null);
  const outerGlowMeshRef = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  const targetCamPosRef = useRef(new THREE.Vector3(0, 210, 340));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  const sphericalRef = useRef({ radius: 390, theta: 0.15, phi: 0.9 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  // Track props in refs for animation loop
  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const isCinematicRef = useRef(isCinematic);
  isCinematicRef.current = isCinematic;

  // Procedural canvas textures
  const createPlanetTexture = useCallback((type: string, baseHex: string, secHex: string) => {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 256;
    const ctx = cvs.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(cvs);

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 256);

    if (type === 'stripes') {
      for (let i = 0; i < 50; i++) {
        const y = Math.random() * 256;
        const h = 2 + Math.random() * 12;
        ctx.fillStyle = (i % 2 === 0) ? secHex : 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(0, y, 512, h);
      }
      ctx.fillStyle = '#b7410e';
      ctx.beginPath();
      ctx.ellipse(320, 160, 24, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'earth') {
      ctx.fillStyle = '#1d6f42';
      for (let i = 0; i < 35; i++) {
        const x = Math.random() * 512;
        const y = 40 + Math.random() * 176;
        const rad = 15 + Math.random() * 45;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let j = 0; j < 25; j++) {
        const cx = Math.random() * 512;
        const cy = Math.random() * 256;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 30 + Math.random() * 60, 8 + Math.random() * 12, 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'crater') {
      ctx.fillStyle = secHex;
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = 2 + Math.random() * 14;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'ice') {
      ctx.fillStyle = secHex;
      for (let i = 0; i < 30; i++) {
        const y = Math.random() * 256;
        ctx.fillRect(0, y, 512, 4 + Math.random() * 16);
      }
    }
    return new THREE.CanvasTexture(cvs);
  }, []);

  // Update target focus when selectedId changes
  useEffect(() => {
    if (selectedId === 'sun') {
      if (sunMeshRef.current) {
        targetCamPosRef.current.set(0, 120, 180);
        targetLookAtRef.current.set(0, 0, 0);
      }
      return;
    }

    const foundPlanet = planetsRef.current.find(p => p.id === selectedId);
    if (foundPlanet) {
      const worldPos = new THREE.Vector3();
      foundPlanet.mesh.getWorldPosition(worldPos);
      const offsetDist = Math.max(foundPlanet.size * 5.5, 14);
      targetCamPosRef.current.set(
        worldPos.x + offsetDist * 0.8,
        worldPos.y + offsetDist * 0.6,
        worldPos.z + offsetDist * 0.8
      );
      targetLookAtRef.current.copy(worldPos);
      return;
    }

    const foundProbe = probeMeshesRef.current.find(p => p.userData?.id === selectedId);
    if (foundProbe) {
      const worldPos = foundProbe.position.clone();
      targetCamPosRef.current.set(
        worldPos.x + 25,
        worldPos.y + 18,
        worldPos.z + 25
      );
      targetLookAtRef.current.copy(worldPos);
    }
  }, [selectedId]);

  // Adjust visibility based on props
  useEffect(() => {
    if (asteroidBeltRef.current) asteroidBeltRef.current.visible = showAsteroids;
  }, [showAsteroids]);

  useEffect(() => {
    if (kuiperBeltRef.current) kuiperBeltRef.current.visible = showKuiper;
  }, [showKuiper]);

  useEffect(() => {
    probeMeshesRef.current.forEach(mesh => { mesh.visible = showProbes; });
    probeLinesRef.current.forEach(line => { line.visible = showProbes; });
  }, [showProbes]);

  useEffect(() => {
    orbitLinesRef.current.forEach(line => { line.visible = showOrbits; });
  }, [showOrbits]);

  useEffect(() => {
    if (pointLightRef.current) pointLightRef.current.intensity = 4.2 * (lightIntensity / 1.3);
    if (dirLightRef.current) dirLightRef.current.intensity = 0.6 * (lightIntensity / 1.3);
  }, [lightIntensity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030614, 0.0016);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4500);
    camera.position.set(0, 210, 340);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Starfield Generator
    const starCount = 4500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const colorChoices = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xaec9ff),
      new THREE.Color(0xffd2a1),
      new THREE.Color(0xfff4e8),
      new THREE.Color(0x9bc5ff),
      new THREE.Color(0xd6e5ff)
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 900 + Math.random() * 1400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 2.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.88
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x283048, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff6dd, 4.2, 1800, 0.45);
    scene.add(sunLight);
    pointLightRef.current = sunLight;

    const dirLight = new THREE.DirectionalLight(0x405570, 0.6);
    dirLight.position.set(0, 100, 50);
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 4. Central Sun & Glowing Corona Layers
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    const sunGeo = new THREE.SphereGeometry(17, 36, 36);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.userData = { id: 'sun', name: 'Sol (Sun)', isSun: true, distAU: '0.000 AU' };
    sunGroup.add(sunMesh);
    sunMeshRef.current = sunMesh;

    const glowGeo = new THREE.SphereGeometry(21, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff7700,
      transparent: true,
      opacity: 0.32,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    sunGroup.add(glowMesh);
    glowMeshRef.current = glowMesh;

    const outerGlowGeo = new THREE.SphereGeometry(25.5, 32, 32);
    const outerGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    });
    const outerGlowMesh = new THREE.Mesh(outerGlowGeo, outerGlowMat);
    sunGroup.add(outerGlowMesh);
    outerGlowMeshRef.current = outerGlowMesh;

    // 5. Planet Configurations & Orbital Rings
    const planetConfigs = [
      { id: 'mercury', name: 'Mercury', size: 2.2, dist: 34, period: 87.97, rotSpeed: 0.008, tilt: 0.03, color: 0xa8a59b, texType: 'crater', baseColor: '#8a8882', secColor: '#5c5b57', distAU: '0.387 AU' },
      { id: 'venus', name: 'Venus', size: 3.4, dist: 48, period: 224.7, rotSpeed: -0.004, tilt: 3.1, color: 0xe3bb76, texType: 'stripes', baseColor: '#d6a056', secColor: '#f1d29b', distAU: '0.723 AU' },
      { id: 'earth', name: 'Earth', size: 3.8, dist: 66, period: 365.25, rotSpeed: 0.024, tilt: 0.41, color: 0x2277ff, texType: 'earth', baseColor: '#10529e', secColor: '#28924f', distAU: '1.000 AU' },
      { id: 'mars', name: 'Mars', size: 2.8, dist: 84, period: 686.98, rotSpeed: 0.022, tilt: 0.44, color: 0xcc4422, texType: 'crater', baseColor: '#c1440e', secColor: '#e77b47', distAU: '1.524 AU' },
      { id: 'jupiter', name: 'Jupiter', size: 9.8, dist: 122, period: 4332.6, rotSpeed: 0.05, tilt: 0.05, color: 0xdca878, texType: 'stripes', baseColor: '#cfa276', secColor: '#a16538', distAU: '5.204 AU' },
      { id: 'saturn', name: 'Saturn', size: 8.2, dist: 162, period: 10759.2, rotSpeed: 0.045, tilt: 0.47, color: 0xdfcb95, hasRings: true, texType: 'stripes', baseColor: '#e0c88f', secColor: '#bfa365', distAU: '9.582 AU' },
      { id: 'uranus', name: 'Uranus', size: 5.4, dist: 204, period: 30685.4, rotSpeed: -0.03, tilt: 1.71, color: 0x6be0dd, texType: 'ice', baseColor: '#5ec9c6', secColor: '#88edea', distAU: '19.201 AU' },
      { id: 'neptune', name: 'Neptune', size: 5.2, dist: 246, period: 60189.0, rotSpeed: 0.032, tilt: 0.49, color: 0x2755e0, texType: 'stripes', baseColor: '#2448b8', secColor: '#3d72ff', distAU: '30.047 AU' },
      { id: 'pluto', name: 'Pluto', size: 1.6, dist: 284, period: 90560.0, rotSpeed: 0.005, tilt: 2.13, color: 0xb59b86, texType: 'crater', baseColor: '#a08572', secColor: '#d6c0af', distAU: '39.482 AU' }
    ];

    const planetObjs: PlanetMeshObject[] = [];
    const interactiveTargets: THREE.Object3D[] = [sunMesh];
    const orbitLines: THREE.Line[] = [];

    planetConfigs.forEach((cfg) => {
      // Orbit Line
      const segments = 128;
      const orbitGeo = new THREE.BufferGeometry();
      const orbitPts: number[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPts.push(Math.cos(theta) * cfg.dist, 0, Math.sin(theta) * cfg.dist);
      }
      orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPts, 3));
      const orbitMat = new THREE.LineBasicMaterial({ color: 0x4466aa, transparent: true, opacity: 0.32 });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);
      orbitLines.push(orbitLine);

      const pivot = new THREE.Group();
      scene.add(pivot);
      pivot.rotation.y = Math.random() * Math.PI * 2;

      const planetAnchor = new THREE.Group();
      planetAnchor.position.x = cfg.dist;
      planetAnchor.rotation.z = cfg.tilt;
      pivot.add(planetAnchor);

      const pTex = createPlanetTexture(cfg.texType, cfg.baseColor, cfg.secColor);
      const pGeo = new THREE.SphereGeometry(cfg.size, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({ map: pTex, roughness: 0.72, metalness: 0.05 });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.userData = { id: cfg.id, name: cfg.name, distAU: cfg.distAU };
      planetAnchor.add(pMesh);
      interactiveTargets.push(pMesh);

      // Atmosphere glow for larger worlds
      if (cfg.size >= 3.8) {
        const atmoGeo = new THREE.SphereGeometry(cfg.size * 1.08, 24, 24);
        const atmoMat = new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.18, side: THREE.BackSide });
        planetAnchor.add(new THREE.Mesh(atmoGeo, atmoMat));
      }

      // Saturn Rings
      if (cfg.hasRings) {
        const innerR = cfg.size * 1.35;
        const outerR = cfg.size * 2.5;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 64);
        ringGeo.rotateX(Math.PI / 2);
        const rCvs = document.createElement('canvas');
        rCvs.width = 256;
        rCvs.height = 1;
        const rCtx = rCvs.getContext('2d');
        if (rCtx) {
          const grad = rCtx.createLinearGradient(0, 0, 256, 0);
          grad.addColorStop(0, 'rgba(195, 175, 130, 0)');
          grad.addColorStop(0.2, 'rgba(215, 195, 140, 0.7)');
          grad.addColorStop(0.55, 'rgba(150, 130, 95, 0.2)');
          grad.addColorStop(0.7, 'rgba(220, 200, 155, 0.85)');
          grad.addColorStop(1, 'rgba(180, 160, 120, 0)');
          rCtx.fillStyle = grad;
          rCtx.fillRect(0, 0, 256, 1);
        }
        const ringTex = new THREE.CanvasTexture(rCvs);
        const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
        planetAnchor.add(new THREE.Mesh(ringGeo, ringMat));
      }

      planetObjs.push({
        id: cfg.id,
        name: cfg.name,
        pivot,
        mesh: pMesh,
        anchor: planetAnchor,
        orbitSpeed: (2 * Math.PI / Math.sqrt(cfg.period)) * 0.12,
        rotSpeed: cfg.rotSpeed,
        dist: cfg.dist,
        size: cfg.size
      });
    });
    planetsRef.current = planetObjs;
    orbitLinesRef.current = orbitLines;

    // 6. Main Asteroid Belt (dist ~97 to 109)
    const asteroidCount = 1800;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    const asteroidColors = new Float32Array(asteroidCount * 3);
    const cAsteroid = new THREE.Color(0xb09e86);
    const cAsteroidDim = new THREE.Color(0x6e6355);

    for (let i = 0; i < asteroidCount; i++) {
      const dist = 97 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const ySpread = (Math.random() - 0.5) * 4.5;
      asteroidPositions[i * 3] = Math.cos(angle) * dist;
      asteroidPositions[i * 3 + 1] = ySpread;
      asteroidPositions[i * 3 + 2] = Math.sin(angle) * dist;

      const lerpC = cAsteroidDim.clone().lerp(cAsteroid, Math.random());
      asteroidColors[i * 3] = lerpC.r;
      asteroidColors[i * 3 + 1] = lerpC.g;
      asteroidColors[i * 3 + 2] = lerpC.b;
    }
    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    asteroidGeo.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));
    const asteroidMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.72
    });
    const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
    scene.add(asteroidBelt);
    asteroidBeltRef.current = asteroidBelt;

    // 7. Kuiper Belt (dist ~295 to 380)
    const kuiperCount = 2600;
    const kuiperGeo = new THREE.BufferGeometry();
    const kuiperPositions = new Float32Array(kuiperCount * 3);
    const kuiperColors = new Float32Array(kuiperCount * 3);
    const cKuiperIce = new THREE.Color(0x9bd8ff);
    const cKuiperDark = new THREE.Color(0x406085);

    for (let i = 0; i < kuiperCount; i++) {
      const dist = 295 + Math.random() * 85;
      const angle = Math.random() * Math.PI * 2;
      const ySpread = (Math.random() - 0.5) * 16;
      kuiperPositions[i * 3] = Math.cos(angle) * dist;
      kuiperPositions[i * 3 + 1] = ySpread;
      kuiperPositions[i * 3 + 2] = Math.sin(angle) * dist;

      const lerpC = cKuiperDark.clone().lerp(cKuiperIce, Math.random());
      kuiperColors[i * 3] = lerpC.r;
      kuiperColors[i * 3 + 1] = lerpC.g;
      kuiperColors[i * 3 + 2] = lerpC.b;
    }
    kuiperGeo.setAttribute('position', new THREE.BufferAttribute(kuiperPositions, 3));
    kuiperGeo.setAttribute('color', new THREE.BufferAttribute(kuiperColors, 3));
    const kuiperMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });
    const kuiperBelt = new THREE.Points(kuiperGeo, kuiperMat);
    scene.add(kuiperBelt);
    kuiperBeltRef.current = kuiperBelt;

    // 8. Deep-Space Probes (Voyager 1, Voyager 2, New Horizons)
    const probeTrajectories = [
      {
        id: 'voyager-1',
        name: 'Voyager 1',
        color: 0x38bdf8,
        distAU: '163.42 AU',
        points: [
          new THREE.Vector3(66, 0, 0),
          new THREE.Vector3(124, 8, 40),
          new THREE.Vector3(160, 28, 80),
          new THREE.Vector3(260, 85, 170),
          new THREE.Vector3(420, 160, 310)
        ],
        currentPos: new THREE.Vector3(380, 140, 275)
      },
      {
        id: 'voyager-2',
        name: 'Voyager 2',
        color: 0x34d399,
        distAU: '136.21 AU',
        points: [
          new THREE.Vector3(66, 0, 0),
          new THREE.Vector3(120, -4, -30),
          new THREE.Vector3(158, -12, -75),
          new THREE.Vector3(204, -26, -125),
          new THREE.Vector3(246, -42, -180),
          new THREE.Vector3(390, -95, -290)
        ],
        currentPos: new THREE.Vector3(350, -82, -260)
      },
      {
        id: 'new-horizons',
        name: 'New Horizons',
        color: 0xfbbf24,
        distAU: '57.84 AU',
        points: [
          new THREE.Vector3(66, 0, 0),
          new THREE.Vector3(125, 4, 15),
          new THREE.Vector3(284, 18, 120),
          new THREE.Vector3(340, 26, 180),
          new THREE.Vector3(430, 42, 260)
        ],
        currentPos: new THREE.Vector3(365, 30, 205)
      }
    ];

    const probeMeshes: THREE.Object3D[] = [];
    const probeLines: THREE.Line[] = [];

    probeTrajectories.forEach(probe => {
      const curve = new THREE.CatmullRomCurve3(probe.points);
      const curvePts = curve.getPoints(120);
      const trajGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
      const trajMat = new THREE.LineDashedMaterial({
        color: probe.color,
        dashSize: 4,
        gapSize: 2,
        transparent: true,
        opacity: 0.75
      });
      const trajLine = new THREE.Line(trajGeo, trajMat);
      trajLine.computeLineDistances();
      scene.add(trajLine);
      probeLines.push(trajLine);

      // Marker for probe current position
      const probeGeo = new THREE.SphereGeometry(2.0, 16, 16);
      const probeMat = new THREE.MeshBasicMaterial({ color: probe.color });
      const probeMesh = new THREE.Mesh(probeGeo, probeMat);
      probeMesh.position.copy(probe.currentPos);
      probeMesh.userData = { id: probe.id, name: probe.name, isProbe: true, distAU: probe.distAU };
      scene.add(probeMesh);
      interactiveTargets.push(probeMesh);
      probeMeshes.push(probeMesh);

      // Halo ring
      const haloGeo = new THREE.RingGeometry(2.8, 4.2, 24);
      const haloMat = new THREE.MeshBasicMaterial({ color: probe.color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(probe.currentPos);
      halo.lookAt(camera.position);
      scene.add(halo);
      probeMeshes.push(halo);
    });
    probeMeshesRef.current = probeMeshes;
    probeLinesRef.current = probeLines;

    // 9. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    const dom = renderer.domElement;

    const getRaycastTargets = (clientX: number, clientY: number) => {
      const rect = dom.getBoundingClientRect();
      mouseVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);
      return raycaster.intersectObjects(interactiveTargets, true);
    };

    const updateCameraFromSpherical = () => {
      const s = sphericalRef.current;
      targetCamPosRef.current.x = s.radius * Math.sin(s.phi) * Math.sin(s.theta);
      targetCamPosRef.current.y = s.radius * Math.cos(s.phi);
      targetCamPosRef.current.z = s.radius * Math.sin(s.phi) * Math.cos(s.theta);
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - prevMouseRef.current.x;
        const dy = e.clientY - prevMouseRef.current.y;
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
        sphericalRef.current.theta -= dx * 0.0055;
        sphericalRef.current.phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.03, sphericalRef.current.phi - dy * 0.0045));
        updateCameraFromSpherical();
      } else {
        const hits = getRaycastTargets(e.clientX, e.clientY);
        if (hits.length > 0 && hits[0].object.userData?.name) {
          dom.style.cursor = 'pointer';
          const ud = hits[0].object.userData;
          if (onHoverTarget) {
            onHoverTarget({
              name: ud.name,
              dist: ud.distAU || '',
              x: e.clientX,
              y: e.clientY
            });
          }
        } else {
          dom.style.cursor = 'default';
          if (onHoverTarget) onHoverTarget(null);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRef.current.radius = Math.max(35, Math.min(950, sphericalRef.current.radius + e.deltaY * 0.45));
      updateCameraFromSpherical();
    };

    const handleClick = (e: MouseEvent) => {
      const hits = getRaycastTargets(e.clientX, e.clientY);
      if (hits.length > 0) {
        const hit = hits[0].object;
        if (hit.userData?.id) {
          onSelectTarget(hit.userData.id);
        }
      }
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleClick);

    // 10. Animation Loop
    const clock = new THREE.Clock();
    let pulse = 0;
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      pulse += delta * 1.8;
      const pScale = 1 + Math.sin(pulse) * 0.05;
      if (glowMeshRef.current) glowMeshRef.current.scale.set(pScale, pScale, pScale);
      if (outerGlowMeshRef.current) {
        const pScale2 = 1 + Math.cos(pulse * 0.7) * 0.08;
        outerGlowMeshRef.current.scale.set(pScale2, pScale2, pScale2);
      }

      if (!isPausedRef.current) {
        const effSpeed = speedRef.current;
        planetObjs.forEach(p => {
          p.pivot.rotation.y += p.orbitSpeed * delta * effSpeed;
          p.mesh.rotation.y += p.rotSpeed * delta * 50 * effSpeed;
        });
        if (asteroidBeltRef.current) asteroidBeltRef.current.rotation.y += 0.015 * delta * effSpeed;
        if (kuiperBeltRef.current) kuiperBeltRef.current.rotation.y += 0.005 * delta * effSpeed;
      }

      // Cinematic drone camera rotation
      if (isCinematicRef.current) {
        sphericalRef.current.theta += 0.0025;
        updateCameraFromSpherical();
      }

      // Smooth camera interpolation
      camera.position.lerp(targetCamPosRef.current, 0.06);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.06);
      camera.lookAt(currentLookAtRef.current);

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [createPlanetTexture, onHoverTarget, onSelectTarget]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none" />;
}
