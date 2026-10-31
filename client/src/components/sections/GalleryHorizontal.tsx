import React, { useRef } from 'react';
import { GlassPill } from '../ui/GlassPill';
import { Camera, Sparkles } from 'lucide-react';
import { useCursor } from '../../hooks/useCursorContext';

export const GalleryHorizontal: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { setCursorVariant, setCursorText } = useCursor();

  const galleryItems = [
    {
      img: '/images/hero-counter.jpg',
      title: 'Counter #01 Steaming Station',
      caption: 'Hammered brass samovars keeping fresh decoctions at 82°C.',
    },
    {
      img: '/images/adrak-chai.jpg',
      title: 'Crushed Ginger & Spices',
      caption: 'Bruised ginger and green cardamom simmered in creamy A2 milk.',
    },
    {
      img: '/images/cutting-chai.jpg',
      title: 'Terracotta Kulhad Service',
      caption: 'Porous earth cooling the decoction naturally to drinking temperature.',
    },
    {
      img: '/images/bun-maska.jpg',
      title: 'Toasted Bakery Classics',
      caption: 'Freshly baked Irani-style sweet buns slathered with salted butter.',
    },
    {
      img: '/images/elaichi-chai.jpg',
      title: 'Cardamom Cloud Decanted',
      caption: 'Triple aerated for velvety micro-froth and fragrant floral top notes.',
    },
    {
      img: '/images/matcha-latte.jpg',
      title: 'Botanical Cold Infusions',
      caption: 'Ceremonial grade green tea whisked with cold oat cream.',
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0E0A07] text-[#F6EBDD] overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <GlassPill variant="amber" icon={<Camera className="w-3.5 h-3.5" />}>
              Visual Sanctuary
            </GlassPill>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-[#F6EBDD] tracking-tight">
              Life Around the Samovar.
            </h2>
            <p className="text-sm sm:text-base text-[#BFAE9A] max-w-lg font-body">
              An unhurried sanctuary where terracotta, steaming brass, and warm spice fragrance converge.
            </p>
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-[#7E6F60] hidden sm:block">
            ← Drag or scroll to explore →
          </span>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        onMouseEnter={() => {
          setCursorVariant('drag');
          setCursorText('DRAG');
        }}
        onMouseLeave={() => {
          setCursorVariant('default');
          setCursorText('');
        }}
        className="flex gap-6 overflow-x-auto no-scrollbar px-4 sm:px-8 lg:px-12 py-4 cursor-grab active:cursor-grabbing select-none"
      >
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[280px] sm:w-[380px] lg:w-[440px] group relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#17100B] border border-white/[0.08]"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Dark vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A07] via-[#0E0A07]/30 to-transparent opacity-80" />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 space-y-1.5 z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8A24A]">
                Chit 0{idx + 1}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F6EBDD]">
                {item.title}
              </h3>
              <p className="text-xs text-[#BFAE9A] line-clamp-2 font-body">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
