import React from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowRight, Sparkles, Clock, Coffee, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { KulhadScene } from '../three/KulhadScene';
import { GlassPill } from '../ui/GlassPill';
import { AmberButton } from '../ui/AmberButton';
import { GhostButton } from '../ui/GhostButton';
import { MagneticButton } from '../motion/MagneticButton';
import { useCursor } from '../../hooks/useCursorContext';

export const HeroV5: React.FC = () => {
  const { setCursorVariant } = useCursor();

  const scrollToStory = () => {
    const el = document.getElementById('brewing-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0E0A07] text-[#F6EBDD] flex flex-col justify-between overflow-hidden pt-12 sm:pt-16 pb-20">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E8A24A]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-[#9E3D24]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Grid: Left Typography & Content (60%) + Right 3D Kulhad (40%) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center py-8 lg:py-12">
          
          {/* Left Column (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
            {/* Overline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassPill variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Artisanal Chai Sanctuary · Est. 2024
              </GlassPill>
            </motion.div>

            {/* Giant Fluid Display Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 sm:space-y-2"
            >
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-[#F6EBDD] leading-[0.98]">
                Crushed. Steeped.
              </h1>
              <div className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tight bg-gradient-to-r from-[#E8A24A] via-[#FFC875] to-[#E8A24A] bg-clip-text text-transparent leading-[0.98]">
                Poured Hot.
              </div>
            </motion.div>

            {/* Subline Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base sm:text-lg text-[#BFAE9A] max-w-xl font-body leading-relaxed"
            >
              Single-estate Assam CTC decoctions, crushed root ginger, and whole cardamom pods simmered in hammered brass. Poured steaming warm into unglazed terracotta kulhads.
            </motion.p>

            {/* Floating Info Chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#F6EBDD]/90">
                <Coffee className="w-3.5 h-3.5 text-[#E8A24A]" />
                <span className="font-medium">19 Handcrafted Recipes</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#F6EBDD]/90">
                <Clock className="w-3.5 h-3.5 text-[#E8A24A]" />
                <span className="font-medium">6 Orders Per 15-Min Slot</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#F6EBDD]/90">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8A24A]" />
                <span className="font-medium">Hot Counter Pickup</span>
              </div>
            </motion.div>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MagneticButton>
                <Link to="/menu">
                  <AmberButton size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Full Menu
                  </AmberButton>
                </Link>
              </MagneticButton>

              <GhostButton size="lg" onClick={scrollToStory}>
                The Brewing Ritual
              </GhostButton>
            </motion.div>
          </div>

          {/* Right Column: 3D Kulhad Canvas Scene (5 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-center justify-center relative"
          >
            <KulhadScene />

            {/* Floating 3D Interaction Tip */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E6F60] px-3 py-1 rounded-full bg-[#17100B]/80 backdrop-blur-md border border-white/[0.08]">
                ✦ Move cursor to tilt 3D Kulhad
              </span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="flex justify-center pb-4 z-10">
        <button
          onClick={scrollToStory}
          onMouseEnter={() => setCursorVariant('pointer')}
          onMouseLeave={() => setCursorVariant('default')}
          className="flex flex-col items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#7E6F60] hover:text-[#E8A24A] transition-colors group cursor-pointer"
        >
          <span>Scroll to Discover</span>
          <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#E8A24A]/40 flex items-center justify-center transition-colors">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#E8A24A]" />
          </div>
        </button>
      </div>
    </section>
  );
};
