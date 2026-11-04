import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ExternalLink,
  ListMusic,
  Loader2,
  Maximize2,
  Music,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AudioPlayerState, EraMode, radioAudio, YOUTUBE_PLAYLIST_URL } from '../../lib/radio-audio';
import { AudioSeekBar, formatSeconds } from './AudioSeekBar';
import { SaasTooltip } from './SaasTooltip';
import { SynchronizedLyrics } from './SynchronizedLyrics';
import { WalkmanDeck } from './WalkmanDeck';

interface EraRadioProps {
  eraMode?: EraMode;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  isSpotifyListening?: boolean;
  onSpotifyInteraction?: () => void;
}

export const EraRadio: React.FC<EraRadioProps> = ({
  eraMode = '2020s',
  isPlayingAudio,
  onToggleAudio,
}) => {
  const [state, setState] = useState<AudioPlayerState>(() => radioAudio.getState());
  const [playlistDrawerOpen, setPlaylistDrawerOpen] = useState(false);

  useEffect(() => {
    return radioAudio.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  // Ensure radio engine knows the active era
  useEffect(() => {
    if (state.currentMode !== eraMode) {
      radioAudio.setMode(eraMode, false);
    }
  }, [eraMode, state.currentMode]);

  const currentTrack = state.currentTrack;
  const is2020s = eraMode === '2020s';

  return (
    <section id="radio" className="era-radio-strip-section" aria-labelledby="radio-strip-heading">
      <div
        className={`radio-strip-container ${state.theatreMode ? 'theatre-active' : ''} era-${eraMode}`}
        data-reveal
      >
        {!is2020s ? (
          /* =========================================================================
             1900s ADDA: WALKMAN CASSETTE DECK + SYNCHRONIZED EVERGREEN LYRICS
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
                  <span>Master Tape</span>
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
              <div
                className={`walkman-deck-wrapper ${
                  state.theatreMode ? 'fade-out-theatre' : 'fade-in-theatre'
                }`}
              >
                <WalkmanDeck state={state} />
              </div>

              <div
                className={`lyrics-deck-wrapper ${
                  state.theatreMode ? 'expanded-theatre' : ''
                }`}
              >
                <SynchronizedLyrics
                  currentTrack={state.currentTrack}
                  currentTime={state.currentTime}
                  isTheatre={state.theatreMode}
                />
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             2020s CAFÉ: FULL NATIVE LOCAL MUSIC PLAYER (35 TRACKS FROM 2000's VAULT)
             ========================================================================= */
          <div className="radio-2020s-classic-grid">
            {/* Left Column: Rotating Vinyl Record & Live EQ Pulse */}
            <div className="radio-stage-visual-col">
              <div
                className={`radio-record ${state.isPlaying ? 'spinning' : ''}`}
                style={{
                  boxShadow: state.isPlaying
                    ? `0 35px 80px -25px ${state.auraGlow}, 0 0 45px -5px ${state.auraColor}`
                    : undefined,
                }}
                aria-hidden="true"
              >
                <img
                  src="/images/matcha-latte.jpg"
                  alt=""
                  className="record-label-img"
                />
                <span className="record-spindle" />
              </div>

              {/* Soundwave EQ bars beneath the disc */}
              <div
                className={`radio-soundwave-bars ${state.isPlaying ? 'active-pulse' : ''}`}
                aria-label={state.isPlaying ? 'Audio visualizer active' : 'Audio visualizer idle'}
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <span
                    key={i}
                    className="eq-bar"
                    style={{
                      backgroundColor: state.auraColor,
                      animationDelay: `${(i % 5) * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Radio Metadata, Track Info & Full Controls */}
            <div className="radio-text-descriptors cafe-player-deck">
              <div className="radio-eyebrow-container">
                <p className="section-number light">
                  <span>No. 03</span> Chaiwala radio
                </p>
                <span className="cafe-vault-badge">
                  <Music size={11} aria-hidden="true" />
                  <span>35 Master Tracks · Local Vault</span>
                </span>
              </div>

              <h2 id="radio-strip-heading" className="radio-station-title">
                2000s Café, <em>evergreen acoustic library.</em>
              </h2>

              <p className="radio-track-title">
                A hand-curated library of 35 warm acoustic melodies, golden-era classics, and lo-fi textures streaming directly from our café vault. It only plays when you press play.
              </p>

              {/* Now Playing Focal Box */}
              <div
                className="cafe-track-stage-card"
                style={{
                  borderLeftColor: state.auraColor,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(20,18,16,0.6) 100%)`,
                }}
              >
                <div className="cafe-track-card-header">
                  <span className="cafe-track-pill">
                    Track {(state.currentTrackIndex + 1).toString().padStart(2, '0')} of {state.playlist.length}
                  </span>
                  {currentTrack.identificationStatus === 'identified' && (
                    <span className="cafe-verified-badge" title="Verified Track Metadata">
                      <Sparkles size={11} />
                      <span>Verified Master</span>
                    </span>
                  )}
                </div>

                <div className="cafe-track-body">
                  <h3 className="cafe-now-playing-title" title={currentTrack.title}>
                    {currentTrack.title}
                  </h3>
                  <p className="cafe-now-playing-artist">
                    {currentTrack.artist}
                    {currentTrack.movie ? ` · ${currentTrack.movie}` : ''}
                    {currentTrack.year ? ` (${currentTrack.year})` : ''}
                  </p>
                </div>

                {/* Loading / Buffering indicator */}
                {state.isLoading && (
                  <div className="cafe-loading-banner" role="status">
                    <Loader2 size={13} className="animate-spin text-[var(--accent)]" />
                    <span>Buffering high-fidelity audio stream…</span>
                  </div>
                )}

                {/* Error Banner with Retry */}
                {state.loadError && (
                  <div className="cafe-error-banner" role="alert">
                    <AlertCircle size={14} className="text-red-400" />
                    <span>{state.loadError}</span>
                    <button
                      type="button"
                      className="cafe-retry-btn"
                      onClick={() => radioAudio.playTrack(state.currentTrackIndex)}
                    >
                      <RotateCcw size={12} />
                      <span>Retry</span>
                    </button>
                  </div>
                )}

                {/* CRITICAL REQUIREMENT: Working, Draggable Scrubber / Seek Bar */}
                <div className="cafe-scrubber-wrapper">
                  <AudioSeekBar
                    currentTime={state.currentTime}
                    duration={state.duration}
                    onSeek={(sec) => radioAudio.seekTo(sec)}
                    accentColor={state.auraColor}
                    size="md"
                    disabled={!!state.loadError}
                  />
                </div>

                {/* Player Transport Controls Cluster */}
                <div className="cafe-transport-row">
                  <div className="cafe-transport-left">
                    <SaasTooltip label="Previous Track" shortcut="Alt+←">
                      <button
                        type="button"
                        className="cafe-control-btn secondary"
                        onClick={() => radioAudio.prevTrack()}
                        aria-label="Previous track"
                      >
                        <SkipBack size={18} />
                      </button>
                    </SaasTooltip>

                    <button
                      type="button"
                      className={`radio-circular-play-btn ${state.isPlaying ? 'is-playing' : ''}`}
                      onClick={onToggleAudio}
                      aria-label={state.isPlaying ? 'Pause 2000s Café Radio' : 'Play 2000s Café Radio'}
                      style={{
                        backgroundColor: state.auraColor,
                        boxShadow: state.isPlaying ? `0 0 25px 4px ${state.auraGlow}` : undefined,
                      }}
                    >
                      {state.isPlaying ? (
                        <Pause size={24} />
                      ) : (
                        <Play size={24} fill="currentColor" className="ml-1" />
                      )}
                    </button>

                    <SaasTooltip label="Next Track" shortcut="Alt+→">
                      <button
                        type="button"
                        className="cafe-control-btn secondary"
                        onClick={() => radioAudio.nextTrack()}
                        aria-label="Next track"
                      >
                        <SkipForward size={18} />
                      </button>
                    </SaasTooltip>
                  </div>

                  <div className="cafe-transport-right">
                    <SaasTooltip label={state.isMuted ? 'Unmute' : 'Mute'} shortcut="M">
                      <button
                        type="button"
                        className="cafe-action-pill-btn"
                        onClick={() => radioAudio.toggleMute()}
                        aria-label={state.isMuted ? 'Unmute sound' : 'Mute sound'}
                      >
                        {state.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                    </SaasTooltip>

                    <SaasTooltip label="View all 35 tracks">
                      <button
                        type="button"
                        className={`cafe-action-pill-btn drawer-toggle ${
                          playlistDrawerOpen ? 'is-open' : ''
                        }`}
                        onClick={() => setPlaylistDrawerOpen(!playlistDrawerOpen)}
                        aria-label="Toggle tracklist drawer"
                      >
                        <ListMusic size={15} />
                        <span className="drawer-btn-label">
                          {state.playlist.length} Tracks
                        </span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            playlistDrawerOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </SaasTooltip>

                    <SaasTooltip label="Theatre Mode" shortcut="T">
                      <button
                        type="button"
                        className="cafe-action-pill-btn"
                        onClick={() => radioAudio.toggleTheatreMode()}
                        aria-label="Enter Theatre Mode"
                      >
                        <Maximize2 size={15} />
                      </button>
                    </SaasTooltip>
                  </div>
                </div>
              </div>

              {/* Collapsible Playlist Drawer (35 Tracks) */}
              {playlistDrawerOpen && (
                <div
                  className="cafe-playlist-drawer-box"
                  role="region"
                  aria-label="2000s Café Tracklist"
                >
                  <div className="cafe-drawer-header">
                    <span className="drawer-heading">Café Vault · 2000s Library</span>
                    <span className="drawer-subtitle">
                      {state.playlist.length} Tracks · Unhurried Listening
                    </span>
                  </div>

                  <div className="cafe-drawer-track-list">
                    {state.playlist.map((track, idx) => {
                      const isCurrent = idx === state.currentTrackIndex;
                      return (
                        <div
                          key={track.id}
                          className={`cafe-drawer-row ${isCurrent ? 'is-active' : ''}`}
                          onClick={() => radioAudio.playTrack(idx)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Play track ${idx + 1}: ${track.title} by ${track.artist}`}
                        >
                          <span className="row-track-num">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <div className="row-track-details">
                            <span className="row-track-title">{track.title}</span>
                            <span className="row-track-meta">
                              {track.artist}
                              {track.movie ? ` · ${track.movie}` : ''}
                            </span>
                          </div>
                          <span
                            className="row-aura-pill"
                            style={{ backgroundColor: track.auraColor }}
                            aria-hidden="true"
                          />
                          <span className="row-track-dur">
                            {formatSeconds(track.durationSeconds)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
