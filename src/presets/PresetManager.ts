import { Preset, EffectState } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class PresetManager {
  private presets: Map<string, Preset> = new Map();
  private presetDirectory: string;

  constructor(presetDirectory: string = './presets') {
    this.presetDirectory = presetDirectory;
    this.loadPresetsFromDisk();
  }

  createPreset(name: string, description: string, effects: EffectState[]): Preset {
    const preset: Preset = {
      id: this.generateId(),
      name,
      description,
      effects,
      created: new Date(),
      modified: new Date()
    };

    this.presets.set(preset.id, preset);
    this.savePreset(preset);
    return preset;
  }

  loadPreset(id: string): Preset | undefined {
    return this.presets.get(id);
  }

  updatePreset(id: string, updates: Partial<Preset>): Preset | undefined {
    const preset = this.presets.get(id);
    if (!preset) return undefined;

    const updated = {
      ...preset,
      ...updates,
      modified: new Date()
    };

    this.presets.set(id, updated);
    this.savePreset(updated);
    return updated;
  }

  deletePreset(id: string): boolean {
    const deleted = this.presets.delete(id);
    if (deleted) {
      this.deletePresetFile(id);
    }
    return deleted;
  }

  listPresets(): Preset[] {
    return Array.from(this.presets.values());
  }

  searchPresets(query: string): Preset[] {
    const lowerQuery = query.toLowerCase();
    return this.listPresets().filter(preset =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.description?.toLowerCase().includes(lowerQuery)
    );
  }

  exportPreset(id: string, filepath: string): void {
    const preset = this.presets.get(id);
    if (!preset) throw new Error(`Preset ${id} not found`);

    fs.writeFileSync(filepath, JSON.stringify(preset, null, 2));
  }

  importPreset(filepath: string): Preset {
    const data = fs.readFileSync(filepath, 'utf-8');
    const preset = JSON.parse(data) as Preset;

    preset.id = this.generateId();
    preset.created = new Date();
    preset.modified = new Date();

    this.presets.set(preset.id, preset);
    this.savePreset(preset);
    return preset;
  }

  private savePreset(preset: Preset): void {
    if (!fs.existsSync(this.presetDirectory)) {
      fs.mkdirSync(this.presetDirectory, { recursive: true });
    }

    const filepath = path.join(this.presetDirectory, `${preset.id}.json`);
    fs.writeFileSync(filepath, JSON.stringify(preset, null, 2));
  }

  private deletePresetFile(id: string): void {
    const filepath = path.join(this.presetDirectory, `${id}.json`);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  private loadPresetsFromDisk(): void {
    if (!fs.existsSync(this.presetDirectory)) {
      fs.mkdirSync(this.presetDirectory, { recursive: true });
      return;
    }

    const files = fs.readdirSync(this.presetDirectory);
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filepath = path.join(this.presetDirectory, file);
          const data = fs.readFileSync(filepath, 'utf-8');
          const preset = JSON.parse(data) as Preset;
          this.presets.set(preset.id, preset);
        } catch (error) {
          console.error(`Failed to load preset ${file}:`, error);
        }
      }
    }
  }

  private generateId(): string {
    return `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
