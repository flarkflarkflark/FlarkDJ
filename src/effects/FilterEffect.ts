import { BaseEffect } from './BaseEffect';
import { SidechainConfig } from '../types';

export class FilterEffect extends BaseEffect {
  private cutoff: number = 1000;
  private resonance: number = 1;
  private filterType: 'lowpass' | 'highpass' | 'bandpass' = 'lowpass';
  private sidechainConfig: SidechainConfig | null = null;
  private sidechainInput: Float32Array | null = null;

  constructor(id: string = 'filter') {
    super(id, 'Filter');
    this.initializeParameters();
  }

  private initializeParameters(): void {
    this.addParameter({
      name: 'cutoff',
      value: 1000,
      min: 20,
      max: 20000,
      step: 1,
      unit: 'Hz'
    });
    this.addParameter({
      name: 'resonance',
      value: 1,
      min: 0.1,
      max: 10,
      step: 0.1
    });
  }

  setSidechainInput(input: Float32Array): void {
    this.sidechainInput = input;
  }

  setSidechainConfig(config: SidechainConfig): void {
    this.sidechainConfig = config;
  }

  setFilterType(type: 'lowpass' | 'highpass' | 'bandpass'): void {
    this.filterType = type;
  }

  process(input: Float32Array): Float32Array {
    this.cutoff = this.getParameter('cutoff') || 1000;
    this.resonance = this.getParameter('resonance') || 1;

    const output = new Float32Array(input.length);

    let modulatedCutoff = this.cutoff;
    if (this.sidechainConfig?.enabled && this.sidechainInput) {
      const sidechainLevel = this.calculateSidechainLevel(this.sidechainInput);
      modulatedCutoff = this.cutoff * (1 - sidechainLevel * 0.8);
    }

    const omega = 2 * Math.PI * modulatedCutoff / 44100;
    const sinOmega = Math.sin(omega);
    const cosOmega = Math.cos(omega);
    const alpha = sinOmega / (2 * this.resonance);

    let b0, b1, b2, a0, a1, a2;

    switch (this.filterType) {
      case 'lowpass':
        b0 = (1 - cosOmega) / 2;
        b1 = 1 - cosOmega;
        b2 = (1 - cosOmega) / 2;
        a0 = 1 + alpha;
        a1 = -2 * cosOmega;
        a2 = 1 - alpha;
        break;
      case 'highpass':
        b0 = (1 + cosOmega) / 2;
        b1 = -(1 + cosOmega);
        b2 = (1 + cosOmega) / 2;
        a0 = 1 + alpha;
        a1 = -2 * cosOmega;
        a2 = 1 - alpha;
        break;
      case 'bandpass':
        b0 = alpha;
        b1 = 0;
        b2 = -alpha;
        a0 = 1 + alpha;
        a1 = -2 * cosOmega;
        a2 = 1 - alpha;
        break;
    }

    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

    for (let i = 0; i < input.length; i++) {
      const x0 = input[i];
      const y0 = (b0 / a0) * x0 + (b1 / a0) * x1 + (b2 / a0) * x2
                 - (a1 / a0) * y1 - (a2 / a0) * y2;

      output[i] = y0;

      x2 = x1;
      x1 = x0;
      y2 = y1;
      y1 = y0;
    }

    return output;
  }

  private calculateSidechainLevel(input: Float32Array): number {
    if (!this.sidechainConfig) return 0;

    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      sum += Math.abs(input[i]);
    }
    const rms = sum / input.length;

    if (rms > this.sidechainConfig.threshold) {
      return Math.min(1, (rms - this.sidechainConfig.threshold) * this.sidechainConfig.ratio);
    }
    return 0;
  }
}
