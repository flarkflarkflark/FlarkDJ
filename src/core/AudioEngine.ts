import { AudioEffect } from '../types';

export class AudioEngine {
  private context: AudioContext;
  private analyser: AnalyserNode;
  private effectChain: AudioEffect[] = [];
  private sampleRate: number;

  constructor(sampleRate: number = 44100) {
    this.sampleRate = sampleRate;
    this.context = new AudioContext({ sampleRate });
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
  }

  addEffect(effect: AudioEffect): void {
    this.effectChain.push(effect);
  }

  removeEffect(effectId: string): void {
    this.effectChain = this.effectChain.filter(e => e.id !== effectId);
  }

  getEffect(effectId: string): AudioEffect | undefined {
    return this.effectChain.find(e => e.id === effectId);
  }

  reorderEffects(newOrder: string[]): void {
    const ordered: AudioEffect[] = [];
    for (const id of newOrder) {
      const effect = this.effectChain.find(e => e.id === id);
      if (effect) ordered.push(effect);
    }
    this.effectChain = ordered;
  }

  process(input: Float32Array): Float32Array {
    let output = input;
    for (const effect of this.effectChain) {
      if (effect.enabled) {
        output = effect.process(output);
      }
    }
    return output;
  }

  getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  getSampleRate(): number {
    return this.sampleRate;
  }

  getContext(): AudioContext {
    return this.context;
  }

  clearEffects(): void {
    this.effectChain = [];
  }
}
