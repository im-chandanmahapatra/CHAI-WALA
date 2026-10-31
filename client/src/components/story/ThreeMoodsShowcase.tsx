import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Coffee, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MoodSlug } from '../../lib/database.types';

export const ThreeMoodsShowcase: React.FC = () => {
  const { mood, setMood } = useTheme();

  const moods = [
    {
      slug: 'adda' as MoodSlug,
      title: 'Classic Adda',
      hindi: 'सवेरा · सुबह की चाय',
      tagline: 'Pull up a wooden stool.',
      desc: 'The morning tapri ritual. Assam CTC slow-simmered in brass pots with crushed raw ginger, cracked green cardamom, and warm bakery buns with melting salted butter.',
      image: '/images/adrak-chai.jpg',
      icon: <Flame className="w-5 h-5 text-[#9E3D24]" />,
      accentColor: '#9E3D24',
      badgeBg: 'rgba(158, 61, 36, 0.08)',
      highlight: 'Ginger Chai · Cardamom · Bun Maska',
    },
    {
      slug: 'classics' as MoodSlug,
      title: 'Café Classics',
      hindi: 'दोपहर · कहवा व कॉफी',
      tagline: 'Side A, side B, one more cup.',
      desc: 'Midday bistro comfort. South Indian chicory-blend filter kaapi pulled frothy in brass dabara sets, grilled Mumbai green chutney toasties, and Belgian dark chocolate truffle.',
      image: '/images/hot-coffee.jpg',
      icon: <Coffee className="w-5 h-5 text-[#683C54]" />,
      accentColor: '#683C54',
      badgeBg: 'rgba(104, 60, 84, 0.08)',
      highlight: 'Filter Kaapi · Grilled Toasties · Truffle Cake',
    },
    {
      slug: 'lab' as MoodSlug,
      title: 'Trend Lab',
      hindi: 'शाम · नई तरकीब',
      tagline: 'Small batch experiments.',
      desc: 'Contemporary beverage drops. Ceremonial Japanese matcha whisked fresh with oat milk, 16-hour citrus tonic cold brew, and brown sugar tapioca pearls steeped in jaggery syrup.',
      image: '/images/matcha-latte.jpg',
      icon: <Sparkles className="w-5 h-5 text-[#445932]" />,
      accentColor: '#445932',
      badgeBg: 'rgba(68, 89, 50, 0.08)',
      highlight: 'Ceremonial Matcha · Tonic Cold Brew · Brown Sugar Boba',
    },
  ];

  return (
    <section id="three-moods" className="py-20 bg-[var(--surface)] border-b border-[var(--border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] block">
              Atmospheric Flights
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
              One Sanctuary. Three Distinct Atmospheres.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] max-w-md leading-relaxed font-body">
            We don’t believe in one-size-fits-all menus. Switch your active atmosphere at any moment—your cart and selections remain completely intact.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moods.map((m, idx) => {
            const isCurrent = mood === m.slug;
            return (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
                onClick={() => setMood(m.slug)}
                className={`group relative bg-[var(--bg)] border rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-card transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-card-hover'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-2.5 rounded-xl border border-[var(--border)] shadow-stamp flex-shrink-0"
                      style={{ backgroundColor: m.badgeBg }}
                    >
                      {m.icon}
                    </div>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[var(--primary)] text-white shadow-stamp">
                        <Check className="w-3 h-3" />
                        <span>Active Atmosphere</span>
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--ink-muted)] group-hover:text-[var(--primary)] transition-colors">
                        Click to Activate
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Image */}
                  <div className="w-full aspect-[16/10] rounded-xl border border-[var(--border)] overflow-hidden mb-5 shadow-stamp relative">
                    <img
                      src={m.image}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-devanagari font-bold">
                      {m.hindi}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl text-[var(--ink)]">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[var(--primary)] font-bold italic font-display">
                      "{m.tagline}"
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--ink-muted)] mt-2.5 leading-relaxed font-body">
                    {m.desc}
                  </p>
                </div>

                {/* Bottom Highlight Row */}
                <div className="pt-4 border-t border-[var(--border-subtle)] mt-5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--ink-muted)]">
                    {m.highlight}
                  </span>
                  <Link
                    to="/menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMood(m.slug);
                    }}
                    className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Browse Flight</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThreeMoodsShowcase;
