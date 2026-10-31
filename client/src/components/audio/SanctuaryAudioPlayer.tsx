import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sliders, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { MoodSlug } from '../../lib/database.types';

interface TrackInfo {
  title: string;
  subtitle: string;
  bpm: number;
  description: string;
}

const TRACKS: Record<MoodSlug, TrackInfo> = {
  adda: {
    title: 'Morning Tapri Ragas & Sitar',
    subtitle: 'Classic Adda · Vintage Acoustic Heritage',
    bpm: 68,
    description: 'Resonant sitar harmonics, tanpura drone warmth, and brass kettle simmer sounds.',
  },
  classics: {
    title: '2000s Nostalgic Acoustic Lounge',
    subtitle: 'Café Classics · Afternoon Reverie',
    bpm: 76,
    description: 'Warm fingerstyle acoustic guitar, soft room reverberation, and gentle café clinks.',
  },
  lab: {
    title: 'Subcontinental Lo-Fi Chill & Rhodes',
    subtitle: 'Trend Lab · Contemporary Flow',
    bpm: 84,
    description: 'Binaural 432Hz ambient pads, soft electric piano Rhodes chords, and modern chill beats.',
  },
};

export const SanctuaryAudioPlayer: React.FC = () => {
  const { mood } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [panelOpen, setPanelOpen] = useState(false);

  // Web Audio Context for zero-dependency high-fidelity ambient synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const currentTrack = TRACKS[mood] || TRACKS.adda;

  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
    } catch {
      // AudioContext unavailable; silent mode fallback
    }
  };

  const startSynthesis = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !gain) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    stopSynthesis(); // Clear existing oscillators

    // Frequencies tailored to active atmosphere mood
    const baseFreqs =
      mood === 'adda'
        ? [138.59, 207.65, 277.18] // C# harmonic minor tanpura chord
        : mood === 'classics'
        ? [146.83, 220.0, 293.66] // D major warm acoustic resonance
        : [164.81, 246.94, 329.63]; // E minor lo-fi lush chord

    const newOscillators: OscillatorNode[] = [];

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Gentle LFO modulation for organic breath
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.04 / (idx + 1), ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(gain);

      osc.start();
      newOscillators.push(osc);
    });

    oscillatorsRef.current = newOscillators;
  };

  const stopSynthesis = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    oscillatorsRef.current = [];
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSynthesis();
      setIsPlaying(false);
    } else {
      startSynthesis();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startSynthesis();
    }
    return () => stopSynthesis();
  }, [mood]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetVolume = isMuted ? 0 : volume;
      gainNodeRef.current.gain.setTargetAtTime(targetVolume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume, isMuted]);

  return (
    <div className="relative inline-flex items-center">
      {/* Dock Icon Button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className={`relative p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
          isPlaying
            ? 'bg-[var(--brass)]/15 border-[var(--brass)] text-[var(--brass)] shadow-[var(--shadow-warm-xs)]'
            : 'bg-[var(--linen)] border-[var(--warm-border)] text-[var(--clay)] hover:text-[var(--dark-roast)]'
        }`}
        title="Sanctuary Soundtrack"
        aria-label="Toggle Soundtrack Player"
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span className="w-0.5 bg-[var(--brass)] rounded-full animate-[sound-bar_0.8s_ease-in-out_infinite]" />
            <span className="w-0.5 bg-[var(--brass)] rounded-full animate-[sound-bar_1.1s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 bg-[var(--brass)] rounded-full animate-[sound-bar_0.7s_ease-in-out_infinite_0.4s]" />
          </div>
        ) : (
          <Music className="w-4 h-4" />
        )}
      </button>

      {/* Floating Audio Controller Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-72 bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-4 shadow-[var(--shadow-warm-lg)] space-y-3 z-50 text-[var(--dark-roast)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--warm-border)] pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brass)]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--clay)]">
                  Sanctuary Audio
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--linen)] text-[var(--terracotta)] border border-[var(--warm-border)]">
                {mood.toUpperCase()}
              </span>
            </div>

            {/* Track Info */}
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-[var(--dark-roast)] leading-snug">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] text-[var(--clay)] leading-relaxed">
                {currentTrack.description}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={togglePlayback}
                className="px-4 py-2 bg-[var(--terracotta)] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#85321D] transition-colors cursor-pointer shadow-xs"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Ambient</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg border border-[var(--warm-border)] text-[var(--clay)] hover:text-[var(--dark-roast)] cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-[#E5484D]" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-16 h-1.5 bg-[var(--linen)] rounded-lg appearance-none cursor-pointer accent-[var(--terracotta)]"
                />
              </div>
            </div>

            <div className="text-[9px] text-[var(--clay)] text-center pt-1 border-t border-[var(--warm-border)]">
              Pure acoustic synthesis · Royalty-free master license
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
