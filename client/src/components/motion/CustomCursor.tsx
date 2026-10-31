import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { useCursor } from '../../hooks/useCursorContext';

export const CustomCursor: React.FC = () => {
  const { cursorVariant, cursorText } = useCursor();
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor follow
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch or reduced motion
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touchCheck || reducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible || cursorVariant === 'hidden') {
    return null;
  }

  // Determine size & styling based on variant
  const isText = Boolean(cursorText);
  const isDrag = cursorVariant === 'drag';
  const isButton = cursorVariant === 'button';
  const isPointer = cursorVariant === 'pointer';

  let size = 32;
  if (isText || isDrag) size = 72;
  else if (isButton) size = 48;
  else if (isPointer) size = 44;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Outer follow ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: size,
          height: size,
          scale: isButton ? 1.15 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`rounded-full flex items-center justify-center transition-colors duration-200 ${
          isText || isDrag
            ? 'bg-[#E8A24A] text-[#0E0A07] shadow-[0_0_25px_rgba(232,162,74,0.6)] font-bold text-[11px] tracking-wider'
            : isButton
            ? 'bg-[#E8A24A]/20 border-2 border-[#E8A24A]'
            : isPointer
            ? 'bg-white/[0.1] border border-white/40'
            : 'border border-[#E8A24A]/40 bg-[#E8A24A]/5'
        }`}
      >
        {cursorText && (
          <span className="font-display uppercase tracking-widest text-center px-1">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Center pinpoint dot (hidden when text cursor is active) */}
      {!isText && !isDrag && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="w-1.5 h-1.5 rounded-full bg-[#E8A24A] shadow-[0_0_8px_#FFC875]"
        />
      )}
    </div>
  );
};
