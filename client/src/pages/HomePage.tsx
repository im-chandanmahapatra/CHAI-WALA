import React from 'react';
import { HeroV5 } from '../components/sections/HeroV5';
import { MarqueeSection } from '../components/sections/MarqueeSection';
import { CinematicBrewingStory } from '../components/story/CinematicBrewingStory';
import { BentoMenuGrid } from '../components/sections/BentoMenuGrid';
import { MoodsEditorial } from '../components/sections/MoodsEditorial';
import { CraftTimeline } from '../components/sections/CraftTimeline';
import { GalleryHorizontal } from '../components/sections/GalleryHorizontal';
import { TestimonialsMarquee } from '../components/sections/TestimonialsMarquee';
import { CTABand } from '../components/sections/CTABand';
import { FooterV5 } from '../components/layout/FooterV5';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0E0A07] text-[#F6EBDD] flex flex-col selection:bg-[#E8A24A] selection:text-[#0E0A07]">
      <main className="flex-1 space-y-0">
        {/* Full-Viewport Hero with 3D Kulhad Scene */}
        <HeroV5 />

        {/* Endless Ingredient Marquee Strip */}
        <MarqueeSection />

        {/* Scroll-Driven 10s Tea Brewing Canvas Story */}
        <div id="brewing-story">
          <CinematicBrewingStory />
        </div>

        {/* Asymmetric 12-Column Signature Bento Grid */}
        <BentoMenuGrid />

        {/* Three Curated Atmospheric Flights Editorial */}
        <MoodsEditorial />

        {/* Craft Process Numbered Vertical Timeline */}
        <CraftTimeline />

        {/* Horizontal Experience Photo Gallery */}
        <GalleryHorizontal />

        {/* Dual-Direction Patron Testimonials Marquee */}
        <TestimonialsMarquee />

        {/* Conversion CTA Band */}
        <CTABand />
      </main>

      {/* Giant Architectural Wordmark Footer */}
      <FooterV5 />
    </div>
  );
};
