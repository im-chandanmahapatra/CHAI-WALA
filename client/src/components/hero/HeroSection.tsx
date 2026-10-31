import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export const HeroSection: React.FC = () => {
  const { moodName } = useTheme();

  // Subtle parallax on desktop scroll
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 400], [0, 45]);
  const heroScale = useTransform(scrollY, [0, 400], [1.02, 0.99]);

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 border-b border-[var(--border)]">
      {/* Background Paper Texture */}
      <div className="absolute inset-0 paper-grain opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typographic Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Overline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-stamp"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]">
                चायवाला · Artisanal Tea & Café Sanctuary
              </span>
            </motion.div>

            {/* Display Headline */}
            <div className="space-y-1">
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--ink)] leading-[1.06]"
              >
                The Daily Ritual, <br />
                <span className="text-[var(--primary)] italic font-normal">Brewed with Soul.</span>
              </motion.h1>
            </div>

            {/* Narrative Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="text-sm sm:text-base text-[var(--ink-muted)] max-w-xl leading-relaxed font-body"
            >
              From street-side cutting chai boiled slow in brass kettles with freshly crushed ginger, to South Indian filter coffee and ceremonial Kyoto matcha. Order ahead in 15-minute slots and collect warm from Counter #01 without the queue.
            </motion.p>

            {/* Live Counter Capacity Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: 'easeOut' }}
              className="inline-flex items-center gap-3 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-stamp text-xs text-[var(--ink-muted)]"
            >
              <div className="flex items-center gap-1.5 font-bold text-[var(--ink)]">
                <Clock className="w-4 h-4 text-[var(--primary)]" />
                <span>Next Window:</span>
              </div>
              <span>15-min pickup windows · 6 slots per interval</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live & Open
              </span>
            </motion.div>

            {/* Action CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/menu"
                className="px-7 py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-card shadow-card-hover transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Full Menu & Order Ahead</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#three-moods"
                className="px-5 py-4 bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--ink)] rounded-full font-bold text-xs uppercase tracking-wider border border-[var(--border)] shadow-stamp transition-colors flex items-center gap-2"
              >
                <span>The 3 Atmospheres</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Parallax Hero Culinary Visual */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <motion.div
              style={{ y: heroImageY, scale: heroScale }}
              className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl border border-[var(--border)] shadow-card overflow-hidden bg-[var(--surface)]"
            >
              <img
                src="/images/hero-counter.jpg"
                alt="Chaiwala Counter with brass kettle and kulhad cups"
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Ambient Steam Gradient & Real-time Live Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--brass)] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--brass)]" />
                    <span>Live Kitchen Counter #01</span>
                  </div>
                  <p className="font-display font-bold text-lg text-white">Fresh Decoction Steaming Now</p>
                  <p className="text-xs text-white/80">Assam CTC · Raw Crushed Ginger · Buffalo Milk</p>
                </div>
              </div>

              {/* Floating Ticket Chip */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-[var(--border)] text-[var(--ink)] px-3.5 py-1.5 rounded-xl shadow-card hidden sm:block">
                <span className="text-[9px] uppercase font-bold tracking-widest block text-[var(--ink-muted)]">
                  PICKUP TICKET
                </span>
                <span className="font-display font-black text-sm text-[var(--primary)]">#CW-1001</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
