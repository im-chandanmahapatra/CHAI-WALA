import { useRef, useEffect } from "react";

interface MagneticOptions {
  strength?: number;
  ease?: number;
}

export function useMagnetic<T extends HTMLElement>({ strength = 0.35, ease = 0.15 }: MagneticOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animFrame: number;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) * strength;
      targetY = (e.clientY - cy) * strength;
    };

    const handleMouseEnter = () => {
      isHovering = true;
      el.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      el.removeEventListener("mousemove", handleMouseMove);
    };

    const animate = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      if (el) {
        el.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      }
      animFrame = requestAnimationFrame(animate);
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    animFrame = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
      if (el) el.style.transform = "";
    };
  }, [strength, ease]);

  return ref;
}
