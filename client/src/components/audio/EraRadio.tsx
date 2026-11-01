import React, { useEffect, useState } from 'react';
import { ExternalLink, Maximize2, Pause, Play, Sparkles } from 'lucide-react';
import { AudioPlayerState, radioAudio, YOUTUBE_PLAYLIST_URL } from '../../lib/radio-audio';
import { SaasTooltip } from './SaasTooltip';
import { SynchronizedLyrics } from './SynchronizedLyrics';
import { WalkmanDeck } from './WalkmanDeck';

interface EraRadioProps {
  eraMode: '1900s' | '2020s';
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

export const EraRadio: React.FC<EraRadioProps> = ({ eraMode, isPlayingAudio, onToggleAudio }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>(() => radioAudio.getState());

  useEffect(() => {
    radioAudio.initYouTube('chaiwala-yt-player');
    return radioAudio.subscribe((state) => {
      setAudioState(state);
    });
  }, []);

  return (
    <section id="radio" className="era-radio-strip-section" aria-labelledby="radio-strip-heading">
      {/* Persistent Invisible/Docked YouTube Anchor Container (Never removed from DOM) */}
      <div id="chaiwala-yt-anchor" className="chaiwala-yt-docked-anchor" aria-hidden="true">
        <div id="chaiwala-yt-player" />
      </div>

      <div className={`radio-strip-container ${audioState.theatreMode ? 'theatre-active' : ''}`} data-reveal>
        {eraMode === '1900s' ? (
          /* =========================================================================
             1900s ADDA: WALKMAN DECK + SYNCHRONIZED LYRICS + IMMERSIVE THEATRE
             ========================================================================= */
          <div className="radio-audiophile-stage">
            {/* Stage Header */}
            <div className="audiophile-stage-header">
              <div className="stage-eyebrow-row">
                <span className="section-number light">
                  <span>No. 03</span> Chaiwala Sound System
                </span>
                <span className="audiophile-badge">
                  <Sparkles size={12} className="text-[var(--accent)]" />
                  <span>Sunday Salon Barbershop Master</span>
                </span>
                <a
                  href={YOUTUBE_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="radio-yt-pill"
                  title="Open Sunday Salon Barbershop Playlist on YouTube"
                >
                  <ExternalLink size={12} />
                  <span>YouTube Master</span>
                </a>
              </div>

              <div className="stage-title-row">
                <h2 id="radio-strip-heading" className="radio-station-title">
                  The 1900s Walkman, <em>evergreen Bollywood.</em>
                </h2>
                <SaasTooltip label="Expand to Fullscreen Theatre" shortcut="T">
                  <button
                    type="button"
                    className="theatre-stage-trigger-btn"
                    onClick={() => radioAudio.toggleTheatreMode()}
                    aria-label="Toggle Theatre Mode"
                  >
                    <Maximize2 size={16} />
                    <span>Theatre Mode</span>
                  </button>
                </SaasTooltip>
              </div>
            </div>

            {/* Split Stage: Walkman Deck (Left) & Synchronized Lyrics (Right) */}
            <div className="audiophile-dual-grid">
              {/* Feature 2: Walkman Deck fades out when Theatre Mode is activated */}
              <div
                className={`walkman-deck-wrapper ${
                  audioState.theatreMode ? 'fade-out-theatre' : 'fade-in-theatre'
                }`}
              >
                <WalkmanDeck state={audioState} />
              </div>

              {/* Synchronized Lyrics (Expands in Theatre Mode) */}
              <div
                className={`lyrics-deck-wrapper ${
                  audioState.theatreMode ? 'expanded-theatre' : ''
                }`}
              >
                <SynchronizedLyrics
                  currentTrack={audioState.currentTrack}
                  currentTime={audioState.currentTime}
                  isTheatre={audioState.theatreMode}
                />
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             2020s CAFÉ: MODERN LO-FI AMBIENT RADIO
             ========================================================================= */
          <div className="radio-2020s-classic-grid">
            <div className={`radio-record ${isPlayingAudio ? 'spinning' : ''}`} aria-hidden="true">
              <img src="/images/matcha-latte.jpg" alt="" className="record-label-img" />
              <span className="record-spindle" />
            </div>

            <div className="radio-text-descriptors">
              <p className="section-number light">
                <span>No. 03</span> Chaiwala radio
              </p>
              <h2 id="radio-strip-heading" className="radio-station-title">
                Lo-fi pads, <em>warm Rhodes.</em>
              </h2>
              <p className="radio-track-title">
                A gentle ambient soundscape synthesized live in your browser. It only plays when you press play.
              </p>

              <div className="radio-audio-controls-cluster">
                <button
                  type="button"
                  className="radio-circular-play-btn"
                  onClick={onToggleAudio}
                  aria-label={isPlayingAudio ? 'Pause era radio' : 'Play era radio'}
                >
                  {isPlayingAudio ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                </button>
                <span className="radio-now-label">
                  {isPlayingAudio ? 'Now playing' : 'Press play'} · 2020s Café
                </span>
                <div
                  className={`radio-soundwave-bars ${isPlayingAudio ? 'active-pulse' : ''}`}
                  aria-hidden="true"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} className="eq-bar" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
