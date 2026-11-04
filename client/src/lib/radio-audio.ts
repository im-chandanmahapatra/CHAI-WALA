/**
 * Chaiwala Radio Engine (Unified Native HTML5 Audio & Ambient Synthesis Engine)
 * - Native HTML5 audio playback for:
 *   - 1900s Era: Sunday Salon Barbershop Evergreen Classics (continuous tape master)
 *   - 2020s Era: Café Radio Local 2000s Library (35 curated lossless tracks from 2000's vault)
 * - Draggable seek-bar & instant seek synchronization
 * - Apple Music-style ambient aura extraction with smooth crossfade
 * - Theme-aware playlist switching with zero cross-playlist bleed
 * - Global synchronization across Hero, EraRadio, DynamicIsland, and Theatre Mode
 */

import { CAFE_LIBRARY_TRACKS, getPlaylistForEra, PLAYLIST_TRACKS, TrackData } from './playlist-data';

export type EraMode = '1900s' | '2020s';

export const PLAYLIST_AUDIO_SRC = '/audio/90s_playlist.mp3';
export const YOUTUBE_PLAYLIST_ID = '3KfZVtjsRdo';
export const YOUTUBE_PLAYLIST_URL = 'https://youtu.be/3KfZVtjsRdo';

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  loadError: string | null;
  currentMode: EraMode;
  currentTrackIndex: number;
  currentTrack: TrackData;
  playlist: TrackData[];
  currentTime: number; // in seconds relative to the current track (0 to duration)
  duration: number;    // duration in seconds of current track
  isMuted: boolean;
  volume: number;      // 0 - 100
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
  private isLoading: boolean = false;
  private loadError: string | null = null;
  private currentMode: EraMode = '1900s';
  private currentTrackIndex: number = 0;
  private currentTime: number = 0;
  private duration: number = PLAYLIST_TRACKS[0]?.durationSeconds || 318;
  private isMuted: boolean = false;
  private volume: number = 80;
  private theatreMode: boolean = false;
  private externalPlaybackLocked: boolean = false;

  private listeners: Set<AudioListener> = new Set();
  private pendingPlayPromise: Promise<void> | null = null;

  constructor() {
    // Check initial era from localStorage / URL if in browser
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlEra = params.get('era') as EraMode;
        if (urlEra === '2020s' || urlEra === '1900s') {
          this.currentMode = urlEra;
        } else {
          const saved = localStorage.getItem('cw.era.v3') as EraMode;
          if (saved === '2020s' || saved === '1900s') {
            this.currentMode = saved;
          }
        }
      } catch {}

      const initialTrack = this.getCurrentTrack();
      this.duration = initialTrack?.durationSeconds || 300;
      this.initKeyboardShortcuts();
      (window as unknown as { radioAudio: RadioAudioEngine }).radioAudio = this;
    }
  }

  public getPlaylist(mode?: EraMode): TrackData[] {
    return getPlaylistForEra(mode || this.currentMode);
  }

  public getCurrentTrack(): TrackData {
    const list = this.getPlaylist();
    return list[this.currentTrackIndex] || list[0];
  }

  private getAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioElement) {
      const audio = new Audio();
      audio.id = 'chaiwala-native-audio';
      audio.style.display = 'none';
      audio.preload = 'metadata';
      const initialTrack = this.getCurrentTrack();
      audio.src = this.currentMode === '2020s' ? (initialTrack.src || PLAYLIST_AUDIO_SRC) : PLAYLIST_AUDIO_SRC;
      audio.volume = this.isMuted ? 0 : this.volume / 100;

      if (typeof document !== 'undefined' && document.body && !document.getElementById('chaiwala-native-audio')) {
        document.body.appendChild(audio);
      }

      audio.addEventListener('timeupdate', () => {
        if (this.currentMode === '1900s') {
          const rawSec = audio.currentTime;
          this.detectCurrentTrack1900s(rawSec);
          const track = this.getCurrentTrack();
          this.currentTime = Math.max(0, rawSec - track.startSeconds);
          this.duration = track.durationSeconds;

          // Track boundary in continuous file
          if (rawSec >= track.startSeconds + track.durationSeconds - 0.25) {
            this.nextTrack();
            return;
          }
        } else {
          // 2020s discrete tracks
          this.currentTime = audio.currentTime;
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            this.duration = audio.duration;
          } else {
            this.duration = this.getCurrentTrack().durationSeconds;
          }
        }
        this.notify();
      });

      audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isLoading = false;
        this.loadError = null;
        this.notify();
      });

      audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      audio.addEventListener('waiting', () => {
        this.isLoading = true;
        this.notify();
      });

      audio.addEventListener('canplay', () => {
        this.isLoading = false;
        this.loadError = null;
        this.notify();
      });

      audio.addEventListener('seeking', () => {
        this.isLoading = true;
        this.notify();
      });

      audio.addEventListener('seeked', () => {
        this.isLoading = false;
        this.notify();
      });

      audio.addEventListener('ended', () => {
        this.nextTrack();
      });

      audio.addEventListener('error', () => {
        const err = audio.error;
        console.warn('Native audio load error, error code:', err?.code, err?.message);
        this.loadError = 'Audio playback error. Click retry or choose another track.';
        this.isLoading = false;
        this.isPlaying = false;
        this.notify();
      });

      this.audioElement = audio;
    }

    return this.audioElement;
  }

  public getState(): AudioPlayerState {
    const track = this.getCurrentTrack();
    const playlist = this.getPlaylist();
    return {
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      loadError: this.loadError,
      currentMode: this.currentMode,
      currentTrackIndex: this.currentTrackIndex,
      currentTrack: track,
      playlist: playlist,
      currentTime: this.currentTime,
      duration: this.duration || track.durationSeconds,
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
    // Legacy stub - chaiwala uses native HTML5 audio for zero iframe lag
  }

  private detectCurrentTrack1900s(sec: number) {
    const tracks = PLAYLIST_TRACKS;
    for (let i = tracks.length - 1; i >= 0; i--) {
      if (sec >= tracks[i].startSeconds) {
        if (this.currentTrackIndex !== i) {
          this.currentTrackIndex = i;
          this.duration = tracks[i].durationSeconds;
        }
        break;
      }
    }
  }

  private playAudio(audio: HTMLAudioElement) {
    this.isLoading = true;
    this.loadError = null;
    const promise = audio.play();
    if (promise !== undefined) {
      this.pendingPlayPromise = promise;
      promise
        .then(() => {
          this.isPlaying = true;
          this.isLoading = false;
          this.loadError = null;
          this.pendingPlayPromise = null;
          this.notify();
        })
        .catch((err) => {
          this.pendingPlayPromise = null;
          if (err.name === 'AbortError') {
            // Rapid next/prev skip - ignore expected abort
            return;
          }
          console.warn('Native audio play error, falling back if necessary:', err);
          this.isLoading = false;
          this.isPlaying = false;
          this.notify();
        });
    }
  }

  public playTrack(index: number, mode?: EraMode) {
    if (this.externalPlaybackLocked) return;
    if (mode && mode !== this.currentMode) {
      this.currentMode = mode;
    }

    const playlist = this.getPlaylist();
    if (index < 0 || index >= playlist.length) {
      index = 0;
    }

    this.currentTrackIndex = index;
    const track = playlist[index];
    this.duration = track.durationSeconds;
    this.currentTime = 0;
    this.isLoading = true;
    this.loadError = null;
    this.stopOscillators();

    const audio = this.getAudio();
    if (audio) {
      const targetSrc = this.currentMode === '2020s'
        ? (track.src || PLAYLIST_AUDIO_SRC)
        : PLAYLIST_AUDIO_SRC;

      // Only reassign src if it changed
      const currentSrcPath = new URL(audio.src, window.location.href).pathname;
      const targetSrcPath = new URL(targetSrc, window.location.href).pathname;

      if (currentSrcPath !== targetSrcPath) {
        audio.src = targetSrc;
      }

      const targetTime = this.currentMode === '1900s' ? track.startSeconds : 0;
      try {
        audio.currentTime = targetTime;
      } catch {}

      this.playAudio(audio);
      this.notify();
    }
  }

  public nextTrack() {
    const playlist = this.getPlaylist();
    const nextIdx = (this.currentTrackIndex + 1) % playlist.length;
    this.playTrack(nextIdx);
  }

  public prevTrack() {
    const playlist = this.getPlaylist();
    // If more than 4 seconds in, restart track
    if (this.currentTime > 4) {
      this.seekTo(0);
    } else {
      const prevIdx = (this.currentTrackIndex - 1 + playlist.length) % playlist.length;
      this.playTrack(prevIdx);
    }
  }

  public seekTo(relativeSeconds: number) {
    const track = this.getCurrentTrack();
    const maxDur = this.duration || track.durationSeconds;
    const clamped = Math.max(0, Math.min(maxDur, relativeSeconds));
    this.currentTime = clamped;

    const audio = this.getAudio();
    if (audio) {
      try {
        if (this.currentMode === '1900s') {
          audio.currentTime = track.startSeconds + clamped;
        } else {
          audio.currentTime = clamped;
        }
      } catch (err) {
        console.warn('Seek error:', err);
      }
    }
    this.notify();
  }

  public play(mode?: EraMode) {
    if (this.externalPlaybackLocked) return;
    if (mode && mode !== this.currentMode) {
      this.setMode(mode, true);
      return;
    }

    this.stopOscillators();
    const audio = this.getAudio();
    const track = this.getCurrentTrack();
    const targetSrc = this.currentMode === '2020s'
      ? (track.src || PLAYLIST_AUDIO_SRC)
      : PLAYLIST_AUDIO_SRC;

    if (audio) {
      const currentSrcPath = new URL(audio.src, window.location.href).pathname;
      const targetSrcPath = new URL(targetSrc, window.location.href).pathname;

      if (currentSrcPath !== targetSrcPath) {
        audio.src = targetSrc;
        const targetTime = this.currentMode === '1900s'
          ? track.startSeconds + this.currentTime
          : this.currentTime;
        try {
          audio.currentTime = targetTime;
        } catch {}
      }

      this.playAudio(audio);
    } else {
      void this.playWebAudio(this.currentMode);
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
    if (this.externalPlaybackLocked) return false;
    const targetMode = mode || this.currentMode;
    if (this.isPlaying && this.currentMode === targetMode) {
      this.stop();
      return false;
    } else {
      this.play(targetMode);
      return true;
    }
  }

  public setMode(mode: EraMode, startPlaying: boolean = false) {
    if (this.currentMode === mode && !startPlaying) return;

    const wasPlaying = this.isPlaying || startPlaying;
    this.currentMode = mode;
    this.currentTrackIndex = 0;
    this.currentTime = 0;

    const track = this.getCurrentTrack();
    this.duration = track.durationSeconds;

    const audio = this.getAudio();
    if (audio) {
      audio.pause();
      const targetSrc = this.currentMode === '2020s'
        ? (track.src || PLAYLIST_AUDIO_SRC)
        : PLAYLIST_AUDIO_SRC;
      audio.src = targetSrc;
      audio.currentTime = this.currentMode === '1900s' ? track.startSeconds : 0;

      if (wasPlaying) {
        this.playAudio(audio);
      } else {
        this.isPlaying = false;
        this.notify();
      }
    } else {
      this.notify();
    }
  }

  public lockForExternalPlayback() {
    this.externalPlaybackLocked = true;
    this.stop();
  }

  public unlockExternalPlayback() {
    this.externalPlaybackLocked = false;
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

  // Web Audio fallback
  private initWebAudioContext() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      const currentVol = this.isMuted ? 0 : (this.volume / 100) * 0.4;
      this.masterGain.gain.setValueAtTime(currentVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {}
  }

  private async playWebAudio(mode: EraMode) {
    this.initWebAudioContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {}
    }

    this.stopOscillators();

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freqs = mode === '1900s'
      ? [138.59, 207.65, 277.18, 415.30] // C# harmonic tanpura drone
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

      const targetVolume = 0.15 / (idx + 1);
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(targetVolume, now + 0.8);

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
