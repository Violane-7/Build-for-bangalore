import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function WearableHero() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Smartwatch body ──
    const watchGroup = new THREE.Group();

    // Watch case
    const caseGeo = new THREE.BoxGeometry(2.2, 2.6, 0.4, 4, 4, 4);
    // Round the edges
    const caseMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const watchCase = new THREE.Mesh(caseGeo, caseMat);
    watchGroup.add(watchCase);

    // Watch screen (glowing)
    const screenGeo = new THREE.PlaneGeometry(1.8, 2.2);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x050508,
      transparent: true,
      opacity: 0.95,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.21;
    watchGroup.add(screen);

    // Screen bezel ring
    const bezelGeo = new THREE.RingGeometry(1.05, 1.15, 64);
    const bezelMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.z = 0.22;
    watchGroup.add(bezel);

    // Crown / button
    const crownGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16);
    const crownMat = new THREE.MeshPhysicalMaterial({
      color: 0x333355,
      metalness: 0.9,
      roughness: 0.3,
    });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(1.25, 0.3, 0);
    watchGroup.add(crown);

    // Watch bands (top + bottom)
    const bandGeo = new THREE.BoxGeometry(1.6, 2, 0.15, 1, 6, 1);
    const bandMat = new THREE.MeshPhysicalMaterial({
      color: 0x222244,
      metalness: 0.1,
      roughness: 0.8,
    });
    const topBand = new THREE.Mesh(bandGeo, bandMat);
    topBand.position.y = 2.3;
    watchGroup.add(topBand);
    const bottomBand = new THREE.Mesh(bandGeo, bandMat);
    bottomBand.position.y = -2.3;
    watchGroup.add(bottomBand);

    // ── Smart Ring ──
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(0.7, 0.18, 32, 64);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a4a,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ringGroup.add(ring);

    // Ring sensor glow
    const sensorGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const sensorMat = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.8,
    });
    for (let i = 0; i < 3; i++) {
      const sensor = new THREE.Mesh(sensorGeo, sensorMat.clone());
      const angle = (i * Math.PI * 2) / 3;
      sensor.position.set(Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0);
      ringGroup.add(sensor);
    }
    ringGroup.position.set(3.5, -0.5, 0);
    ringGroup.rotation.x = Math.PI / 4;

    // ── Fitness Band ──
    const bandGroup = new THREE.Group();
    const fbGeo = new THREE.TorusGeometry(1, 0.15, 16, 64, Math.PI * 1.8);
    const fbMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a35,
      metalness: 0.6,
      roughness: 0.4,
    });
    const fitBand = new THREE.Mesh(fbGeo, fbMat);
    bandGroup.add(fitBand);

    // Band screen
    const bScreenGeo = new THREE.PlaneGeometry(0.6, 0.3);
    const bScreenMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.6,
    });
    const bScreen = new THREE.Mesh(bScreenGeo, bScreenMat);
    bScreen.position.set(0, 1, 0.16);
    bandGroup.add(bScreen);
    bandGroup.position.set(-3.5, -1, 0);
    bandGroup.rotation.z = Math.PI / 6;

    // ── Orbiting data particles ──
    const particleCount = 600;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colSet = [
      new THREE.Color(0xef4444),
      new THREE.Color(0x22d3ee),
      new THREE.Color(0x4ade80),
      new THREE.Color(0xa78bfa),
      new THREE.Color(0xfb923c),
    ];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 3;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = colSet[Math.floor(Math.random() * colSet.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);

    // ── Orbital rings ──
    const orbitRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.005, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.15 })
    );
    orbitRing1.rotation.x = Math.PI / 3;
    const orbitRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 0.005, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.1 })
    );
    orbitRing2.rotation.x = -Math.PI / 4;
    orbitRing2.rotation.y = Math.PI / 5;

    scene.add(watchGroup, ringGroup, bandGroup, particles, orbitRing1, orbitRing2);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const p1 = new THREE.PointLight(0x818cf8, 2, 15);
    p1.position.set(2, 3, 5);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x22d3ee, 1.5, 15);
    p2.position.set(-3, -2, 4);
    scene.add(p2);
    const p3 = new THREE.PointLight(0xef4444, 1, 12);
    p3.position.set(0, 0, -3);
    scene.add(p3);

    camera.position.set(0, 0, 9);

    let t = 0;
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      t += 0.005;

      // Watch gentle float
      watchGroup.rotation.y = Math.sin(t * 0.5) * 0.15;
      watchGroup.rotation.x = Math.sin(t * 0.3) * 0.05;
      watchGroup.position.y = Math.sin(t * 0.8) * 0.15;

      // Ring orbit
      ringGroup.rotation.y += 0.005;
      ringGroup.position.y = -0.5 + Math.sin(t * 1.2) * 0.2;

      // Band float
      bandGroup.rotation.y += 0.003;
      bandGroup.position.y = -1 + Math.cos(t * 0.9) * 0.15;

      // Screen bezel pulse
      bezel.material.opacity = 0.2 + Math.sin(t * 3) * 0.15;

      // Ring sensor pulse
      ringGroup.children.forEach((child, i) => {
        if (i > 0 && child.material) {
          child.material.opacity = 0.4 + Math.sin(t * 4 + i) * 0.4;
        }
      });

      // Particles rotate
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      // Orbit rings spin
      orbitRing1.rotation.z += 0.002;
      orbitRing2.rotation.z -= 0.0015;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="wear-hero">
      <div className="wear-hero-canvas">
        <canvas ref={canvasRef} />
      </div>
      <div className="wear-hero-overlay">
        <h1 className="wear-hero-title">
          Your <span>Wearables</span> Hub
        </h1>
        <p className="wear-hero-subtitle">
          Real-time health telemetry from your smartwatch, ring, and fitness band —
          60+ metrics tracked, analyzed, and visualized.
        </p>
        <div className="wear-hero-devices">
          <div className="wear-hero-device-badge">
            <span className="device-dot" style={{ background: '#818cf8' }} />
            Smart Watch
          </div>
          <div className="wear-hero-device-badge">
            <span className="device-dot" style={{ background: '#4ade80' }} />
            Smart Ring
          </div>
          <div className="wear-hero-device-badge">
            <span className="device-dot" style={{ background: '#22d3ee' }} />
            Fitness Band
          </div>
        </div>
      </div>
    </div>
  );
}
