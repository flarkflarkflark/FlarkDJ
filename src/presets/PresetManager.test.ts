import { PresetManager } from './PresetManager';
import { EffectState } from '../types';
import * as fs from 'fs';
import * as path from 'path';

describe('PresetManager', () => {
  let manager: PresetManager;
  const testDir = './test-presets';

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    manager = new PresetManager(testDir);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  test('should create a preset', () => {
    const effects: EffectState[] = [{
      effectId: 'filter1',
      effectType: 'filter',
      enabled: true,
      parameters: { cutoff: 1000 }
    }];

    const preset = manager.createPreset('Test Preset', 'A test preset', effects);
    expect(preset.name).toBe('Test Preset');
    expect(preset.effects).toEqual(effects);
  });

  test('should load a preset', () => {
    const effects: EffectState[] = [{
      effectId: 'filter1',
      effectType: 'filter',
      enabled: true,
      parameters: { cutoff: 1000 }
    }];

    const created = manager.createPreset('Test', 'Description', effects);
    const loaded = manager.loadPreset(created.id);
    expect(loaded?.name).toBe('Test');
  });

  test('should update a preset', () => {
    const effects: EffectState[] = [];
    const preset = manager.createPreset('Original', 'Desc', effects);

    const updated = manager.updatePreset(preset.id, { name: 'Updated' });
    expect(updated?.name).toBe('Updated');
  });

  test('should delete a preset', () => {
    const preset = manager.createPreset('Test', 'Desc', []);
    const deleted = manager.deletePreset(preset.id);
    expect(deleted).toBe(true);
    expect(manager.loadPreset(preset.id)).toBeUndefined();
  });

  test('should list all presets', () => {
    manager.createPreset('Preset 1', 'Desc 1', []);
    manager.createPreset('Preset 2', 'Desc 2', []);

    const list = manager.listPresets();
    expect(list.length).toBe(2);
  });

  test('should search presets', () => {
    manager.createPreset('Rock Sound', 'Heavy distortion', []);
    manager.createPreset('Jazz Clean', 'Clean reverb', []);

    const results = manager.searchPresets('rock');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Rock Sound');
  });

  test('should export preset', () => {
    const preset = manager.createPreset('Export Test', 'Test', []);
    const exportPath = path.join(testDir, 'export.json');

    manager.exportPreset(preset.id, exportPath);
    expect(fs.existsSync(exportPath)).toBe(true);
  });

  test('should import preset', () => {
    const preset = manager.createPreset('Original', 'Test', []);
    const exportPath = path.join(testDir, 'export.json');
    manager.exportPreset(preset.id, exportPath);

    const imported = manager.importPreset(exportPath);
    expect(imported.name).toBe('Original');
    expect(imported.id).not.toBe(preset.id);
  });
});
