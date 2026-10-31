import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(() => {
    // Check if already shown in this session
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('cw_v5_preloaded'));
    }
    return false;
  });
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isFinished) {
      onComplete?.();
      return;
    }

    // Canvas steam simulation
    const canvas = canvasRef.current;
    let animId: number;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          radius: number;
          alpha: number;
          maxLife: number;
          life: number;
        }> = [];

        for (let i = 0; i < 35; i++) {
          particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 80,
            y: canvas.height * 0.65 + Math.random() * 40,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -(0.8 + Math.random() * 1.5),
            radius: 8 + Math.random() * 18,
            alpha: 0.08 + Math.random() * 0.15,
            maxLife: 80 + Math.random() * 50,
            life: Math.random() * 60,
          });
        }

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((p) => {
            p.x += p.vx + Math.sin(p.life * 0.05) * 0.4;
            p.y += p.vy;
            p.life++;

            const currentAlpha = p.alpha * (1 - p.life / p.maxLife);
            if (currentAlpha > 0) {
              const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
              grad.addColorStop(0, `rgba(232, 162, 74, ${currentAlpha * 0.8})`);
              grad.addColorStop(1, 'rgba(232, 162, 74, 0)');

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fill();
            }

            if (p.life >= p.maxLife || p.y < 0) {
              p.x = canvas.width / 2 + (Math.random() - 0.5) * 80;
              p.y = canvas.height * 0.65 + Math.random() * 40;
              p.life = 0;
            }
          });

          animId = requestAnimationFrame(render);
        };

        render();
      }
    }

    // Timer progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            sessionStorage.setItem('cw_v5_preloaded', 'true');
            setIsFinished(true);
            onComplete?.();
          }, 350);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => {
      clearInterval(interval);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isFinished, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('cw_v5_preloaded', 'true');
    setIsFinished(true);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
          }}
          className="fixed inset-0 z-[10000] bg-[#0E0A07] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Background steam canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Center Brand Identity */}
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#E8A24A] font-semibold mb-3"
            >
              <span>Artisanal Sanctuary</span>
              <span>✦</span>
              <span>Est. 2024</span>
            </motion.div>

            {/* Bilingual Fraunces Wordmark */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-[#F6EBDD] tracking-tight"
            >
              CHAIWALA
            </motion.h1>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-devanagari text-xl sm:text-2xl text-[#E8A24A] mt-1 font-normal tracking-wider"
            >
              चायवाला
            </motion.span>

            {/* Amber Progress Line */}
            <div className="w-48 sm:w-64 h-[2px] bg-white/[0.08] rounded-full mt-8 overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#E8A24A] to-[#FFC875] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Subtitle / Counter */}
            <div className="flex items-center justify-between w-48 sm:w-64 mt-3 text-[11px] font-mono text-[#7E6F60]">
              <span>BREWING SANCTUARY</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute bottom-8 text-xs font-mono tracking-widest text-[#7E6F60] hover:text-[#E8A24A] transition-colors py-2 px-4 uppercase"
          >
            [ Skip Intro ]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
