import React, { useState } from 'react';

export const formatSeconds = (sec: number): string => {
  if (isNaN(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
};

interface AudioSeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  accentColor?: string;
  showTimestamps?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const AudioSeekBar: React.FC<AudioSeekBarProps> = ({
  currentTime,
  duration,
  onSeek,
  accentColor = 'var(--accent, #e58e26)',
  showTimestamps = true,
  className = '',
  size = 'md',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragSeconds, setDragSeconds] = useState(0);

  const safeDuration = Math.max(1, duration || 1);
  const activeSeconds = isDragging ? dragSeconds : currentTime;
  const progressPercent = Math.min(100, Math.max(0, (activeSeconds / safeDuration) * 100));

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = parseFloat((e.target as HTMLInputElement).value);
    setIsDragging(true);
    setDragSeconds(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = parseFloat(e.target.value);
    setIsDragging(false);
    onSeek(val);
  };

  const handlePointerDown = () => {
    if (disabled) return;
    setIsDragging(true);
    setDragSeconds(currentTime);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = parseFloat((e.target as HTMLInputElement).value);
    setIsDragging(false);
    onSeek(val);
  };

  return (
    <div className={`audio-seek-component size-${size} ${className}`}>
      {showTimestamps && (
        <span className="seek-timestamp current" aria-label="Current time">
          {formatSeconds(activeSeconds)}
        </span>
      )}

      <div className="seek-interactive-container">
        {/* Track Background Rail */}
        <div className="seek-track-rail" />

        {/* Active Filled Progress Rail */}
        <div
          className="seek-active-fill"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: accentColor,
          }}
        />

        {/* Interactive Scrub Thumb Knob */}
        <div
          className={`seek-scrubber-thumb ${isDragging ? 'is-active' : ''}`}
          style={{
            left: `${progressPercent}%`,
            backgroundColor: '#ffffff',
            borderColor: accentColor,
            boxShadow: isDragging
              ? `0 0 16px 3px ${accentColor}`
              : '0 2px 6px rgba(0,0,0,0.5)',
          }}
          aria-hidden="true"
        />

        {/* Accessible, Draggable Native Range Slider Overlay */}
        <input
          type="range"
          min={0}
          max={safeDuration}
          step={0.5}
          value={activeSeconds}
          disabled={disabled}
          onInput={handleInput}
          onChange={handleChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="seek-native-range"
          aria-label="Seek track playback position"
          aria-valuemin={0}
          aria-valuemax={Math.round(safeDuration)}
          aria-valuenow={Math.round(activeSeconds)}
          aria-valuetext={`${formatSeconds(activeSeconds)} of ${formatSeconds(safeDuration)}`}
        />

        {/* Floating Tooltip displaying current scrub timestamp */}
        {isDragging && (
          <div
            className="seek-hover-tooltip"
            style={{ left: `${progressPercent}%` }}
            aria-hidden="true"
          >
            {formatSeconds(dragSeconds)}
          </div>
        )}
      </div>

      {showTimestamps && (
        <span className="seek-timestamp total" aria-label="Total duration">
          {formatSeconds(safeDuration)}
        </span>
      )}
    </div>
  );
};
