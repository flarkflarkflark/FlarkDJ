import { BaseEffect } from './BaseEffect';

export class ReverbEffect extends BaseEffect {
  private delayBuffers: Float32Array[];
  private delayIndices: number[];
  private delayLengths: number[];

  constructor(id: string = 'reverb') {
    super(id, 'Reverb');
    this.initializeParameters();

    this.delayLengths = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116];
    this.delayBuffers = this.delayLengths.map(len => new Float32Array(len));
    this.delayIndices = new Array(this.delayLengths.length).fill(0);
  }

  private initializeParameters(): void {
    this.addParameter({
      name: 'roomSize',
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01
    });
    this.addParameter({
      name: 'damping',
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01
    });
    this.addParameter({
      name: 'wetDry',
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.01
    });
  }

  process(input: Float32Array): Float32Array {
    const roomSize = this.getParameter('roomSize') || 0.5;
    const damping = this.getParameter('damping') || 0.5;
    const wetDry = this.getParameter('wetDry') || 0.3;

    const output = new Float32Array(input.length);
    const feedback = 0.5 + (roomSize * 0.48);

    for (let i = 0; i < input.length; i++) {
      let wetSignal = 0;

      for (let j = 0; j < this.delayBuffers.length; j++) {
        const delayedSample = this.delayBuffers[j][this.delayIndices[j]];
        wetSignal += delayedSample;

        const inputSample = input[i] + (delayedSample * feedback * (1 - damping));
        this.delayBuffers[j][this.delayIndices[j]] = inputSample;

        this.delayIndices[j] = (this.delayIndices[j] + 1) % this.delayLengths[j];
      }

      wetSignal /= this.delayBuffers.length;
      output[i] = input[i] * (1 - wetDry) + wetSignal * wetDry;
    }

    return output;
  }
}
