export interface AudioEffect {
  id: string;
  name: string;
  enabled: boolean;
  process(input: Float32Array): Float32Array;
  getParameters(): Map<string, EffectParameter>;
  setParameter(name: string, value: number): void;
}

export interface EffectParameter {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  midiCC?: number;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  effects: EffectState[];
  created: Date;
  modified: Date;
}

export interface EffectState {
  effectId: string;
  effectType: string;
  enabled: boolean;
  parameters: Record<string, number>;
}

export interface XYPad {
  x: number;
  y: number;
  xParameter: string;
  yParameter: string;
  effectId: string;
}

export interface MIDILearnConfig {
  parameterId: string;
  effectId: string;
  midiCC: number;
  channel: number;
  min: number;
  max: number;
}

export interface LFO {
  id: string;
  rate: number;
  depth: number;
  waveform: 'sine' | 'square' | 'triangle' | 'sawtooth';
  phase: number;
  target?: ModulationTarget;
}

export interface ModulationTarget {
  effectId: string;
  parameterId: string;
  amount: number;
}

export interface MacroControl {
  id: string;
  name: string;
  value: number;
  targets: MacroTarget[];
}

export interface MacroTarget {
  effectId: string;
  parameterId: string;
  min: number;
  max: number;
  curve?: 'linear' | 'exponential' | 'logarithmic';
}

export interface EffectSnapshot {
  id: string;
  name: string;
  timestamp: Date;
  state: Record<string, EffectState>;
}

export interface SidechainConfig {
  enabled: boolean;
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
}

export interface SpectrumData {
  frequencies: Float32Array;
  magnitudes: Float32Array;
  fftSize: number;
}
