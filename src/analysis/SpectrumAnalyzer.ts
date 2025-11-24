import { SpectrumData } from '../types';

export class SpectrumAnalyzer {
  private analyser: AnalyserNode;
  private fftSize: number;
  private frequencyData: Float32Array;
  private timeData: Float32Array;

  constructor(context: AudioContext, fftSize: number = 2048) {
    this.fftSize = fftSize;
    this.analyser = context.createAnalyser();
    this.analyser.fftSize = fftSize;
    this.analyser.smoothingTimeConstant = 0.8;

    this.frequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.timeData = new Float32Array(this.analyser.fftSize);
  }

  getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  getSpectrumData(): SpectrumData {
    this.analyser.getFloatFrequencyData(this.frequencyData);

    const nyquist = this.analyser.context.sampleRate / 2;
    const binSize = nyquist / this.analyser.frequencyBinCount;

    const frequencies = new Float32Array(this.analyser.frequencyBinCount);
    for (let i = 0; i < frequencies.length; i++) {
      frequencies[i] = i * binSize;
    }

    return {
      frequencies,
      magnitudes: this.frequencyData,
      fftSize: this.fftSize
    };
  }

  getWaveformData(): Float32Array {
    this.analyser.getFloatTimeDomainData(this.timeData);
    return this.timeData;
  }

  getPeakFrequency(): number {
    this.analyser.getFloatFrequencyData(this.frequencyData);

    let maxIndex = 0;
    let maxValue = -Infinity;

    for (let i = 0; i < this.frequencyData.length; i++) {
      if (this.frequencyData[i] > maxValue) {
        maxValue = this.frequencyData[i];
        maxIndex = i;
      }
    }

    const nyquist = this.analyser.context.sampleRate / 2;
    const binSize = nyquist / this.analyser.frequencyBinCount;
    return maxIndex * binSize;
  }

  getRMS(): number {
    this.analyser.getFloatTimeDomainData(this.timeData);

    let sum = 0;
    for (let i = 0; i < this.timeData.length; i++) {
      sum += this.timeData[i] * this.timeData[i];
    }

    return Math.sqrt(sum / this.timeData.length);
  }

  setFFTSize(size: number): void {
    this.fftSize = size;
    this.analyser.fftSize = size;
    this.frequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.timeData = new Float32Array(this.analyser.fftSize);
  }

  setSmoothingTimeConstant(value: number): void {
    this.analyser.smoothingTimeConstant = Math.max(0, Math.min(1, value));
  }
}
