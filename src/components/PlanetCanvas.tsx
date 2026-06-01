import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CelestialBody, ExoplanetConfig } from '../types';
import { SOLAR_SYSTEM } from '../data';
import { RotateCw, Maximize2, Move3d } from 'lucide-react';

interface PlanetCanvasProps {
  selectedPlanet: CelestialBody | null;
  selectedExoplanet: ExoplanetConfig | null;
  isExoplanetMode: boolean;
  crossSectionMode: boolean;
  viewMode: 'solar_system' | 'single_planet';
  speedMultiplier: number;
  activeTourStop: any | null;
  onSelectPlanet: (planet: CelestialBody) => void;
}

export const PlanetCanvas: React.FC<PlanetCanvasProps> = ({
  selectedPlanet,
  selectedExoplanet,
  isExoplanetMode,
  crossSectionMode,
  viewMode,
  speedMultiplier,
  activeTourStop,
  onSelectPlanet,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetMeshesRef = useRef<{ [key: string]: THREE.Group }>({});
  const orbitLinesRef = useRef<THREE.Line[]>([]);
  const coreLayersRef = useRef<THREE.Mesh[]>([]);

  // Interaction State
  const [isRotating, setIsRotating] = useState(true);
  const [telemetry, setTelemetry] = useState({ fps: 60, drawCalls: 12, triCount: 15320 });
  
  // Custom rotation offsets for users to drag the camera
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraAngle = useRef({ theta: 0.5, phi: 1.2, radius: 12 });

  // Generate gorgeous procedural seamless canvas textures to avoid net assets loading delays
  const buildProceduralTexture = (
    type: string,
    primaryColor: string,
    secondaryColor: string,
    density: number = 0.5
  ): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, primaryColor);
    grad.addColorStop(1, secondaryColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';

    if (type === 'mercury') {
      // Impact craters
      for (let i = 0; i < 180; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = Math.random() * 8 + 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.stroke();
      }
    } else if (type === 'venus') {
      // Dense swirling sulfur clouds
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        const y = 30 + Math.random() * 200;
        ctx.ellipse(256, y, 220, 15 + Math.random() * 25, 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'earth') {
      // Dynamic green & cyan continent blobs
      ctx.fillStyle = '#10b981';
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * 512;
        const y = 50 + Math.random() * 150;
        const rx = 40 + Math.random() * 80;
        const ry = 30 + Math.random() * 60;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
        // Wrap around effect
        ctx.beginPath();
        ctx.ellipse(x - 512, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + 512, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      // Atmospheric clouds overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * 512;
        const y = 30 + Math.random() * 190;
        ctx.beginPath();
        ctx.ellipse(x, y, 70, 8, -0.05, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'mars') {
      // Rust spots and poles
      ctx.fillStyle = '#7f1d1d';
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, 128 + (Math.random() * 80 - 40), 20 + Math.random() * 30, 0, Math.PI * 2);
        ctx.fill();
      }
      // White polar ice caps
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 12);
      ctx.fillRect(0, 244, 512, 12);
    } else if (type === 'jupiter') {
      // High details storm bands
      for (let y = 10; y < 246; y += 12) {
        ctx.fillStyle = y % 24 === 0 ? 'rgba(255, 251, 235, 0.25)' : 'rgba(120, 53, 4, 0.35)';
        ctx.fillRect(0, y, 512, 4 + Math.random() * 8);
      }
      // Giant Red Spot
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(320, 160, 30, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'saturn') {
      // Gentle warm golden gradient layers
      for (let y = 10; y < 246; y += 16) {
        ctx.fillStyle = `rgba(253, 224, 71, ${0.05 + Math.random() * 0.15})`;
        ctx.fillRect(0, y, 512, 8);
      }
    } else if (type === 'uranus') {
      // Light methane cyan haze
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 80, 512, 96);
    } else if (type === 'neptune') {
      // Dark hurricane vector streaks
      ctx.fillStyle = 'rgba(30, 64, 175, 0.5)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(0, 40 + i * 25, 512, 5);
      }
      // Bright scooter storm cloud
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.ellipse(140, 100, 25, 8, 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Exoplanet custom procedurals
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255, 0.08)' : 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, i * 12.8, 512, 3 + density * 8);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  // Build Procedural Rings Texture for ring systems
  const buildRingTexture = (ringColor: string): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    // Clear
    ctx.clearRect(0, 0, 256, 16);
    
    // Concentric ice debris belts
    const baseCol = ringColor.replace('rgba', '').replace(')', ''); // e.g. "(253, 224, 71, 0.45"
    for (let x = 0; x < 256; x += 3) {
      if (Math.random() > 0.3) {
        const opacity = (0.05 + Math.random() * 0.45).toFixed(2);
        ctx.fillStyle = `rgba${baseCol}, ${opacity})`;
        ctx.fillRect(x, 0, 2 + Math.random() * 2, 16);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  // Listen to Window resizing correctly via container ResizeObserver
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    
    // Position camera based on view mode
    if (viewMode === 'solar_system') {
      cameraAngle.current.radius = 23;
      cameraAngle.current.theta = 0.6;
      cameraAngle.current.phi = 0.9;
    } else {
      cameraAngle.current.radius = 7.5;
      cameraAngle.current.theta = 0.3;
      cameraAngle.current.phi = 1.3;
    }

    // 3. Renderer with antialiasing and preserveDrawingBuffer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.22);
    scene.add(ambientLight);

    // Directional sun light
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // Dynamic backlight for sci-fi atmosphere halo
    const backLight = new THREE.DirectionalLight(0x3b82f6, 0.55);
    backLight.position.set(-8, -2, -8);
    scene.add(backLight);

    // 5. Starfield background particle grid
    const starsCount = 1000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPositions[i] = (Math.random() - 0.5) * 80;
      starsPositions[i + 1] = (Math.random() - 0.5) * 80;
      starsPositions[i + 2] = (Math.random() - 0.5) * 80;

      // Pure digital white through cyber blue colors
      starColors[i] = 0.8 + Math.random() * 0.2;
      starColors[i + 1] = 0.8 + Math.random() * 0.2;
      starColors[i + 2] = 0.9 + Math.random() * 0.1;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const starField = new THREE.Points(starsGeometry, starMaterial);
    scene.add(starField);

    // 6. Build procedural 3D elements based on current view modes
    planetMeshesRef.current = {};
    orbitLinesRef.current = [];
    coreLayersRef.current = [];

    if (viewMode === 'solar_system') {
      // Draw Central Solar Core (The Sun)
      const sunGeo = new THREE.SphereGeometry(1.6, 32, 32);
      const sunTexture = buildProceduralTexture('sun', '#fbbf24', '#f97316');
      const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
      const sunGroup = new THREE.Group();
      sunGroup.add(new THREE.Mesh(sunGeo, sunMat));
      
      // Solar coronal halo indicator
      const glowGeo = new THREE.RingGeometry(1.7, 1.85, 32);
      const glowMat = new THREE.MeshBasicMaterial({ 
        color: 0xf97316, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.4 
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.rotation.x = Math.PI / 2;
      sunGroup.add(glow);

      scene.add(sunGroup);
      planetMeshesRef.current['sun'] = sunGroup;

      // Draw all Solar System orbits and planets
      SOLAR_SYSTEM.forEach((body) => {
        const group = new THREE.Group();

        // High fidelity procedural planet body
        const isSelected = selectedPlanet?.id === body.id;
        const radius = isSelected ? 0.65 : 0.44; // Scale focused planet in overall map
        const planetGeo = new THREE.SphereGeometry(radius, 32, 32);

        const planetTex = buildProceduralTexture(body.id, body.color, body.secondaryColor || '#111111');
        const planetMat = new THREE.MeshStandardMaterial({
          map: planetTex,
          roughness: 0.6,
          metalness: 0.1,
          bumpScale: 0.05,
        });

        const planetMesh = new THREE.Mesh(planetGeo, planetMat);
        group.add(planetMesh);

        // Planet Rings if applicable
        if (body.hasRings) {
          const ringGeo = new THREE.RingGeometry(radius * 1.5, radius * 2.6, 64);
          const ringTex = buildRingTexture(body.ringColor || 'rgba(255,255,255,0.2)');
          const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.82,
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          // Angle rings nicely
          ringMesh.rotation.x = Math.PI / 2.3;
          group.add(ringMesh);
        }

        scene.add(group);
        planetMeshesRef.current[body.id] = group;

        // Visual telemetry orbit path line
        // Scale distance to look elegant inside the viewport bounds
        const orbitRadius = 2.5 + body.distanceFromSun * 0.06;
        const orbitGeo = new THREE.BufferGeometry();
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 100; i++) {
          const a = (i / 100) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * orbitRadius, 0, Math.sin(a) * orbitRadius));
        }
        orbitGeo.setFromPoints(pts);
        
        const orbitMat = new THREE.LineBasicMaterial({
          color: isSelected ? 0xffffff : 0x2e2e2e,
          transparent: true,
          opacity: isSelected ? 0.8 : 0.35,
        });
        
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        scene.add(orbitLine);
        orbitLinesRef.current.push(orbitLine);
      });

    } else {
      // SINGLE PLANET VIEW or EXOPLANET LABORATORY
      const group = new THREE.Group();

      if (isExoplanetMode && selectedExoplanet) {
        // EXOPLANET LABORATORY CORE DESIGN
        const sizeMultiplier = selectedExoplanet.size;
        const planetGeo = new THREE.SphereGeometry(1.6 * sizeMultiplier, 64, 48);

        // Dynamic material mapped to user controls
        const planetTex = buildProceduralTexture(
          'exoplanet',
          selectedExoplanet.colorPrimary,
          selectedExoplanet.colorSecondary,
          selectedExoplanet.atmosphereDensity
        );

        let planetMat;
        if (crossSectionMode) {
          // Glass envelope for cross-section slice visibility
          planetMat = new THREE.MeshStandardMaterial({
            map: planetTex,
            transparent: true,
            opacity: 0.25,
            wireframe: false,
          });

          // Draw slice layers inside of the custom exoplanet
          const coreRadius = 1.6 * sizeMultiplier;
          const layerConfigs = [
            { r: 0.3, color: '#fef08a', name: 'Ultra-Dense Solid Iron core' },
            { r: 0.55, color: selectedExoplanet.colorSecondary, name: 'Liquid mantel flow' },
            { r: 0.85, color: selectedExoplanet.colorPrimary, name: 'Tectonic silicate crust' }
          ];

          layerConfigs.forEach((lc, index) => {
            const innerGeo = new THREE.SphereGeometry(coreRadius * lc.r, 32, 32);
            const innerMat = new THREE.MeshBasicMaterial({
              color: lc.color,
              transparent: true,
              opacity: 0.9 - index * 0.1,
              wireframe: true
            });
            const innerMesh = new THREE.Mesh(innerGeo, innerMat);
            group.add(innerMesh);
          });
        } else {
          // Standard gorgeous model material block
          planetMat = new THREE.MeshStandardMaterial({
            map: planetTex,
            roughness: 0.5,
            metalness: 0.3,
          });
        }

        const planetMesh = new THREE.Mesh(planetGeo, planetMat);
        group.add(planetMesh);

        // Custom exoplanet atmosphere glow ring
        const atmosGeo = new THREE.RingGeometry(1.6 * sizeMultiplier * 1.05, 1.6 * sizeMultiplier * 1.15, 32);
        const atmosMat = new THREE.MeshBasicMaterial({
          color: selectedExoplanet.colorPrimary,
          transparent: true,
          opacity: 0.3 * selectedExoplanet.atmosphereDensity,
          side: THREE.DoubleSide
        });
        const atmos = new THREE.Mesh(atmosGeo, atmosMat);
        atmos.rotation.y = Math.PI / 4;
        group.add(atmos);

        // Ring Style rendering
        if (selectedExoplanet.ringStyle !== 'none') {
          const ringInner = 1.6 * sizeMultiplier * 1.6;
          const ringOuter = selectedExoplanet.ringStyle === 'thin' ? 1.6 * sizeMultiplier * 2.1 : 1.6 * sizeMultiplier * 2.8;
          const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 64);
          
          const ringTex = buildRingTexture(selectedExoplanet.colorPrimary);
          const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2.3;
          group.add(ringMesh);
        }

        scene.add(group);
        planetMeshesRef.current['exoplanet'] = group;

      } else if (selectedPlanet) {
        // STANDARD SOLAR SYSTEM CELESTIAL ANALYSIS VIEWER
        const planetGeo = new THREE.SphereGeometry(1.6, 64, 48);
        const planetTex = buildProceduralTexture(selectedPlanet.id, selectedPlanet.color, selectedPlanet.secondaryColor || '#111111');

        let planetMat;
        if (crossSectionMode) {
          // Make the main shell translucent
          planetMat = new THREE.MeshStandardMaterial({
            map: planetTex,
            transparent: true,
            opacity: 0.18,
            wireframe: true,
          });

          // Core Layers of standard planet
          // Generate nested colored geometry shells to represent the different layers!
          const layersCount = selectedPlanet.coreStructure.length;
          selectedPlanet.coreStructure.forEach((layer, i) => {
            // Fraction of size based on layers indexing
            // Outer layer corresponds to crust (larger), core is smallest (inner)
            const ratio = (layersCount - i) / layersCount;
            const innerGeo = new THREE.SphereGeometry(1.6 * ratio, 32, 24);
            const innerMat = new THREE.MeshStandardMaterial({
              color: new THREE.Color(layer.color),
              roughness: 0.7,
              metalness: 0.1,
              transparent: true,
              opacity: 0.9,
              wireframe: false,
            });
            const innerMesh = new THREE.Mesh(innerGeo, innerMat);
            group.add(innerMesh);
            coreLayersRef.current.push(innerMesh);

            // Tech circular orbit lines for layers indices
            const ringGeo = new THREE.RingGeometry(1.64 * ratio, 1.66 * ratio, 32);
            const ringMat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.25,
              side: THREE.DoubleSide
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            group.add(ringMesh);
          });

        } else {
          // Normal fully rendered planet body
          planetMat = new THREE.MeshStandardMaterial({
            map: planetTex,
            roughness: 0.55,
            metalness: 0.1,
          });
        }

        const planetMesh = new THREE.Mesh(planetGeo, planetMat);
        group.add(planetMesh);

        // Custom Earth atmosphere clouds moving effect group
        if (selectedPlanet.id === 'earth' && !crossSectionMode) {
          const cloudGeo = new THREE.SphereGeometry(1.62, 40, 40);
          const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.42,
            blending: THREE.NormalBlending,
          });
          const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
          group.add(cloudMesh);
          planetMeshesRef.current['earth_clouds'] = group;
        }

        // Saturn, Uranus, Jupiter rings in single planet mode
        if (selectedPlanet.hasRings) {
          const ringInner = 1.6 * 1.5;
          const ringOuter = 1.6 * 2.8;
          const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 64);
          const ringTex = buildRingTexture(selectedPlanet.ringColor || 'rgba(255,255,255,0.25)');
          const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2.3;
          group.add(ringMesh);
        }

        scene.add(group);
        planetMeshesRef.current[selectedPlanet.id] = group;
      }
    }

    // 7. Guided tour animation triggers
    if (activeTourStop) {
      // Direct camera position override
      const offset = activeTourStop.cameraOffset;
      if (activeTourStop.planetId === 'system') {
        cameraAngle.current.radius = offset.z || 25;
        cameraAngle.current.theta = offset.y || 0.6;
        cameraAngle.current.phi = offset.x || 0.5;
      } else {
        cameraAngle.current.radius = 7.5;
        cameraAngle.current.theta = 0.4;
        cameraAngle.current.phi = 1.1;
      }
    }

    // 8. Dynamic Animation Loop
    let animationFrameId = 0;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // FPS and drawing telemetry calculations
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setTelemetry({
          fps: Math.round((frameCount * 1000) / (now - lastTime)),
          drawCalls: renderer.info.render.calls,
          triCount: renderer.info.render.triangles,
        });
        frameCount = 0;
        lastTime = now;
      }

      // Rotate planet components if continuous rotation toggle is active
      const rotSpeed = 0.15 * speedMultiplier * (isRotating ? 1 : 0);

      if (viewMode === 'solar_system') {
        // Planetary orbits revolution and rotations
        SOLAR_SYSTEM.forEach((body) => {
          const blockGroup = planetMeshesRef.current[body.id];
          if (blockGroup) {
            // Self rotation
            blockGroup.rotation.y += (1 / (body.rotationPeriod || 24)) * rotSpeed;

            // Orbital revolution
            const orbitRad = 2.5 + body.distanceFromSun * 0.06;
            // High fidelity real ratio scale period
            const angle = (time * 0.3 * speedMultiplier) / (body.orbitalPeriod / 365.25);
            blockGroup.position.set(
              Math.cos(angle) * orbitRad,
              0,
              Math.sin(angle) * orbitRad
            );
          }
        });

        // Spin the Sun
        const sun = planetMeshesRef.current['sun'];
        if (sun) {
          sun.rotation.y += 0.005 * speedMultiplier;
        }

      } else {
        // Single planet rotating view
        if (isExoplanetMode && selectedExoplanet) {
          const exMesh = planetMeshesRef.current['exoplanet'];
          if (exMesh) {
            exMesh.rotation.y += 0.02 * selectedExoplanet.rotationSpeed * speedMultiplier * (isRotating ? 1 : 0);
          }
        } else if (selectedPlanet) {
          const plMesh = planetMeshesRef.current[selectedPlanet.id];
          if (plMesh) {
            // Avoid extreme slow values for Mercury/Venus slow periods
            const rotFactor = Math.abs(selectedPlanet.rotationPeriod) > 100 ? 5 : 24 / Math.abs(selectedPlanet.rotationPeriod);
            plMesh.rotation.y += 0.015 * rotFactor * speedMultiplier * (isRotating ? 1 : 0);
          }
        }
      }

      // 9. Camera spherical angle controls and calculations
      const theta = cameraAngle.current.theta;
      const phi = cameraAngle.current.phi;
      const r = cameraAngle.current.radius;

      // Restrict polar angles to avoid camera flipping over target core poles
      cameraAngle.current.theta = Math.max(0.1, Math.min(Math.PI - 0.1, theta));

      camera.position.x = r * Math.sin(theta) * Math.cos(phi);
      camera.position.y = r * Math.cos(theta);
      camera.position.z = r * Math.sin(theta) * Math.sin(phi);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Handle window resizing via ResizeObserver
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(mountRef.current);

    // Cleanup WebGL contexts to prevent memory leaks and black screens
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        rendererRef.current.domElement.remove();
      }
    };
  }, [selectedPlanet, selectedExoplanet, viewMode, isExoplanetMode, crossSectionMode, speedMultiplier, isRotating, activeTourStop]);

  // Click handler to select target planet in solar system overview
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'solar_system' || !sceneRef.current || !cameraRef.current) return;

    // Standard Raycasting in custom Three.js
    const bounds = mountRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const mouse = new THREE.Vector2(
      ((e.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((e.clientY - bounds.top) / bounds.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Check hit against each planet group
    SOLAR_SYSTEM.forEach((body) => {
      const plMesh = planetMeshesRef.current[body.id];
      if (plMesh) {
        // Test children elements
        const intersects = raycaster.intersectObjects(plMesh.children, true);
        if (intersects.length > 0) {
          onSelectPlanet(body);
        }
      }
    });
  };

  // Drag controls logic
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    cameraAngle.current.phi -= deltaX * 0.007;
    cameraAngle.current.theta -= deltaY * 0.007;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Zoom helpers
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      cameraAngle.current.radius = Math.max(3.5, cameraAngle.current.radius - 1.5);
    } else {
      cameraAngle.current.radius = Math.min(35, cameraAngle.current.radius + 1.5);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] hud-border rounded-lg overflow-hidden flex flex-col justify-between" id="3d-canvas-viewport">
      {/* Dynamic Telemetry Matrix Stats (Clinical geometric aesthetic) */}
      <div className="absolute top-3 left-3 bg-neutral-950/90 border border-white/10 px-2 py-1 rounded text-[10px] font-mono tracking-wider flex items-center gap-3 text-neutral-400 select-none z-10" id="canvas-telemetry">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00F0FF]"></span>
          RENDER: STANDBY
        </span>
        <span>FPS: {telemetry.fps}</span>
        <span>POLYS: {telemetry.triCount}</span>
        <span>MAT: WEBGL_PRO</span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2 z-10" id="canvas-interaction-controls">
        {/* Toggle Rotation state */}
        <button
          onClick={() => setIsRotating(prev => !prev)}
          className={`p-1.5 rounded border text-xs font-mono flex items-center gap-1 transition-all ${
            isRotating
              ? 'bg-white/15 text-white border-white/20'
              : 'bg-[#0a0a0ae0] text-neutral-400 border-white/10 hover:border-white/20 hover:text-white'
          }`}
          title="Toggle Auto Orbital Rotation"
          id="btn-toggle-spin"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '10s', color: isRotating ? '#00F0FF' : 'inherit' }} />
          <span>{isRotating ? 'SPIN: ON' : 'SPIN: STABLE'}</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex rounded border border-white/10 bg-[#0a0a0ae0] overflow-hidden text-[10px] font-mono shadow-lg">
          <button
            onClick={() => handleZoom('in')}
            className="px-2 py-1.5 text-neutral-400 hover:text-white hover:bg-white/5 border-r border-white/10"
            title="Spatially Zoom In"
            id="btn-zoom-in"
          >
            ZOOM+
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="px-2 py-1.5 text-neutral-400 hover:text-white hover:bg-white/5"
            title="Spatially Zoom Out"
            id="btn-zoom-out"
          >
            ZOOM-
          </button>
        </div>
      </div>

      {/* Primary Interaction Area for custom dragging */}
      <div
        ref={mountRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full h-full cursor-grab active:cursor-grabbing grow"
        id="gl-canvas-mount"
        style={{ touchAction: 'none' }}
      />

      {/* Guide telemetry instructions bottom bar */}
      <div className="absolute bottom-2 left-3 bg-neutral-950/80 border border-neutral-800/50 px-2 py-1 rounded text-[9px] font-mono tracking-widest text-neutral-500 uppercase select-none flex items-center gap-1.5">
        <Move3d className="w-3 h-3 text-neutral-500" />
        <span>Drag to rotate coordinate orbit. Click a celestial body to inspect telemetry.</span>
      </div>
    </div>
  );
};
