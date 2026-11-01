import React, { useEffect, useRef } from 'react';
import { LyricLine, TrackData } from '../../lib/playlist-data';
import { radioAudio } from '../../lib/radio-audio';

interface SynchronizedLyricsProps {
  currentTrack: TrackData;
  currentTime: number;
  isTheatre?: boolean;
}

export const SynchronizedLyrics: React.FC<SynchronizedLyricsProps> = ({
  currentTrack,
  currentTime,
  isTheatre = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  const lyrics: LyricLine[] = currentTrack.lyrics || [];

  // Determine which line is currently active
  let activeIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
      break;
    }
  }

  // Smooth scroll to keep the active line in focal view
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeLineRef.current;

      const elementOffset = element.offsetTop;
      const elementHeight = element.clientHeight;
      const containerHeight = container.clientHeight;

      const targetScroll = elementOffset - containerHeight / 2 + elementHeight / 2;

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  const handleLineClick = (time: number) => {
    radioAudio.seekTo(time);
  };

  return (
    <div
      ref={containerRef}
      className={`synchronized-lyrics-container ${isTheatre ? 'theatre-mode-lyrics' : ''}`}
      aria-label="Synchronized lyrics"
    >
      <div className="lyrics-track-header">
        <p className="lyrics-kicker">Live synchronized lyrics</p>
        <h3 className="lyrics-song-title">
          {currentTrack.title}
          <span className="lyrics-artist-tag"> · {currentTrack.artist}</span>
        </h3>
        {currentTrack.movie && (
          <p className="lyrics-movie-meta">
            From {currentTrack.movie} ({currentTrack.year}) · Music: {currentTrack.composer} · Lyrics: {currentTrack.lyricist}
          </p>
        )}
      </div>

      <div className="lyrics-lines-flow">
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = idx < activeIndex;

          return (
            <p
              key={`${line.time}-${idx}`}
              ref={isActive ? activeLineRef : null}
              className={`lyrics-line ${isActive ? 'is-active' : ''} ${
                isPassed ? 'is-passed' : 'is-upcoming'
              }`}
              onClick={() => handleLineClick(line.time)}
              role="button"
              tabIndex={0}
              title={`Jump to ${Math.floor(line.time / 60)}:${(line.time % 60).toString().padStart(2, '0')}`}
            >
              <span className="lyrics-line-text">{line.text}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

