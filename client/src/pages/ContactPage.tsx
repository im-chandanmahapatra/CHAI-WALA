import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft, MapPin, Clock, Phone, Mail, Sparkles, Navigation } from 'lucide-react';
import { GlassPill } from '../components/ui/GlassPill';
import { AmberButton } from '../components/ui/AmberButton';
import { FooterV5 } from '../components/layout/FooterV5';
import { PageTransition } from '../components/motion/PageTransition';

export const ContactPage: React.FC = () => {
  return (
    <PageTransition className="min-h-screen bg-[#0E0A07] text-[#F6EBDD] flex flex-col justify-between">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#BFAE9A] hover:text-[#E8A24A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sanctuary</span>
        </Link>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Title */}
        <div className="space-y-4">
          <GlassPill variant="amber" icon={<MapPin className="w-3.5 h-3.5" />}>
            Sanctuary & Counter #01
          </GlassPill>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-[#F6EBDD] tracking-tight">
            Find Counter #01.
          </h1>
          <p className="text-base sm:text-lg text-[#BFAE9A] font-body max-w-2xl">
            Collect warm pre-orders directly from Counter 01 or join the unhurried communal seating.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Location Card */}
          <div className="p-8 rounded-3xl bg-[#17100B] border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-3 text-[#E8A24A]">
              <MapPin className="w-6 h-6" />
              <h3 className="font-display text-2xl font-bold text-[#F6EBDD]">
                Kala Ghoda Flagship
              </h3>
            </div>
            
            <p className="text-sm text-[#BFAE9A] leading-relaxed">
              12 Ropewalk Lane, Behind Jehangir Art Gallery,<br />
              Kala Ghoda, Fort, Mumbai 400001
            </p>

            <div className="pt-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E8A24A] hover:underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Maps / Get Directions</span>
              </a>
            </div>
          </div>

          {/* Service Hours Card */}
          <div className="p-8 rounded-3xl bg-[#17100B] border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-3 text-[#E8A24A]">
              <Clock className="w-6 h-6" />
              <h3 className="font-display text-2xl font-bold text-[#F6EBDD]">
                Operational Windows
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#BFAE9A] font-mono">
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span>Classic Adda (Morning)</span>
                <span className="text-[#F6EBDD]">07:00 – 12:00 IST</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span>Café Classics (Afternoon)</span>
                <span className="text-[#F6EBDD]">12:00 – 17:00 IST</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span>Trend Lab (Evening)</span>
                <span className="text-[#F6EBDD]">17:00 – 23:00 IST</span>
              </div>
            </div>
          </div>

        </div>

        {/* Pre-Order Prompt */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#17100B] via-[#1F1710] to-[#17100B] border border-[#E8A24A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="font-display text-xl font-bold text-[#F6EBDD]">
              Avoid Counter Waits Today
            </h4>
            <p className="text-xs sm:text-sm text-[#BFAE9A]">
              Choose a 15-minute pickup slot and we guarantee your kulhad is steaming warm upon arrival.
            </p>
          </div>

          <Link to="/menu" className="flex-shrink-0">
            <AmberButton size="md">
              Order Ahead
            </AmberButton>
          </Link>
        </div>

      </main>

      <FooterV5 />
    </PageTransition>
  );
};
