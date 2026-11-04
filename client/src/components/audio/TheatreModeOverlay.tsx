import React from 'react';
import { Minimize2, Music, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
import { AudioPlayerState, radioAudio } from '../../lib/radio-audio';
import { AudioSeekBar, formatSeconds } from './AudioSeekBar';
import { SaasTooltip } from './SaasTooltip';
import { SynchronizedLyrics } from './SynchronizedLyrics';

interface TheatreModeOverlayProps {
  state: AudioPlayerState;
}

export const TheatreModeOverlay: React.FC<TheatreModeOverlayProps> = ({ state }) => {
  if (!state.theatreMode) return null;

  const hasLyrics = state.currentTrack.lyrics && state.currentTrack.lyrics.length > 0;
  const is2020s = state.currentMode === '2020s';

  return (
    <div
      className="theatre-mode-viewport"
      role="dialog"
      aria-modal="true"
      aria-label="Chaiwala Cinema & Music Theatre"
    >
      {/* Darkened Cinematic Mesh Gradient Backdrop with Ambient Aura Diffusion */}
      <div
        className="theatre-cinematic-backdrop"
        style={{
          background: `
            radial-gradient(ellipse 90% 65% at 50% 38%, ${state.auraGlow} 0%, rgba(5, 4, 3, 0.94) 55%, #050403 100%),
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
          <span className="theatre-pill-tag">
            CHAIWALA THEATRE · {is2020s ? '2020s CAFÉ' : '1900s ADDA'}
          </span>
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

      {/* Main Focal Stage */}
      <main className="theatre-focal-stage">
        {hasLyrics ? (
          <div className="theatre-lyrics-stage">
            <SynchronizedLyrics
              currentTrack={state.currentTrack}
              currentTime={state.currentTime}
              isTheatre={true}
            />
          </div>
        ) : (
          <div className="theatre-ambient-stage">
            <div
              className={`theatre-spinning-disc ${state.isPlaying ? 'is-spinning' : ''}`}
              style={{
                boxShadow: `0 0 100px 20px ${state.auraGlow}`,
              }}
            >
              <img
                src="/images/matcha-latte.jpg"
                alt=""
                className="theatre-disc-art"
              />
              <span className="theatre-disc-spindle" />
            </div>

            <div className="theatre-track-meta-center">
              <span className="theatre-tag">
                <Music size={13} className="text-[var(--accent)]" />
                <span>2000s Café Vault Master</span>
              </span>
              <h2 className="theatre-big-title">{state.currentTrack.title}</h2>
              <p className="theatre-big-artist">
                {state.currentTrack.artist}
                {state.currentTrack.movie ? ` · ${state.currentTrack.movie}` : ''}
                {state.currentTrack.year ? ` (${state.currentTrack.year})` : ''}
              </p>

              {/* Scrubber inside Theatre Mode */}
              <div className="theatre-seek-container">
                <AudioSeekBar
                  currentTime={state.currentTime}
                  duration={state.duration}
                  onSeek={(sec) => radioAudio.seekTo(sec)}
                  accentColor={state.auraColor}
                  size="lg"
                />
              </div>

              {/* Transport controls in Theatre Mode */}
              <div className="theatre-transport-cluster">
                <button
                  type="button"
                  className="theatre-ctrl-btn"
                  onClick={() => radioAudio.prevTrack()}
                  aria-label="Previous track"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  type="button"
                  className="theatre-play-btn"
                  onClick={() => radioAudio.toggle()}
                  aria-label={state.isPlaying ? 'Pause' : 'Play'}
                  style={{ backgroundColor: state.auraColor }}
                >
                  {state.isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
                <button
                  type="button"
                  className="theatre-ctrl-btn"
                  onClick={() => radioAudio.nextTrack()}
                  aria-label="Next track"
                >
                  <SkipForward size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
