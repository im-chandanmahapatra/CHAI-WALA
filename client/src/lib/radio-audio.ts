/**
 * Chaiwala Radio Engine (SaaS-Grade Unified Audio Controller)
 * - YouTube IFrame integration with precise track-level seeking for "1900s Adda"
 * - Ambient aura extraction with 1.5s crossfade
 * - Live playback time synchronization for lyrics
 * - Web Audio ambient synthesis fallback & 2020s lo-fi engine
 * - Global event broadcasting for Dynamic Island, Theatre Mode, and Walkman Deck
 */

import { PLAYLIST_TRACKS, TrackData } from './playlist-data';

export type EraMode = '1900s' | '2020s';

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

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId: string;
          playerVars?: Record<string, string | number | boolean>;
          events?: {
            onReady?: (event: { target: any }) => void;
            onStateChange?: (event: { data: number; target: any }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfos: OscillatorNode[] = [];
  private voiceGains: GainNode[] = [];

  private isPlaying: boolean = false;
  private currentMode: EraMode = '1900s';
  private currentTrackIndex: number = 0;
  private currentTime: number = 0;
  private duration: number = PLAYLIST_TRACKS[0].durationSeconds;
  private isMuted: boolean = false;
  private volume: number = 80;
  private theatreMode: boolean = false;

  private ytPlayer: any = null;
  private ytReady: boolean = false;
  private ytFailed: boolean = false;
  private ytPendingPlay: boolean = false;
  private ytContainerId: string = 'chaiwala-yt-player';
  private timePollTimer: number | null = null;

  private listeners: Set<AudioListener> = new Set();

  constructor() {
    this.initKeyboardShortcuts();
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
      isYtReady: this.ytReady,
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

  public initYouTube(containerId: string = 'chaiwala-yt-player') {
    this.ytContainerId = containerId;
    if (typeof window === 'undefined') return;

    if (this.ytPlayer) return;

    const setupPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      const el = document.getElementById(this.ytContainerId);
      if (!el) return;

      try {
        this.ytPlayer = new window.YT.Player(this.ytContainerId, {
          videoId: YOUTUBE_PLAYLIST_ID,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            loop: 1,
            playlist: YOUTUBE_PLAYLIST_ID,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              this.ytReady = true;
              if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
                this.ytPlayer.setVolume(this.volume);
              }
              if (this.ytPendingPlay && this.currentMode === '1900s') {
                this.ytPendingPlay = false;
                this.play('1900s');
              }
              this.notify();
            },
            onStateChange: (event: { data: number }) => {
              if (event.data === 1) {
                // PLAYING
                if (this.currentMode === '1900s') {
                  this.isPlaying = true;
                  this.stopOscillators();
                  this.startTimePolling();
                  this.notify();
                }
              } else if (event.data === 2 || event.data === 0) {
                // PAUSED or ENDED
                if (this.currentMode === '1900s') {
                  this.isPlaying = false;
                  this.stopTimePolling();
                  this.notify();
                }
              }
            },
            onError: (err: { data: number }) => {
              console.warn('YouTube player error code:', err.data, '- activating ambient fallback');
              this.ytFailed = true;
              if (this.isPlaying && this.currentMode === '1900s') {
                this.playWebAudio('1900s');
              }
            },
          },
        });
      } catch (e) {
        console.warn('Could not initialize YouTube player:', e);
        this.ytFailed = true;
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevOnReady) prevOnReady();
        setupPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
    }
  }

  private startTimePolling() {
    this.stopTimePolling();
    this.timePollTimer = window.setInterval(() => {
      if (this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        try {
          const sec = this.ytPlayer.getCurrentTime() || 0;
          this.currentTime = sec;

          // Auto-detect which track corresponds to the current timestamp
          this.detectCurrentTrack(sec);
          this.notify();
        } catch {}
      }
    }, 250);
  }

  private stopTimePolling() {
    if (this.timePollTimer) {
      clearInterval(this.timePollTimer);
      this.timePollTimer = null;
    }
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
    }

    this.stopOscillators();

    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
      try {
        this.ytPlayer.seekTo(track.startSeconds, true);
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        this.startTimePolling();
        this.notify();
        return;
      } catch (e) {
        console.warn('Error seeking YouTube track:', e);
      }
    }

    if (!this.ytReady && !this.ytFailed) {
      this.ytPendingPlay = true;
      this.isPlaying = true;
      this.notify();
      return;
    }

    // Fallback
    this.playWebAudio('1900s');
    this.isPlaying = true;
    this.notify();
  }

  public nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % PLAYLIST_TRACKS.length;
    this.playTrack(nextIdx);
  }

  public prevTrack() {
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];
    // If playing more than 3 seconds into the track, replay current track from start
    if (this.currentTime - track.startSeconds > 4) {
      this.seekTo(track.startSeconds);
    } else {
      const prevIdx = (this.currentTrackIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
      this.playTrack(prevIdx);
    }
  }

  public seekTo(seconds: number) {
    this.currentTime = seconds;
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
      try {
        this.ytPlayer.seekTo(seconds, true);
      } catch {}
    }
    this.detectCurrentTrack(seconds);
    this.notify();
  }

  public play(mode?: EraMode) {
    if (mode) this.currentMode = mode;

    if (this.currentMode === '1900s') {
      this.stopOscillators();

      if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        try {
          this.ytPlayer.playVideo();
          this.isPlaying = true;
          this.startTimePolling();
          this.notify();
          return;
        } catch (e) {
          console.warn('Error invoking YouTube playVideo:', e);
        }
      }

      if (!this.ytFailed && !this.ytReady) {
        this.ytPendingPlay = true;
        this.isPlaying = true;
        this.notify();
        setTimeout(() => {
          if (this.ytPendingPlay && this.isPlaying && this.currentMode === '1900s') {
            this.ytPendingPlay = false;
            this.playWebAudio('1900s');
          }
        }, 3500);
        return;
      }

      this.playWebAudio('1900s');
      this.isPlaying = true;
      this.notify();
    } else {
      this.pauseYouTube();
      this.playWebAudio('2020s');
      this.isPlaying = true;
      this.notify();
    }
  }

  private pauseYouTube() {
    this.ytPendingPlay = false;
    this.stopTimePolling();
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch {}
    }
  }

  public stop() {
    this.ytPendingPlay = false;
    this.pauseYouTube();
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
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(this.volume);
      } catch {}
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime((this.volume / 100) * 0.4, this.ctx.currentTime);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ytReady && this.ytPlayer) {
      try {
        if (this.isMuted) {
          this.ytPlayer.mute();
        } else {
          this.ytPlayer.unMute();
          this.ytPlayer.setVolume(this.volume);
        }
      } catch {}
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : (this.volume / 100) * 0.4, this.ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  // Keyboard shortcut listener for native-SaaS polish
  private initKeyboardShortcuts() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in an input, textarea or search box
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
