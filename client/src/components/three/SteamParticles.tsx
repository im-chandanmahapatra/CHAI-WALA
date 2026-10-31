import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const SteamParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const particleCount = 45;

  const { positions, randoms, geometry } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const rnd = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Ring above the cup rim at Y = 1.0, radius ~0.8
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.7;
      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 1.0 + Math.random() * 2.5; // Y height
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      rnd[i * 3 + 0] = Math.random(); // speed offset
      rnd[i * 3 + 1] = Math.random() * Math.PI * 2; // phase
      rnd[i * 3 + 2] = 0.5 + Math.random() * 0.5; // size
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    return { positions: pos, randoms: rnd, geometry: geom };
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color('#FFD199'),
      size: 0.22,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const speed = 0.8 + randoms[idx] * 0.6;
      const phase = randoms[idx + 1];

      // Rise in Y
      array[idx + 1] += speed * delta;

      // Sinusoidal sway in X and Z
      array[idx + 0] += Math.sin(time * 2 + phase) * 0.003;
      array[idx + 2] += Math.cos(time * 1.5 + phase) * 0.003;

      // Reset when reaching peak
      if (array[idx + 1] > 3.8) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.6;
        array[idx + 0] = Math.cos(angle) * radius;
        array[idx + 1] = 1.0;
        array[idx + 2] = Math.sin(angle) * radius;
      }
    }

    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};
