/**
 * Chaiwala Radio Engine (Unified Native HTML5 Audio & Ambient Synthesis Engine)
 * - Native HTML5 audio playback for the 1900s Adda 90's Playlist (zero iframes, zero ads, instant playback)
 * - Web Audio ambient synthesis for the 2020s Café lo-fi station
 * - Synchronized track progress, seeking, and lyrics synchronization
 * - Ambient aura extraction with 1.5s crossfade
 * - Global event broadcasting for Hero, EraRadio, Dynamic Island, and Theatre Mode
 */

import { PLAYLIST_TRACKS, TrackData } from './playlist-data';

export type EraMode = '1900s' | '2020s';

export const PLAYLIST_AUDIO_SRC = '/audio/90s_playlist.mp3';
export const YOUTUBE_PLAYLIST_ID = '3KfZVtjsRdo';
export const YOUTUBE_PLAYLIST_URL = 'https://youtu.be/3KfZVtjsRdo';

export interface AudioPlayerState {
  isPlaying: boolean;
  currentMode: EraMode;
  currentTrackIndex: number;
  currentTrack: TrackData;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  volume: number; // 0 - 100
  theatreMode: boolean;
  auraColor: string;
  auraGlow: string;
  isYtReady: boolean;
}

type AudioListener = (state: AudioPlayerState) => void;

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfos: OscillatorNode[] = [];
  private voiceGains: GainNode[] = [];

  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentMode: EraMode = '1900s';
  private currentTrackIndex: number = 0;
  private currentTime: number = 0;
  private duration: number = PLAYLIST_TRACKS[0]?.durationSeconds || 318;
  private isMuted: boolean = false;
  private volume: number = 80;
  private theatreMode: boolean = false;

  private listeners: Set<AudioListener> = new Set();

  constructor() {
    this.initKeyboardShortcuts();
  }

  private getAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioElement) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = PLAYLIST_AUDIO_SRC;
      audio.volume = this.isMuted ? 0 : this.volume / 100;

      audio.addEventListener('timeupdate', () => {
        if (this.currentMode === '1900s') {
          this.currentTime = audio.currentTime;
          this.detectCurrentTrack(this.currentTime);
          this.notify();
        }
      });

      audio.addEventListener('play', () => {
        if (this.currentMode === '1900s') {
          this.isPlaying = true;
          this.notify();
        }
      });

      audio.addEventListener('pause', () => {
        if (this.currentMode === '1900s') {
          this.isPlaying = false;
          this.notify();
        }
      });

      audio.addEventListener('ended', () => {
        if (this.currentMode === '1900s') {
          this.nextTrack();
        }
      });

      audio.addEventListener('error', (e) => {
        console.warn('Native audio load notice, using synthesizer fallback if necessary:', e);
      });

      this.audioElement = audio;
    }

    return this.audioElement;
  }

  public getState(): AudioPlayerState {
    const track = PLAYLIST_TRACKS[this.currentTrackIndex] || PLAYLIST_TRACKS[0];
    return {
      isPlaying: this.isPlaying,
      currentMode: this.currentMode,
      currentTrackIndex: this.currentTrackIndex,
      currentTrack: track,
      currentTime: this.currentTime,
      duration: this.duration,
      isMuted: this.isMuted,
      volume: this.volume,
      theatreMode: this.theatreMode,
      auraColor: track.auraColor,
      auraGlow: track.auraGlow,
      isYtReady: true,
    };
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error('Radio listener error:', err);
      }
    });
  }

  public initYouTube(_containerId: string = 'chaiwala-yt-player') {
    // Replaced by native HTML5 audio for zero iframe clutter and instant playback
  }

  private detectCurrentTrack(sec: number) {
    for (let i = PLAYLIST_TRACKS.length - 1; i >= 0; i--) {
      if (sec >= PLAYLIST_TRACKS[i].startSeconds) {
        if (this.currentTrackIndex !== i) {
          this.currentTrackIndex = i;
          this.duration = PLAYLIST_TRACKS[i].durationSeconds;
        }
        break;
      }
    }
  }

  public playTrack(index: number) {
    if (index < 0 || index >= PLAYLIST_TRACKS.length) return;
    this.currentTrackIndex = index;
    const track = PLAYLIST_TRACKS[index];
    this.duration = track.durationSeconds;
    this.currentTime = track.startSeconds;

    if (this.currentMode !== '1900s') {
      this.currentMode = '1900s';
      this.stopOscillators();
    }

    const audio = this.getAudio();
    if (audio) {
      audio.currentTime = track.startSeconds;
      audio.play().catch((err) => {
        console.warn('Audio play error:', err);
      });
      this.isPlaying = true;
      this.notify();
    }
  }

  public nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % PLAYLIST_TRACKS.length;
    this.playTrack(nextIdx);
  }

  public prevTrack() {
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];
    if (this.currentTime - track.startSeconds > 4) {
      this.seekTo(track.startSeconds);
    } else {
      const prevIdx = (this.currentTrackIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
      this.playTrack(prevIdx);
    }
  }

  public seekTo(seconds: number) {
    this.currentTime = seconds;
    if (this.currentMode === '1900s') {
      const audio = this.getAudio();
      if (audio) {
        try {
          audio.currentTime = seconds;
        } catch {}
      }
    }
    this.detectCurrentTrack(seconds);
    this.notify();
  }

  public play(mode?: EraMode) {
    if (mode) this.currentMode = mode;

    if (this.currentMode === '1900s') {
      this.stopOscillators();
      const audio = this.getAudio();
      if (audio) {
        audio.play().then(() => {
          this.isPlaying = true;
          this.notify();
        }).catch((err) => {
          console.warn('Native audio play error, falling back to ambient synthesis:', err);
          this.playWebAudio('1900s');
          this.isPlaying = true;
          this.notify();
        });
      } else {
        this.playWebAudio('1900s');
        this.isPlaying = true;
        this.notify();
      }
    } else {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.playWebAudio('2020s');
      this.isPlaying = true;
      this.notify();
    }
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopOscillators();
    this.isPlaying = false;
    this.notify();
  }

  public toggle(mode?: EraMode): boolean {
    const targetMode = mode || this.currentMode;
    if (this.isPlaying && this.currentMode === targetMode) {
      this.stop();
      return false;
    } else {
      this.play(targetMode);
      return true;
    }
  }

  public setMode(mode: EraMode) {
    this.currentMode = mode;
    this.notify();
  }

  public toggleTheatreMode(): boolean {
    this.theatreMode = !this.theatreMode;
    this.notify();
    return this.theatreMode;
  }

  public setTheatreMode(active: boolean) {
    this.theatreMode = active;
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.isMuted && this.volume > 0) {
      this.isMuted = false;
    }
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume / 100;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime((this.volume / 100) * 0.4, this.ctx.currentTime);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
      this.audioElement.volume = this.isMuted ? 0 : this.volume / 100;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : (this.volume / 100) * 0.4, this.ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  // Keyboard shortcut listener
  private initKeyboardShortcuts() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggle();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        this.toggleTheatreMode();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        this.toggleMute();
      } else if (e.code === 'ArrowRight' && (e.metaKey || e.ctrlKey || e.altKey)) {
        e.preventDefault();
        this.nextTrack();
      } else if (e.code === 'ArrowLeft' && (e.metaKey || e.ctrlKey || e.altKey)) {
        e.preventDefault();
        this.prevTrack();
      } else if (e.code === 'Escape' && this.theatreMode) {
        e.preventDefault();
        this.setTheatreMode(false);
      }
    });
  }

  // Web Audio Context fallback & 2020s lo-fi synthesis
  private initWebAudioContext() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      const currentVol = this.isMuted ? 0 : (this.volume / 100) * 0.35;
      this.masterGain.gain.setValueAtTime(currentVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {}
  }

  private playWebAudio(mode: EraMode) {
    this.initWebAudioContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    this.stopOscillators();

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freqs = mode === '1900s'
      ? [138.59, 207.65, 277.18, 415.30] // C# harmonic tanpura & sitar drone fallback
      : [164.81, 246.94, 329.63, 493.88]; // E minor lo-fi electric Rhodes chord

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.04, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(1.2 + idx * 0.5, now);
      lfo.connect(osc.frequency);
      lfo.start();
      this.lfos.push(lfo);

      const targetVolume = 0.05 / (idx + 1);
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(targetVolume, now + 1.2);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc);
      this.voiceGains.push(oscGain);
    });
  }

  private stopOscillators() {
    const now = this.ctx ? this.ctx.currentTime : 0;
    const fadeEnd = now + 0.15;
    this.voiceGains.forEach(({ gain }) => {
      try {
        const current = gain.value;
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(current, now);
        gain.linearRampToValueAtTime(0, fadeEnd);
      } catch {}
    });
    [...this.oscillators, ...this.lfos].forEach((node) => {
      try {
        node.stop(fadeEnd);
        node.onended = () => node.disconnect();
      } catch {}
    });
    this.oscillators = [];
    this.lfos = [];
    this.voiceGains = [];
  }
}

export const radioAudio = new RadioAudioEngine();
