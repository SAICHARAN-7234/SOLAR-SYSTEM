class CosmicAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscBass: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private shimmerLfo: OscillatorNode | null = null;
  private pinkNoiseNode: AudioBufferSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  public init() {
    if (this.audioCtx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioCtx();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 64;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    // 1. Sub-bass Resonant Drone (55Hz / A1 fundamental)
    this.oscBass = this.audioCtx.createOscillator();
    this.oscBass.type = 'sine';
    this.oscBass.frequency.setValueAtTime(55, this.audioCtx.currentTime);

    const bassFilter = this.audioCtx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(110, this.audioCtx.currentTime);
    bassFilter.Q.setValueAtTime(4.0, this.audioCtx.currentTime);

    const bassGain = this.audioCtx.createGain();
    bassGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

    this.oscBass.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.masterGain);
    this.oscBass.start();

    // 2. Harmonic Shimmer (164.81 Hz / 3rd harmonic overtone + slow LFO celestial drift)
    this.oscHarmonic = this.audioCtx.createOscillator();
    this.oscHarmonic.type = 'triangle';
    this.oscHarmonic.frequency.setValueAtTime(164.81, this.audioCtx.currentTime);

    this.shimmerLfo = this.audioCtx.createOscillator();
    this.shimmerLfo.frequency.setValueAtTime(0.12, this.audioCtx.currentTime);
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(10, this.audioCtx.currentTime);
    this.shimmerLfo.connect(lfoGain);
    lfoGain.connect(this.oscHarmonic.frequency);
    this.shimmerLfo.start();

    const shimmerFilter = this.audioCtx.createBiquadFilter();
    shimmerFilter.type = 'bandpass';
    shimmerFilter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    shimmerFilter.Q.setValueAtTime(2.5, this.audioCtx.currentTime);

    const shimmerGain = this.audioCtx.createGain();
    shimmerGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

    this.oscHarmonic.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(this.masterGain);
    this.oscHarmonic.start();

    // 3. Cosmic Deep-Space Pink Noise
    const sampleRate = this.audioCtx.sampleRate;
    const bufferSize = sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(2, bufferSize, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const output = noiseBuffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }
    }

    this.pinkNoiseNode = this.audioCtx.createBufferSource();
    this.pinkNoiseNode.buffer = noiseBuffer;
    this.pinkNoiseNode.loop = true;

    const noiseFilter = this.audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);

    this.pinkNoiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    this.pinkNoiseNode.start();
  }

  public toggle(): boolean {
    if (!this.audioCtx) {
      this.init();
    }
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = !this.isPlaying;

    if (this.masterGain && this.audioCtx) {
      if (this.isPlaying) {
        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.25, this.audioCtx.currentTime + 1.2);
      } else {
        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.8);
      }
    }

    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getWaveformData(): number[] {
    if (!this.isPlaying || !this.analyser || !this.dataArray) {
      return [4, 4, 4, 4];
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    return [
      Math.max(3, (this.dataArray[1] / 255) * 14 + 3),
      Math.max(3, (this.dataArray[3] / 255) * 16 + 4),
      Math.max(3, (this.dataArray[5] / 255) * 12 + 3),
      Math.max(3, (this.dataArray[8] / 255) * 8 + 2)
    ];
  }
}

export const cosmicAudio = new CosmicAudioSynthesizer();
