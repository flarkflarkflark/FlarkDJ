import { PluginWrapper } from './PluginWrapper';

/**
 * Standalone Application for FlarkDJ
 *
 * This creates a standalone application that can run without a DAW.
 * Useful for:
 * - Testing the plugin
 * - Live performance
 * - Audio file processing
 * - Demo purposes
 */

export interface AudioDeviceInfo {
  id: string;
  name: string;
  channels: number;
  sampleRate: number;
}

export interface StandaloneConfig {
  inputDevice?: string;
  outputDevice?: string;
  sampleRate: number;
  bufferSize: number;
  inputChannels: number;
  outputChannels: number;
}

export class StandaloneApp {
  private wrapper: PluginWrapper;
  private config: StandaloneConfig;
  private isProcessing: boolean = false;
  private audioContext: AudioContext | null = null;

  constructor(config?: Partial<StandaloneConfig>) {
    this.config = {
      sampleRate: 44100,
      bufferSize: 512,
      inputChannels: 2,
      outputChannels: 2,
      ...config
    };

    this.wrapper = new PluginWrapper(this.config.sampleRate);
  }

  async initialize(): Promise<boolean> {
    try {
      // Initialize Web Audio API (for browser/electron)
      if (typeof AudioContext !== 'undefined') {
        this.audioContext = new AudioContext({
          sampleRate: this.config.sampleRate
        });
      }

      console.log('Standalone app initialized');
      console.log(`Sample rate: ${this.config.sampleRate}Hz`);
      console.log(`Buffer size: ${this.config.bufferSize} samples`);

      return true;
    } catch (error) {
      console.error('Failed to initialize standalone app:', error);
      return false;
    }
  }

  async startProcessing(): Promise<void> {
    if (this.isProcessing) return;

    try {
      if (this.audioContext) {
        await this.audioContext.resume();
      }

      this.isProcessing = true;
      console.log('Audio processing started');
    } catch (error) {
      console.error('Failed to start processing:', error);
    }
  }

  stopProcessing(): void {
    if (!this.isProcessing) return;

    if (this.audioContext) {
      this.audioContext.suspend();
    }

    this.isProcessing = false;
    console.log('Audio processing stopped');
  }

  processBuffer(
    inputLeft: Float32Array,
    inputRight: Float32Array
  ): { left: Float32Array; right: Float32Array } {
    const outputLeft = new Float32Array(inputLeft.length);
    const outputRight = new Float32Array(inputRight.length);

    this.wrapper.processAudio(inputLeft, inputRight, outputLeft, outputRight);

    return { left: outputLeft, right: outputRight };
  }

  setParameter(id: number, value: number): void {
    this.wrapper.setParameter(id, value);
  }

  getParameter(id: number): number {
    return this.wrapper.getParameter(id);
  }

  getParameters() {
    return this.wrapper.getParameters();
  }

  savePreset(name: string): string {
    const preset = this.wrapper.getPreset();
    preset.name = name;
    return JSON.stringify(preset);
  }

  loadPreset(presetJson: string): void {
    try {
      const preset = JSON.parse(presetJson);
      this.wrapper.loadPreset(preset);
    } catch (error) {
      console.error('Failed to load preset:', error);
    }
  }

  reset(): void {
    this.wrapper.reset();
  }

  getConfig(): StandaloneConfig {
    return { ...this.config };
  }

  getSampleRate(): number {
    return this.config.sampleRate;
  }

  getBufferSize(): number {
    return this.config.bufferSize;
  }

  isActive(): boolean {
    return this.isProcessing;
  }

  // File processing (for batch processing audio files)
  async processAudioFile(
    inputData: Float32Array[],
    sampleRate: number
  ): Promise<Float32Array[]> {
    if (inputData.length !== 2) {
      throw new Error('Only stereo input is supported');
    }

    const outputLeft = new Float32Array(inputData[0].length);
    const outputRight = new Float32Array(inputData[1].length);

    // Process in chunks
    const chunkSize = this.config.bufferSize;
    for (let i = 0; i < inputData[0].length; i += chunkSize) {
      const end = Math.min(i + chunkSize, inputData[0].length);
      const inL = inputData[0].subarray(i, end);
      const inR = inputData[1].subarray(i, end);
      const outL = outputLeft.subarray(i, end);
      const outR = outputRight.subarray(i, end);

      this.wrapper.processAudio(inL, inR, outL, outR);
    }

    return [outputLeft, outputRight];
  }

  shutdown(): void {
    this.stopProcessing();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    console.log('Standalone app shut down');
  }
}

// Create standalone application
export function createStandaloneApp(
  config?: Partial<StandaloneConfig>
): StandaloneApp {
  return new StandaloneApp(config);
}
