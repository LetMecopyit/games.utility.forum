/**
 * games.utility.forum - Procedural Audio & Retro Synth Engine
 * Uses Web Audio API for lightweight, zero-dependency 8-bit / synth music & sound effects.
 */

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.isMuted = localStorage.getItem('guf_audio_muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('guf_audio_vol')) || 0.25;
    this.musicTimer = null;
    this.musicStep = 0;
    this.gainNode = null;
    this.subscribers = [];

    // Chiptune / Synthwave arpeggio notes in Hz
    // Progression: Em -> C -> G -> D (Classic driving synthwave vibe)
    this.melodyChords = [
      [164.81, 196.00, 246.94, 329.63, 392.00, 493.88], // E minor
      [130.81, 164.81, 196.00, 261.63, 329.63, 392.00], // C major
      [196.00, 246.94, 293.66, 392.00, 493.88, 587.33], // G major
      [146.83, 185.00, 220.00, 293.66, 369.99, 440.00]  // D major
    ];
  }

  // Ensure AudioContext is initialized after user interaction (browser policy)
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Subscribe to state changes (for updating UI buttons/pulse)
  onChange(cb) {
    this.subscribers.push(cb);
  }

  notify() {
    this.subscribers.forEach(cb => cb({
      isPlaying: this.isPlayingMusic,
      isMuted: this.isMuted,
      volume: this.volume
    }));
  }

  // Master Volume Toggle / Mute
  toggleMute() {
    this.initContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('guf_audio_muted', this.isMuted);

    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }

    if (!this.isMuted && !this.isPlayingMusic) {
      this.startMusic();
    }
    this.notify();
    return this.isMuted;
  }

  // Start Ambient Background Synth Music
  startMusic() {
    this.initContext();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.musicStep = 0;

    const tempoMs = 135; // ~110 BPM 16th notes
    this.musicTimer = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      this.playSynthNote();
      this.musicStep++;
    }, tempoMs);

    this.notify();
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.isPlayingMusic = false;
    this.notify();
  }

  toggleMusic() {
    if (this.isPlayingMusic) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  playSynthNote() {
    try {
      const chordIndex = Math.floor((this.musicStep / 16) % this.melodyChords.length);
      const chord = this.melodyChords[chordIndex];
      const noteIndex = this.musicStep % chord.length;
      const freq = chord[noteIndex];

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Alternate waveform for rich arcade atmosphere
      osc.type = (this.musicStep % 4 === 0) ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Lowpass filter for dreamy retro vibe
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.06 * (this.isMuted ? 0 : 1), now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.2);

      // Add a subtle kick on every 4th beat
      if (this.musicStep % 8 === 0) {
        this.playBassDrum();
      }
    } catch (e) {
      console.warn('Audio playback glitch caught:', e);
    }
  }

  playBassDrum() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    kickGain.gain.setValueAtTime(0.12, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(kickGain);
    kickGain.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // SFX: Coin collected
  playCoin() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const sfxGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    sfxGain.gain.setValueAtTime(0.15, now);
    sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(sfxGain);
    sfxGain.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // SFX: Laser / Shoot
  playLaser() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const sfxGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

    sfxGain.gain.setValueAtTime(0.12, now);
    sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(sfxGain);
    sfxGain.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // SFX: Game Over
  playGameOver() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const sfxGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(293.66, now);
    osc.frequency.setValueAtTime(261.63, now + 0.15);
    osc.frequency.setValueAtTime(220.00, now + 0.3);
    osc.frequency.setValueAtTime(164.81, now + 0.45);

    sfxGain.gain.setValueAtTime(0.18, now);
    sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(sfxGain);
    sfxGain.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + 0.72);
  }
}

// Global Singleton Instance
window.gufAudio = new RetroAudioEngine();
