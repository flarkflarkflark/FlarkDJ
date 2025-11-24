import { FlarkDJ } from './index';

describe('FlarkDJ', () => {
  let flark: FlarkDJ;

  beforeEach(() => {
    flark = new FlarkDJ(44100);
  });

  test('should initialize all managers', () => {
    expect(flark.engine).toBeDefined();
    expect(flark.presets).toBeDefined();
    expect(flark.xyPad).toBeDefined();
    expect(flark.spectrum).toBeDefined();
    expect(flark.midiLearn).toBeDefined();
    expect(flark.lfo).toBeDefined();
    expect(flark.macros).toBeDefined();
    expect(flark.snapshots).toBeDefined();
  });

  test('should add filter effect', () => {
    const filter = flark.addFilterEffect('test-filter');
    expect(filter).toBeDefined();
    expect(flark.engine.getEffect('test-filter')).toBe(filter);
  });

  test('should add reverb effect', () => {
    const reverb = flark.addReverbEffect('test-reverb');
    expect(reverb).toBeDefined();
    expect(flark.engine.getEffect('test-reverb')).toBe(reverb);
  });

  test('should add delay effect', () => {
    const delay = flark.addDelayEffect('test-delay');
    expect(delay).toBeDefined();
    expect(flark.engine.getEffect('test-delay')).toBe(delay);
  });

  test('should process audio', () => {
    const input = new Float32Array(128).fill(1);
    const filter = flark.addFilterEffect();

    const output = flark.process(input);
    expect(output).toBeDefined();
    expect(output.length).toBe(128);
  });

  test('should return version', () => {
    expect(flark.getVersion()).toBe('1.0.0');
  });

  test('should integrate LFO with effects', () => {
    const filter = flark.addFilterEffect('filter1');
    filter.setParameter('cutoff', 1000);

    const lfo = flark.lfo.createLFO('lfo1', 2);
    flark.lfo.setTarget('lfo1', 'filter1', 'cutoff', 0.5);

    const input = new Float32Array(1024).fill(1);
    flark.process(input);

    expect(flark.lfo.getLFO('lfo1')).toBeDefined();
  });

  test('should integrate macros with effects', () => {
    const filter = flark.addFilterEffect('filter1');

    const macro = flark.macros.createMacro('macro1', 'Test Macro');
    flark.macros.addTarget('macro1', 'filter1', 'cutoff', 100, 10000);
    flark.macros.setMacroValue('macro1', 0.75);

    const cutoff = filter.getParameter('cutoff');
    expect(cutoff).toBeGreaterThan(100);
    expect(cutoff).toBeLessThan(10000);
  });

  test('should create and recall snapshots', () => {
    const filter = flark.addFilterEffect('filter1');
    filter.setParameter('cutoff', 5000);

    const snapshot = flark.snapshots.captureSnapshot('Test Scene');
    filter.setParameter('cutoff', 1000);

    flark.snapshots.recallSnapshot(snapshot.id);
    expect(filter.getParameter('cutoff')).toBe(5000);
  });
});
