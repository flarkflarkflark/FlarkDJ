import { XYPad } from '../types';
import { AudioEngine } from '../core/AudioEngine';

export class XYPadController {
  private pads: Map<string, XYPad> = new Map();
  private engine: AudioEngine;

  constructor(engine: AudioEngine) {
    this.engine = engine;
  }

  createPad(id: string, effectId: string, xParameter: string, yParameter: string): XYPad {
    const pad: XYPad = {
      x: 0.5,
      y: 0.5,
      xParameter,
      yParameter,
      effectId
    };

    this.pads.set(id, pad);
    return pad;
  }

  updatePadPosition(id: string, x: number, y: number): void {
    const pad = this.pads.get(id);
    if (!pad) return;

    pad.x = Math.max(0, Math.min(1, x));
    pad.y = Math.max(0, Math.min(1, y));

    this.applyPadValues(pad);
  }

  getPad(id: string): XYPad | undefined {
    return this.pads.get(id);
  }

  deletePad(id: string): boolean {
    return this.pads.delete(id);
  }

  morphBetweenEffects(padId: string, effect1Id: string, effect2Id: string, x: number): void {
    const effect1 = this.engine.getEffect(effect1Id);
    const effect2 = this.engine.getEffect(effect2Id);

    if (!effect1 || !effect2) return;

    const params1 = effect1.getParameters();
    const params2 = effect2.getParameters();

    params1.forEach((param1, paramName) => {
      const param2 = params2.get(paramName);
      if (param2) {
        const morphedValue = param1.value * (1 - x) + param2.value * x;
        effect1.setParameter(paramName, morphedValue);
      }
    });
  }

  private applyPadValues(pad: XYPad): void {
    const effect = this.engine.getEffect(pad.effectId);
    if (!effect) return;

    const xParam = effect.getParameters().get(pad.xParameter);
    const yParam = effect.getParameters().get(pad.yParameter);

    if (xParam) {
      const xValue = xParam.min + (xParam.max - xParam.min) * pad.x;
      effect.setParameter(pad.xParameter, xValue);
    }

    if (yParam) {
      const yValue = yParam.min + (yParam.max - yParam.min) * pad.y;
      effect.setParameter(pad.yParameter, yValue);
    }
  }

  listPads(): XYPad[] {
    return Array.from(this.pads.values());
  }
}
