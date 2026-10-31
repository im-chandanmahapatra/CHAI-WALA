import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const KulhadMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Generate traditional unglazed clay kulhad profile
  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // Base bottom center
    points.push(new THREE.Vector2(0.0, 0.0));
    // Base rim
    points.push(new THREE.Vector2(0.7, 0.0));
    points.push(new THREE.Vector2(0.75, 0.1));
    // Lower body tapering
    points.push(new THREE.Vector2(0.85, 0.4));
    points.push(new THREE.Vector2(1.0, 0.9));
    // Mid body waist
    points.push(new THREE.Vector2(1.15, 1.4));
    // Upper outward flare
    points.push(new THREE.Vector2(1.35, 2.0));
    points.push(new THREE.Vector2(1.48, 2.4));
    // Rim lip
    points.push(new THREE.Vector2(1.52, 2.5));
    points.push(new THREE.Vector2(1.48, 2.55));
    // Inner wall
    points.push(new THREE.Vector2(1.4, 2.5));
    points.push(new THREE.Vector2(1.25, 2.0));
    points.push(new THREE.Vector2(1.0, 1.4));
    points.push(new THREE.Vector2(0.8, 0.8));
    points.push(new THREE.Vector2(0.6, 0.2));
    points.push(new THREE.Vector2(0.0, 0.2));

    return new THREE.LatheGeometry(points, 64);
  }, []);

  // Unglazed terracotta material with warm earth tone
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B8603A'), // Terracotta clay
      roughness: 0.85,
      metalness: 0.05,
      flatShading: false,
    });
  }, []);

  // Liquid chai fill mesh inside
  const liquidGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(1.3, 1.1, 0.1, 64);
  }, []);

  const liquidMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#783818'), // Dark rich chai brew
      roughness: 0.2,
      metalness: 0.1,
    });
  }, []);

  return (
    <group position={[0, -1.2, 0]}>
      {/* Kulhad Cup Body */}
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />

      {/* Steaming hot chai liquid surface */}
      <mesh
        geometry={liquidGeometry}
        material={liquidMaterial}
        position={[0, 2.15, 0]}
      />
    </group>
  );
};
