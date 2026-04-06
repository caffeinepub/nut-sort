export class SoundSystem {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private musicEnabled = true;
  private musicOscillators: OscillatorNode[] = [];
  private musicGain: GainNode | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      this.initialized = true;
    } catch {
      // AudioContext not available
    }
  }

  private getCtx(): AudioContext | null {
    if (!this.ctx) this.init();
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    gain = 0.3,
    delay = 0,
  ) {
    const ctx = this.getCtx();
    if (!ctx || !this.soundEnabled) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(
        gain,
        ctx.currentTime + delay + 0.01,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + delay + duration,
      );

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch {
      // ignore audio errors
    }
  }

  playClick() {
    this.playTone(200, 0.05, "sine", 0.2);
  }

  playPlace() {
    this.playTone(440, 0.1, "sine", 0.25);
  }

  playDing() {
    this.playTone(880, 0.2, "sine", 0.3);
    this.playTone(1320, 0.2, "sine", 0.25, 0.2);
  }

  playError() {
    this.playTone(150, 0.1, "square", 0.15);
  }

  playCelebration() {
    // C4=261, E4=329, G4=392, C5=523, E5=659, G5=784
    const notes = [261, 329, 392, 523, 659, 784];
    for (let i = 0; i < notes.length; i++) {
      this.playTone(notes[i], 0.15, "sine", 0.3, i * 0.12);
    }
  }

  playBgMusic() {
    const ctx = this.getCtx();
    if (!ctx || !this.musicEnabled) return;
    this.stopBgMusic();

    try {
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.connect(ctx.destination);
      this.musicGain = gainNode;

      // C maj pentatonic: C3, E3, G3, A3, C4
      const pentatonic = [130.81, 164.81, 196, 220, 261.63];

      const playNote = (freq: number, time: number, dur: number) => {
        try {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.connect(g);
          g.connect(gainNode);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, time);
          g.gain.setValueAtTime(0, time);
          g.gain.linearRampToValueAtTime(0.5, time + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, time + dur);
          osc.start(time);
          osc.stop(time + dur);
        } catch {
          // ignore
        }
      };

      // Play a gentle looping pattern
      const now = ctx.currentTime;
      let t = now;
      const pattern = [0, 2, 4, 2, 1, 3, 2, 0];
      for (let i = 0; i < pattern.length; i++) {
        playNote(pentatonic[pattern[i]], t, 1.8);
        t += 2;
      }
    } catch {
      // ignore
    }
  }

  stopBgMusic() {
    if (this.musicGain) {
      try {
        this.musicGain.gain.setValueAtTime(0, this.ctx?.currentTime ?? 0);
        this.musicGain.disconnect();
      } catch {
        // ignore
      }
      this.musicGain = null;
    }
    for (const osc of this.musicOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    }
    this.musicOscillators = [];
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopBgMusic();
    } else {
      this.playBgMusic();
    }
    return this.musicEnabled;
  }

  setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
  }

  setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
    if (!val) this.stopBgMusic();
  }

  isSoundOn() {
    return this.soundEnabled;
  }

  isMusicOn() {
    return this.musicEnabled;
  }
}

export const soundSystem = new SoundSystem();
