import React from 'react';
import clsx from 'clsx';

interface MarqueeStripProps {
  items?: string[];
  speed?: number; // duration in seconds
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}

const DEFAULT_ITEMS = [
  'Assam CTC Gold',
  '✦',
  'Stone-Crushed Ginger',
  '✦',
  'Green Cardamom Pods',
  '✦',
  'Warm Bun Maska',
  '✦',
  'South Indian Filter Kaapi',
  '✦',
  'Ceremonial Uji Matcha',
  '✦',
  'Unglazed Clay Kulhad',
  '✦',
  'Hammered Brass Kettle',
  '✦',
];

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  items = DEFAULT_ITEMS,
  speed = 35,
  reverse = false,
  className = '',
  itemClassName = '',
}) => {
  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden whitespace-nowrap select-none py-4 border-y border-white/[0.06] bg-[#17100B]/80 backdrop-blur-md',
        className
      )}
    >
      <div
        className={clsx(
          'inline-flex items-center gap-8 animate-marquee',
          reverse && 'animate-marquee-reverse'
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {/* Render twice for seamless loop */}
        {[...items, ...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className={clsx(
              'font-display text-base sm:text-lg tracking-wider text-[#F6EBDD]/90 transition-colors duration-200 hover:text-[#E8A24A]',
              item === '✦' ? 'text-[#E8A24A] text-xs' : 'font-medium',
              itemClassName
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
