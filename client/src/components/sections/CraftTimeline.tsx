import React from 'react';
import { GlassPill } from '../ui/GlassPill';
import { Sparkles } from 'lucide-react';

export const CraftTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Single-Estate Assam CTC Selection',
      hindi: 'पत्ती चयन',
      badge: 'Brahmaputra Valley Grade 1',
      desc: 'Sourced exclusively during the second flush from organic tea gardens along the Brahmaputra River. Small, dense granules deliver bold malty body without harsh astringency.',
    },
    {
      num: '02',
      title: 'Mortar Stone Pestle Crushing',
      hindi: 'मूसल कुटाई',
      badge: 'Zero Electrical Blending',
      desc: 'Raw ginger roots bruised under granite pestles to burst cellular walls, immediately combined with bruised green cardamom pods and Indonesian cinnamon bark.',
    },
    {
      num: '03',
      title: 'Low-Flame Brass Samovar Decoction',
      hindi: 'धीमी आंच उबाल',
      badge: 'Strict 14-Minute Simmer',
      desc: 'Boiled gently in hand-hammered unlined brass vessels with full-fat A2 buffalo milk and raw sulphurless sugarcane jaggery until the golden ring of emulsion forms.',
    },
    {
      num: '04',
      title: 'Aerial Meter Aeration & Kulhad Pour',
      hindi: 'कुल्हड़ सेवा',
      badge: 'Unglazed Red Clay Vessels',
      desc: 'Aerated with a three-foot meter cascade through natural unbleached muslin, cooling the liquid to exact 78°C drinking temperature as it kisses the porous clay.',
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0E0A07] text-[#F6EBDD] overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-4 mb-20">
          <GlassPill variant="amber" icon={<Sparkles className="w-3.5 h-3.5" />}>
            The Four Foundations
          </GlassPill>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#F6EBDD] tracking-tight">
            How True Chai is Born.
          </h2>
          <p className="text-sm sm:text-base text-[#BFAE9A] max-w-xl font-body">
            No machine-dispensed powder. No high-fructose syrups. An uncompromising 14-minute manual decoction.
          </p>
        </div>

        {/* Vertical Timeline with Connecting Line */}
        <div className="relative">
          {/* Vertical subtle amber line */}
          <div className="absolute left-6 sm:left-12 top-6 bottom-6 w-[1.5px] bg-gradient-to-b from-[#E8A24A] via-[#E8A24A]/40 to-transparent" />

          <div className="space-y-16 sm:space-y-24">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-8 sm:gap-16 group">
                
                {/* Step Circle & Number */}
                <div className="relative z-10 flex-shrink-0 w-12 sm:w-24 h-12 sm:h-24 rounded-2xl bg-[#17100B] border border-white/[0.12] group-hover:border-[#E8A24A]/60 transition-colors flex items-center justify-center shadow-lg">
                  <span className="font-display font-black text-xl sm:text-4xl text-[#E8A24A]">
                    {step.num}
                  </span>
                </div>

                {/* Content Block */}
                <div className="space-y-3 pt-1 sm:pt-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#FFC875] px-2.5 py-1 rounded-full bg-[#E8A24A]/10 border border-[#E8A24A]/20">
                      {step.badge}
                    </span>
                    <span className="font-devanagari text-xs text-[#7E6F60]">
                      ({step.hindi})
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-3xl font-bold text-[#F6EBDD] group-hover:text-[#E8A24A] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#BFAE9A] leading-relaxed max-w-2xl">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
