import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';

interface AddaSessionsProps {
  isPlayingAudio: boolean;
  /** Called when the video starts, so the generated radio drone doesn't play over it. */
  onStart: () => void;
}

const VIDEO_ID = '3KfZVtjsRdo';
const VIDEO_TITLE = 'Sunday Salon Barbershop Playlist — Kumar Sanu, Kishore Kumar';
const ARTISTS = ['Kishore Kumar', 'Kumar Sanu', 'Evergreen Bollywood'];

// The YouTube player only loads after a click: no third-party script or cookies until the guest asks for it.
export const AddaSessions: React.FC<AddaSessionsProps> = ({ isPlayingAudio, onStart }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`);

  // Pressing play on the radio hands the speakers back to it.
  useEffect(() => {
    if (isPlayingAudio) setIsLoaded(false);
  }, [isPlayingAudio]);

  const start = () => {
    setIsLoaded(true);
    onStart();
  };

  return (
    <section id="adda-sessions" className="adda-sessions-section" aria-labelledby="adda-sessions-title">
      <div className="adda-sessions-head" data-reveal>
        <div>
          <p className="section-number">
            <span>No. 03 · B</span> Adda sessions
          </p>
          <h2 id="adda-sessions-title" className="adda-sessions-title">
            Sunday at the salon, <em>Kishore on the radio.</em>
          </h2>
        </div>
        <div className="adda-sessions-aside">
          <p>
            The barbershop transistor, the chai glass on the bench and the evergreen songs everyone hums along to. Press
            play and stay a while.
          </p>
          <ul className="adda-sessions-tags" aria-label="Featured artists">
            {ARTISTS.map((artist) => (
              <li key={artist}>{artist}</li>
            ))}
          </ul>
        </div>
      </div>

      <figure className="adda-screen-frame" data-reveal>
        <div className="adda-screen">
          {isLoaded ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
              title={VIDEO_TITLE}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button type="button" className="adda-screen-facade" onClick={start} aria-label={`Play ${VIDEO_TITLE}`}>
              <img
                src={poster}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setPoster(`https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`)}
              />
              <span className="adda-screen-play" aria-hidden="true">
                <Play size={26} fill="currentColor" />
              </span>
              <span className="adda-screen-caption" aria-hidden="true">
                <small>Now screening</small>
                Sunday Salon Barbershop Playlist
              </span>
            </button>
          )}
        </div>

        <figcaption className="adda-screen-meta">
          <span className="adda-screen-reel">
            <i aria-hidden="true" /> Reel 1900 · The adda gramophone
          </span>
          <a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noopener noreferrer">
            Sony Music India on YouTube <ArrowUpRight size={14} />
          </a>
        </figcaption>
      </figure>
    </section>
  );
};
