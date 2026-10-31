import React from 'react';
import { ArrowRight, Check, Flame, Coffee, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MoodSlug } from '../../lib/database.types';
import { GlassPill } from '../ui/GlassPill';
import { AmberButton } from '../ui/AmberButton';
import { GhostButton } from '../ui/GhostButton';

export const MoodsEditorial: React.FC = () => {
  const { mood, setMood } = useTheme();

  return (
    <section className="relative py-24 sm:py-32 bg-[#0E0A07] text-[#F6EBDD] overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <GlassPill variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Atmospheric Flights
          </GlassPill>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-[#F6EBDD] tracking-tight">
            Three Sacred Moods.
          </h2>
          <p className="text-sm sm:text-base text-[#BFAE9A] font-body">
            From the bustling warmth of the morning roadside tapri to the quiet intimacy of late evening infusion trials.
          </p>
        </div>

        {/* Flight 1: Classic Adda (Morning · सवेरा) - Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden aspect-[16/10] bg-[#17100B] border border-white/[0.08]">
            <img
              src="/images/hero-counter.jpg"
              alt="Classic Adda Tapri Atmosphere"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A07] via-transparent to-transparent opacity-50" />
            <div className="absolute top-4 left-4">
              <GlassPill variant="spice" icon={<Flame className="w-3.5 h-3.5" />}>
                07:00 – 12:00 IST
              </GlassPill>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E8A24A]">
              <span>Flight 01</span>
              <span>·</span>
              <span className="font-devanagari text-sm">सवेरा</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#F6EBDD]">
              Classic Adda
            </h3>
            <p className="text-sm text-[#BFAE9A] leading-relaxed">
              The crack of dawn, newspapers unfolded over granite tables, unglazed clay kulhads, and the fierce rhythm of bubbling Assam CTC infused with fresh ginger.
            </p>
            <div className="pt-2">
              {mood === 'adda' ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8A24A]/20 border border-[#E8A24A] text-[#E8A24A] text-xs font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" />
                  <span>Currently Immersed</span>
                </div>
              ) : (
                <GhostButton size="sm" onClick={() => setMood('adda')}>
                  Tune Sanctuary to Adda
                </GhostButton>
              )}
            </div>
          </div>
        </div>

        {/* Flight 2: Café Classics (Afternoon · दोपहर) - Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4A054]">
              <span>Flight 02</span>
              <span>·</span>
              <span className="font-devanagari text-sm">दोपहर</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#F6EBDD]">
              Café Classics
            </h3>
            <p className="text-sm text-[#BFAE9A] leading-relaxed">
              Muted jazz, wooden booths, frothy South Indian decoctions poured high between davarah and tumbler, accompanied by golden butter-toasted brioche.
            </p>
            <div className="pt-2">
              {mood === 'classics' ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A054]/20 border border-[#D4A054] text-[#D4A054] text-xs font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" />
                  <span>Currently Immersed</span>
                </div>
              ) : (
                <GhostButton size="sm" onClick={() => setMood('classics')}>
                  Tune Sanctuary to Classics
                </GhostButton>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden aspect-[16/10] bg-[#17100B] border border-white/[0.08] order-1 lg:order-2">
            <img
              src="/images/craft-pour.jpg"
              alt="Café Classics Filter Coffee Ritual"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A07] via-transparent to-transparent opacity-50" />
            <div className="absolute top-4 left-4">
              <GlassPill variant="neutral" icon={<Coffee className="w-3.5 h-3.5" />}>
                12:00 – 17:00 IST
              </GlassPill>
            </div>
          </div>
        </div>

        {/* Flight 3: Trend Lab (Evening · शाम) - Wide Visual & Infusion Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden aspect-[16/10] bg-[#17100B] border border-white/[0.08]">
            <img
              src="/images/mood-lab.jpg"
              alt="Trend Lab Cold Brew Infusions"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A07] via-transparent to-transparent opacity-50" />
            <div className="absolute top-4 left-4">
              <GlassPill variant="leaf" icon={<Sparkles className="w-3.5 h-3.5" />}>
                17:00 – 23:00 IST
              </GlassPill>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7C9A5E]">
              <span>Flight 03</span>
              <span>·</span>
              <span className="font-devanagari text-sm">शाम</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#F6EBDD]">
              Trend Lab
            </h3>
            <p className="text-sm text-[#BFAE9A] leading-relaxed">
              Botanical extractions, cold-steeped Earl Grey tonic with charred orange, ceremonial Uji matcha clouds, and house-made saffron syrups.
            </p>
            <div className="pt-2">
              {mood === 'lab' ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C9A5E]/20 border border-[#7C9A5E] text-[#7C9A5E] text-xs font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" />
                  <span>Currently Immersed</span>
                </div>
              ) : (
                <GhostButton size="sm" onClick={() => setMood('lab')}>
                  Tune Sanctuary to Trend Lab
                </GhostButton>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
