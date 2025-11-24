import { AudioEffect, EffectParameter } from '../types';

export abstract class BaseEffect implements AudioEffect {
  public id: string;
  public name: string;
  public enabled: boolean = true;
  protected parameters: Map<string, EffectParameter> = new Map();

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  abstract process(input: Float32Array): Float32Array;

  getParameters(): Map<string, EffectParameter> {
    return this.parameters;
  }

  setParameter(name: string, value: number): void {
    const param = this.parameters.get(name);
    if (param) {
      param.value = Math.max(param.min, Math.min(param.max, value));
    }
  }

  getParameter(name: string): number | undefined {
    return this.parameters.get(name)?.value;
  }

  protected addParameter(param: EffectParameter): void {
    this.parameters.set(param.name, param);
  }
}
