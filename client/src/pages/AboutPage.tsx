import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, Sparkles, Coffee, Heart, ShieldCheck } from 'lucide-react';
import { GlassPill } from '../components/ui/GlassPill';
import { AmberButton } from '../components/ui/AmberButton';
import { FooterV5 } from '../components/layout/FooterV5';
import { PageTransition } from '../components/motion/PageTransition';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition className="min-h-screen bg-[#0E0A07] text-[#F6EBDD] flex flex-col justify-between">
      {/* Top Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#BFAE9A] hover:text-[#E8A24A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sanctuary</span>
        </Link>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        
        {/* Editorial Title */}
        <div className="space-y-4">
          <GlassPill variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
            The Philosophy
          </GlassPill>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-[#F6EBDD] tracking-tight leading-[1.02]">
            Reclaiming the Soul of Indian Tea.
          </h1>
          <p className="text-base sm:text-lg text-[#BFAE9A] leading-relaxed max-w-3xl font-body">
            In an era of commercial powders, automated push-button dispensers, and artificial syrups, Chaiwala was founded to preserve the sacred ritual of manual low-flame decoction.
          </p>
        </div>

        {/* Feature Hero Image */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-[#17100B] border border-white/[0.08] shadow-2xl">
          <img
            src="/images/hero-counter.jpg"
            alt="Handcrafted Chai Preparation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A07] via-transparent to-transparent opacity-60" />
        </div>

        {/* Story Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm sm:text-base text-[#BFAE9A] leading-relaxed font-body">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-[#F6EBDD]">
              The Unglazed Kulhad Ethos
            </h3>
            <p>
              When hot tea touches an unglazed terracotta kulhad, something magical happens. The porous earthen walls gently absorb a fraction of the liquid's surface moisture, concentrating the brew while releasing rich mineral petrichor aromas into the steam.
            </p>
            <p>
              Each kulhad is hand-thrown by generational potter guilds in Rajasthan and used once before returning to the soil from which it came.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-[#F6EBDD]">
              Pure Second Flush Assam CTC
            </h3>
            <p>
              We bypass intermediate commodity auction houses, partnering directly with bio-dynamic tea estates in the Brahmaputra Valley. Our CTC tea granules are heavy, dark, and aromatic, carrying natural malt notes that stand tall against thick A2 dairy.
            </p>
            <p>
              Spices are never pre-ground in factories. Ginger roots and green cardamom are crushed immediately prior to decoction under heavy granite pestles.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 rounded-3xl bg-[#17100B] border border-white/[0.08] text-center">
          <div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#E8A24A] block">14 Min</span>
            <span className="text-[11px] font-mono uppercase text-[#7E6F60] tracking-wider">Slow Decoction</span>
          </div>
          <div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#E8A24A] block">100%</span>
            <span className="text-[11px] font-mono uppercase text-[#7E6F60] tracking-wider">Porous Red Clay</span>
          </div>
          <div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#E8A24A] block">0g</span>
            <span className="text-[11px] font-mono uppercase text-[#7E6F60] tracking-wider">Artificial Powders</span>
          </div>
          <div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#E8A24A] block">6 Slots</span>
            <span className="text-[11px] font-mono uppercase text-[#7E6F60] tracking-wider">Cap Per 15 Mins</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link to="/menu">
            <AmberButton size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Explore Handcrafted Catalogue
            </AmberButton>
          </Link>
        </div>

      </main>

      <FooterV5 />
    </PageTransition>
  );
};
