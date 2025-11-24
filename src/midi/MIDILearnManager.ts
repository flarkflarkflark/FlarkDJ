import { MIDILearnConfig } from '../types';
import { AudioEngine } from '../core/AudioEngine';

interface MIDIMessage {
  data: Uint8Array;
}

export class MIDILearnManager {
  private mappings: Map<string, MIDILearnConfig> = new Map();
  private engine: AudioEngine;
  private midiAccess: any = null;
  private learningMode: boolean = false;
  private learningTarget: { effectId: string; parameterId: string } | null = null;

  constructor(engine: AudioEngine) {
    this.engine = engine;
    this.initializeMIDI();
  }

  private async initializeMIDI(): Promise<void> {
    if (typeof navigator !== 'undefined' && (navigator as any).requestMIDIAccess) {
      try {
        this.midiAccess = await (navigator as any).requestMIDIAccess();
        this.setupMIDIInputs();
      } catch (error) {
        console.error('MIDI initialization failed:', error);
      }
    }
  }

  private setupMIDIInputs(): void {
    if (!this.midiAccess) return;

    for (const input of this.midiAccess.inputs.values()) {
      input.onmidimessage = (message: MIDIMessage) => this.handleMIDIMessage(message);
    }
  }

  startLearning(effectId: string, parameterId: string): void {
    this.learningMode = true;
    this.learningTarget = { effectId, parameterId };
    console.log(`MIDI Learn: Waiting for CC message for ${effectId}.${parameterId}`);
  }

  stopLearning(): void {
    this.learningMode = false;
    this.learningTarget = null;
  }

  private handleMIDIMessage(message: MIDIMessage): void {
    const [status, cc, value] = message.data;
    const messageType = status & 0xF0;
    const channel = status & 0x0F;

    if (messageType === 0xB0) {
      if (this.learningMode && this.learningTarget) {
        this.createMapping(this.learningTarget.effectId, this.learningTarget.parameterId, cc, channel);
        this.stopLearning();
      } else {
        this.applyMIDIControl(cc, channel, value);
      }
    }
  }

  private createMapping(effectId: string, parameterId: string, midiCC: number, channel: number): void {
    const effect = this.engine.getEffect(effectId);
    if (!effect) return;

    const param = effect.getParameters().get(parameterId);
    if (!param) return;

    const mappingKey = `${effectId}.${parameterId}`;
    const config: MIDILearnConfig = {
      parameterId,
      effectId,
      midiCC,
      channel,
      min: param.min,
      max: param.max
    };

    this.mappings.set(mappingKey, config);
    param.midiCC = midiCC;
    console.log(`MIDI mapping created: CC${midiCC} -> ${effectId}.${parameterId}`);
  }

  private applyMIDIControl(cc: number, channel: number, value: number): void {
    this.mappings.forEach((config, key) => {
      if (config.midiCC === cc && config.channel === channel) {
        const effect = this.engine.getEffect(config.effectId);
        if (!effect) return;

        const normalizedValue = value / 127;
        const scaledValue = config.min + (config.max - config.min) * normalizedValue;
        effect.setParameter(config.parameterId, scaledValue);
      }
    });
  }

  removeMapping(effectId: string, parameterId: string): boolean {
    const mappingKey = `${effectId}.${parameterId}`;
    return this.mappings.delete(mappingKey);
  }

  getMappings(): MIDILearnConfig[] {
    return Array.from(this.mappings.values());
  }

  clearAllMappings(): void {
    this.mappings.clear();
  }

  exportMappings(): string {
    return JSON.stringify(Array.from(this.mappings.entries()));
  }

  importMappings(data: string): void {
    try {
      const entries = JSON.parse(data);
      this.mappings = new Map(entries);
    } catch (error) {
      console.error('Failed to import MIDI mappings:', error);
    }
  }
}
