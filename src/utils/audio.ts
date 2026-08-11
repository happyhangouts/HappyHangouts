// Web Audio API Synthesizer for Happy Hangouts Experience
// No external assets required, synthesized completely in-browser

class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private lfo: OscillatorNode | null = null;

  // Initialize safe AudioContext upon user gesture
  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  // Soft, organic UI Click (warm wood-like sound)
  public playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      // Start high, slide down rapidly for a organic pop
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn("Audio click failed", e);
    }
  }

  // Beautiful rising melody for switching pages, opening modals, or clicking anchor links
  public playPageTransition() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      
      // Node 1: E4 sliding to A4
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(329.63, now); // E4
      osc1.frequency.exponentialRampToValueAtTime(440.00, now + 0.12); // A4
      
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Node 2 (delayed offset): C#5 sliding to E5
      const delay = 0.06;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(554.37, now + delay); // C#5
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + delay + 0.12); // E5
      
      gain2.gain.setValueAtTime(0, now + delay);
      gain2.gain.linearRampToValueAtTime(0.10, now + delay + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);
      
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.16);
    } catch (e) {
      console.warn("Page transition sound failed", e);
    }
  }

  // Soft high-frequency hover sparkle
  public playHover() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      // safe ignore
    }
  }

  // Satisfying roulette tick sound with slight pitch increase on each step
  public playRouletteTick(step = 1) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const baseFreq = 500 + step * 40; // rising pitch
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // safe ignore
    }
  }

  // Triumph success sound (celebratory 3-note major arpeggio)
  public playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      freqs.forEach((freq, idx) => {
        const noteDelay = idx * 0.07;
        const noteTime = now + noteDelay;

        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.36);
      });
    } catch (e) {
      console.warn("Success sound failed", e);
    }
  }

  // Crispy toggle sound for switches and tabs
  public playToggle() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      // safe ignore
    }
  }

  // Beacon activation pulse
  public playBeacon() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(330, now); // E4
      osc.frequency.exponentialRampToValueAtTime(165, now + 0.3);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.31);
    } catch (e) {
      // safe ignore
    }
  }

  // Beautiful, magical pentatonic chime sequence when Happy Key is connected
  public playConnect() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      // Beautiful major/pentatonic chords (C major 7, etc.)
      const freqs = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25]; // C4, E4, G4, B4, C5, E5

      freqs.forEach((freq, idx) => {
        const noteDelay = idx * 0.08;
        const noteTime = now + noteDelay;

        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        // Warm triangle wave for organic marimba/rhodes vibe
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);
        
        // Gentle vibrato
        const vibrato = this.ctx!.createOscillator();
        const vibratoGain = this.ctx!.createGain();
        vibrato.frequency.value = 6; // 6 Hz vibrato
        vibratoGain.gain.value = 4; // microtonal detune
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        vibrato.start(noteTime);
        osc.start(noteTime);
        
        vibrato.stop(noteTime + 0.61);
        osc.stop(noteTime + 0.61);
      });
    } catch (e) {
      console.warn("Audio connect failed", e);
    }
  }

  // Synthesize soft, warm, evolving ambient background chords
  // (Analog warm pad style)
  public toggleAmbient(play: boolean, volume = 0.3) {
    try {
      this.init();
      if (!this.ctx) return false;

      if (!play) {
        this.stopAmbient();
        return false;
      }

      if (this.isAmbientPlaying) {
        // Adjust volume if already playing
        if (this.ambientGain) {
          this.ambientGain.gain.linearRampToValueAtTime(volume * 0.15, this.ctx.currentTime + 1.0);
        }
        return true;
      }

      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(volume * 0.15, now + 2.0); // Smooth 2s fade in
      this.ambientGain.connect(this.ctx.destination);

      // Evolving warm pad chord frequencies (Maj9 ambient chord: C3, G3, B3, D4, E4)
      const rootFreqs = [130.81, 196.00, 246.94, 293.66, 329.63];

      this.ambientOscs = rootFreqs.map((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gainNode = this.ctx!.createGain();

        // Mix triangle and sine to get a warm, soft tone
        osc.type = index % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Slow, offset modulation on each note's volume for an evolving "breathing" texture
        const modSpeed = 0.1 + index * 0.04; // Very slow LFO
        const modDepth = 0.03 + index * 0.01;
        
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.value = modSpeed;
        lfoGain.gain.value = modDepth;
        lfo.connect(lfoGain);
        
        // Base gain
        gainNode.gain.setValueAtTime(0.08 / rootFreqs.length, now);
        lfoGain.connect(gainNode.gain);

        osc.connect(gainNode);
        gainNode.connect(this.ambientGain!);

        lfo.start(now);
        osc.start(now);

        // Keep tracks of objects
        return { osc, gain: gainNode };
      });

      this.isAmbientPlaying = true;
      return true;
    } catch (e) {
      console.warn("Ambient toggle failed", e);
      return false;
    }
  }

  private stopAmbient() {
    try {
      if (!this.ctx || !this.isAmbientPlaying) return;
      const now = this.ctx.currentTime;

      if (this.ambientGain) {
        // Smooth 1.5s fade out
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.linearRampToValueAtTime(0, now + 1.5);
      }

      setTimeout(() => {
        this.ambientOscs.forEach(({ osc }) => {
          try {
            osc.stop();
          } catch (e) {}
        });
        this.ambientOscs = [];
        this.isAmbientPlaying = false;
      }, 1600);
    } catch (e) {
      console.warn("Stop ambient failed", e);
    }
  }

  public getIsPlaying() {
    return this.isAmbientPlaying;
  }
}

export const audio = new AudioEngine();
