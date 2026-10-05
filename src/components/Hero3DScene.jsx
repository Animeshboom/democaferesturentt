import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Sparkles, Zap } from 'lucide-react';

export default function Hero3DScene({ scrollProgress = 0, onSelectSpice }) {
  const containerRef = useRef(null);
  const [activeSpiceInfo, setActiveSpiceInfo] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [quality, setQuality] = useState('high'); // 'high' | 'balanced'

  // Internal refs to keep animation loop stable without re-rendering
  const sceneState = useRef({
    scene: null,
    camera: null,
    renderer: null,
    handiGroup: null,
    spicesGroup: null,
    steamParticles: null,
    candleLight: null,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    rotationY: 0,
    rotationX: 0.28,
    targetRotationY: 0,
    targetRotationX: 0.28,
    cameraRadius: 7.2,
    baseCameraRadius: 7.2,
    animFrameId: null,
    startTime: performance.now()
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0807, 0.045);
    sceneState.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.2);
    camera.lookAt(0, 0.4, 0);
    sceneState.current.camera = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: quality === 'high',
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    sceneState.current.renderer = renderer;

    // 3. Lighting System
    // Key Warm Brass Light
    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0x2a1c14, 1.2);
    scene.add(ambientLight);

    // Dynamic Candlelight (flickering flame)
    const candleLight = new THREE.PointLight(0xff9933, 3.2, 10, 1.4);
    candleLight.position.set(-2.4, 1.1, 1.8);
    candleLight.castShadow = true;
    scene.add(candleLight);
    sceneState.current.candleLight = candleLight;

    // Soft Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xdfb958, 1.8);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // 4. Dining Table Scene
    // Dark Green / Indian Black Emerald Marble Tabletop
    const tableGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.25, 48);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0f1813,
      roughness: 0.18,
      metalness: 0.15
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.12;
    table.receiveShadow = true;
    scene.add(table);

    // Procedural Hammered Texture for Antique Handi
    const createHammeredBumpTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 260; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const r = 6 + Math.random() * 10;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(0.7, 'rgba(128, 128, 128, 0.15)');
        grad.addColorStop(1, 'rgba(50, 50, 50, 0.35)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 2);
      return tex;
    };
    const hammeredBump = createHammeredBumpTexture();

    // Procedural Saffron Basmati Grain Texture
    const createRiceTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f0c765';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 700; i++) {
        ctx.fillStyle = Math.random() > 0.45 ? '#fff9e6' : Math.random() > 0.5 ? '#e09825' : '#b26815';
        const rx = Math.random() * 256;
        const ry = Math.random() * 256;
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(Math.random() * Math.PI);
        ctx.fillRect(-1.5, -4, 3, 8);
        ctx.restore();
      }
      for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = '#c52e12';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const sx = Math.random() * 256;
        const sy = Math.random() * 256;
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx + 10, sy + 15, sx + 20, sy + 5);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      return tex;
    };
    const riceTexture = createRiceTexture();

    // Hammered Brass Thali Platter
    const thaliGeo = new THREE.CylinderGeometry(2.35, 2.2, 0.08, 48);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc89b38,
      roughness: 0.28,
      metalness: 0.88,
      bumpMap: hammeredBump,
      bumpScale: 0.03
    });
    const thali = new THREE.Mesh(thaliGeo, brassMat);
    thali.position.y = 0.04;
    thali.receiveShadow = true;
    scene.add(thali);

    // 5. Main Handi & Biryani Food Object
    const handiGroup = new THREE.Group();
    scene.add(handiGroup);
    sceneState.current.handiGroup = handiGroup;

    // Handi Bowl (Antique Hammered Copper-Brass)
    const handiBowlGeo = new THREE.CylinderGeometry(1.6, 1.05, 1.15, 36, 1, false);
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb56334,
      roughness: 0.32,
      metalness: 0.82,
      bumpMap: hammeredBump,
      bumpScale: 0.05
    });
    const handiBowl = new THREE.Mesh(handiBowlGeo, copperMat);
    handiBowl.position.y = 0.62;
    handiBowl.castShadow = true;
    handiBowl.receiveShadow = true;
    handiGroup.add(handiBowl);

    // Brass Collar Rim
    const rimGeo = new THREE.TorusGeometry(1.62, 0.08, 16, 48);
    rimGeo.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, brassMat);
    rimMesh.position.y = 1.18;
    handiGroup.add(rimMesh);

    // Twin Brass Handles
    const handleGeo = new THREE.TorusGeometry(0.35, 0.06, 12, 24, Math.PI);
    const handleL = new THREE.Mesh(handleGeo, brassMat);
    handleL.position.set(-1.68, 0.9, 0);
    handleL.rotation.z = Math.PI / 2;
    handiGroup.add(handleL);

    const handleR = new THREE.Mesh(handleGeo, brassMat);
    handleR.position.set(1.68, 0.9, 0);
    handleR.rotation.z = -Math.PI / 2;
    handiGroup.add(handleR);

    // Saffron Basmati Rice Mound inside Handi
    const riceGeo = new THREE.SphereGeometry(1.5, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.38);
    const riceMat = new THREE.MeshStandardMaterial({
      map: riceTexture,
      roughness: 0.72,
      metalness: 0.05,
      bumpMap: riceTexture,
      bumpScale: 0.04
    });
    const riceMound = new THREE.Mesh(riceGeo, riceMat);
    riceMound.position.y = 0.95;
    riceMound.castShadow = true;
    handiGroup.add(riceMound);

    // Garnish on top of rice: Fresh Mint cluster
    const leafGeo = new THREE.BoxGeometry(0.3, 0.02, 0.16);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e6b3e, roughness: 0.4 });
    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i / 6) * Math.PI * 2;
      leaf.position.set(Math.cos(angle) * 0.35, 1.45, Math.sin(angle) * 0.35);
      leaf.rotation.set(0.3, angle, 0.2);
      handiGroup.add(leaf);
    }

    // Handi Lid resting on table
    const lidGeo = new THREE.ConeGeometry(1.55, 0.45, 32);
    const lid = new THREE.Mesh(lidGeo, copperMat);
    lid.position.set(2.1, 0.3, 0.4);
    lid.rotation.z = -0.35;
    lid.rotation.x = 0.2;
    lid.castShadow = true;
    scene.add(lid);

    // Lid Finial Brass Knob
    const knobGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const knob = new THREE.Mesh(knobGeo, brassMat);
    knob.position.set(0, 0.35, 0);
    lid.add(knob);

    // Amber Candle Glass & Wick Flame
    const candleGlassGeo = new THREE.CylinderGeometry(0.32, 0.26, 0.65, 24);
    const candleGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe07a43,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      transmission: 0.75
    });
    const candleGlass = new THREE.Mesh(candleGlassGeo, candleGlassMat);
    candleGlass.position.set(-2.4, 0.36, 1.8);
    scene.add(candleGlass);

    const flameGeo = new THREE.ConeGeometry(0.06, 0.18, 12);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffe680 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 0.2, 0);
    candleGlass.add(flame);

    // Brass Cutlery (Royal Spoon & Fork)
    const spoonHandleGeo = new THREE.CylinderGeometry(0.035, 0.025, 1.5, 12);
    const spoonHandle = new THREE.Mesh(spoonHandleGeo, brassMat);
    spoonHandle.position.set(-2.15, 0.08, -0.2);
    spoonHandle.rotation.x = Math.PI / 2;
    spoonHandle.rotation.z = 0.2;
    spoonHandle.castShadow = true;
    scene.add(spoonHandle);

    const spoonBowlGeo = new THREE.SphereGeometry(0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const spoonBowl = new THREE.Mesh(spoonBowlGeo, brassMat);
    spoonBowl.position.set(0, 0.75, 0);
    spoonBowl.rotation.x = Math.PI;
    spoonHandle.add(spoonBowl);

    // 6. Floating Ingredient System (Spices in orbit)
    const spicesGroup = new THREE.Group();
    scene.add(spicesGroup);
    sceneState.current.spicesGroup = spicesGroup;

    // Helper: Create Star Anise Geometry
    const createStarAnise = () => {
      const star = new THREE.Group();
      const carpelGeo = new THREE.ConeGeometry(0.12, 0.42, 6);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2112, roughness: 0.85 });
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const carpel = new THREE.Mesh(carpelGeo, woodMat);
        carpel.rotation.z = angle + Math.PI / 2;
        carpel.position.set(Math.cos(angle) * 0.24, Math.sin(angle) * 0.24, 0);
        star.add(carpel);
      }
      return star;
    };

    // Helper: Create Green Cardamom Pod
    const createCardamom = () => {
      const podGeo = new THREE.SphereGeometry(0.18, 14, 14);
      podGeo.scale(0.8, 1.6, 0.8);
      const podMat = new THREE.MeshStandardMaterial({ color: 0x5a6842, roughness: 0.65 });
      return new THREE.Mesh(podGeo, podMat);
    };

    // Helper: Create Cinnamon Quill Bark
    const createCinnamon = () => {
      const stickGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16, 1, true);
      const barkMat = new THREE.MeshStandardMaterial({
        color: 0x6e381b,
        roughness: 0.9,
        side: THREE.DoubleSide
      });
      return new THREE.Mesh(stickGeo, barkMat);
    };

    // Helper: Create Saffron Golden Thread
    const createSaffronThread = () => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.1, 0.25, 0.05),
        new THREE.Vector3(-0.05, 0.5, -0.05),
        new THREE.Vector3(0.15, 0.75, 0.1)
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.02, 6, false);
      const saffMat = new THREE.MeshStandardMaterial({
        color: 0xe64a19,
        emissive: 0xaa2200,
        roughness: 0.4
      });
      return new THREE.Mesh(tubeGeo, saffMat);
    };

    // Instantiate Spices array
    const spiceDefs = [
      { name: 'Kashmiri Mogra Saffron', type: 'saffron', origin: 'Pampore, Kashmir', mesh: createSaffronThread(), radius: 2.8, angle: 0.4, speed: 0.35, yBase: 1.8 },
      { name: 'Malabar Star Anise', type: 'anise', origin: 'Idukki Hills, Kerala', mesh: createStarAnise(), radius: 3.2, angle: 1.8, speed: 0.28, yBase: 2.2 },
      { name: 'Green Cardamom Pod', type: 'cardamom', origin: 'Coorg Valley, Karnataka', mesh: createCardamom(), radius: 2.6, angle: 3.1, speed: 0.42, yBase: 1.5 },
      { name: 'Ceylon Cinnamon Bark', type: 'cinnamon', origin: 'Southern Foothills', mesh: createCinnamon(), radius: 3.4, angle: 4.5, speed: 0.32, yBase: 2.5 },
      { name: 'Heritage Kashmiri Chilli', type: 'chilli', origin: 'Doda Valley, Kashmir', mesh: createCardamom(), radius: 2.9, angle: 5.6, speed: 0.38, yBase: 1.9 }
    ];

    spiceDefs.forEach((spice) => {
      spice.mesh.castShadow = true;
      spice.mesh.userData = { name: spice.name, origin: spice.origin, type: spice.type };
      spicesGroup.add(spice.mesh);
    });

    // 7. Billowing Culinary Steam Particles
    const particleCount = quality === 'high' ? 65 : 30;
    const steamGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.2;
      positions[i * 3 + 1] = 1.3 + Math.random() * 2.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
      alphas[i] = Math.random();
      speeds[i] = 0.008 + Math.random() * 0.012;
    }

    const createSteamTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 250, 240, 0.75)');
      grad.addColorStop(0.3, 'rgba(255, 245, 230, 0.35)');
      grad.addColorStop(0.7, 'rgba(240, 230, 215, 0.1)');
      grad.addColorStop(1, 'rgba(240, 230, 215, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };
    const steamTexture = createSteamTexture();

    steamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xfdf7eb,
      map: steamTexture,
      size: 0.52,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    scene.add(steamParticles);
    sceneState.current.steamParticles = steamParticles;

    // 8. Interactive Drag Controls (Mouse / Touch)
    const onPointerDown = (e) => {
      sceneState.current.isDragging = true;
      sceneState.current.prevMouseX = e.clientX || (e.touches && e.touches[0].clientX);
      sceneState.current.prevMouseY = e.clientY || (e.touches && e.touches[0].clientY);
      setIsInteracting(true);
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (sceneState.current.isDragging) {
        const deltaX = clientX - sceneState.current.prevMouseX;
        const deltaY = clientY - sceneState.current.prevMouseY;

        sceneState.current.targetRotationY += deltaX * 0.007;
        sceneState.current.targetRotationX = Math.max(
          0.05,
          Math.min(0.85, sceneState.current.targetRotationX + deltaY * 0.005)
        );

        sceneState.current.prevMouseX = clientX;
        sceneState.current.prevMouseY = clientY;
      }
    };

    const onPointerUp = () => {
      sceneState.current.isDragging = false;
    };

    // Click Raycaster for Spices
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects(spicesGroup.children, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.name && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData.name) {
          setActiveSpiceInfo(obj.userData);
          if (onSelectSpice) onSelectSpice(obj.userData);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domEl.addEventListener('click', onCanvasClick);

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Main Animation Loop
    const animate = () => {
      sceneState.current.animFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - sceneState.current.startTime) * 0.001;

      // Smooth Rotation Damping
      if (isAutoSpin && !sceneState.current.isDragging) {
        sceneState.current.targetRotationY += 0.0025;
      }

      sceneState.current.rotationY +=
        (sceneState.current.targetRotationY - sceneState.current.rotationY) * 0.08;
      sceneState.current.rotationX +=
        (sceneState.current.targetRotationX - sceneState.current.rotationX) * 0.08;

      // Position Camera in 360° Orbit around table
      const r = sceneState.current.cameraRadius;
      const phi = sceneState.current.rotationX;
      const theta = sceneState.current.rotationY;

      camera.position.x = r * Math.sin(theta) * Math.cos(phi);
      camera.position.y = 1.2 + r * Math.sin(phi);
      camera.position.z = r * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(0, 0.8, 0);

      // Flickering Candle Light
      if (candleLight) {
        candleLight.intensity = 2.8 + Math.sin(elapsed * 9) * 0.35 + Math.sin(elapsed * 23) * 0.15;
      }

      // Orbiting Floating Spices with gentle floating oscillation
      spiceDefs.forEach((spice, idx) => {
        const orbitAngle = spice.angle + elapsed * spice.speed * 0.45;
        const floatY = spice.yBase + Math.sin(elapsed * 1.5 + idx) * 0.22;
        spice.mesh.position.x = Math.cos(orbitAngle) * spice.radius;
        spice.mesh.position.z = Math.sin(orbitAngle) * spice.radius;
        spice.mesh.position.y = floatY;
        spice.mesh.rotation.y += 0.015;
        spice.mesh.rotation.x = Math.sin(elapsed + idx) * 0.3;
      });

      // Billowing Steam Simulation
      if (steamParticles) {
        const posAttr = steamParticles.geometry.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          posAttr.array[i * 3 + 1] += speeds[i];
          posAttr.array[i * 3] += Math.sin(elapsed * 2 + i) * 0.003;
          if (posAttr.array[i * 3 + 1] > 3.8) {
            posAttr.array[i * 3 + 1] = 1.35;
            posAttr.array[i * 3] = (Math.random() - 0.5) * 1.1;
            posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 1.1;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(sceneState.current.animFrameId);
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domEl.removeEventListener('click', onCanvasClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [quality, isAutoSpin]);

  // React to scroll progress (expand spices, dolly camera smoothly)
  useEffect(() => {
    if (sceneState.current.spicesGroup) {
      const separation = 1 + scrollProgress * 0.65;
      sceneState.current.spicesGroup.scale.set(separation, separation, separation);
      sceneState.current.cameraRadius = sceneState.current.baseCameraRadius - scrollProgress * 1.4;
    }
  }, [scrollProgress]);

  const handleResetCamera = () => {
    sceneState.current.targetRotationY = 0;
    sceneState.current.targetRotationX = 0.28;
    setActiveSpiceInfo(null);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 360° Interaction Visual Cue Badge (Fades smoothly as user scrolls) */}
      {!isInteracting && scrollProgress < 0.25 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-2 rounded-full border border-[rgba(197,155,39,0.35)] bg-[rgba(18,15,13,0.75)] backdrop-blur-md text-[0.78rem] tracking-wider text-[var(--brass-200)] flex items-center gap-2 animate-bounce transition-opacity duration-300"
          style={{
            animationDuration: '3s',
            opacity: Math.max(0, 1 - scrollProgress * 4)
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--brass-400)]" />
          <span>✦ Drag to explore in 360° • Scroll for culinary story</span>
        </div>
      )}

      {/* Control Panel: Reset, Auto-spin, Quality */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          onClick={() => setIsAutoSpin(!isAutoSpin)}
          className={`px-3 py-1.5 rounded text-[0.72rem] tracking-wider uppercase font-medium border backdrop-blur-md transition-all ${
            isAutoSpin
              ? 'bg-[rgba(197,155,39,0.22)] border-[var(--brass-500)] text-[var(--brass-200)]'
              : 'bg-[rgba(18,15,13,0.65)] border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white'
          }`}
          title="Toggle 360° Auto Rotation"
        >
          {isAutoSpin ? 'Orbiting' : 'Paused'}
        </button>

        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded bg-[rgba(18,15,13,0.65)] border border-[var(--border-subtle)] text-[var(--ivory-300)] hover:text-[var(--brass-300)] hover:border-[var(--brass-500)] backdrop-blur-md transition-all"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Active Spice Inspector Badge (When Clicked) */}
      {activeSpiceInfo && (
        <div className="absolute bottom-6 left-6 max-w-xs p-4 rounded bg-[rgba(18,15,13,0.88)] border border-[var(--brass-500)] backdrop-blur-xl shadow-2xl z-20 animate-fade-in">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[0.68rem] uppercase tracking-widest text-[var(--brass-400)]">
              Botanical Inspection
            </span>
            <button
              onClick={() => setActiveSpiceInfo(null)}
              className="text-xs text-[var(--ivory-muted)] hover:text-white"
            >
              ✕
            </button>
          </div>
          <h4 className="font-display text-base text-[var(--ivory-50)] mb-1">
            {activeSpiceInfo.name}
          </h4>
          <p className="text-[0.76rem] text-[var(--ivory-300)] font-editorial italic">
            Single-estate terroir: {activeSpiceInfo.origin}
          </p>
          <div className="mt-2 pt-2 border-t border-[rgba(197,155,39,0.2)] text-[0.72rem] text-[var(--brass-300)]">
            ✦ Infused into 4-hour slow Awadhi Dum Biryani
          </div>
        </div>
      )}
    </div>
  );
}
