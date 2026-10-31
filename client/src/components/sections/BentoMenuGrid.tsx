import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Plus, Sparkles, Flame, Coffee } from 'lucide-react';
import { SEED_PRODUCTS } from '../../lib/seed-data';
import { Product } from '../../lib/database.types';
import { SpotlightCard } from '../motion/SpotlightCard';
import { GlassPill } from '../ui/GlassPill';
import { useCart } from '../../context/CartContext';
import { useCursor } from '../../hooks/useCursorContext';

const HINDI_MAP: Record<string, string> = {
  'kadak-masala-chai': 'कड़क मसाला चाय',
  'adrak-elaichi-chai': 'अदरक इलायची चाय',
  'bun-maska': 'पारसी बन मस्का',
  'filter-kaapi': 'डिग्री फ़िल्टर कॉफ़ी',
  'iced-masala-chai': 'कोल्ड मसाला इनफ़्यूज़न',
  'saffron-kahwa': 'कश्मीरी ज़ाफ़रानी कहवा',
};

export const BentoMenuGrid: React.FC = () => {
  const { addItem } = useCart();
  const { setCursorVariant } = useCursor();

  // Pick key signature items from SEED_PRODUCTS
  const heroItem = SEED_PRODUCTS.find((p) => p.slug === 'kadak-masala-chai') || SEED_PRODUCTS[0];
  const item2 = SEED_PRODUCTS.find((p) => p.slug === 'adrak-elaichi-chai') || SEED_PRODUCTS[1];
  const item3 = SEED_PRODUCTS.find((p) => p.slug === 'bun-maska') || SEED_PRODUCTS[2];
  const item4 = SEED_PRODUCTS.find((p) => p.slug === 'filter-kaapi') || SEED_PRODUCTS[3];
  const item5 = SEED_PRODUCTS.find((p) => p.slug === 'iced-masala-chai') || SEED_PRODUCTS[4];
  const item6 = SEED_PRODUCTS.find((p) => p.slug === 'saffron-kahwa') || SEED_PRODUCTS[5];

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, [], 1);
  };

  return (
    <section className="relative py-24 sm:py-32 bg-[#0E0A07] text-[#F6EBDD] overflow-hidden">
      {/* Background glow auras */}
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[#E8A24A]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#9E3D24]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <GlassPill variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Signature Collection
            </GlassPill>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-[#F6EBDD] tracking-tight">
              The Artisan Bento.
            </h2>
            <p className="text-sm sm:text-base text-[#BFAE9A] max-w-lg font-body">
              Six curated masterpieces showcasing slow-decocted spice mastery, artisanal dairy, and regional tea culture.
            </p>
          </div>

          <Link
            to="/menu"
            onMouseEnter={() => setCursorVariant('pointer')}
            onMouseLeave={() => setCursorVariant('default')}
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#E8A24A] hover:text-[#FFC875] transition-colors py-2 border-b border-[#E8A24A]/30 pb-1"
          >
            <span>Explore All 19 Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 12-Column Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Tile 1: Hero Large Card (Spans 6 cols, 2 rows on desktop) */}
          <div className="md:col-span-12 lg:col-span-6">
            <SpotlightCard className="h-full flex flex-col justify-between group p-6 sm:p-8 border-white/[0.1] bg-[#17100B]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <GlassPill variant="spice" icon={<Flame className="w-3.5 h-3.5" />}>
                    Sanctuary Landmark
                  </GlassPill>
                  <span className="font-mono text-sm font-bold text-[#E8A24A]">
                    ₹{(heroItem.basePricePaise / 100).toFixed(0)}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F6EBDD] group-hover:text-[#E8A24A] transition-colors">
                    {heroItem.name}
                  </h3>
                  <span className="font-devanagari text-sm text-[#BFAE9A] opacity-75">
                    {HINDI_MAP[heroItem.slug] || 'कड़क चाय'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#BFAE9A] line-clamp-2 leading-relaxed">
                  {heroItem.description}
                </p>
              </div>

              {/* Large Image with Hover Zoom */}
              <div className="relative my-6 rounded-2xl overflow-hidden aspect-[16/10] bg-[#1F1710]">
                <img
                  src={heroItem.imagePath}
                  alt={heroItem.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17100B] via-transparent to-transparent opacity-60" />
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <Link
                  to={`/menu/${heroItem.slug}`}
                  className="text-xs font-semibold text-[#BFAE9A] hover:text-[#F6EBDD] transition-colors"
                >
                  Customise Chit →
                </Link>

                <button
                  onClick={(e) => handleQuickAdd(e, heroItem)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E8A24A] hover:bg-[#F5B563] text-[#0E0A07] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </SpotlightCard>
          </div>

          {/* Tile 2 & 3: Secondary Medium Cards (3 cols each on desktop) */}
          <div className="md:col-span-6 lg:col-span-3">
            <SpotlightCard className="h-full flex flex-col justify-between group p-6 border-white/[0.1] bg-[#17100B]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <GlassPill variant="amber">Stone-Crushed</GlassPill>
                  <span className="font-mono text-xs font-bold text-[#E8A24A]">
                    ₹{(item2.basePricePaise / 100).toFixed(0)}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#F6EBDD] group-hover:text-[#E8A24A] transition-colors">
                  {item2.name}
                </h3>
                <span className="font-devanagari text-xs text-[#BFAE9A] block mb-2">
                  {HINDI_MAP[item2.slug] || 'इलायची चाय'}
                </span>

                <div className="relative rounded-xl overflow-hidden aspect-square my-4 bg-[#1F1710]">
                  <img
                    src={item2.imagePath}
                    alt={item2.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                <Link to={`/menu/${item2.slug}`} className="text-xs text-[#BFAE9A] hover:text-[#F6EBDD]">
                  Options →
                </Link>
                <button
                  onClick={(e) => handleQuickAdd(e, item2)}
                  className="p-2 rounded-full bg-[#E8A24A] text-[#0E0A07] hover:bg-[#F5B563] transition-colors"
                  aria-label="Add to cart"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightCard>
          </div>

          <div className="md:col-span-6 lg:col-span-3">
            <SpotlightCard className="h-full flex flex-col justify-between group p-6 border-white/[0.1] bg-[#17100B]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <GlassPill variant="neutral">Bakery Special</GlassPill>
                  <span className="font-mono text-xs font-bold text-[#E8A24A]">
                    ₹{(item3.basePricePaise / 100).toFixed(0)}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#F6EBDD] group-hover:text-[#E8A24A] transition-colors">
                  {item3.name}
                </h3>
                <span className="font-devanagari text-xs text-[#BFAE9A] block mb-2">
                  {HINDI_MAP[item3.slug] || 'बन मस्का'}
                </span>

                <div className="relative rounded-xl overflow-hidden aspect-square my-4 bg-[#1F1710]">
                  <img
                    src={item3.imagePath}
                    alt={item3.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                <Link to={`/menu/${item3.slug}`} className="text-xs text-[#BFAE9A] hover:text-[#F6EBDD]">
                  Options →
                </Link>
                <button
                  onClick={(e) => handleQuickAdd(e, item3)}
                  className="p-2 rounded-full bg-[#E8A24A] text-[#0E0A07] hover:bg-[#F5B563] transition-colors"
                  aria-label="Add to cart"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightCard>
          </div>

          {/* Tile 4, 5, 6: Bottom Row (4 cols each on desktop) */}
          <div className="md:col-span-4">
            <SpotlightCard className="p-5 flex items-center gap-4 group border-white/[0.1] bg-[#17100B]">
              <img
                src={item4.imagePath}
                alt={item4.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-[#E8A24A] uppercase block">Davanagere Chicory</span>
                <h4 className="font-display font-bold text-base text-[#F6EBDD] truncate group-hover:text-[#E8A24A] transition-colors">
                  {item4.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-xs font-bold text-[#F6EBDD]">
                    ₹{(item4.basePricePaise / 100).toFixed(0)}
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, item4)}
                    className="p-1.5 rounded-full bg-white/[0.08] hover:bg-[#E8A24A] hover:text-[#0E0A07] text-[#F6EBDD] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="md:col-span-4">
            <SpotlightCard className="p-5 flex items-center gap-4 group border-white/[0.1] bg-[#17100B]">
              <img
                src={item5.imagePath}
                alt={item5.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-[#7C9A5E] uppercase block">Cold Brew Infusion</span>
                <h4 className="font-display font-bold text-base text-[#F6EBDD] truncate group-hover:text-[#E8A24A] transition-colors">
                  {item5.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-xs font-bold text-[#F6EBDD]">
                    ₹{(item5.basePricePaise / 100).toFixed(0)}
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, item5)}
                    className="p-1.5 rounded-full bg-white/[0.08] hover:bg-[#E8A24A] hover:text-[#0E0A07] text-[#F6EBDD] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="md:col-span-4">
            <SpotlightCard className="p-5 flex items-center gap-4 group border-white/[0.1] bg-[#17100B]">
              <img
                src={item6.imagePath}
                alt={item6.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-[#FFC875] uppercase block">Kashmiri Saffron</span>
                <h4 className="font-display font-bold text-base text-[#F6EBDD] truncate group-hover:text-[#E8A24A] transition-colors">
                  {item6.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-xs font-bold text-[#F6EBDD]">
                    ₹{(item6.basePricePaise / 100).toFixed(0)}
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, item6)}
                    className="p-1.5 rounded-full bg-white/[0.08] hover:bg-[#E8A24A] hover:text-[#0E0A07] text-[#F6EBDD] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </div>

        </div>
      </div>
    </section>
  );
};
