import React from 'react';

interface BrandStoryProps {
  eraMode: '1900s' | '2020s';
}

const STORY = {
  '1900s': {
    quote: ['Chai was never just a drink.', 'It was the reason to stay.'],
    pillars: [
      { title: 'Authentic recipes', text: 'Timeless blends of whole spice, fresh ginger and slow brewing — nothing rushed, nothing skipped.' },
      { title: 'Rooted in history', text: 'The glass that fuelled conversations, movements and friendships across generations.' },
      { title: 'The adda spirit', text: 'An open wooden bench, a shared pause, and a counter where everyone belongs.' },
    ],
  },
  '2020s': {
    quote: ['New flavours, same ritual.', 'Pause, sip, talk.'],
    pillars: [
      { title: 'Contemporary flavour', text: 'Modern craft meets mindful ingredients — ceremonial Uji matcha, cold brew and brown-sugar pearls.' },
      { title: 'Café culture', text: 'A sunlit corner for collaborative work, creative ideas and restorative pauses.' },
      { title: 'Made for your moment', text: "Prepared fresh for today's fast, intentional life without losing the soul of the old counter." },
    ],
  },
} as const;

const NUMERALS = ['i', 'ii', 'iii'];

export const BrandStory: React.FC<BrandStoryProps> = ({ eraMode }) => {
  const story = STORY[eraMode];

  return (
    <section id="story" className="brand-story-section" aria-labelledby="brand-story-title">
      <header className="section-head" data-reveal>
        <p className="section-number">
          <span>No. 02</span> Philosophy
        </p>
      </header>

      <h2 id="brand-story-title" className="story-quote" data-reveal>
        {story.quote[0]} <em>{story.quote[1]}</em>
      </h2>

      <div className="story-three-grid">
        {story.pillars.map((pillar, i) => (
          <div className="story-cell" key={pillar.title} data-reveal>
            <span className="story-cell-numeral" aria-hidden="true">
              {NUMERALS[i]}.
            </span>
            <h3 className="story-cell-heading">{pillar.title}</h3>
            <p className="story-cell-text">{pillar.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
