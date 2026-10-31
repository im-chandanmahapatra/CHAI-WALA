import React from 'react';
import { GlassPill } from '../ui/GlassPill';
import { Quote, Sparkles, Star } from 'lucide-react';
import clsx from 'clsx';

export const TestimonialsMarquee: React.FC = () => {
  const reviewsRow1 = [
    {
      name: 'Aarav Mehta',
      role: 'Architect & Regular',
      text: 'The Kadak Masala in the clay kulhad is the real deal. No powdered syrups, genuine hand-bruised ginger that hits the throat just right.',
      slot: 'Morning Adda · 08:30 AM',
    },
    {
      name: 'Pooja Venkatesh',
      role: 'Design Director',
      text: 'Reserving the 15-minute pickup slot means my cutting chai is steaming hot the exact second I reach Counter 01. Never standing in line again.',
      slot: 'Café Classics · 01:15 PM',
    },
    {
      name: 'Kabir Sen',
      role: 'Writer',
      text: 'The Bun Maska toasted just to crispness with cold salted Amul butter dipped into piping hot cardamom chai. A religious morning ritual.',
      slot: 'Classic Adda · 07:45 AM',
    },
  ];

  const reviewsRow2 = [
    {
      name: 'Dr. Sunita Rao',
      role: 'Professor',
      text: 'The Filter Kaapi foam head stays thick and golden until the last drop. Reminds me of traditional Mylapore filter coffee decoctions.',
      slot: 'Café Classics · 03:00 PM',
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Sound Engineer',
      text: 'The acoustic atmosphere, warm espresso wood, and absence of espresso machine shriek make this my favourite sanctuary in the city.',
      slot: 'Trend Lab · 06:30 PM',
    },
    {
      name: 'Ananya Sharma',
      role: 'Culinary Journalist',
      text: 'The unglazed clay kulhad brings a rich earthy petrichor mineral quality to the tea that glass or paper simply cannot deliver.',
      slot: 'Classic Adda · 10:00 AM',
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0E0A07] text-[#F6EBDD] overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center space-y-3">
        <GlassPill variant="amber" icon={<Quote className="w-3.5 h-3.5" />}>
          Patron Chronicles
        </GlassPill>
        <h2 className="font-display text-3xl sm:text-5xl font-black text-[#F6EBDD] tracking-tight">
          Voices From the Counter.
        </h2>
        <p className="text-sm sm:text-base text-[#BFAE9A] max-w-lg mx-auto font-body">
          What our daily community of morning risers and evening conversationalists say.
        </p>
      </div>

      {/* Row 1 - Leftward Marquee */}
      <div className="w-full overflow-hidden py-3 select-none">
        <div className="flex gap-6 animate-marquee w-max" style={{ animationDuration: '38s' }}>
          {[...reviewsRow1, ...reviewsRow1, ...reviewsRow1].map((rev, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] rounded-2xl bg-[#17100B] border border-white/[0.08] p-6 space-y-4 hover:border-[#E8A24A]/40 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center gap-1 text-[#E8A24A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#F6EBDD]/90 leading-relaxed font-body italic">
                "{rev.text}"
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                <div>
                  <span className="font-bold text-[#F6EBDD] block">{rev.name}</span>
                  <span className="text-[10px] text-[#7E6F60]">{rev.role}</span>
                </div>
                <span className="text-[10px] font-mono text-[#E8A24A] bg-[#E8A24A]/10 px-2 py-0.5 rounded-full">
                  {rev.slot}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Rightward Reverse Marquee */}
      <div className="w-full overflow-hidden py-3 select-none">
        <div className="flex gap-6 animate-marquee-reverse w-max" style={{ animationDuration: '44s' }}>
          {[...reviewsRow2, ...reviewsRow2, ...reviewsRow2].map((rev, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] rounded-2xl bg-[#17100B] border border-white/[0.08] p-6 space-y-4 hover:border-[#E8A24A]/40 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center gap-1 text-[#E8A24A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#F6EBDD]/90 leading-relaxed font-body italic">
                "{rev.text}"
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                <div>
                  <span className="font-bold text-[#F6EBDD] block">{rev.name}</span>
                  <span className="text-[10px] text-[#7E6F60]">{rev.role}</span>
                </div>
                <span className="text-[10px] font-mono text-[#FFC875] bg-white/[0.05] px-2 py-0.5 rounded-full">
                  {rev.slot}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
