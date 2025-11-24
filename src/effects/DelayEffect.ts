import { BaseEffect } from './BaseEffect';

export class DelayEffect extends BaseEffect {
  private buffer: Float32Array;
  private writeIndex: number = 0;
  private sampleRate: number;

  constructor(id: string = 'delay', sampleRate: number = 44100) {
    super(id, 'Delay');
    this.sampleRate = sampleRate;
    this.buffer = new Float32Array(sampleRate * 2);
    this.initializeParameters();
  }

  private initializeParameters(): void {
    this.addParameter({
      name: 'time',
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.01,
      unit: 's'
    });
    this.addParameter({
      name: 'feedback',
      value: 0.3,
      min: 0,
      max: 0.95,
      step: 0.01
    });
    this.addParameter({
      name: 'wetDry',
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01
    });
  }

  process(input: Float32Array): Float32Array {
    const time = this.getParameter('time') || 0.5;
    const feedback = this.getParameter('feedback') || 0.3;
    const wetDry = this.getParameter('wetDry') || 0.5;

    const output = new Float32Array(input.length);
    const delaySamples = Math.floor(time * this.sampleRate);

    for (let i = 0; i < input.length; i++) {
      const readIndex = (this.writeIndex - delaySamples + this.buffer.length) % this.buffer.length;
      const delayedSample = this.buffer[readIndex];

      this.buffer[this.writeIndex] = input[i] + (delayedSample * feedback);
      output[i] = input[i] * (1 - wetDry) + delayedSample * wetDry;

      this.writeIndex = (this.writeIndex + 1) % this.buffer.length;
    }

    return output;
  }
}
