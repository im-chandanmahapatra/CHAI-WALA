import React from 'react';

export const SceneEnvironment: React.FC = () => {
  return (
    <>
      {/* Soft warm ambient lighting */}
      <ambientLight intensity={0.65} color="#FFE5C4" />

      {/* Primary Key Light - Warm Amber */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.8}
        color="#FFA84A"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Secondary Fill Light - Warm Terracotta */}
      <directionalLight position={[-4, 2, 2]} intensity={0.6} color="#E07A5F" />

      {/* Rim Light - Cool Contrast Highlight */}
      <pointLight position={[0, 4, -4]} intensity={0.8} color="#FFF2E0" />
    </>
  );
};
