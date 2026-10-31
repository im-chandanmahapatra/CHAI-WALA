import React from 'react';
import { MarqueeStrip } from '../motion/MarqueeStrip';

export const MarqueeSection: React.FC = () => {
  const row1 = [
    'Assam Single-Estate CTC',
    '✦',
    'Freshly Stone-Crushed Ginger',
    '✦',
    'Green Malabar Cardamom Pods',
    '✦',
    'Toasted Bun Maska with Amul Butter',
    '✦',
    'Traditional Unglazed Clay Kulhad',
    '✦',
    'Hand-Hammered Brass Samovar',
    '✦',
  ];

  return (
    <div className="relative z-10">
      <MarqueeStrip items={row1} speed={32} />
    </div>
  );
};
