import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { AmberButton } from '../ui/AmberButton';
import { MagneticButton } from '../motion/MagneticButton';
import { GlassPill } from '../ui/GlassPill';

export const CTABand: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 bg-[#0E0A07] text-[#F6EBDD] overflow-hidden border-t border-white/[0.06] text-center">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#E8A24A]/12 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <GlassPill variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
          Hot Counter Guarantee
        </GlassPill>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-[#F6EBDD] tracking-tight leading-[0.98]">
          Ready to Sip?
        </h2>

        <p className="text-base sm:text-lg text-[#BFAE9A] max-w-xl mx-auto font-body leading-relaxed">
          Your decoction is timed specifically to your 15-minute slot. Never reheated, never rushed, poured bubbling hot as you reach Counter #01.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#F6EBDD]/90">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <Clock className="w-3.5 h-3.5 text-[#E8A24A]" />
            <span>15-Minute Windows</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E8A24A]" />
            <span>Zero Queue Stagnation</span>
          </div>
        </div>

        {/* Big Magnetic CTA */}
        <div className="pt-4 flex justify-center">
          <MagneticButton pullStrength={0.4}>
            <Link to="/menu">
              <AmberButton size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Reserve Your Cup & Order Ahead
              </AmberButton>
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
