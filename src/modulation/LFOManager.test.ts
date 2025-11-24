import { LFOManager } from './LFOManager';
import { AudioEngine } from '../core/AudioEngine';
import { FilterEffect } from '../effects/FilterEffect';

describe('LFOManager', () => {
  let manager: LFOManager;
  let engine: AudioEngine;

  beforeEach(() => {
    engine = new AudioEngine(44100);
    manager = new LFOManager(engine, 44100);
  });

  test('should create LFO', () => {
    const lfo = manager.createLFO('lfo1', 2, 'sine');
    expect(lfo.id).toBe('lfo1');
    expect(lfo.rate).toBe(2);
    expect(lfo.waveform).toBe('sine');
  });

  test('should set modulation target', () => {
    const effect = new FilterEffect('filter1');
    engine.addEffect(effect);

    const lfo = manager.createLFO('lfo1');
    manager.setTarget('lfo1', 'filter1', 'cutoff', 0.5);

    expect(lfo.target?.effectId).toBe('filter1');
    expect(lfo.target?.parameterId).toBe('cutoff');
  });

  test('should update LFO parameters', () => {
    manager.createLFO('lfo1', 1, 'sine');
    manager.updateLFO('lfo1', { rate: 5, depth: 0.8 });

    const lfo = manager.getLFO('lfo1');
    expect(lfo?.rate).toBe(5);
    expect(lfo?.depth).toBe(0.8);
  });

  test('should process LFO modulation', () => {
    const effect = new FilterEffect('filter1');
    effect.setParameter('cutoff', 1000);
    engine.addEffect(effect);

    manager.createLFO('lfo1', 1, 'sine');
    manager.setTarget('lfo1', 'filter1', 'cutoff', 0.5);

    manager.process(1024);
    const modulatedValue = effect.getParameter('cutoff');

    expect(modulatedValue).toBeDefined();
  });

  test('should generate different waveforms', () => {
    const waveforms: Array<'sine' | 'square' | 'triangle' | 'sawtooth'> =
      ['sine', 'square', 'triangle', 'sawtooth'];

    waveforms.forEach(waveform => {
      const lfo = manager.createLFO(`lfo_${waveform}`, 1, waveform);
      expect(lfo.waveform).toBe(waveform);
    });
  });

  test('should remove LFO', () => {
    manager.createLFO('lfo1');
    const removed = manager.removeLFO('lfo1');
    expect(removed).toBe(true);
    expect(manager.getLFO('lfo1')).toBeUndefined();
  });

  test('should list all LFOs', () => {
    manager.createLFO('lfo1');
    manager.createLFO('lfo2');
    const list = manager.listLFOs();
    expect(list.length).toBe(2);
  });

  test('should reset all LFOs', () => {
    const lfo = manager.createLFO('lfo1');
    manager.process(1024);
    manager.reset();
    expect(lfo.phase).toBe(0);
  });
});
