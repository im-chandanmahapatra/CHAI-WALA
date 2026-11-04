import React, { useEffect, useRef, useState } from 'react';
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
import { formatSeconds } from './AudioSeekBar';
import { SaasTooltip } from './SaasTooltip';

export const DynamicIslandPlayer: React.FC = () => {
  const [state, setState] = useState<AudioPlayerState>(() => radioAudio.getState());
  const [isDragging, setIsDragging] = useState(false);
  const [dragSeconds, setDragSeconds] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return radioAudio.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  const safeDuration = Math.max(1, state.duration || state.currentTrack.durationSeconds || 1);
  const activeSeconds = isDragging ? dragSeconds : state.currentTime;
  const trackProgressPercent = Math.min(
    100,
    Math.max(0, (activeSeconds / safeDuration) * 100)
  );

  const calculateSecondsFromClientX = (clientX: number): number => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * safeDuration;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const sec = calculateSecondsFromClientX(e.clientX);
    setIsDragging(true);
    setDragSeconds(sec);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const sec = calculateSecondsFromClientX(e.clientX);
      setDragSeconds(sec);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const sec = calculateSecondsFromClientX(e.clientX);
      radioAudio.seekTo(sec);
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      radioAudio.seekTo(Math.min(safeDuration, state.currentTime + 5));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      radioAudio.seekTo(Math.max(0, state.currentTime - 5));
    }
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
          {/* Live Visualizer */}
          <div
            className={`dynamic-live-visualizer ${state.isPlaying ? 'is-playing' : 'is-paused'}`}
            title={state.isPlaying ? 'Audio Frequency EQ: Active' : 'Audio Frequency EQ: Paused'}
            aria-label="Frequency visualizer"
          >
            <span className="eq-bar bar-1" style={{ backgroundColor: state.auraColor }} />
            <span className="eq-bar bar-2" style={{ backgroundColor: state.auraColor }} />
            <span className="eq-bar bar-3" style={{ backgroundColor: state.auraColor }} />
            <span className="eq-bar bar-4" style={{ backgroundColor: state.auraColor }} />
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

        {/* Center Segment: Transport Controls */}
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
              style={{
                backgroundColor: state.auraColor,
                boxShadow: state.isPlaying ? `0 0 16px 2px ${state.auraGlow}` : undefined,
              }}
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

        {/* Right Segment: Time, Mute & Theatre Mode Toggle */}
        <div className="island-action-segment">
          <div className="island-time-display" aria-label="Track time">
            <span className="time-current">{formatSeconds(activeSeconds)}</span>
            <span className="time-sep">/</span>
            <span className="time-total">{formatSeconds(safeDuration)}</span>
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

        {/* Micro-Progress Bar along the bottom of the Dynamic Island - Draggable & Clickable */}
        <div
          ref={trackRef}
          className={`island-progress-track ${isDragging ? 'is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          role="slider"
          tabIndex={0}
          aria-label="Seek track position"
          aria-valuenow={Math.round(activeSeconds)}
          aria-valuemin={0}
          aria-valuemax={Math.round(safeDuration)}
          aria-valuetext={`${formatSeconds(activeSeconds)} of ${formatSeconds(safeDuration)}`}
        >
          <div
            className="island-progress-bar"
            style={{
              width: `${trackProgressPercent}%`,
              backgroundColor: state.auraColor,
            }}
          />
          {isDragging && (
            <div
              className="island-progress-scrub-tooltip"
              style={{ left: `${trackProgressPercent}%` }}
              aria-hidden="true"
            >
              {formatSeconds(dragSeconds)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
