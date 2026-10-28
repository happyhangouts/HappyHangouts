// Web Audio API Synthesizer for Happy Hangouts Experience
// Engineered for robust mobile (iOS Safari / Android Chrome) & desktop audio

class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private isMuted = false;
  private typeNoteIndex = 0;
  private lastTypeTime = 0;
  private lastClickTime = 0;
  private unlocked = false;

  // Pentatonic musical scale for pleasant, rewarding typing notes (C major pentatonic across 2 octaves)
  private readonly TYPE_FREQS = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50, // C6
    1174.66, // D6
    1318.51  // E6
  ];

  constructor() {
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("happy_hangouts_muted");
      if (savedMute === "true") {
        this.isMuted = true;
      }
    }
  }

  // Initialize AudioContext
  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  // Explicit Mobile Audio Pipeline Unlock (required for iOS Safari and Android Chrome)
  public unlock() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    if (!this.unlocked && this.ctx.state === "running") {
      try {
        // Play 1 sample of silent audio to unlock the hardware output on iOS/Android
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
        this.unlocked = true;
      } catch (e) {
        // ignore
      }
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("happy_hangouts_muted", String(this.isMuted));
    }
    if (!this.isMuted) {
      this.unlock();
      this.playUnlock();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("happy_hangouts_muted", String(muted));
    }
  }

  // =========================================================================
  // TYPING SOUND: Tactile acoustic kalimba drops (Optimized for Mobile & Desktop)
  // =========================================================================
  public playType(key?: string) {
    if (this.isMuted) return;

    // Mobile safe unlock
    this.unlock();

    // Throttle slightly to prevent audio clipping during fast continuous typing
    const nowTs = Date.now();
    if (nowTs - this.lastTypeTime < 25) return;
    this.lastTypeTime = nowTs;

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;

      // Handle special keys with distinct tactile character
      if (key === " " || key === "Space" || key === "Spacebar") {
        // Spacebar: deeper, warmer resonant thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.07);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        return;
      }

      if (key === "Backspace" || key === "Delete") {
        // Backspace: downward tactile scoop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
        return;
      }

      if (key === "Enter") {
        this.playToggle();
        return;
      }

      // Regular letters: cycle through pentatonic scale with subtle variation
      const charCode = key && key.length === 1 ? key.charCodeAt(0) : this.typeNoteIndex;
      const noteFreq = this.TYPE_FREQS[(charCode + this.typeNoteIndex) % this.TYPE_FREQS.length];
      this.typeNoteIndex = (this.typeNoteIndex + 1) % this.TYPE_FREQS.length;

      // 1. Tactile click transient (high-frequency micro-tap)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = "sine";
      clickOsc.frequency.setValueAtTime(1600, now);
      clickOsc.frequency.exponentialRampToValueAtTime(800, now + 0.015);
      clickGain.gain.setValueAtTime(0.07, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.02);

      // 2. Melodic body note (marimba / waterdrop tone)
      const noteOsc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      noteOsc.type = "sine";
      noteOsc.frequency.setValueAtTime(noteFreq, now);
      noteOsc.frequency.exponentialRampToValueAtTime(noteFreq * 0.96, now + 0.06);

      noteGain.gain.setValueAtTime(0.08, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noteOsc.connect(noteGain);
      noteGain.connect(this.ctx.destination);
      noteOsc.start(now);
      noteOsc.stop(now + 0.07);

    } catch (e) {
      // safe ignore
    }
  }

  // =========================================================================
  // CLICK SOUND: Rich, organic tactile pop with resonant tone
  // =========================================================================
  public playClick() {
    if (this.isMuted) return;

    // Mobile safe unlock
    this.unlock();

    // Prevent duplicate triggers within 40ms
    const nowTs = Date.now();
    if (nowTs - this.lastClickTime < 40) return;
    this.lastClickTime = nowTs;

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      
      // Main acoustic bubble pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      // Subtle glass overtone
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      overtone.type = "triangle";
      overtone.frequency.setValueAtTime(1080, now);
      overtone.frequency.exponentialRampToValueAtTime(600, now + 0.04);
      overtoneGain.gain.setValueAtTime(0.045, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      overtone.connect(overtoneGain);
      overtoneGain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.08);
      overtone.stop(now + 0.05);
    } catch (e) {
      console.warn("Audio click failed", e);
    }
  }

  // Slider change tick
  public playSlider(percent = 0.5) {
    if (this.isMuted) return;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const freq = 400 + Math.min(600, percent * 500);
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {
      // safe ignore
    }
  }

  // Beautiful rising melody for switching pages, opening modals, or clicking anchor links
  public playPageTransition() {
    if (this.isMuted) return;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      
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
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {
      // safe ignore
    }
  }

  // Triumph success sound (celebratory 4-note major arpeggio)
  public playSuccess() {
    if (this.isMuted) return;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

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
    if (this.isMuted) return;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

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

  // Unlock or confirmation chime
  public playUnlock() {
    if (this.isMuted) return;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      // safe ignore
    }
  }

  // Beacon activation pulse
  public playBeacon() {
    if (this.isMuted) return;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(330, now); // E4
      osc.frequency.exponentialRampToValueAtTime(165, now + 0.25);

      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      // safe ignore
    }
  }

  // Pentatonic chime sequence on celebration/connection
  public playConnect() {
    if (this.isMuted) return;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      const freqs = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25]; // C4, E4, G4, B4, C5, E5

      freqs.forEach((freq, idx) => {
        const noteDelay = idx * 0.08;
        const noteTime = now + noteDelay;

        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);
        
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.51);
      });
    } catch (e) {
      console.warn("Audio connect failed", e);
    }
  }

  // Synthesize soft ambient background chords
  public toggleAmbient(play: boolean, volume = 0.3) {
    if (this.isMuted) return false;
    this.unlock();

    try {
      this.init();
      if (!this.ctx) return false;

      if (!play) {
        this.stopAmbient();
        return false;
      }

      if (this.isAmbientPlaying) {
        if (this.ambientGain) {
          this.ambientGain.gain.linearRampToValueAtTime(volume * 0.15, this.ctx.currentTime + 1.0);
        }
        return true;
      }

      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});

      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(volume * 0.15, now + 2.0);
      this.ambientGain.connect(this.ctx.destination);

      const rootFreqs = [130.81, 196.00, 246.94, 293.66, 329.63];

      this.ambientOscs = rootFreqs.map((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gainNode = this.ctx!.createGain();

        osc.type = index % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);

        const modSpeed = 0.1 + index * 0.04;
        const modDepth = 0.03 + index * 0.01;
        
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.value = modSpeed;
        lfoGain.gain.value = modDepth;
        lfo.connect(lfoGain);
        
        gainNode.gain.setValueAtTime(0.08 / rootFreqs.length, now);
        lfoGain.connect(gainNode.gain);

        osc.connect(gainNode);
        gainNode.connect(this.ambientGain!);

        lfo.start(now);
        osc.start(now);

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

// =========================================================================
// GLOBAL INTERACTIVE AUDIO HOOK (Supports Mobile Keyboards & Touch Gestures)
// =========================================================================
export function setupGlobalAudioListeners(): () => void {
  if (typeof window === "undefined") return () => {};

  // 1. Mobile & Desktop Unlock Gesture (unlocks iOS / Android audio context on first touch)
  const unlockAudioOnGesture = () => {
    audio.unlock();
  };

  // 2. Physical Keyboard Typing Listener (Desktop)
  const handleKeyDown = (e: KeyboardEvent) => {
    audio.unlock();

    // Ignore standalone modifier keys
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape"].includes(e.key)) {
      return;
    }

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const isInput = 
      target.tagName === "INPUT" || 
      target.tagName === "TEXTAREA" || 
      target.isContentEditable ||
      target.getAttribute("role") === "textbox";

    if (isInput) {
      audio.playType(e.key);
    }
  };

  // 3. Virtual Software Keyboard Typing Listener (CRITICAL FOR MOBILE PHONES)
  // Mobile virtual keyboards (iOS Safari & Android Chrome) fire 'beforeinput' / 'input'
  const handleInputEvent = (e: Event) => {
    audio.unlock();

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Range slider feedback
    if (target.tagName === "INPUT" && (target as HTMLInputElement).type === "range") {
      const min = parseFloat((target as HTMLInputElement).min) || 0;
      const max = parseFloat((target as HTMLInputElement).max) || 100;
      const val = parseFloat((target as HTMLInputElement).value) || 0;
      const percent = (val - min) / (max - min || 1);
      audio.playSlider(percent);
      return;
    }

    // Mobile Virtual Keyboard Typing Feedback
    const isTextInput = 
      (target.tagName === "INPUT" && (target as HTMLInputElement).type !== "range") || 
      target.tagName === "TEXTAREA" || 
      target.isContentEditable;

    if (isTextInput) {
      const inputEvent = e as InputEvent;
      const inputType = inputEvent.inputType;
      
      if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
        audio.playType("Backspace");
      } else if (inputType === "insertLineBreak") {
        audio.playType("Enter");
      } else if (inputEvent.data === " ") {
        audio.playType(" ");
      } else if (inputEvent.data) {
        audio.playType(inputEvent.data);
      } else {
        audio.playType();
      }
    }
  };

  // 4. Delegated Click & Tap Listener (Desktop & Mobile Touch)
  const handleInteraction = (e: Event) => {
    audio.unlock();

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if clicked/tapped element or its parent is interactive
    const clickable = target.closest("button, a, [role='button'], input[type='checkbox'], input[type='radio'], select");
    if (clickable) {
      audio.playClick();
    }
  };

  // Attach touch and click unlock listeners to document
  window.addEventListener("touchstart", unlockAudioOnGesture, { passive: true, capture: true });
  window.addEventListener("touchend", unlockAudioOnGesture, { passive: true, capture: true });
  window.addEventListener("pointerdown", unlockAudioOnGesture, { passive: true, capture: true });
  window.addEventListener("mousedown", unlockAudioOnGesture, { passive: true, capture: true });

  // Attach typing listeners
  window.addEventListener("keydown", handleKeyDown, { passive: true });
  window.addEventListener("input", handleInputEvent, { passive: true });
  window.addEventListener("click", handleInteraction, { passive: true });

  return () => {
    window.removeEventListener("touchstart", unlockAudioOnGesture);
    window.removeEventListener("touchend", unlockAudioOnGesture);
    window.removeEventListener("pointerdown", unlockAudioOnGesture);
    window.removeEventListener("mousedown", unlockAudioOnGesture);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("input", handleInputEvent);
    window.removeEventListener("click", handleInteraction);
  };
}
