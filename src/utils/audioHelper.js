// Web Audio API generator for simulated WhatsApp/Instagram voice note playback

class SimulatedAudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.timer = null;
    this.currentPosition = 0;
    this.duration = 18; // 18 seconds
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  play(onProgress, onEnd) {
    this.initContext();
    this.isPlaying = true;

    // Beep start tone (like Instagram voice message start)
    this.playTone(520, 0.08, 'sine');
    setTimeout(() => this.playTone(680, 0.08, 'sine'), 90);

    // Ambient voice-like modulation using synthesized formant frequencies
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(3, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();

    // Rhythmic murmur pattern
    const modulateInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(modulateInterval);
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
        return;
      }
      const randomFreq = 120 + Math.random() * 80;
      osc.frequency.setValueAtTime(randomFreq, this.audioCtx.currentTime);
    }, 180);

    this.timer = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(this.timer);
        return;
      }
      this.currentPosition += 0.2;
      if (onProgress) {
        onProgress(Math.min(this.currentPosition, this.duration));
      }

      if (this.currentPosition >= this.duration) {
        this.stop();
        if (onEnd) onEnd();
      }
    }, 200);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.currentPosition = 0;
  }

  playTone(freq, duration, type = 'sine') {
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }
}

export const simulatedAudio = new SimulatedAudioPlayer();
