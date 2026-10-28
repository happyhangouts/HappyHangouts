import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Maximize2, 
  Sliders, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight,
  Eye,
  Info,
  Compass,
  ShoppingBag,
  ExternalLink,
  Tag,
  Camera,
  Coffee,
  Dumbbell,
  Users
} from "lucide-react";
import { audio } from "../utils/audio";
import { CompanionPartner, COMPANION_PARTNERS } from "../data/companions";

export interface JacketItem {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  edition: string;
  baseColor: number;
  accentColor: number;
  liningColor: number;
  roughness: number;
  metalness: number;
  style: "bomber" | "windbreaker" | "shell" | "puffer" | "vest" | "parka";
  fabric: string;
  price: number;
  rentalPrice: number;
  pairedCompanionId: string;
  description: string;
  specs: {
    weight: string;
    waterproof: string;
    temperature: string;
    nfcTech: string;
  };
  lookbookImage: string;
  lookbookLocation: string;
  lookbookActivity: string;
}

export const JACKET_COLLECTION: JacketItem[] = [
  {
    id: "raceway-bomber",
    number: "01",
    name: "RACEWAY PADDED BOMBER",
    subtitle: "RACING STRIPE & DUAL COMPANION EMBLEM",
    edition: "EDITION 01 // SS-26",
    baseColor: 0x18181b, // Charcoal Obsidian
    accentColor: 0x2563eb, // Cobalt Blue
    liningColor: 0x3b82f6, // Bright Blue
    roughness: 0.35,
    metalness: 0.25,
    style: "bomber",
    fabric: "380GSM Heavyweight Micro-Twill with Cire Water Repellent",
    price: 3899,
    rentalPrice: 499,
    pairedCompanionId: "comp-2", // Meera Reddy (Sports & Badminton)
    description: "Engineered for active sports meetups and brisk evening walks. Features ergonomic shoulder articulation, laser-etched Happy Hangouts crest, and an integrated NFC smart tag.",
    specs: {
      weight: "820g",
      waterproof: "DWR Finish Level 4",
      temperature: "14°C to 26°C",
      nfcTech: "Encrypted Companion Identity Chip"
    },
    lookbookImage: "/src/assets/images/hub_sports_rally_1792650858523.jpg",
    lookbookLocation: "Siri Fort Sports Complex, South Delhi",
    lookbookActivity: "Badminton Warm-up & Recovery Chat"
  },
  {
    id: "cybertech-windbreaker",
    number: "02",
    name: "CYBERTECH METRO WINDBREAKER",
    subtitle: "HIGH-VIS ACCENTS & VENTILATED CORE",
    edition: "EDITION 02 // SS-26",
    baseColor: 0xe2e8f0, // Titanium Oyster
    accentColor: 0xf97316, // Solar Orange
    liningColor: 0x0f172a, // Deep Navy
    roughness: 0.28,
    metalness: 0.45,
    style: "windbreaker",
    fabric: "Ultra-Light Ripstop Nylon with Bonded Seams",
    price: 3499,
    rentalPrice: 449,
    pairedCompanionId: "comp-1", // Aarav Mehta (Tech & Co-working)
    description: "Designed for coffee shop co-working, startup discussions, and urban pedestrian transit. Highly breathable with hidden zip pockets for laptop accessories.",
    specs: {
      weight: "440g",
      waterproof: "10,000mm Hydrostatic Head",
      temperature: "18°C to 30°C",
      nfcTech: "Verified Hub Automated Check-In"
    },
    lookbookImage: "/src/assets/images/hub_cafe_coffee_1792650858578.jpg",
    lookbookLocation: "Blue Tokai Coffee, Khan Market",
    lookbookActivity: "Product Strategy & Pour-Over Tasting"
  },
  {
    id: "nomad-tokyo-shell",
    number: "03",
    name: "NOMAD TOKYO TECH-SHELL",
    subtitle: "KANJI WATERMARK & DUAL CARRIER STRAP",
    edition: "EDITION 03 // SS-26",
    baseColor: 0x09090b, // Deep Pitch Black
    accentColor: 0x10b981, // Emerald Cyber
    liningColor: 0x059669, // Forest Emerald
    roughness: 0.4,
    metalness: 0.15,
    style: "shell",
    fabric: "3-Layer GORE-TEX Breathable Technical Membrane",
    price: 4599,
    rentalPrice: 599,
    pairedCompanionId: "comp-4", // Ananya Kapoor (Street Photography)
    description: "Built for golden-hour photography walks and street explorations. Features weather-sealed YKK Aquaguard zips, camera strap loops, and reflective companion markings.",
    specs: {
      weight: "610g",
      waterproof: "20,000mm GORE-TEX Spec",
      temperature: "10°C to 24°C",
      nfcTech: "Geo-Verified Street Trail Pass"
    },
    lookbookImage: "/src/assets/images/hero_delhi_hangout_1792650857994.jpg",
    lookbookLocation: "32nd Avenue & CyberHub Promenade",
    lookbookActivity: "Street Photography & Night Stroll"
  },
  {
    id: "solar-expedition-puffer",
    number: "04",
    name: "SOLAR EXPEDITION PUFFER",
    subtitle: "BAFFLED QUILTING & THERMAL ACOUSTIC INSULATION",
    edition: "EDITION 04 // SS-26",
    baseColor: 0xd97706, // Amber Desert Sun
    accentColor: 0x475569, // Slate Steel
    liningColor: 0x78350f, // Warm Russet
    roughness: 0.3,
    metalness: 0.3,
    style: "puffer",
    fabric: "750-Fill Recycled Down with Matte Nylon Face",
    price: 4999,
    rentalPrice: 650,
    pairedCompanionId: "comp-3", // Kabir Sen (Coffee & Books)
    description: "Voluminous high-cushion silhouette for open-air concerts, rooftop jams, and winter park picnics. Maximum thermal comfort with minimal bulk.",
    specs: {
      weight: "890g",
      waterproof: "Storm-Repel DWR",
      temperature: "5°C to 20°C",
      nfcTech: "Acoustic Session Pass Token"
    },
    lookbookImage: "/src/assets/images/hub_cafe_coffee_1792650858578.jpg",
    lookbookLocation: "Lodhi Art District & Cafe Lawn",
    lookbookActivity: "Acoustic Jamming & Storytelling"
  },
  {
    id: "tactical-modular-vest",
    number: "05",
    name: "MODULAR UTILITY TECH-VEST",
    subtitle: "MOLLE SYSTEM & QUICK-RELEASE COBRA BUCKLES",
    edition: "EDITION 05 // SS-26",
    baseColor: 0x27272a, // Gunmetal Zinc
    accentColor: 0x6366f1, // Indigo Violet
    liningColor: 0x1e1b4b, // Deep Violet
    roughness: 0.5,
    metalness: 0.2,
    style: "vest",
    fabric: "1000D Cordura Ballistic Canvas with Mil-Spec Webbing",
    price: 2999,
    rentalPrice: 399,
    pairedCompanionId: "comp-5", // Tanya Verma
    description: "Versatile modular vest designed for strategy board game meetups and tech hack nights. 8 functional tactical pouches for game cards, pens, and cables.",
    specs: {
      weight: "520g",
      waterproof: "Splash & Spill Resistant",
      temperature: "All-Season Layering",
      nfcTech: "Boardgame Master Badge"
    },
    lookbookImage: "/src/assets/images/hub_sports_rally_1792650858523.jpg",
    lookbookLocation: "Hauz Khas Social & Boardgame Lounge",
    lookbookActivity: "Catan Tournament & Coffee Chat"
  },
  {
    id: "neo-holo-parka",
    number: "06",
    name: "NEO SPECTRAL OVERCOAT",
    subtitle: "FUTURISTIC REFLECTIVE CHROMATIC COATING",
    edition: "EDITION 06 // SS-26",
    baseColor: 0xf1f5f9, // Frost White
    accentColor: 0x06b6d4, // Cyan Hologram
    liningColor: 0x0e7490, // Deep Teal
    roughness: 0.2,
    metalness: 0.6,
    style: "parka",
    fabric: "Reflective Glass-Microbead Polyurethane Membrane",
    price: 5299,
    rentalPrice: 699,
    pairedCompanionId: "comp-6", // Vikram Rao (Fitness)
    description: "The hero statement silhouette of the Happy Hangouts collection. In daylight it reads as minimalist matte chalk; at night under headlights it reflects glowing iridescent neon.",
    specs: {
      weight: "950g",
      waterproof: "15,000mm Sealed Tech",
      temperature: "8°C to 22°C",
      nfcTech: "VIP Night Ride Companion Gate"
    },
    lookbookImage: "/src/assets/images/hero_delhi_hangout_1792650857994.jpg",
    lookbookLocation: "Aerocity Pedestrian Promenade, New Delhi",
    lookbookActivity: "Midnight Cycling & Gelato Hangout"
  }
];

interface Editorial3DExperienceProps {
  onBookCompanion: (companion: CompanionPartner, lookName?: string) => void;
  onExploreDirectory?: () => void;
  onOpenMatchmaker?: () => void;
}

export default function Editorial3DExperience({
  onBookCompanion,
  onExploreDirectory,
  onOpenMatchmaker
}: Editorial3DExperienceProps) {
  // Active selection
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const activeJacket = JACKET_COLLECTION[currentIndex];

  // Visual modes
  const [renderMode, setRenderMode] = useState<"pbr" | "wireframe" | "unzipped">("pbr");
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [activeTab, setActiveTab] = useState<"look" | "inside_frame" | "specs">("look");
  const [selectedColorway, setSelectedColorway] = useState<number>(0);

  // Companion paired
  const pairedCompanion = useMemo(() => {
    return COMPANION_PARTNERS.find(c => c.id === activeJacket.pairedCompanionId) || COMPANION_PARTNERS[0];
  }, [activeJacket.pairedCompanionId]);

  // Three.js Mount & Animation Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Jacket 3D groups: Center, Left ghost, Right ghost
  const centerJacketGroupRef = useRef<THREE.Group | null>(null);
  const leftGhostGroupRef = useRef<THREE.Group | null>(null);
  const rightGhostGroupRef = useRef<THREE.Group | null>(null);

  // Specific panel references for unzipping animation
  const leftTorsoRef = useRef<THREE.Mesh | null>(null);
  const rightTorsoRef = useRef<THREE.Mesh | null>(null);
  const innerCardRef = useRef<THREE.Mesh | null>(null);

  // Interaction drags
  const isDraggingRef = useRef<boolean>(false);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0 });

  // Unzip animation interpolation state
  const unzipProgressRef = useRef<number>(0);

  // Navigation handlers
  const handleNext = () => {
    audio.playClick();
    setCurrentIndex((prev) => (prev + 1) % JACKET_COLLECTION.length);
  };

  const handlePrev = () => {
    audio.playClick();
    setCurrentIndex((prev) => (prev - 1 + JACKET_COLLECTION.length) % JACKET_COLLECTION.length);
  };

  const handleSelectIndex = (idx: number) => {
    audio.playClick();
    setCurrentIndex(idx);
  };

  // Build Procedural 3D Garment Model
  const createProceduralJacket = (jacket: JacketItem, isGhost: boolean = false): THREE.Group => {
    const group = new THREE.Group();

    const mainColor = isGhost ? 0x94a3b8 : jacket.baseColor;
    const accentCol = isGhost ? 0x64748b : jacket.accentColor;
    const opacityVal = isGhost ? 0.35 : 1.0;
    const isTrans = isGhost;

    // 1. Torso Material (PBR or Wireframe)
    const torsoMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: jacket.roughness,
      metalness: jacket.metalness,
      transparent: isTrans,
      opacity: opacityVal,
      wireframe: renderMode === "wireframe"
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: accentCol,
      roughness: 0.2,
      metalness: 0.4,
      transparent: isTrans,
      opacity: opacityVal,
      wireframe: renderMode === "wireframe"
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.9,
      transparent: isTrans,
      opacity: opacityVal
    });

    // Sub-assembly 1: Left Front Panel
    const leftPanelGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.45, 16, 4, false, 0, Math.PI * 0.46);
    const leftMesh = new THREE.Mesh(leftPanelGeo, torsoMat);
    leftMesh.position.set(-0.06, 0.1, 0);
    leftMesh.castShadow = !isGhost;
    leftMesh.receiveShadow = !isGhost;
    group.add(leftMesh);
    if (!isGhost) leftTorsoRef.current = leftMesh;

    // Sub-assembly 2: Right Front Panel
    const rightPanelGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.45, 16, 4, false, Math.PI * 0.54, Math.PI * 0.46);
    const rightMesh = new THREE.Mesh(rightPanelGeo, torsoMat);
    rightMesh.position.set(0.06, 0.1, 0);
    rightMesh.castShadow = !isGhost;
    rightMesh.receiveShadow = !isGhost;
    group.add(rightMesh);
    if (!isGhost) rightTorsoRef.current = rightMesh;

    // Sub-assembly 3: Back Panel
    const backGeo = new THREE.CylinderGeometry(0.53, 0.63, 1.45, 16, 4, false, Math.PI, Math.PI);
    const backMesh = new THREE.Mesh(backGeo, torsoMat);
    backMesh.position.set(0, 0.1, 0);
    backMesh.castShadow = !isGhost;
    group.add(backMesh);

    // Sub-assembly 4: Shoulders & Collar
    const collarGeo = new THREE.TorusGeometry(0.38, 0.08, 12, 24, Math.PI * 1.8);
    const collarMesh = new THREE.Mesh(collarGeo, accentMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.rotation.z = Math.PI * 0.1;
    collarMesh.position.set(0, 0.84, 0);
    group.add(collarMesh);

    // Sub-assembly 5: Left Arm / Sleeve
    const leftArmGeo = new THREE.CylinderGeometry(0.22, 0.18, 1.3, 12);
    const leftArm = new THREE.Mesh(leftArmGeo, torsoMat);
    leftArm.position.set(-0.78, 0.25, 0);
    leftArm.rotation.z = 0.28;
    leftArm.castShadow = !isGhost;
    group.add(leftArm);

    // Sub-assembly 6: Left Arm Cuff / Accent
    const cuffGeo = new THREE.TorusGeometry(0.18, 0.04, 10, 20);
    const leftCuff = new THREE.Mesh(cuffGeo, accentMat);
    leftCuff.position.set(-0.95, -0.32, 0);
    leftCuff.rotation.x = Math.PI / 2;
    leftCuff.rotation.y = 0.28;
    group.add(leftCuff);

    // Sub-assembly 7: Right Arm / Sleeve
    const rightArmGeo = new THREE.CylinderGeometry(0.22, 0.18, 1.3, 12);
    const rightArm = new THREE.Mesh(rightArmGeo, torsoMat);
    rightArm.position.set(0.78, 0.25, 0);
    rightArm.rotation.z = -0.28;
    rightArm.castShadow = !isGhost;
    group.add(rightArm);

    // Sub-assembly 8: Right Arm Cuff
    const rightCuff = new THREE.Mesh(cuffGeo, accentMat);
    rightCuff.position.set(0.95, -0.32, 0);
    rightCuff.rotation.x = Math.PI / 2;
    rightCuff.rotation.y = -0.28;
    group.add(rightCuff);

    // Sub-assembly 9: Racing Stripes or Chest Accent Webbing
    const stripeGeo = new THREE.BoxGeometry(0.14, 0.9, 0.04);
    const stripeMesh = new THREE.Mesh(stripeGeo, accentMat);
    stripeMesh.position.set(-0.28, 0.2, 0.52);
    stripeMesh.rotation.z = -0.05;
    group.add(stripeMesh);

    // Sub-assembly 10: Central Zipper Hardware Track
    const zipperGeo = new THREE.BoxGeometry(0.035, 1.4, 0.05);
    const zipperMesh = new THREE.Mesh(zipperGeo, chromeMat);
    zipperMesh.position.set(0, 0.1, 0.54);
    group.add(zipperMesh);

    // Zipper Slider Pull
    const pullGeo = new THREE.BoxGeometry(0.06, 0.12, 0.08);
    const pullMesh = new THREE.Mesh(pullGeo, chromeMat);
    pullMesh.position.set(0, 0.45, 0.58);
    group.add(pullMesh);

    // Sub-assembly 11: Inner NFC Smart Pass / Companion Crest Card (revealed when unzipped!)
    const cardGeo = new THREE.BoxGeometry(0.48, 0.72, 0.02);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Vibrant Royal Blue
      roughness: 0.15,
      metalness: 0.8,
      emissive: 0x1e40af,
      emissiveIntensity: 0.35,
      transparent: isTrans,
      opacity: opacityVal
    });
    const innerCard = new THREE.Mesh(cardGeo, cardMat);
    innerCard.position.set(0, 0.15, 0.1);
    group.add(innerCard);
    if (!isGhost) innerCardRef.current = innerCard;

    // Sub-assembly 12: Architectural Hanger / Titanium Stand
    const hangerGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12);
    const hangerMesh = new THREE.Mesh(hangerGeo, chromeMat);
    hangerMesh.position.set(0, 0.98, 0);
    hangerMesh.rotation.z = Math.PI / 2;
    group.add(hangerMesh);

    const hookGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI * 1.3);
    const hookMesh = new THREE.Mesh(hookGeo, chromeMat);
    hookMesh.position.set(0, 1.12, 0);
    hookMesh.rotation.y = Math.PI / 2;
    group.add(hookMesh);

    return group;
  };

  // Re-build or Update Scene when selection/mode changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check Software WebGL
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

    // Initialize Scene & Renderer once
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = null; // Transparent to blend seamlessly with UI container
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        36,
        container.clientWidth / container.clientHeight,
        0.1,
        50
      );
      camera.position.set(0, 0.4, 4.8);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isSoftwareGl,
        powerPreference: "high-performance",
        alpha: true
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Studio Environment Reflections
      try {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        pmremGenerator.dispose();
      } catch (err) {
        console.warn("Studio PMREM skipped", err);
      }

      // Studio 3-Point Lighting
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(3, 4, 4);
      keyLight.castShadow = !isSoftwareGl;
      if (keyLight.castShadow) {
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.bias = -0.0005;
      }
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
      fillLight.position.set(-3, 2, 3);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
      rimLight.position.set(0, 3, -3);
      scene.add(rimLight);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.8);
      scene.add(hemiLight);

      // Contact Shadow Plane at Base
      const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
      const canvasTex = document.createElement("canvas");
      canvasTex.width = 128;
      canvasTex.height = 128;
      const ctx = canvasTex.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
        grad.addColorStop(0, "rgba(15, 23, 42, 0.45)");
        grad.addColorStop(0.5, "rgba(15, 23, 42, 0.15)");
        grad.addColorStop(1, "rgba(15, 23, 42, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      const shadowTex = new THREE.CanvasTexture(canvasTex);
      shadowTex.colorSpace = THREE.SRGBColorSpace;

      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.8
      });
      const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -0.92;
      scene.add(shadowPlane);
    }

    const scene = sceneRef.current;
    if (!scene) return;

    // Clear existing jacket groups
    if (centerJacketGroupRef.current) scene.remove(centerJacketGroupRef.current);
    if (leftGhostGroupRef.current) scene.remove(leftGhostGroupRef.current);
    if (rightGhostGroupRef.current) scene.remove(rightGhostGroupRef.current);

    // 1. Build Center Active Jacket
    const centerGroup = createProceduralJacket(activeJacket, false);
    centerGroup.position.set(0, 0, 0);
    centerGroup.scale.set(1, 1, 1);
    scene.add(centerGroup);
    centerJacketGroupRef.current = centerGroup;

    // 2. Build Left Ghost (Previous Item in collection)
    const prevIndex = (currentIndex - 1 + JACKET_COLLECTION.length) % JACKET_COLLECTION.length;
    const leftGhost = createProceduralJacket(JACKET_COLLECTION[prevIndex], true);
    leftGhost.position.set(-2.2, -0.15, -0.9);
    leftGhost.scale.set(0.68, 0.68, 0.68);
    leftGhost.rotation.y = 0.35;
    scene.add(leftGhost);
    leftGhostGroupRef.current = leftGhost;

    // 3. Build Right Ghost (Next Item in collection)
    const nextIndex = (currentIndex + 1) % JACKET_COLLECTION.length;
    const rightGhost = createProceduralJacket(JACKET_COLLECTION[nextIndex], true);
    rightGhost.position.set(2.2, -0.15, -0.9);
    rightGhost.scale.set(0.68, 0.68, 0.68);
    rightGhost.rotation.y = -0.35;
    scene.add(rightGhost);
    rightGhostGroupRef.current = rightGhost;

  }, [currentIndex, renderMode]);

  // Animation Loop with Silk Spring Damping
  useEffect(() => {
    let frameId = 0;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Auto rotation when enabled and not dragging
      if (isAutoSpin && !isDraggingRef.current) {
        targetRotationRef.current.y += delta * 0.45;
      }

      // Smooth exponential damping on rotation
      currentRotationRef.current.x = THREE.MathUtils.damp(
        currentRotationRef.current.x,
        targetRotationRef.current.x,
        8,
        delta
      );
      currentRotationRef.current.y = THREE.MathUtils.damp(
        currentRotationRef.current.y,
        targetRotationRef.current.y,
        8,
        delta
      );

      // Apply to Center Jacket
      if (centerJacketGroupRef.current) {
        centerJacketGroupRef.current.rotation.y = currentRotationRef.current.y;
        centerJacketGroupRef.current.rotation.x = currentRotationRef.current.x;
        // Subtle floating breath motion
        centerJacketGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.8) * 0.035;
      }

      // Animate Unzipping / Panel separation
      const targetUnzip = renderMode === "unzipped" ? 1.0 : 0.0;
      unzipProgressRef.current = THREE.MathUtils.damp(
        unzipProgressRef.current,
        targetUnzip,
        6,
        delta
      );

      if (leftTorsoRef.current && rightTorsoRef.current) {
        // Slide front panels outward and rotate slightly
        leftTorsoRef.current.position.x = -0.06 - unzipProgressRef.current * 0.28;
        leftTorsoRef.current.rotation.y = unzipProgressRef.current * 0.42;

        rightTorsoRef.current.position.x = 0.06 + unzipProgressRef.current * 0.28;
        rightTorsoRef.current.rotation.y = -unzipProgressRef.current * 0.42;
      }

      if (innerCardRef.current) {
        // Card emerges slightly forward and tilts up
        innerCardRef.current.position.z = 0.1 + unzipProgressRef.current * 0.22;
        innerCardRef.current.scale.setScalar(1 + unzipProgressRef.current * 0.15);
      }

      // Subtle float on flanking ghosts
      if (leftGhostGroupRef.current) {
        leftGhostGroupRef.current.position.y = -0.15 + Math.sin(clock.getElapsedTime() * 1.5 + 1) * 0.025;
      }
      if (rightGhostGroupRef.current) {
        rightGhostGroupRef.current.position.y = -0.15 + Math.cos(clock.getElapsedTime() * 1.5 + 2) * 0.025;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isAutoSpin, renderMode]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      if (!container || !renderer || !camera) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pointer drag listeners for 360 spin
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - pointerPosRef.current.x;
    const deltaY = e.clientY - pointerPosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.009;
    targetRotationRef.current.x = Math.max(-0.35, Math.min(0.35, targetRotationRef.current.x + deltaY * 0.006));

    pointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full bg-[#f4f3ef] text-slate-950 font-sans border-b border-slate-300 relative overflow-hidden">
      
      {/* Background Studio Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* ============================================================ */}
      {/* 1. EDITORIAL HEADER BAR (As seen in the Video)              */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-300/80">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-900">
              HAPPY HANGOUTS LAB // SS-26
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-slate-500">
            • 3D INTERACTIVE STREETWEAR & COMPANIONS
          </span>
        </div>

        {/* View Mode Switching Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl border border-slate-300 text-xs font-bold">
          <button
            onClick={() => { audio.playClick(); setActiveTab("look"); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "look"
                ? "bg-white text-blue-900 shadow-xs border border-slate-300"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            3D HERO STAGE
          </button>
          <button
            onClick={() => { audio.playClick(); setActiveTab("inside_frame"); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "inside_frame"
                ? "bg-white text-blue-900 shadow-xs border border-slate-300"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            INSIDE THE FRAME
          </button>
          <button
            onClick={() => { audio.playClick(); setActiveTab("specs"); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "specs"
                ? "bg-white text-blue-900 shadow-xs border border-slate-300"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            CUT ONCE (CONFIGURATOR)
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN 3D SHOWCASE HERO STAGE (Matches the Reference Video) */}
      {/* ============================================================ */}
      {activeTab === "look" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
            
            {/* Left Column: Bold Editorial Typography */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-5">
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-black text-blue-700 bg-blue-100/90 px-2.5 py-1 rounded-md border border-blue-300">
                  {activeJacket.number} / 06
                </span>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-600">
                  {activeJacket.edition}
                </span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.05] uppercase">
                  {activeJacket.name}
                </h1>
                <p className="mt-2 text-sm font-mono font-bold tracking-wide text-blue-700">
                  {activeJacket.subtitle}
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {activeJacket.description}
              </p>

              {/* Paired Companion Callout Badge */}
              <div className="bg-white/90 rounded-2xl p-4 border border-slate-300/80 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                    {pairedCompanion.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Paired Verified Host
                    </div>
                    <div className="text-sm font-black text-slate-900 truncate">
                      {pairedCompanion.name}
                    </div>
                    <div className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{pairedCompanion.hub.split("•")[0]}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    audio.playClick();
                    onBookCompanion(pairedCompanion, activeJacket.name);
                  }}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 shrink-0 shadow-xs flex items-center gap-1"
                >
                  <span>Book Duo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Quick Tech Specs Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-200/70 p-2.5 rounded-xl border border-slate-300">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Weight & Layer</div>
                  <div className="font-bold text-slate-900">{activeJacket.specs.weight}</div>
                </div>
                <div className="bg-slate-200/70 p-2.5 rounded-xl border border-slate-300">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Waterproof</div>
                  <div className="font-bold text-slate-900">{activeJacket.specs.waterproof}</div>
                </div>
              </div>

            </div>

            {/* Center & Right: 3D Stage Viewport */}
            <div className="lg:col-span-8 flex flex-col items-center relative">
              
              {/* WebGL Canvas Viewport */}
              <div 
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-[460px] sm:h-[520px] rounded-3xl relative cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
              >
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full block" 
                />

                {/* Ghost Click Targets on Left & Right Flanks (As seen in the Video) */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-300 shadow-md flex items-center justify-center transition-all hover:scale-110 z-20"
                  aria-label="Previous Jacket"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-800" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-300 shadow-md flex items-center justify-center transition-all hover:scale-110 z-20"
                  aria-label="Next Jacket"
                >
                  <ChevronRight className="w-5 h-5 text-slate-800" />
                </button>

                {/* Floating 3D Interaction Control Dock (Skill Compliant, Bottom-Centered) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-white/95 px-3 py-2 rounded-2xl border border-slate-300 shadow-lg text-xs font-bold text-slate-800">
                  <button
                    onClick={() => {
                      audio.playClick();
                      setIsAutoSpin(!isAutoSpin);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                      isAutoSpin ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">360° Spin</span>
                  </button>

                  <button
                    onClick={() => {
                      audio.playClick();
                      setRenderMode(renderMode === "wireframe" ? "pbr" : "wireframe");
                    }}
                    className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                      renderMode === "wireframe" ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cyber Mesh</span>
                  </button>

                  <button
                    onClick={() => {
                      audio.playClick();
                      setRenderMode(renderMode === "unzipped" ? "pbr" : "unzipped");
                    }}
                    className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                      renderMode === "unzipped" ? "bg-emerald-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{renderMode === "unzipped" ? "Close Jacket" : "Unzip / NFC Pass"}</span>
                  </button>
                </div>

                {/* Hint Pill */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="bg-slate-900/80 text-white px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider font-bold">
                    DRAG TO ROTATE 3D MODEL
                  </span>
                </div>
              </div>

              {/* Bottom Pagination Timeline / Segment Indicators (Matches Video 0:04) */}
              <div className="w-full mt-4 flex items-center justify-between gap-4 px-2">
                
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-slate-900">
                    {activeJacket.number}
                  </span>
                  <span className="text-slate-400 font-bold">/</span>
                  <span className="font-mono text-sm font-bold text-slate-500">
                    06
                  </span>
                </div>

                {/* Segmented Clickable Progress Bars */}
                <div className="flex-1 max-w-md flex items-center gap-1.5 sm:gap-2">
                  {JACKET_COLLECTION.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectIndex(idx)}
                      className={`h-2 rounded-full transition-all flex-1 ${
                        idx === currentIndex
                          ? "bg-blue-600 ring-2 ring-blue-300"
                          : "bg-slate-300 hover:bg-slate-400"
                      }`}
                      title={item.name}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("specs")}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                  >
                    <span>Configure & Buy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. "INSIDE THE FRAME" LOOKBOOK STRIP (Matches Video 0:08)    */}
      {/* ============================================================ */}
      {activeTab === "inside_frame" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-700">
                PHOTO ESSAY // ISSUE 01
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 mt-1">
                INSIDE THE FRAME
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mt-1">
                Real moments between verified companions and hangout seekers across certified Delhi NCR hubs, captured in the Happy Hangouts technical apparel.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("look")}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold self-start sm:self-auto hover:bg-slate-800 transition-colors"
            >
              Return to 3D Stage
            </button>
          </div>

          {/* Editorial Photo Strip Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JACKET_COLLECTION.slice(0, 3).map((item, idx) => {
              const comp = COMPANION_PARTNERS.find(c => c.id === item.pairedCompanionId) || COMPANION_PARTNERS[0];
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-300 shadow-md group hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img 
                      src={item.lookbookImage} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-mono font-bold">
                      FRAME 0{idx + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs rounded-xl p-2.5 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {item.lookbookActivity}
                      </div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{item.lookbookLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-blue-700">
                        {item.name}
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-1">
                        Meet with {comp.name} ({comp.vibe})
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {comp.bio}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div className="text-xs font-black text-slate-900">
                        ₹{comp.hourlyRate}/hr <span className="text-[10px] text-slate-500 font-normal">session</span>
                      </div>
                      <button
                        onClick={() => {
                          audio.playClick();
                          onBookCompanion(comp, item.name);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Book This Vibe
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 4. PRODUCT & COMPANION CONFIGURATOR (Matches Video 0:11)     */}
      {/* ============================================================ */}
      {activeTab === "specs" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Visual Card */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-300 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                  {activeJacket.edition}
                </span>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold border border-emerald-300">
                  In Stock & Ready for Pairing
                </span>
              </div>

              <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200">
                <img 
                  src={activeJacket.lookbookImage} 
                  alt={activeJacket.name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-mono uppercase tracking-wider text-blue-300">
                    FEATURED WEARER
                  </div>
                  <div className="text-xl font-black">
                    {pairedCompanion.name} ({pairedCompanion.vibe})
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    "{pairedCompanion.bio.slice(0, 75)}..."
                  </div>
                </div>
              </div>

              {/* Fabric Specs Summary */}
              <div className="mt-6 space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Material Composition</span>
                  <span className="font-black text-slate-900 text-right">{activeJacket.fabric}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Smart Tag Spec</span>
                  <span className="font-black text-slate-900">{activeJacket.specs.nfcTech}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold text-slate-600">Optimal Climate</span>
                  <span className="font-black text-slate-900">{activeJacket.specs.temperature}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Customizer & Booking Panel */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-blue-700">
                  CUT ONCE. WORN FOR YEARS.
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 mt-1">
                  {activeJacket.name}
                </h2>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-950">
                    ₹{activeJacket.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    (or <strong className="text-blue-700">₹{activeJacket.rentalPrice}/session</strong> when booking with {pairedCompanion.name})
                  </span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>SELECT SIZE</span>
                  <span className="text-blue-700 font-mono">True to relaxed streetwear fit</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {(["S", "M", "L", "XL"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => { audio.playClick(); setSelectedSize(size); }}
                      className={`py-3 rounded-xl font-mono text-sm font-black transition-all ${
                        selectedSize === size
                          ? "bg-slate-950 text-white shadow-md ring-2 ring-blue-500"
                          : "bg-white text-slate-800 border border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorway Selector */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">COLORWAY FINISH</div>
                <div className="flex items-center gap-3">
                  {[
                    { name: "Obsidian Core", color: "bg-slate-950" },
                    { name: "Cobalt Hyper", color: "bg-blue-600" },
                    { name: "Titanium Slate", color: "bg-slate-400" },
                    { name: "Solar Glow", color: "bg-amber-600" }
                  ].map((cw, idx) => (
                    <button
                      key={cw.name}
                      onClick={() => { audio.playClick(); setSelectedColorway(idx); }}
                      className={`w-10 h-10 rounded-full ${cw.color} border-2 transition-all ${
                        selectedColorway === idx ? "border-blue-600 scale-110 shadow-md ring-2 ring-blue-300" : "border-white"
                      }`}
                      title={cw.name}
                    />
                  ))}
                </div>
              </div>

              {/* Companion Pairing Options */}
              <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>INCLUDED WITH EVERY DROP: CERTIFIED COMPANION ACCESS</span>
                </div>
                <p className="text-xs text-blue-950 leading-relaxed font-medium">
                  Wearing your Happy Hangouts technical jacket unlocks 1 curated session with our top-rated certified companions, verified safe hub entry, and priority matching in Delhi NCR.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    audio.playUnlock();
                    onBookCompanion(pairedCompanion, activeJacket.name);
                  }}
                  className="w-full py-4 bg-slate-950 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-transform active:scale-[0.99] shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>RESERVE LOOK & BOOK {pairedCompanion.name.toUpperCase()}</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onOpenMatchmaker}
                    className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Run Smart Match</span>
                  </button>
                  <button
                    onClick={onExploreDirectory}
                    className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-700" />
                    <span>Browse All Hosts</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
