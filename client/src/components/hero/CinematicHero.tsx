import React from 'react';
import { ArrowDown, ArrowRight, Pause, Play } from 'lucide-react';
import { EraSwitcher } from './EraSwitcher';

interface CinematicHeroProps {
  eraMode: '1900s' | '2020s';
  onSwitchEra: (mode: '1900s' | '2020s') => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

const COPY = {
  '1900s': {
    chapter: 'Chapter I · The 1900s',
    title: ['The original', 'adda.'],
    sub: 'Slow-simmered chai, poured for long conversations.',
    body: 'Step into the era where friendships brewed slowly, and a simple glass of chai brought a whole street together.',
    facts: ['Assam CTC, hand-ground spice', 'Brewed over a slow flame', 'Kulhad or cutting glass'],
    genre: 'Evergreen Bollywood Classics',
  },
  '2020s': {
    chapter: 'Chapter II · The 2020s',
    title: ['The modern', 'café.'],
    sub: 'Modern sips, the same old adda.',
    body: 'A contemporary chai counter for a new generation — classic comfort meets matcha, cold brew and mindful pauses.',
    facts: ['Ceremonial Uji matcha', 'Boba, cold brew & lemon tea', 'Pickup in 15-minute windows'],
    genre: 'Lo-fi & warm Rhodes',
  },
} as const;

export const CinematicHero: React.FC<CinematicHeroProps> = ({ eraMode, onSwitchEra, isPlayingAudio, onToggleAudio }) => {
  const copy = COPY[eraMode];

  return (
    <section className="cinematic-hero-section" aria-labelledby="hero-display-heading">
      <div className="hero-photographic-stage" aria-hidden="true">
        <img
          src="/images/campaign/hero-1900s-scene.jpg"
          alt=""
          className={`hero-photo-layer ${eraMode === '1900s' ? 'visible' : ''}`}
        />
        <img
          src="/images/campaign/hero-2020s-scene.jpg"
          alt=""
          className={`hero-photo-layer ${eraMode === '2020s' ? 'visible' : ''}`}
        />
        <div className="hero-atmosphere-gradient" />
        <div className="grain" />
      </div>

      <div className="hero-inner-container">
        {/* Keyed by era so the copy re-runs its entrance when the era changes */}
        <div className="hero-text-column" key={eraMode}>
          <p className="hero-eyebrow-tag">
            <span className="eyebrow-rule" aria-hidden="true" />
            {copy.chapter}
          </p>

          <h1 id="hero-display-heading" className="hero-headline">
            {copy.title[0]} <em>{copy.title[1]}</em>
          </h1>
          <p className="hero-subheadline">{copy.sub}</p>
          <p className="hero-narrative-copy">{copy.body}</p>

          <div className="hero-actions-cluster">
            <a
              href="#menu"
              className="hero-primary-cta"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore the menu</span>
              <ArrowRight size={16} />
            </a>

            <button
              type="button"
              className="hero-radio-cta"
              onClick={onToggleAudio}
              aria-label={isPlayingAudio ? 'Pause era radio' : 'Play era radio'}
            >
              <span className={`radio-pill-circle ${isPlayingAudio ? 'playing' : ''}`}>
                {isPlayingAudio ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
              </span>
              <span className="radio-pill-meta">
                <span className="radio-pill-title">{isPlayingAudio ? 'Now playing' : 'Era radio'}</span>
                <span className="radio-pill-genre">{copy.genre}</span>
              </span>
            </button>
          </div>
        </div>

        <div className="hero-controls-column">
          <EraSwitcher eraMode={eraMode} onSwitchEra={onSwitchEra} />
        </div>
      </div>

      <div className="hero-footer-strip">
        <ul className="hero-badges-strip" aria-label="What makes this era">
          {copy.facts.map((fact) => (
            <li key={fact} className="badge-unit">
              {fact}
            </li>
          ))}
        </ul>
        <a href="#menu" className="hero-scroll-cue">
          <span>Scroll</span>
          <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
};
