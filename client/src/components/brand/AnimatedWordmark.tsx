import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

interface AnimatedWordmarkProps {
  className?: string;
  showSubtitle?: boolean;
}

export const AnimatedWordmark: React.FC<AnimatedWordmarkProps> = ({
  className = '',
  showSubtitle = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const letters = 'CHAIWALA'.split('');

  return (
    <Link
      to="/"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`group inline-flex items-center gap-3 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--terracotta)] rounded-lg p-1 transition-all ${className}`}
      aria-label="Chaiwala — Contemporary Indian Chai Sanctuary"
    >
      {/* Kettle Medallion Icon */}
      <motion.div
        animate={isHovered ? { rotate: [-2, 4, -2, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-9 h-9 rounded-full bg-[var(--terracotta)] text-white flex items-center justify-center shrink-0 shadow-[var(--shadow-warm-sm)]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          {/* Authentic Brass Kettle / Tapri Kettli Silhouette */}
          <path d="M4 11h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <path d="M19 14l3-2v4l-3-1" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Tri-Script Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {/* Character-by-Character Staggered Headline */}
          <div className="flex font-serif font-black text-xl tracking-tight text-[var(--dark-roast)]">
            {letters.map((char, index) => (
              <motion.span
                key={index}
                animate={
                  isHovered
                    ? {
                        y: -3,
                        color: '#9E3D24',
                        transition: {
                          delay: index * 0.03,
                          duration: 0.25,
                          ease: 'easeOut',
                        },
                      }
                    : {
                        y: 0,
                        color: '#241611',
                        transition: {
                          delay: (letters.length - index) * 0.02,
                          duration: 0.2,
                        },
                      }
                }
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Bilingual Devanagari Calligraphy Stamp */}
          <motion.span
            animate={isHovered ? { scale: 1.05, color: '#C8963E' } : { scale: 1, color: '#7C6E65' }}
            transition={{ duration: 0.3 }}
            className="text-[13px] font-devanagari font-semibold text-[var(--clay)]"
          >
            चायवाला
          </motion.span>
        </div>

        {showSubtitle && (
          <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--clay)] -mt-0.5">
            Artisanal Café & Sanctuary
          </span>
        )}
      </div>
    </Link>
  );
};
