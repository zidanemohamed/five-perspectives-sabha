// Web Audio API Procedural Classical Soundscape Engine
// Features: Tanpura Drone + Veena Plucks + Dynamic Tabla / War Drums (Pakhawaj)
// Transitions seamlessly from Meditative Peace (Veena) to Kurukshetra War Drums (Tabla/Dundubhi) based on Conflict Escalation Index

class SoundscapeEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.volume = 0.45;
    this.escalationLevel = 0.15; // 0.0 (Peace) to 1.0 (War)
    this.masterGain = null;
    this.droneGain = null;
    this.tablaGain = null;
    this.intervalId = null;
    this.rhythmStep = 0;
    this.listeners = new Set();
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Drone bus
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    // Rhythm bus
    this.tablaGain = this.ctx.createGain();
    this.tablaGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    this.tablaGain.connect(this.masterGain);

    this.startDrone();
    this.startRhythmLoop();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener({
        isPlaying: this.isPlaying,
        volume: this.volume,
        escalationLevel: this.escalationLevel,
        moodLabel: this.getMoodLabel()
      });
    }
  }

  getMoodLabel() {
    if (this.escalationLevel < 0.25) return 'Shānti (Veena Meditative Drone)';
    if (this.escalationLevel < 0.55) return 'Sabhā Charchā (Veena + Gentle Keherwa)';
    if (this.escalationLevel < 0.80) return 'Tīvra Sankat (Intense Tabla Syncopation)';
    return 'Kurukshetra Ranabheri (War Drums & Dundubhi)';
  }

  async toggle() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      this.isPlaying = false;
    } else {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.4);
      this.isPlaying = true;
    }
    this.notify();
    return this.isPlaying;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.isPlaying) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  setEscalation(level) {
    this.escalationLevel = Math.max(0, Math.min(1, level));

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Shift relative gain between Veena drone and heavy Tabla
    // At low escalation: Veena is dominant (0.8), Tabla is faint (0.05)
    // At high escalation: Tabla is thunderous (0.9), Veena shifts to tense dissonance
    const droneVol = Math.max(0.2, 0.85 - this.escalationLevel * 0.45);
    const tablaVol = Math.min(0.9, 0.05 + this.escalationLevel * 0.85);

    this.droneGain.gain.linearRampToValueAtTime(droneVol, now + 0.3);
    this.tablaGain.gain.linearRampToValueAtTime(tablaVol, now + 0.3);

    this.notify();
  }

  startDrone() {
    // Tanpura Drone Fundamental: D3 (146.83 Hz) with Sa-Pa-Sa' strings
    const baseFreq = 146.83;
    const pitches = [baseFreq * 0.75, baseFreq, baseFreq * 1.5, baseFreq * 2]; // Pa (low), Sa, Pa, Sa'

    pitches.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const stringGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc2.type = 'sawtooth';

      // Slight natural chorus detuning
      osc.frequency.setValueAtTime(freq + (idx * 0.35 - 0.5), this.ctx.currentTime);
      osc2.frequency.setValueAtTime(freq * 2.01, this.ctx.currentTime); // Harmonic overtone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650 + idx * 200, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime); // Resonant bridge buzz (jawari)

      // LFO for slow breathing swells (simulating tanpura pluck alternation)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18 + idx * 0.07, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      lfo.connect(lfoGain);

      stringGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      lfoGain.connect(stringGain.gain);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(stringGain);
      stringGain.connect(this.droneGain);

      osc.start();
      osc2.start();
      lfo.start();
    });
  }

  playVeenaPluck(freq = 293.66) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    subOsc.type = 'sine';

    // Meend / Gamaka pitch glide
    osc.frequency.setValueAtTime(freq * 0.96, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.06);

    subOsc.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.2, now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.droneGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 1.5);
    subOsc.stop(now + 1.5);
  }

  playTablaBayan(strength = 1.0) {
    // Deep Bass Dagga modulation
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Pitch drops from 125Hz to 58Hz with wrist modulation
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(62, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.55 * strength, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.tablaGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  playTablaDayan(pitch = 380, strength = 1.0) {
    // Crisp ringing Tun / Tin slap
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(pitch * 1.8, now);
    filter.Q.setValueAtTime(6.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.4 * strength, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.tablaGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playWarDundubhi() {
    // Kurukshetra heavy martial kettle drum boom + noise impact
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    // Sub rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.5);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    // Noise skin snap
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(450, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.tablaGain);

    osc.connect(gain);
    gain.connect(this.tablaGain);

    osc.start(now);
    noise.start(now);
    osc.stop(now + 0.7);
    noise.stop(now + 0.15);
  }

  playConchShell() {
    // Shankha trumpet invocation
    if (!this.ctx) this.init();
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    // Conch fundamental ~311 Hz with pitch crescendo
    osc1.frequency.setValueAtTime(285, now);
    osc1.frequency.linearRampToValueAtTime(320, now + 0.4);
    osc1.frequency.linearRampToValueAtTime(311, now + 1.2);

    osc2.frequency.setValueAtTime(622, now); // Octave overtone

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, now);
    filter.Q.setValueAtTime(2.5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.38, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.3);
    osc2.stop(now + 2.3);
  }

  playParchmentSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  startRhythmLoop() {
    // 8-beat cycle (Keherwa style: Dha Ge Na Ti Na Ka Dhi Na)
    const veenaNotes = [220, 246.94, 293.66, 329.63, 370, 440]; // Raga Yaman/Darbari intervals

    const stepTick = () => {
      if (this.isPlaying) {
        const step = this.rhythmStep % 8;

        // At low escalation (< 0.28): Mostly Veena plucks on steps 0, 3, 6
        if (this.escalationLevel < 0.28) {
          if (step === 0 || step === 4) {
            const note = veenaNotes[Math.floor(Math.random() * veenaNotes.length)];
            this.playVeenaPluck(note);
          }
        }
        // At mid escalation (0.28 to 0.70): Tabla rhythm emerges
        else if (this.escalationLevel < 0.70) {
          if (step === 0) {
            this.playTablaBayan(1.0);
            this.playTablaDayan(380, 0.7);
          } else if (step === 2) {
            this.playTablaDayan(420, 0.6);
          } else if (step === 4) {
            this.playTablaBayan(0.7);
          } else if (step === 6) {
            this.playTablaDayan(380, 0.9);
          }
          if (step === 3 && Math.random() > 0.4) {
            this.playVeenaPluck(veenaNotes[step % veenaNotes.length]);
          }
        }
        // At high escalation (> 0.70): Kurukshetra War march drums
        else {
          if (step === 0 || step === 4) {
            this.playWarDundubhi();
          } else if (step === 2 || step === 6) {
            this.playTablaBayan(1.2);
            this.playTablaDayan(360, 1.0);
          } else {
            this.playTablaDayan(440, 0.5);
          }
        }

        this.rhythmStep++;
      }

      // Dynamic tempo: slower when peaceful (~380ms), faster when escalating (~190ms)
      const currentDelay = Math.max(180, 380 - this.escalationLevel * 190);
      this.intervalId = setTimeout(stepTick, currentDelay);
    };

    stepTick();
  }
}

export const audioEngine = new SoundscapeEngine();
