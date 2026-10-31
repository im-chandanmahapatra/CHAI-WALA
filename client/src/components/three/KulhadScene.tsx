import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { KulhadMesh } from './KulhadMesh';
import { SteamParticles } from './SteamParticles';
import { SceneEnvironment } from './SceneEnvironment';

// Interactive floating & tilting rig inside Canvas
const InteractiveRig: React.FC = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotation.current.y = nx * 0.25; // max ~14 deg
      targetRotation.current.x = ny * 0.15; // max ~8 deg
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Continuous slow baseline rotation on Y
    groupRef.current.rotation.y += delta * 0.25;

    // Smooth lerp toward mouse tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x + 0.15, // slight downward viewing angle
      0.05
    );

    // Subtle gentle floating hover on Y
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <KulhadMesh />
      <SteamParticles />
    </group>
  );
};

export const KulhadScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(rm);

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Fallback for reduced motion or non-WebGL environments
  if (!hasWebGL || reducedMotion) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src="/images/hero-counter.jpg"
          alt="Artisanal Chai Kulhad"
          className="w-full max-w-[420px] aspect-square object-cover rounded-3xl shadow-2xl border border-white/10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A07] via-transparent to-transparent rounded-3xl" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[380px] sm:h-[480px] lg:h-[560px] ${className}`}>
      {/* Warm background glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#E8A24A]/15 blur-[90px] rounded-full pointer-events-none" />

      <Canvas
        camera={{ position: [0, 1.2, 5.2], fov: 42 }}
        dpr={[1, 2]} // Crisp rendering on high DPI
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <SceneEnvironment />
          <InteractiveRig />
        </Suspense>
      </Canvas>
    </div>
  );
};
