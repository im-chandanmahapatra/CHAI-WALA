import React, { useState } from 'react';
import {
  CassetteTape,
  ChevronDown,
  ExternalLink,
  Music,
  Tv,
} from 'lucide-react';
import { PLAYLIST_TRACKS, TrackData } from '../../lib/playlist-data';
import { AudioPlayerState, radioAudio, YOUTUBE_PLAYLIST_URL } from '../../lib/radio-audio';
import { SaasTooltip } from './SaasTooltip';

interface WalkmanDeckProps {
  state: AudioPlayerState;
}

export const WalkmanDeck: React.FC<WalkmanDeckProps> = ({ state }) => {
  const [screenView, setScreenView] = useState<'cassette' | 'video'>('cassette');
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const currentTrack: TrackData = state.currentTrack;

  return (
    <div className="walkman-deck-root" aria-label="Vintage Walkman Cassette Deck">
      {/* Top Brushed Metal Plate & Head Bar */}
      <div className="walkman-top-bezel">
        <div className="walkman-brand-cluster">
          <span className="walkman-brand-name">CHAIWALA</span>
          <span className="walkman-model-badge">WM-1900 STEREO CASSETTE</span>
        </div>

        <div className="walkman-mode-selectors">
          <button
            type="button"
            className={`walkman-selector-pill ${screenView === 'cassette' ? 'is-active' : ''}`}
            onClick={() => setScreenView('cassette')}
            aria-label="Show Cassette Deck"
          >
            <CassetteTape size={13} />
            <span>Tape Deck</span>
          </button>
          <button
            type="button"
            className={`walkman-selector-pill ${screenView === 'video' ? 'is-active' : ''}`}
            onClick={() => setScreenView('video')}
            aria-label="Show Video Screen"
          >
            <Tv size={13} />
            <span>Video Screen</span>
          </button>

          <SaasTooltip label="View Full Barbershop Tracklist">
            <button
              type="button"
              className={`walkman-selector-pill ${playlistOpen ? 'is-active' : ''}`}
              onClick={() => setPlaylistOpen(!playlistOpen)}
              aria-label="Toggle Playlist Drawer"
            >
              <Music size={13} />
              <span>{PLAYLIST_TRACKS.length} Tracks</span>
              <ChevronDown size={12} className={`transition-transform ${playlistOpen ? 'rotate-180' : ''}`} />
            </button>
          </SaasTooltip>

          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="walkman-selector-pill external"
            title="Open in YouTube"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Window Area: Rotating Cassette or YouTube Video */}
      <div className="walkman-window-chassis">
        {screenView === 'cassette' ? (
          <div className="cassette-tape-body">
            {/* Top Tape Sticker */}
            <div
              className="cassette-top-label"
              style={{ borderLeftColor: state.auraColor }}
            >
              <div className="cassette-label-meta">
                <span className="label-side">SIDE A</span>
                <span className="label-nr">DOLBY B-NR · HIGH BIAS</span>
                <span className="label-speed">4.76 cm/s</span>
              </div>
              <div className="cassette-title-row">
                <span className="cassette-track-title">{currentTrack.title}</span>
                <span className="cassette-track-artist">{currentTrack.artist}</span>
              </div>
            </div>

            {/* Middle Window with Twin Spools & Tape Bridge */}
            <div className="cassette-window-cutout">
              {/* Left Spool */}
              <div
                className={`cassette-spool left ${state.isPlaying ? 'is-spinning' : ''}`}
                aria-hidden="true"
              >
                <div className="spool-teeth">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="spool-center-hole" />
              </div>

              {/* Tape Level Meter / Tape Bridge */}
              <div className="cassette-tape-bridge">
                <div className="tape-roller-window">
                  <span
                    className="tape-film"
                    style={{
                      transform: `scaleX(${0.4 + (state.currentTime % 60) * 0.01})`,
                    }}
                  />
                </div>
                <div className="cassette-meter-strip" aria-hidden="true">
                  <span className={`meter-led ${state.isPlaying ? 'lit' : ''}`} />
                  <span className={`meter-led ${state.isPlaying ? 'lit' : ''}`} />
                  <span className={`meter-led ${state.isPlaying ? 'lit' : ''}`} />
                  <span className={`meter-led ${state.isPlaying ? 'lit' : ''}`} />
                  <span className={`meter-led red ${state.isPlaying ? 'lit' : ''}`} />
                </div>
              </div>

              {/* Right Spool */}
              <div
                className={`cassette-spool right ${state.isPlaying ? 'is-spinning' : ''}`}
                aria-hidden="true"
              >
                <div className="spool-teeth">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="spool-center-hole" />
              </div>
            </div>

            {/* Bottom Trapezoid Screw Area */}
            <div className="cassette-bottom-plate">
              <span className="cassette-screw top-left" />
              <span className="cassette-screw top-right" />
              <div className="cassette-guide-roller left" />
              <div className="cassette-tape-head-window" />
              <div className="cassette-guide-roller right" />
              <span className="cassette-screw bottom-center" />
            </div>
          </div>
        ) : (
          <div className="walkman-video-screen-frame">
            {/* When Video Screen is active, we move the YouTube player here */}
            <div id="walkman-video-slot" className="walkman-video-slot">
              {/* The YouTube iframe will be placed here or anchored */}
            </div>
          </div>
        )}
      </div>

      {/* Tracklist Drawer */}
      {playlistOpen && (
        <div className="walkman-playlist-drawer">
          <div className="playlist-drawer-head">
            <span className="drawer-title">Sunday Salon Barbershop Playlist</span>
            <span className="drawer-count">15 Tracks · Sony Music India</span>
          </div>
          <div className="playlist-items-scroll">
            {PLAYLIST_TRACKS.map((track, idx) => {
              const isCurrent = idx === state.currentTrackIndex;
              return (
                <div
                  key={track.id}
                  className={`playlist-track-row ${isCurrent ? 'is-active' : ''}`}
                  onClick={() => {
                    radioAudio.playTrack(idx);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="row-num">{(idx + 1).toString().padStart(2, '0')}</span>
                  <div className="row-info">
                    <span className="row-title">{track.title}</span>
                    <span className="row-artist">{track.artist}</span>
                  </div>
                  <span
                    className="row-aura-dot"
                    style={{ backgroundColor: track.auraColor }}
                    title={`Aura: ${track.auraColor}`}
                  />
                  <span className="row-duration">
                    {Math.floor(track.durationSeconds / 60)}:
                    {(track.durationSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

