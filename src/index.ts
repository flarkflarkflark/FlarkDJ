import { AudioEngine } from './core/AudioEngine';
import { PresetManager } from './presets/PresetManager';
import { XYPadController } from './modulation/XYPadController';
import { SpectrumAnalyzer } from './analysis/SpectrumAnalyzer';
import { MIDILearnManager } from './midi/MIDILearnManager';
import { LFOManager } from './modulation/LFOManager';
import { MacroController } from './modulation/MacroController';
import { SnapshotManager } from './snapshots/SnapshotManager';
import { FilterEffect } from './effects/FilterEffect';
import { ReverbEffect } from './effects/ReverbEffect';
import { DelayEffect } from './effects/DelayEffect';

export class FlarkDJ {
  public engine: AudioEngine;
  public presets: PresetManager;
  public xyPad: XYPadController;
  public spectrum: SpectrumAnalyzer;
  public midiLearn: MIDILearnManager;
  public lfo: LFOManager;
  public macros: MacroController;
  public snapshots: SnapshotManager;

  constructor(sampleRate: number = 44100) {
    this.engine = new AudioEngine(sampleRate);
    this.presets = new PresetManager();
    this.xyPad = new XYPadController(this.engine);
    this.spectrum = new SpectrumAnalyzer(this.engine.getContext());
    this.midiLearn = new MIDILearnManager(this.engine);
    this.lfo = new LFOManager(this.engine, sampleRate);
    this.macros = new MacroController(this.engine);
    this.snapshots = new SnapshotManager(this.engine);
  }

  addFilterEffect(id: string = 'filter'): FilterEffect {
    const effect = new FilterEffect(id);
    this.engine.addEffect(effect);
    return effect;
  }

  addReverbEffect(id: string = 'reverb'): ReverbEffect {
    const effect = new ReverbEffect(id);
    this.engine.addEffect(effect);
    return effect;
  }

  addDelayEffect(id: string = 'delay'): DelayEffect {
    const effect = new DelayEffect(id, this.engine.getSampleRate());
    this.engine.addEffect(effect);
    return effect;
  }

  process(input: Float32Array): Float32Array {
    this.lfo.process(input.length);
    return this.engine.process(input);
  }

  getVersion(): string {
    return '1.0.0';
  }
}

export * from './types';
export * from './core/AudioEngine';
export * from './effects/BaseEffect';
export * from './effects/FilterEffect';
export * from './effects/ReverbEffect';
export * from './effects/DelayEffect';
export * from './presets/PresetManager';
export * from './modulation/XYPadController';
export * from './analysis/SpectrumAnalyzer';
export * from './midi/MIDILearnManager';
export * from './modulation/LFOManager';
export * from './modulation/MacroController';
export * from './snapshots/SnapshotManager';
