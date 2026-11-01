/**
 * Web Audio ambient engine for Chaiwala Radio.
 * Generates zero-dependency, organic, warm soundscapes tailored to each era.
 * Respects browser autoplay restrictions by only starting after a user gesture.
 */

type EraMode = '1900s' | '2020s';

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfos: OscillatorNode[] = [];
  private voiceGains: GainNode[] = [];
  private isPlaying: boolean = false;
  private currentMode: EraMode = '1900s';

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  public play(mode: EraMode) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    this.stopOscillators();
    this.currentMode = mode;
    this.isPlaying = true;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Frequencies tailored to the era aesthetic
    const freqs = mode === '1900s'
      ? [138.59, 207.65, 277.18, 415.30] // C# harmonic tanpura & sitar drone
      : [164.81, 246.94, 329.63, 493.88]; // E minor lo-fi electric Rhodes chord

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle pitch breathe LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.04, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(1.2 + idx * 0.5, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      this.lfos.push(lfo);

      // Fade-in envelope
      const targetVolume = (0.05 / (idx + 1));
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(targetVolume, now + 1.2);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc);
      this.voiceGains.push(oscGain);
    });
  }

  public stop() {
    this.stopOscillators();
    this.isPlaying = false;
  }

  public toggle(mode: EraMode): boolean {
    if (this.isPlaying && this.currentMode === mode) {
      this.stop();
      return false;
    } else {
      this.play(mode);
      return true;
    }
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }

  public getMode(): EraMode {
    return this.currentMode;
  }

  private stopOscillators() {
    // Short fade-out before stopping avoids an audible click.
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
    [...this.oscillators, ...this.lfos].forEach(node => {
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

