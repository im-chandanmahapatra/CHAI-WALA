import React, { useEffect, useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AudioPlayerState, radioAudio } from '../../lib/radio-audio';
import { SaasTooltip } from './SaasTooltip';

const formatSeconds = (sec: number) => {
  if (isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const DynamicIslandPlayer: React.FC = () => {
  const [state, setState] = useState<AudioPlayerState>(() => radioAudio.getState());

  useEffect(() => {
    return radioAudio.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  // Relative time within the current track
  const trackElapsed = Math.max(0, state.currentTime - state.currentTrack.startSeconds);
  const trackProgressPercent = Math.min(
    100,
    Math.max(0, (trackElapsed / (state.currentTrack.durationSeconds || 1)) * 100)
  );

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const targetSecond =
      state.currentTrack.startSeconds + clickRatio * state.currentTrack.durationSeconds;
    radioAudio.seekTo(targetSecond);
  };

  return (
    <div
      className={`dynamic-island-root ${state.theatreMode ? 'in-theatre' : ''}`}
      aria-label="Chaiwala Master Sound Console"
    >
      {/* FEATURE 3: Ambient Aura Extraction (Apple Music Style, 1.5s ease crossfade) */}
      <div
        className="dynamic-island-aura"
        style={{
          background: `radial-gradient(ellipse at center, ${state.auraGlow} 0%, rgba(0,0,0,0) 72%)`,
          boxShadow: `0 0 70px 10px ${state.auraGlow}`,
        }}
        aria-hidden="true"
      />

      {/* The Dynamic Island Pill */}
      <div className="dynamic-island-pill">
        {/* Left Segment: Live Visualizer & Track Metadata */}
        <div className="island-meta-segment">
          {/* FEATURE 1: Dynamic Live Visualizer (The 'Real' Factor) */}
          <div
            className={`dynamic-live-visualizer ${state.isPlaying ? 'is-playing' : 'is-paused'}`}
            title={state.isPlaying ? 'Audio Frequency EQ: Active' : 'Audio Frequency EQ: Paused'}
            aria-label="Frequency visualizer"
          >
            <span className="eq-bar bar-1" />
            <span className="eq-bar bar-2" />
            <span className="eq-bar bar-3" />
            <span className="eq-bar bar-4" />
          </div>

          <div
            className="island-track-chip"
            onClick={() => radioAudio.toggleTheatreMode()}
            role="button"
            tabIndex={0}
            title="Click to toggle Theatre Mode"
          >
            <span className="island-track-title">{state.currentTrack.title}</span>
            <span className="island-track-artist">
              {state.currentTrack.artist}
              {state.currentTrack.movie ? ` · ${state.currentTrack.movie}` : ''}
            </span>
          </div>
        </div>

        {/* Center Segment: Transport Controls with FEATURE 4 SaaS-Grade Tooltips */}
        <div className="island-transport-segment">
          <SaasTooltip label="Previous Track" shortcut="Alt+←">
            <button
              type="button"
              className="transport-btn secondary"
              onClick={() => radioAudio.prevTrack()}
              aria-label="Previous track"
            >
              <SkipBack size={15} />
            </button>
          </SaasTooltip>

          <SaasTooltip
            label={state.isPlaying ? 'Pause' : 'Play'}
            shortcut="Spacebar"
          >
            <button
              type="button"
              className={`transport-btn primary ${state.isPlaying ? 'is-playing' : ''}`}
              onClick={() => radioAudio.toggle()}
              aria-label={state.isPlaying ? 'Pause playback' : 'Start playback'}
            >
              {state.isPlaying ? (
                <Pause size={17} />
              ) : (
                <Play size={17} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </SaasTooltip>

          <SaasTooltip label="Next Track" shortcut="Alt+→">
            <button
              type="button"
              className="transport-btn secondary"
              onClick={() => radioAudio.nextTrack()}
              aria-label="Next track"
            >
              <SkipForward size={15} />
            </button>
          </SaasTooltip>
        </div>

        {/* Right Segment: Time, Mute & FEATURE 2 Minimalist Theatre Mode Toggle */}
        <div className="island-action-segment">
          <div className="island-time-display" aria-label="Track time">
            <span className="time-current">{formatSeconds(trackElapsed)}</span>
            <span className="time-sep">/</span>
            <span className="time-total">{formatSeconds(state.currentTrack.durationSeconds)}</span>
          </div>

          <SaasTooltip label={state.isMuted ? 'Unmute' : 'Mute'} shortcut="M">
            <button
              type="button"
              className="island-action-btn"
              onClick={() => radioAudio.toggleMute()}
              aria-label={state.isMuted ? 'Unmute sound' : 'Mute sound'}
            >
              {state.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </SaasTooltip>

          {/* Minimalist Theatre Mode Toggle Icon with spring tooltip */}
          <SaasTooltip
            label={state.theatreMode ? 'Exit Theatre' : 'Theatre Mode'}
            shortcut="T"
          >
            <button
              type="button"
              className={`island-action-btn theatre-toggle-btn ${
                state.theatreMode ? 'is-active' : ''
              }`}
              onClick={() => radioAudio.toggleTheatreMode()}
              aria-label={state.theatreMode ? 'Exit Theatre Mode' : 'Enter Theatre Mode'}
            >
              {state.theatreMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </SaasTooltip>
        </div>

        {/* Micro-Progress Bar along the bottom of the Dynamic Island */}
        <div
          className="island-progress-track"
          onClick={handleSeek}
          role="slider"
          aria-label="Seek track position"
          aria-valuenow={Math.round(trackProgressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="island-progress-bar"
            style={{
              width: `${trackProgressPercent}%`,
              backgroundColor: state.auraColor,
            }}
          />
        </div>
      </div>
    </div>
  );
};

