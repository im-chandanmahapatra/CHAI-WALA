import React from 'react';
import { Link } from 'react-router';
import { Sparkles, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { MarqueeStrip } from '../motion/MarqueeStrip';
import { useCursor } from '../../hooks/useCursorContext';

export const FooterV5: React.FC = () => {
  const { setCursorVariant } = useCursor();

  const footerMarquee = [
    'Authentic Clay Kulhads',
    '✦',
    'Slow Brass Samovar Brewed',
    '✦',
    '15-Minute Guaranteed Slot Pickup',
    '✦',
    'Pure Single-Estate Assam CTC',
    '✦',
    'Freshly Bruised Malabar Spices',
    '✦',
  ];

  return (
    <footer className="relative bg-[#0E0A07] text-[#F6EBDD] border-t border-white/[0.08] overflow-hidden pt-16 pb-28 md:pb-32">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-[#E8A24A]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Operational Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/[0.08] gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#F6EBDD]">
              Sanctuary Active · 07:00 – 23:00 IST
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#BFAE9A] font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#E8A24A]" />
            <span>Counter #01 · 12 Kala Ghoda, Mumbai</span>
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-xs">
          
          {/* Col 1: Discovery */}
          <div className="space-y-4">
            <h4 className="font-mono text-[#E8A24A] uppercase tracking-widest text-[11px] font-bold">
              Discovery
            </h4>
            <ul className="space-y-2.5 text-[#BFAE9A]">
              <li>
                <Link to="/menu" className="hover:text-[#F6EBDD] transition-colors flex items-center gap-1">
                  Full Recipe Catalogue
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F6EBDD] transition-colors">
                  Our Sourcing & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F6EBDD] transition-colors">
                  Hours & Sanctuary Locations
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#F6EBDD] transition-colors">
                  Atmospheric Flights
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Atmospheres */}
          <div className="space-y-4">
            <h4 className="font-mono text-[#E8A24A] uppercase tracking-widest text-[11px] font-bold">
              Atmospheres
            </h4>
            <ul className="space-y-2.5 text-[#BFAE9A]">
              <li className="flex items-center justify-between">
                <span className="text-[#F6EBDD]">Classic Adda</span>
                <span className="font-devanagari opacity-60 text-[10px]">सवेरा</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#F6EBDD]">Café Classics</span>
                <span className="font-devanagari opacity-60 text-[10px]">दोपहर</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-[#F6EBDD]">Trend Lab</span>
                <span className="font-devanagari opacity-60 text-[10px]">शाम</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Counter Pickup */}
          <div className="space-y-4">
            <h4 className="font-mono text-[#E8A24A] uppercase tracking-widest text-[11px] font-bold">
              Counter Service
            </h4>
            <p className="text-[#BFAE9A] leading-relaxed">
              Strict 6-order capacity caps per 15-minute slot guarantee hot delivery without counter queues.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1 text-[#E8A24A] font-bold tracking-wider hover:underline"
            >
              <span>Order Ahead Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Col 4: Barista Portal */}
          <div className="space-y-4">
            <h4 className="font-mono text-[#E8A24A] uppercase tracking-widest text-[11px] font-bold">
              Station Systems
            </h4>
            <ul className="space-y-2.5 text-[#BFAE9A]">
              <li>
                <Link to="/admin" className="hover:text-[#F6EBDD] transition-colors flex items-center gap-1">
                  Kitchen Display System (KDS)
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/admin/menu" className="hover:text-[#F6EBDD] transition-colors flex items-center gap-1">
                  Inventory & 86 Item Toggle
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Giant Architectural Wordmark */}
        <div className="pt-8 select-none text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-devanagari text-2xl sm:text-3xl text-[#E8A24A] tracking-widest">
              चायवाला
            </span>
          </div>
          <h2 className="font-display font-black text-6xl sm:text-9xl lg:text-[14rem] tracking-tighter text-[#1F1710] hover:text-[#2A1F17] transition-colors duration-500 leading-none">
            CHAIWALA
          </h2>
        </div>

        {/* Bottom Microcopy & Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#7E6F60] font-mono pt-6 border-t border-white/[0.06] gap-4">
          <p>© 2024–2026 Chaiwala Artisanal Sanctuary. Handcrafted in India.</p>
          <p>Zero Artificial Syrups · Hammered Brass Samovars · 100% Porous Red Clay</p>
        </div>

      </div>

      {/* Marquee Footnote Strip */}
      <div className="mt-12">
        <MarqueeStrip items={footerMarquee} speed={40} reverse />
      </div>
    </footer>
  );
};
