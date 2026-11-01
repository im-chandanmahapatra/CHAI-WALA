import React from 'react';
import { Minimize2, X } from 'lucide-react';
import { AudioPlayerState, radioAudio } from '../../lib/radio-audio';
import { SaasTooltip } from './SaasTooltip';
import { SynchronizedLyrics } from './SynchronizedLyrics';

interface TheatreModeOverlayProps {
  state: AudioPlayerState;
}

export const TheatreModeOverlay: React.FC<TheatreModeOverlayProps> = ({ state }) => {
  if (!state.theatreMode) return null;

  return (
    <div
      className="theatre-mode-viewport"
      role="dialog"
      aria-modal="true"
      aria-label="Chaiwala Cinema & Lyrics Theatre"
    >
      {/* Darkened Cinematic Mesh Gradient Backdrop with Ambient Aura Diffusion */}
      <div
        className="theatre-cinematic-backdrop"
        style={{
          background: `
            radial-gradient(ellipse 90% 65% at 50% 38%, ${state.auraGlow} 0%, rgba(5, 4, 3, 0.92) 55%, #050403 100%),
            radial-gradient(circle at 18% 75%, rgba(229, 142, 38, 0.12), transparent 45%),
            #050403
          `,
        }}
      >
        <div className="theatre-noise-layer" />
      </div>

      {/* Top Header Controls */}
      <header className="theatre-top-bar">
        <div className="theatre-header-meta">
          <span className="theatre-pill-tag">CHAIWALA THEATRE · 1900s ADDA</span>
          <span className="theatre-track-sub">
            {state.currentTrack.title} — {state.currentTrack.artist}
          </span>
        </div>

        <div className="theatre-header-actions">
          <SaasTooltip label="Exit Theatre Mode" shortcut="Esc">
            <button
              type="button"
              className="theatre-close-btn"
              onClick={() => radioAudio.setTheatreMode(false)}
              aria-label="Exit Theatre Mode"
            >
              <Minimize2 size={16} />
              <span className="close-text">Exit Theatre</span>
              <X size={15} />
            </button>
          </SaasTooltip>
        </div>
      </header>

      {/* Main Focal Stage: Expanded Synchronized Lyrics */}
      <main className="theatre-focal-stage">
        <div className="theatre-lyrics-stage">
          <SynchronizedLyrics
            currentTrack={state.currentTrack}
            currentTime={state.currentTime}
            isTheatre={true}
          />
        </div>
      </main>
    </div>
  );
};

