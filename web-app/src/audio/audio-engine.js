/**
 * Audio Engine - Core audio processing system using Web Audio API
 */

export class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.analyzer = null;

    // Audio sources
    this.microphoneStream = null;
    this.microphoneSource = null;
    this.audioElement = null;
    this.audioElementSource = null;

    // Current active source
    this.currentSource = null;
    this.sourceType = 'none'; // 'none', 'microphone', 'file'

    // Effect nodes
    this.effects = new Map();

    // VU Meter animation
    this.vuMeterInterval = null;
  }

  /**
   * Initialize the audio context and nodes
   */
  async init() {
    // Create audio context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create master gain node
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.75;

    // Create analyzer for VU meter
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 2048;
    this.analyzer.smoothingTimeConstant = 0.8;

    // Connect analyzer to master gain
    this.masterGain.connect(this.analyzer);
    this.analyzer.connect(this.audioContext.destination);

    // Start VU meter updates
    this.startVUMeter();

    console.log('🔊 Audio Engine initialized - Sample Rate:', this.audioContext.sampleRate);
  }

  /**
   * Start microphone input
   */
  async startMicrophoneInput() {
    // Stop any current input
    await this.stopInput();

    try {
      // Request microphone access
      this.microphoneStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      // Create source from stream
      this.microphoneSource = this.audioContext.createMediaStreamSource(this.microphoneStream);

      // Set as current source
      this.currentSource = this.microphoneSource;
      this.sourceType = 'microphone';

      // Connect to master gain (initially)
      this.currentSource.connect(this.masterGain);

      console.log('🎤 Microphone input started');

    } catch (error) {
      console.error('Failed to start microphone:', error);
      throw error;
    }
  }

  /**
   * Load audio file
   */
  async loadAudioFile(file) {
    // Stop any current input
    await this.stopInput();

    try {
      // Create audio element
      this.audioElement = new Audio();
      this.audioElement.src = URL.createObjectURL(file);
      this.audioElement.loop = true;

      // Wait for audio to be loadable
      await new Promise((resolve, reject) => {
        this.audioElement.addEventListener('canplaythrough', resolve, { once: true });
        this.audioElement.addEventListener('error', reject, { once: true });
      });

      // Create source from audio element
      this.audioElementSource = this.audioContext.createMediaElementSource(this.audioElement);

      // Set as current source
      this.currentSource = this.audioElementSource;
      this.sourceType = 'file';

      // Connect to master gain (initially)
      this.currentSource.connect(this.masterGain);

      console.log('📁 Audio file loaded');

    } catch (error) {
      console.error('Failed to load audio file:', error);
      throw error;
    }
  }

  /**
   * Stop current input
   */
  async stopInput() {
    // Disconnect current source
    if (this.currentSource) {
      try {
        this.currentSource.disconnect();
      } catch (e) {
        // Already disconnected
      }
    }

    // Stop microphone stream
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
      this.microphoneStream = null;
      this.microphoneSource = null;
    }

    // Stop and clean up audio element
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      URL.revokeObjectURL(this.audioElement.src);
      this.audioElement = null;
      this.audioElementSource = null;
    }

    this.currentSource = null;
    this.sourceType = 'none';
  }

  /**
   * Play audio (for file source)
   */
  play() {
    if (this.sourceType === 'file' && this.audioElement) {
      this.audioElement.play();
    }
  }

  /**
   * Pause audio (for file source)
   */
  pause() {
    if (this.sourceType === 'file' && this.audioElement) {
      this.audioElement.pause();
    }
  }

  /**
   * Stop audio (for file source)
   */
  stop() {
    if (this.sourceType === 'file' && this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  /**
   * Set master volume
   */
  setMasterVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(value, this.audioContext.currentTime);
    }
  }

  /**
   * Get current audio source node
   */
  getSourceNode() {
    return this.currentSource;
  }

  /**
   * Get master output node
   */
  getOutputNode() {
    return this.masterGain;
  }

  /**
   * Get audio context
   */
  getContext() {
    return this.audioContext;
  }

  /**
   * Register an effect
   */
  registerEffect(id, effect) {
    this.effects.set(id, effect);
  }

  /**
   * Unregister an effect
   */
  unregisterEffect(id) {
    const effect = this.effects.get(id);
    if (effect) {
      effect.dispose();
      this.effects.delete(id);
    }
  }

  /**
   * Get an effect by ID
   */
  getEffect(id) {
    return this.effects.get(id);
  }

  /**
   * Start VU meter updates
   */
  startVUMeter() {
    const leftMeter = document.getElementById('vuMeterLeft');
    const rightMeter = document.getElementById('vuMeterRight');

    if (!leftMeter || !rightMeter) return;

    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateMeters = () => {
      this.analyzer.getByteTimeDomainData(dataArray);

      // Calculate RMS (Root Mean Square) for level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / bufferLength);
      const db = 20 * Math.log10(rms + 0.0001); // Add small value to avoid log(0)

      // Convert dB to percentage (scale from -60dB to 0dB)
      const percentage = Math.max(0, Math.min(100, ((db + 60) / 60) * 100));

      // Update both meters (stereo visualization)
      leftMeter.style.height = percentage + '%';
      rightMeter.style.height = (percentage * 0.95) + '%'; // Slightly different for visual effect

      // Change color based on level
      const color = percentage > 90 ? '#e74c3c' :
                    percentage > 70 ? '#ff8c42' :
                    '#2ecc71';
      leftMeter.style.background = `linear-gradient(to top, ${color}, ${color}88)`;
      rightMeter.style.background = `linear-gradient(to top, ${color}, ${color}88)`;
    };

    // Update at 60fps
    this.vuMeterInterval = setInterval(updateMeters, 1000 / 60);
  }

  /**
   * Stop VU meter updates
   */
  stopVUMeter() {
    if (this.vuMeterInterval) {
      clearInterval(this.vuMeterInterval);
      this.vuMeterInterval = null;
    }
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    this.stopVUMeter();
    this.stopInput();

    // Dispose all effects
    this.effects.forEach(effect => effect.dispose());
    this.effects.clear();

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
