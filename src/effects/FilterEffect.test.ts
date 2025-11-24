import { FilterEffect } from './FilterEffect';

describe('FilterEffect', () => {
  let filter: FilterEffect;

  beforeEach(() => {
    filter = new FilterEffect('test-filter');
  });

  test('should initialize with default parameters', () => {
    expect(filter.getParameter('cutoff')).toBe(1000);
    expect(filter.getParameter('resonance')).toBe(1);
  });

  test('should update cutoff frequency', () => {
    filter.setParameter('cutoff', 5000);
    expect(filter.getParameter('cutoff')).toBe(5000);
  });

  test('should clamp cutoff to valid range', () => {
    filter.setParameter('cutoff', 50000);
    expect(filter.getParameter('cutoff')).toBe(20000);

    filter.setParameter('cutoff', 10);
    expect(filter.getParameter('cutoff')).toBe(20);
  });

  test('should process audio signal', () => {
    const input = new Float32Array(128);
    for (let i = 0; i < input.length; i++) {
      input[i] = Math.sin(2 * Math.PI * 440 * i / 44100);
    }

    const output = filter.process(input);
    expect(output.length).toBe(input.length);
    expect(output).toBeInstanceOf(Float32Array);
  });

  test('should apply sidechain modulation', () => {
    const input = new Float32Array(128).fill(1);
    const sidechainInput = new Float32Array(128).fill(0.8);

    filter.setSidechainConfig({
      enabled: true,
      threshold: 0.5,
      ratio: 2,
      attack: 0.01,
      release: 0.1
    });

    filter.setSidechainInput(sidechainInput);
    const output = filter.process(input);
    expect(output).toBeDefined();
  });

  test('should change filter type', () => {
    filter.setFilterType('highpass');
    const input = new Float32Array(128).fill(1);
    const output = filter.process(input);
    expect(output).toBeDefined();
  });
});
