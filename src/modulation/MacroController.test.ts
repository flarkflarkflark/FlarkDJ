import { MacroController } from './MacroController';
import { AudioEngine } from '../core/AudioEngine';
import { FilterEffect } from '../effects/FilterEffect';

describe('MacroController', () => {
  let controller: MacroController;
  let engine: AudioEngine;

  beforeEach(() => {
    engine = new AudioEngine(44100);
    controller = new MacroController(engine);
  });

  test('should create macro', () => {
    const macro = controller.createMacro('macro1', 'Master Control');
    expect(macro.id).toBe('macro1');
    expect(macro.name).toBe('Master Control');
    expect(macro.value).toBe(0.5);
  });

  test('should add target to macro', () => {
    const effect = new FilterEffect('filter1');
    engine.addEffect(effect);

    controller.createMacro('macro1', 'Test');
    controller.addTarget('macro1', 'filter1', 'cutoff', 100, 10000);

    const macro = controller.getMacro('macro1');
    expect(macro?.targets.length).toBe(1);
  });

  test('should remove target from macro', () => {
    const effect = new FilterEffect('filter1');
    engine.addEffect(effect);

    controller.createMacro('macro1', 'Test');
    controller.addTarget('macro1', 'filter1', 'cutoff', 100, 10000);
    controller.removeTarget('macro1', 'filter1', 'cutoff');

    const macro = controller.getMacro('macro1');
    expect(macro?.targets.length).toBe(0);
  });

  test('should apply macro value linearly', () => {
    const effect = new FilterEffect('filter1');
    engine.addEffect(effect);

    controller.createMacro('macro1', 'Test');
    controller.addTarget('macro1', 'filter1', 'cutoff', 100, 10000, 'linear');
    controller.setMacroValue('macro1', 0.5);

    const cutoff = effect.getParameter('cutoff');
    expect(cutoff).toBeCloseTo(5050, 0);
  });

  test('should apply exponential curve', () => {
    const effect = new FilterEffect('filter1');
    engine.addEffect(effect);

    controller.createMacro('macro1', 'Test');
    controller.addTarget('macro1', 'filter1', 'cutoff', 100, 10000, 'exponential');
    controller.setMacroValue('macro1', 0.5);

    const cutoff = effect.getParameter('cutoff');
    expect(cutoff).toBeLessThan(5050);
  });

  test('should apply logarithmic curve', () => {
    const effect = new FilterEffect('filter1');
    engine.addEffect(effect);

    controller.createMacro('macro1', 'Test');
    controller.addTarget('macro1', 'filter1', 'cutoff', 100, 10000, 'logarithmic');
    controller.setMacroValue('macro1', 0.5);

    const cutoff = effect.getParameter('cutoff');
    expect(cutoff).toBeGreaterThan(5050);
  });

  test('should clamp macro value between 0 and 1', () => {
    controller.createMacro('macro1', 'Test');
    controller.setMacroValue('macro1', 2);

    const macro = controller.getMacro('macro1');
    expect(macro?.value).toBe(1);
  });

  test('should delete macro', () => {
    controller.createMacro('macro1', 'Test');
    const deleted = controller.deleteMacro('macro1');
    expect(deleted).toBe(true);
    expect(controller.getMacro('macro1')).toBeUndefined();
  });

  test('should export and import macros', () => {
    controller.createMacro('macro1', 'Test');
    const exported = controller.exportMacros();

    const newController = new MacroController(engine);
    newController.importMacros(exported);

    const imported = newController.getMacro('macro1');
    expect(imported?.name).toBe('Test');
  });
});
