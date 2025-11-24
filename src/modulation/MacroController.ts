import { MacroControl, MacroTarget } from '../types';
import { AudioEngine } from '../core/AudioEngine';

export class MacroController {
  private macros: Map<string, MacroControl> = new Map();
  private engine: AudioEngine;

  constructor(engine: AudioEngine) {
    this.engine = engine;
  }

  createMacro(id: string, name: string): MacroControl {
    const macro: MacroControl = {
      id,
      name,
      value: 0.5,
      targets: []
    };

    this.macros.set(id, macro);
    return macro;
  }

  addTarget(
    macroId: string,
    effectId: string,
    parameterId: string,
    min: number,
    max: number,
    curve: 'linear' | 'exponential' | 'logarithmic' = 'linear'
  ): void {
    const macro = this.macros.get(macroId);
    if (!macro) return;

    const target: MacroTarget = {
      effectId,
      parameterId,
      min,
      max,
      curve
    };

    macro.targets.push(target);
  }

  removeTarget(macroId: string, effectId: string, parameterId: string): void {
    const macro = this.macros.get(macroId);
    if (!macro) return;

    macro.targets = macro.targets.filter(
      t => !(t.effectId === effectId && t.parameterId === parameterId)
    );
  }

  setMacroValue(macroId: string, value: number): void {
    const macro = this.macros.get(macroId);
    if (!macro) return;

    macro.value = Math.max(0, Math.min(1, value));
    this.applyMacro(macro);
  }

  private applyMacro(macro: MacroControl): void {
    macro.targets.forEach(target => {
      const effect = this.engine.getEffect(target.effectId);
      if (!effect) return;

      const scaledValue = this.calculateTargetValue(macro.value, target);
      effect.setParameter(target.parameterId, scaledValue);
    });
  }

  private calculateTargetValue(macroValue: number, target: MacroTarget): number {
    let normalizedValue: number;

    switch (target.curve) {
      case 'exponential':
        normalizedValue = Math.pow(macroValue, 2);
        break;

      case 'logarithmic':
        normalizedValue = Math.sqrt(macroValue);
        break;

      case 'linear':
      default:
        normalizedValue = macroValue;
        break;
    }

    return target.min + (target.max - target.min) * normalizedValue;
  }

  getMacro(id: string): MacroControl | undefined {
    return this.macros.get(id);
  }

  deleteMacro(id: string): boolean {
    return this.macros.delete(id);
  }

  listMacros(): MacroControl[] {
    return Array.from(this.macros.values());
  }

  exportMacros(): string {
    return JSON.stringify(Array.from(this.macros.values()));
  }

  importMacros(data: string): void {
    try {
      const macros = JSON.parse(data) as MacroControl[];
      macros.forEach(macro => {
        this.macros.set(macro.id, macro);
      });
    } catch (error) {
      console.error('Failed to import macros:', error);
    }
  }
}
