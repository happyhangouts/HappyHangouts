import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { 
  Sparkles, 
  RotateCw, 
  Eye, 
  Maximize2, 
  Coffee, 
  Dumbbell, 
  Lightbulb, 
  Music, 
  ChevronDown, 
  ChevronUp,
  Volume2
} from "lucide-react";
import { audio } from "../utils/audio";

interface ThreeHeroHangoutSceneProps {
  onSelectActivity?: (activityKey: string) => void;
  className?: string;
}

export default function ThreeHeroHangoutScene({
  onSelectActivity,
  className = ""
}: ThreeHeroHangoutSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scene state
  const [activeActivity, setActiveActivity] = useState<string>("all");
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [hoveredTokenName, setHoveredTokenName] = useState<string | null>(null);

  // References for animation loop & interactions
  const isDraggingRef = useRef<boolean>(false);
  const previousPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.15, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0.15, y: 0 });
  const autoRotateSpeed = useRef<number>(0.3);
  const selectedAngleTargetY = useRef<number | null>(null);

  // Reusable token group refs
  const tokensRef = useRef<{ [key: string]: THREE.Group }>({});
  const constellationRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Software WebGL Detection
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement("canvas");
        const gl = probeCanvas.getContext("webgl2");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.6, 6.2);

    // 3. Renderer Setup with PBR Color Pipeline
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Studio Environment Reflection via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn("RoomEnvironment PMREM fallback:", e);
    }

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xeff6ff, 0x1e293b, 1.2);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Master Constellation Root
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    constellationRef.current = masterGroup;

    // 6. Ground Contact Shadow & Floating Levitation Ring
    const contactShadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const contactCanvas = document.createElement("canvas");
    contactCanvas.width = 128;
    contactCanvas.height = 128;
    const ctx = contactCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, "rgba(2, 6, 23, 0.45)");
    grad.addColorStop(0.5, "rgba(30, 58, 138, 0.18)");
    grad.addColorStop(1, "rgba(2, 6, 23, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(contactCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;

    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const contactShadowMesh = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.y = -1.55;
    scene.add(contactShadowMesh);

    // Base Levitation Platform
    const platformGroup = new THREE.Group();
    platformGroup.position.y = -1.45;

    // Outer Chrome Ring
    const outerRingGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 48);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.85,
      roughness: 0.15,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.receiveShadow = !isSoftwareGl;
    platformGroup.add(outerRing);

    // Glowing Inner Disc
    const innerDiscGeo = new THREE.CylinderGeometry(1.48, 1.48, 0.1, 48);
    const innerDiscMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.6,
      roughness: 0.2,
    });
    const innerDisc = new THREE.Mesh(innerDiscGeo, innerDiscMat);
    innerDisc.position.y = 0.02;
    platformGroup.add(innerDisc);

    // Neon Circuit Accent Ring
    const neonTorusGeo = new THREE.TorusGeometry(1.52, 0.025, 16, 64);
    const neonTorusMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.3,
    });
    const neonRing = new THREE.Mesh(neonTorusGeo, neonTorusMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = 0.07;
    platformGroup.add(neonRing);

    masterGroup.add(platformGroup);

    // 7. Procedural 3D Centerpiece: Twin Humanoid Connection High-Five
    const emblemGroup = new THREE.Group();
    emblemGroup.position.y = -0.55;

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.9,
      roughness: 0.1,
    });

    const blueFigureMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.75,
      roughness: 0.25,
    });

    // Helper to build a stylized stylized figure
    function createStylizedFigure(isBlue: boolean) {
      const fig = new THREE.Group();
      const mat = isBlue ? blueFigureMat : chromeMat;

      // Head
      const headGeo = new THREE.SphereGeometry(0.24, 32, 24);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.set(0, 1.05, 0);
      head.castShadow = !isSoftwareGl;
      fig.add(head);

      // Torso / Body Curve
      const bodyCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0.8, 0),
        new THREE.Vector3(isBlue ? -0.1 : 0.1, 0.55, 0),
        new THREE.Vector3(isBlue ? 0.05 : -0.05, 0.3, 0),
        new THREE.Vector3(0, 0, 0)
      );
      const bodyGeo = new THREE.TubeGeometry(bodyCurve, 20, 0.16, 16, false);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.castShadow = !isSoftwareGl;
      fig.add(body);

      // High-Five Arm reaching toward center
      const armCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(isBlue ? -0.12 : 0.12, 0.75, 0),
        new THREE.Vector3(isBlue ? -0.28 : 0.28, 0.95, 0.05),
        new THREE.Vector3(isBlue ? -0.38 : 0.38, 1.15, 0.08),
        new THREE.Vector3(isBlue ? -0.46 : 0.46, 1.25, 0.1)
      );
      const armGeo = new THREE.TubeGeometry(armCurve, 16, 0.08, 12, false);
      const arm = new THREE.Mesh(armGeo, mat);
      arm.castShadow = !isSoftwareGl;
      fig.add(arm);

      // Outer Supporting Leg / Base
      const legGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.45, 16);
      const leg = new THREE.Mesh(legGeo, mat);
      leg.position.set(isBlue ? 0.18 : -0.18, -0.22, 0);
      leg.rotation.z = isBlue ? -0.2 : 0.2;
      fig.add(leg);

      return fig;
    }

    const figureA = createStylizedFigure(false); // White/Silver Host
    figureA.position.x = -0.48;
    emblemGroup.add(figureA);

    const figureB = createStylizedFigure(true); // Blue Seeker
    figureB.position.x = 0.48;
    emblemGroup.add(figureB);

    // Glowing Golden Spark / Heart between hands
    const sparkGeo = new THREE.OctahedronGeometry(0.14, 0);
    const sparkMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      metalness: 0.3,
      roughness: 0.15,
    });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.set(0, 0.7, 0.1);
    emblemGroup.add(spark);

    masterGroup.add(emblemGroup);

    // 8. Composite 3D Activity Tokens Orbiting the Constellation
    const tokens: { [key: string]: THREE.Group } = {};

    // --- Token 1: ☕ Coffee Cup ---
    const coffeeGroup = new THREE.Group();
    coffeeGroup.name = "coffee";

    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0.1,
    });
    // Cup outer
    const cupOuterGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.38, 24);
    const cupOuter = new THREE.Mesh(cupOuterGeo, cupMat);
    cupOuter.castShadow = !isSoftwareGl;
    coffeeGroup.add(cupOuter);

    // Dark espresso fluid
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x3b1d11,
      roughness: 0.2,
      metalness: 0.1,
    });
    const liquidGeo = new THREE.CircleGeometry(0.22, 24);
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 0.17;
    coffeeGroup.add(liquid);

    // Cup handle
    const handleGeo = new THREE.TorusGeometry(0.12, 0.035, 12, 24, Math.PI);
    const handle = new THREE.Mesh(handleGeo, cupMat);
    handle.rotation.z = -Math.PI / 2;
    handle.position.set(0.26, 0.02, 0);
    coffeeGroup.add(handle);

    // Steam curl
    const steamCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0.22, 0),
      new THREE.Vector3(0.06, 0.34, 0),
      new THREE.Vector3(-0.06, 0.44, 0),
      new THREE.Vector3(0.04, 0.55, 0)
    );
    const steamMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.8,
    });
    const steamGeo = new THREE.TubeGeometry(steamCurve, 16, 0.02, 8, false);
    const steam = new THREE.Mesh(steamGeo, steamMat);
    coffeeGroup.add(steam);

    tokens.coffee = coffeeGroup;

    // --- Token 2: 🏸 Badminton Racket & Shuttlecock ---
    const badmintonGroup = new THREE.Group();
    badmintonGroup.name = "sports";

    const racketFrameMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.85,
      roughness: 0.18,
    });
    // Oval Head
    const racketHeadGeo = new THREE.TorusGeometry(0.28, 0.025, 12, 32);
    const racketHead = new THREE.Mesh(racketHeadGeo, racketFrameMat);
    racketHead.scale.set(0.85, 1.25, 1);
    badmintonGroup.add(racketHead);

    // Cross-strings wireframe
    const stringGridGeo = new THREE.PlaneGeometry(0.42, 0.62, 6, 8);
    const stringMat = new THREE.MeshBasicMaterial({
      color: 0xa7f3d0,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const stringGrid = new THREE.Mesh(stringGridGeo, stringMat);
    badmintonGroup.add(stringGrid);

    // Shaft & Grip
    const shaftGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.5, 16);
    const shaft = new THREE.Mesh(shaftGeo, racketFrameMat);
    shaft.position.y = -0.58;
    badmintonGroup.add(shaft);

    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
    });
    const gripGeo = new THREE.CylinderGeometry(0.035, 0.038, 0.28, 16);
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.y = -0.84;
    badmintonGroup.add(grip);

    // Shuttlecock
    const shuttleGroup = new THREE.Group();
    const corkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const cork = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), corkMat);
    shuttleGroup.add(cork);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4, wireframe: true });
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 12, 1, true), coneMat);
    skirt.position.y = 0.12;
    shuttleGroup.add(skirt);
    shuttleGroup.position.set(0.28, 0.1, 0.15);
    shuttleGroup.rotation.z = 0.5;
    badmintonGroup.add(shuttleGroup);

    tokens.sports = badmintonGroup;

    // --- Token 3: 💡 Tech & Startup Ideation Prism ---
    const techGroup = new THREE.Group();
    techGroup.name = "tech";

    const prismMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.9,
      roughness: 0.1,
    });
    const prismGeo = new THREE.IcosahedronGeometry(0.28, 0);
    const prism = new THREE.Mesh(prismGeo, prismMat);
    techGroup.add(prism);

    const outerGimbalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: true,
    });
    const outerGimbal = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.02, 12, 32), outerGimbalMat);
    techGroup.add(outerGimbal);

    const microCubeMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      metalness: 0.5,
      roughness: 0.2,
    });
    for (let c = 0; c < 3; c++) {
      const angle = (c * Math.PI * 2) / 3;
      const microCube = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), microCubeMat);
      microCube.position.set(Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, 0);
      techGroup.add(microCube);
    }
    tokens.tech = techGroup;

    // --- Token 4: ♟️ Chess Knight Strategy ---
    const chessGroup = new THREE.Group();
    chessGroup.name = "chess";

    const chessMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.8,
      roughness: 0.18,
    });
    // Base pedestal
    const chessBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.1, 24), chessMat);
    chessGroup.add(chessBase);
    const chessTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 0.35, 24), chessMat);
    chessTorso.position.y = 0.22;
    chessGroup.add(chessTorso);
    // Knight head
    const knightHead = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.32, 0.24), chessMat);
    knightHead.position.set(0.04, 0.48, 0);
    knightHead.rotation.z = -0.2;
    chessGroup.add(knightHead);
    // Snout
    const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.18), chessMat);
    muzzle.position.set(-0.1, 0.42, 0);
    chessGroup.add(muzzle);
    tokens.chess = chessGroup;

    // --- Token 5: 🎸 Indie Music & Vinyl ---
    const musicGroup = new THREE.Group();
    musicGroup.name = "music";

    const guitarWoodMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      metalness: 0.7,
      roughness: 0.25,
    });
    // Figure-8 guitar body
    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 32), guitarWoodMat);
    lowerBody.rotation.x = Math.PI / 2;
    musicGroup.add(lowerBody);
    const upperBody = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.08, 32), guitarWoodMat);
    upperBody.rotation.x = Math.PI / 2;
    upperBody.position.y = 0.32;
    musicGroup.add(upperBody);

    // Soundhole
    const soundHoleMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.08, 24), soundHoleMat);
    hole.position.set(0, 0.25, 0.045);
    musicGroup.add(hole);

    // Neck & Headstock
    const neckMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.4 });
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.45, 0.05), neckMat);
    neck.position.set(0, 0.65, 0.02);
    musicGroup.add(neck);

    tokens.music = musicGroup;

    // Arrange tokens on an orbital perimeter around the central high-five beacon
    const tokenKeys = ["coffee", "sports", "tech", "chess", "music"];
    const orbitRadius = 2.15;
    tokenKeys.forEach((key, idx) => {
      const angle = (idx * Math.PI * 2) / tokenKeys.length;
      const group = tokens[key];
      group.position.set(
        Math.cos(angle) * orbitRadius,
        0.15 + (idx % 2 === 0 ? 0.35 : -0.25),
        Math.sin(angle) * orbitRadius
      );
      group.scale.set(0.9, 0.9, 0.9);
      masterGroup.add(group);
    });

    tokensRef.current = tokens;

    // 9. Floating Orbital Star Sparkles (InstancedMesh)
    const particleCount = 28;
    const particleGeo = new THREE.OctahedronGeometry(0.04, 0);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x2563eb,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();
    const particleInitialAngles: number[] = [];
    const particleRadii: number[] = [];
    const particleHeights: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const y = -0.8 + Math.random() * 2.2;
      particleRadii.push(r);
      particleInitialAngles.push(theta);
      particleHeights.push(y);

      dummy.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
      dummy.scale.setScalar(0.6 + Math.random() * 0.8);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    particles.computeBoundingSphere();
    masterGroup.add(particles);

    // Pre-warm shaders
    if (!isSoftwareGl) {
      try {
        renderer.compile(scene, camera);
      } catch (e) {
        console.warn("Renderer pre-compile:", e);
      }
    }

    // 10. Animation & Render Loop with Exponential Damping
    let frameId = 0;
    const clock = new THREE.Clock();

    function renderLoop() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Gentle floating animation of tokens
      tokenKeys.forEach((key, idx) => {
        const group = tokens[key];
        if (group) {
          group.rotation.y += 0.8 * delta;
          group.rotation.x = Math.sin(elapsed * 1.5 + idx) * 0.15;
          group.position.y += Math.sin(elapsed * 2 + idx) * 0.0015;
        }
      });

      // Sparkle particles orbital drift
      for (let i = 0; i < particleCount; i++) {
        const theta = particleInitialAngles[i] + elapsed * 0.25;
        const r = particleRadii[i];
        const y = particleHeights[i] + Math.sin(elapsed * 2 + i) * 0.1;
        dummy.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
        dummy.rotation.x = elapsed + i;
        dummy.rotation.y = elapsed * 1.2 + i;
        dummy.updateMatrix();
        particles.setMatrixAt(i, dummy.matrix);
      }
      particles.instanceMatrix.needsUpdate = true;

      // Pulse central emblem spark
      spark.rotation.y += 2.0 * delta;
      spark.rotation.x += 1.2 * delta;

      // Constellation smooth damping rotation
      if (selectedAngleTargetY.current !== null) {
        // Smoothly rotate to selected activity view
        targetRotation.current.y = THREE.MathUtils.damp(
          targetRotation.current.y,
          selectedAngleTargetY.current,
          5,
          delta
        );
        // Clear when close
        if (Math.abs(targetRotation.current.y - selectedAngleTargetY.current) < 0.01) {
          selectedAngleTargetY.current = null;
        }
      } else if (isAutoRotating && !isDraggingRef.current) {
        targetRotation.current.y += autoRotateSpeed.current * delta;
      }

      currentRotation.current.x = THREE.MathUtils.damp(
        currentRotation.current.x,
        targetRotation.current.x,
        6,
        delta
      );
      currentRotation.current.y = THREE.MathUtils.damp(
        currentRotation.current.y,
        targetRotation.current.y,
        6,
        delta
      );

      masterGroup.rotation.x = currentRotation.current.x;
      masterGroup.rotation.y = currentRotation.current.y;

      renderer.render(scene, camera);

      frameId = requestAnimationFrame(renderLoop);
    }

    frameId = requestAnimationFrame(renderLoop);

    // 11. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      contactShadowMat.dispose();
      shadowTex.dispose();
    };
  }, [isAutoRotating]);

  // Pointer drag controls for 3D navigation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousPointerPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) {
      // Subtle parallax when simply hovering
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotation.current.x = THREE.MathUtils.clamp(0.15 - normY * 0.2, -0.2, 0.45);
      }
      return;
    }

    const deltaX = e.clientX - previousPointerPos.current.x;
    const deltaY = e.clientY - previousPointerPos.current.y;
    previousPointerPos.current = { x: e.clientX, y: e.clientY };

    targetRotation.current.y += deltaX * 0.007;
    targetRotation.current.x = THREE.MathUtils.clamp(
      targetRotation.current.x + deltaY * 0.005,
      -0.25,
      0.5
    );
    selectedAngleTargetY.current = null;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  // Activity Switcher
  const handleSelectActivity = (key: string, idx: number) => {
    audio.playClick();
    setActiveActivity(key);
    if (onSelectActivity) {
      onSelectActivity(key);
    }

    if (key === "all") {
      selectedAngleTargetY.current = 0;
      return;
    }

    // Rotate constellation so the token faces the camera front
    const tokenKeys = ["coffee", "sports", "tech", "chess", "music"];
    const targetIdx = tokenKeys.indexOf(key);
    if (targetIdx !== -1) {
      const angle = (targetIdx * Math.PI * 2) / tokenKeys.length;
      // Front is -angle - Math.PI / 2
      selectedAngleTargetY.current = -angle + Math.PI / 2;
    }
  };

  const activitiesList = [
    { id: "all", label: "All Hangouts", icon: Sparkles },
    { id: "sports", label: "Badminton", icon: Dumbbell },
    { id: "coffee", label: "Specialty Coffee", icon: Coffee },
    { id: "tech", label: "Tech Co-work", icon: Lightbulb },
    { id: "chess", label: "Blitz Chess", icon: Eye },
    { id: "music", label: "Acoustic Music", icon: Music },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[440px] sm:h-[500px] lg:h-[540px] rounded-3xl overflow-hidden border-2 border-slate-300 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white shadow-xl select-none ${className}`}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Floating Badge (High Contrast Legible) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-white/95 border-2 border-slate-300 shadow-md flex items-center gap-2 text-slate-900 font-extrabold text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
          <span>3D Spatial Constellation</span>
          <span className="text-[10px] text-slate-500 font-normal">· Drag to Rotate</span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            audio.playClick();
            setIsAutoRotating(!isAutoRotating);
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer shadow-sm ${
            isAutoRotating
              ? "bg-white text-slate-900 border-slate-300 hover:bg-slate-100"
              : "bg-blue-600 text-white border-blue-700"
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? "text-blue-600" : "text-white"}`} />
          <span className="hidden sm:inline">{isAutoRotating ? "Rotating" : "Paused"}</span>
        </button>
      </div>

      {/* Bottom Sleek Interactive Dock (Per ThreeJS Directives: Collapsible Center Dock) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl transition-all duration-300">
        
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => {
              audio.playClick();
              setIsDockCollapsed(!isDockCollapsed);
            }}
            className="px-3 py-1 rounded-t-lg bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1 shadow-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Activities</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Body */}
        {!isDockCollapsed && (
          <div className="p-2 sm:p-2.5 rounded-2xl bg-white/95 border-2 border-slate-300 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
              {activitiesList.map((act, idx) => {
                const Icon = act.icon;
                const isSelected = activeActivity === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => handleSelectActivity(act.id, idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                        : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-blue-400" : "text-slate-700"}`} />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
