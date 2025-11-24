import { LFO } from '../types';
import { AudioEngine } from '../core/AudioEngine';

export class LFOManager {
  private lfos: Map<string, LFO> = new Map();
  private engine: AudioEngine;
  private sampleRate: number;
  private time: number = 0;

  constructor(engine: AudioEngine, sampleRate: number = 44100) {
    this.engine = engine;
    this.sampleRate = sampleRate;
  }

  createLFO(id: string, rate: number = 1, waveform: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine'): LFO {
    const lfo: LFO = {
      id,
      rate,
      depth: 1,
      waveform,
      phase: 0
    };

    this.lfos.set(id, lfo);
    return lfo;
  }

  setTarget(lfoId: string, effectId: string, parameterId: string, amount: number): void {
    const lfo = this.lfos.get(lfoId);
    if (!lfo) return;

    lfo.target = {
      effectId,
      parameterId,
      amount: Math.max(-1, Math.min(1, amount))
    };
  }

  updateLFO(id: string, updates: Partial<LFO>): void {
    const lfo = this.lfos.get(id);
    if (!lfo) return;

    Object.assign(lfo, updates);
  }

  process(bufferSize: number): void {
    this.lfos.forEach(lfo => {
      if (!lfo.target) return;

      const effect = this.engine.getEffect(lfo.target.effectId);
      if (!effect) return;

      const param = effect.getParameters().get(lfo.target.parameterId);
      if (!param) return;

      const modulationValue = this.calculateLFOValue(lfo);

      const range = param.max - param.min;
      const center = param.value;
      const modulation = modulationValue * lfo.depth * lfo.target.amount * (range * 0.5);

      const newValue = Math.max(param.min, Math.min(param.max, center + modulation));
      effect.setParameter(lfo.target.parameterId, newValue);

      lfo.phase += (lfo.rate * bufferSize) / this.sampleRate;
      while (lfo.phase >= 1) lfo.phase -= 1;
    });

    this.time += bufferSize / this.sampleRate;
  }

  private calculateLFOValue(lfo: LFO): number {
    const phase = lfo.phase * 2 * Math.PI;

    switch (lfo.waveform) {
      case 'sine':
        return Math.sin(phase);

      case 'square':
        return lfo.phase < 0.5 ? 1 : -1;

      case 'triangle':
        return lfo.phase < 0.5
          ? -1 + (lfo.phase * 4)
          : 3 - (lfo.phase * 4);

      case 'sawtooth':
        return -1 + (lfo.phase * 2);

      default:
        return 0;
    }
  }

  getLFO(id: string): LFO | undefined {
    return this.lfos.get(id);
  }

  removeLFO(id: string): boolean {
    return this.lfos.delete(id);
  }

  listLFOs(): LFO[] {
    return Array.from(this.lfos.values());
  }

  reset(): void {
    this.lfos.forEach(lfo => {
      lfo.phase = 0;
    });
    this.time = 0;
  }
}
