import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { Sparkles, ArrowRight, Flame, Droplets, Compass } from 'lucide-react';

interface StoryChapter {
  id: number;
  numHindi: string;
  numLatin: string;
  title: string;
  subtitle: string;
  narrative: string;
  image: string;
  alt: string;
  tag: string;
  spiceNotes: string[];
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    numHindi: '०१',
    numLatin: '01',
    title: 'Before the Flame, the Soil',
    subtitle: 'Assam CTC & Raw Rhizomes',
    narrative:
      'Whole green cardamom pods from the Idukki hills, pungent cloves, and fresh ginger roots bruised by hand in heavy stone mortars. Pure, unadulterated spice with zero artificial syrups.',
    image: '/images/masala-chai.jpg',
    alt: 'Cracked green cardamom and whole Indian spices on dark stone mortar',
    tag: 'Stage 01 · Sourcing & Bruising',
    spiceNotes: ['Upper Assam CTC', 'Idukki Cardamom', 'Crushed Ginger'],
  },
  {
    id: 2,
    numHindi: '०२',
    numLatin: '02',
    title: 'Water Meets Antique Brass',
    subtitle: 'The Heavy Degchi Vessel',
    narrative:
      'Filtered spring water heated in heavy-gauge hand-hammered brass kettles. The thick metal retains and diffuses heat evenly, awakening the dormant essential oils without scorching.',
    image: '/images/hero-counter.jpg',
    alt: 'Hand-hammered brass degchi heating on flame at the chai counter',
    tag: 'Stage 02 · Thermal Awakening',
    spiceNotes: ['Hammered Brass', 'Even Heat Diffusion', 'Slow Bring to Boil'],
  },
  {
    id: 3,
    numHindi: '०३',
    numLatin: '03',
    title: 'The Slow Decoction',
    subtitle: 'Deep Amber Tannins',
    narrative:
      'Robust single-estate CTC leaves tumble into boiling water. As the liquor darkens into shimmering mahogany, the bitter tannins mellow into a malty, aromatic foundation.',
    image: '/images/adrak-chai.jpg',
    alt: 'Simmering deep amber chai decoction releasing fragrant steam',
    tag: 'Stage 03 · Decoction Release',
    spiceNotes: ['Malty Body', 'Amber Liquor', '3-Minute Extraction'],
  },
  {
    id: 4,
    numHindi: '०४',
    numLatin: '04',
    title: 'The Golden Cascade',
    subtitle: 'Whole Milk & Spices Emulsify',
    narrative:
      'Full-cream dairy poured from a height. The sudden thermal collision binds the tea polyphenols with silky milk fats, turning the dark broth into a warm golden-caramel swirl.',
    image: '/images/cutting-chai.jpg',
    alt: 'Golden milk stream cascading into dark tea decoction',
    tag: 'Stage 04 · Lipid Emulsion',
    spiceNotes: ['Whole Dairy', 'Aerated Pour', 'Golden Caramel Swirl'],
  },
  {
    id: 5,
    numHindi: '०५',
    numLatin: '05',
    title: 'The Boil of Patience',
    subtitle: 'The Sacred Ubbaal',
    narrative:
      'The three-stage rolling boil. The tea swells toward the brim and is gently coaxed back down. Each rolling wave caramelizes trace sugars and melds the sharp ginger heat into creamy balance.',
    image: '/images/elaichi-chai.jpg',
    alt: 'Rolling boil of spiced chai rising in traditional pot with rising steam',
    tag: 'Stage 05 · The Ubbaal',
    spiceNotes: ['Rolling Wave', 'Spiced Steam', 'Sugar Caramelization'],
  },
  {
    id: 6,
    numHindi: '०६',
    numLatin: '06',
    title: 'The Daily Ritual',
    subtitle: 'Double-Pulled into Clay',
    narrative:
      'Strained through fine cloth, aerated by double-pulling, and decanted steaming hot into raw unglazed terracotta kulhads. The earth breathes mineral petrichor into every sip.',
    image: '/images/hero-counter.jpg',
    alt: 'Steaming hot chai poured into terracotta kulhad ready for counter pickup',
    tag: 'Stage 06 · Decanting & Service',
    spiceNotes: ['Unglazed Terracotta', 'Mineral Petrichor', 'Served Steaming'],
  },
];

export const CinematicBrewingStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Monitor user preference for reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Motion for React scroll tracking across the 350vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0 to 1) to chapter index (0 to 5)
  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      // Divide into 6 segments
      const idx = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(progress * CHAPTERS.length)));
      setActiveChapterIndex(idx);
    });
  }, [scrollYProgress]);

  // Subtle ambient steam particle canvas animation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool for subtle rising steam wisps
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      radius: 15 + Math.random() * 30,
      speedY: 0.4 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.03 + Math.random() * 0.08,
      wobble: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.wobble += 0.02;
        p.x += Math.sin(p.wobble) * 0.4 + p.speedX;

        // Reset particle when it floats off top
        if (p.y < -50) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(255, 240, 220, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 240, 220, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  const activeChapter = CHAPTERS[activeChapterIndex];

  // If customer prefers reduced motion, render clean accessible grid
  if (prefersReducedMotion) {
    return (
      <section className="py-20 bg-[var(--parchment)] border-b border-[var(--warm-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--terracotta)]">
              Culinary Narrative
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[var(--dark-roast)]">
              The Alchemy of Chai
            </h2>
            <p className="text-sm text-[var(--clay)]">
              From soil and brass to the unglazed clay kulhad. Six steps of uncompromising craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                className="bg-[var(--linen)] border border-[var(--warm-border)] rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--charcoal)]">
                  <img src={ch.image} alt={ch.alt} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--terracotta)]">
                    <span>{ch.tag}</span>
                    <span className="font-devanagari text-base">{ch.numHindi}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[var(--dark-roast)]">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-[var(--clay)] leading-relaxed">{ch.narrative}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={containerRef}
      id="brewing-story"
      className="relative h-[240vh] sm:h-[300vh] bg-[var(--charcoal)] text-[var(--linen)]"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-16 select-none">
        {/* Background Visual Layer with Crossfade */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={activeChapter.image}
                alt={activeChapter.alt}
                className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.1] saturate-[1.15]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Warm Vignette and Canvas Ambient Steam Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)] via-black/40 to-[var(--charcoal)]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--charcoal)] via-transparent to-[var(--charcoal)]/90 pointer-events-none" />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />
        </div>

        {/* Top Header Bar inside Sticky Stage */}
        <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--terracotta)] text-white flex items-center justify-center font-serif text-sm font-bold shadow-md">
              च
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[var(--gold)]">
                Cinematic Craft Narrative
              </span>
              <span className="font-serif text-sm text-[var(--linen)] font-bold">
                The Six Sacred Stages of Decoction
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/menu"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-wider text-[var(--linen)] backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <span>Skip to Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Center Stage: Narrative Typography & Chapter Beat */}
        <div className="relative z-20 max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-auto">
          {/* Main Chapter Content */}
          <div className="lg:col-span-9 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Stage Tag with Devanagari Numeral */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[var(--gold)] px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                    {activeChapter.tag}
                  </span>
                  <span className="font-devanagari text-2xl font-bold text-[var(--gold)]">
                    {activeChapter.numHindi}
                  </span>
                </div>

                {/* Chapter Headline */}
                <h2 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[var(--linen)] tracking-tight leading-[1.08]">
                  {activeChapter.title}
                </h2>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-[var(--gold)]/90 font-serif italic">
                  {activeChapter.subtitle}
                </p>

                {/* Poetic Narrative */}
                <p className="text-xs sm:text-base text-stone-300 max-w-2xl leading-relaxed font-body font-normal">
                  {activeChapter.narrative}
                </p>

                {/* Spice & Craft Notes Pill Row */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {activeChapter.spiceNotes.map((note) => (
                    <span
                      key={note}
                      className="text-[11px] font-semibold text-[var(--linen)]/80 px-2.5 py-1 rounded-md bg-white/5 border border-white/10"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Timeline Indicator & Chapter Bar */}
        <div className="relative z-20 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Chapter Buttons / Progress Dots */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    const container = containerRef.current;
                    if (!container) return;
                    const top = container.offsetTop;
                    const height = container.scrollHeight - window.innerHeight;
                    const targetScroll = top + (idx / (CHAPTERS.length - 1)) * height;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--terracotta)] text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-stone-300'
                  }`}
                >
                  <span className="font-tabular text-[10px]">{ch.numLatin}</span>
                  <span className="hidden md:inline text-[11px] font-serif">{ch.title}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Down Hint */}
          <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-ping" />
            <span>Scroll slowly to witness the infusion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicBrewingStory;
