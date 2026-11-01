import React from 'react';
import { Pause, Play } from 'lucide-react';

interface EraRadioProps {
  eraMode: '1900s' | '2020s';
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

export const EraRadio: React.FC<EraRadioProps> = ({ eraMode, isPlayingAudio, onToggleAudio }) => (
  <section id="radio" className="era-radio-strip-section" aria-labelledby="radio-strip-heading">
    <div className="radio-strip-container" data-reveal>
      <div className={`radio-record ${isPlayingAudio ? 'spinning' : ''}`} aria-hidden="true">
        <img
          src={eraMode === '1900s' ? '/images/campaign/cutting-chai-v2.png' : '/images/matcha-latte.jpg'}
          alt=""
          className="record-label-img"
        />
        <span className="record-spindle" />
      </div>

      <div className="radio-text-descriptors">
        <p className="section-number light">
          <span>No. 03</span> Chaiwala radio
        </p>
        <h2 id="radio-strip-heading" className="radio-station-title">
          {eraMode === '1900s' ? (
            <>
              Morning tapri, <em>tanpura drone.</em>
            </>
          ) : (
            <>
              Lo-fi pads, <em>warm Rhodes.</em>
            </>
          )}
        </h2>
        <p className="radio-track-title">
          A gentle ambient soundscape generated live in your browser. It only plays when you press play.
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
            {isPlayingAudio ? 'Now playing' : 'Press play'} · {eraMode === '1900s' ? '1900s Adda' : '2020s Café'}
          </span>
          <div className={`radio-soundwave-bars ${isPlayingAudio ? 'active-pulse' : ''}`} aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="eq-bar" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
