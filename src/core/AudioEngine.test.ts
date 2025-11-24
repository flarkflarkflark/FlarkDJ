import { AudioEngine } from './AudioEngine';
import { BaseEffect } from '../effects/BaseEffect';

class MockEffect extends BaseEffect {
  constructor(id: string) {
    super(id, 'Mock Effect');
  }

  process(input: Float32Array): Float32Array {
    const output = new Float32Array(input.length);
    for (let i = 0; i < input.length; i++) {
      output[i] = input[i] * 0.5;
    }
    return output;
  }
}

describe('AudioEngine', () => {
  let engine: AudioEngine;

  beforeEach(() => {
    engine = new AudioEngine(44100);
  });

  test('should initialize with correct sample rate', () => {
    expect(engine.getSampleRate()).toBe(44100);
  });

  test('should add effect to chain', () => {
    const effect = new MockEffect('test1');
    engine.addEffect(effect);
    expect(engine.getEffect('test1')).toBe(effect);
  });

  test('should remove effect from chain', () => {
    const effect = new MockEffect('test1');
    engine.addEffect(effect);
    engine.removeEffect('test1');
    expect(engine.getEffect('test1')).toBeUndefined();
  });

  test('should process audio through effect chain', () => {
    const input = new Float32Array([1, 1, 1, 1]);
    const effect = new MockEffect('test1');
    engine.addEffect(effect);

    const output = engine.process(input);
    expect(output[0]).toBe(0.5);
  });

  test('should skip disabled effects', () => {
    const input = new Float32Array([1, 1, 1, 1]);
    const effect = new MockEffect('test1');
    effect.enabled = false;
    engine.addEffect(effect);

    const output = engine.process(input);
    expect(output[0]).toBe(1);
  });

  test('should reorder effects correctly', () => {
    const effect1 = new MockEffect('test1');
    const effect2 = new MockEffect('test2');
    engine.addEffect(effect1);
    engine.addEffect(effect2);

    engine.reorderEffects(['test2', 'test1']);
    expect(engine.getEffect('test2')).toBe(effect2);
  });

  test('should clear all effects', () => {
    engine.addEffect(new MockEffect('test1'));
    engine.addEffect(new MockEffect('test2'));
    engine.clearEffects();
    expect(engine.getEffect('test1')).toBeUndefined();
    expect(engine.getEffect('test2')).toBeUndefined();
  });
});
