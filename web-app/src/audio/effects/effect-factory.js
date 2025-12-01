/**
 * Effect Factory - Creates effect instances
 */

import { ButterworthFilter } from './butterworth-filter.js';
import { Reverb } from './reverb.js';
import { Delay } from './delay.js';
import { Flanger } from './flanger.js';

export class EffectFactory {
  /**
   * Create an effect instance by type
   */
  static createEffect(effectType, audioContext) {
    switch (effectType) {
      case 'butterworth-filter':
        return new ButterworthFilter(audioContext);

      case 'reverb':
        return new Reverb(audioContext);

      case 'delay':
        return new Delay(audioContext);

      case 'flanger':
        return new Flanger(audioContext);

      default:
        console.warn(`Unknown effect type: ${effectType}`);
        return null;
    }
  }

  /**
   * Get effect metadata
   */
  static getEffectMetadata(effectType) {
    const metadata = {
      'butterworth-filter': {
        name: 'Butterworth Filter',
        description: 'Resonant filter with multiple modes',
        parameters: [
          { name: 'cutoff', label: 'Cutoff', min: 20, max: 20000, default: 1000, unit: 'Hz' },
          { name: 'resonance', label: 'Resonance', min: 0.1, max: 20, default: 1, unit: '' },
          { name: 'mode', label: 'Mode', min: 0, max: 2, default: 0, unit: '', options: ['Lowpass', 'Highpass', 'Bandpass'] }
        ]
      },
      'reverb': {
        name: 'Reverb',
        description: 'Algorithmic reverb effect',
        parameters: [
          { name: 'roomSize', label: 'Room Size', min: 0, max: 1, default: 0.5, unit: '' },
          { name: 'damping', label: 'Damping', min: 0, max: 1, default: 0.5, unit: '' },
          { name: 'wetDry', label: 'Mix', min: 0, max: 1, default: 0.3, unit: '' }
        ]
      },
      'delay': {
        name: 'Delay',
        description: 'Stereo delay with feedback',
        parameters: [
          { name: 'time', label: 'Time', min: 0, max: 2, default: 0.5, unit: 's' },
          { name: 'feedback', label: 'Feedback', min: 0, max: 0.95, default: 0.3, unit: '' },
          { name: 'wetDry', label: 'Mix', min: 0, max: 1, default: 0.5, unit: '' }
        ]
      },
      'flanger': {
        name: 'Flanger',
        description: 'Classic modulation effect',
        parameters: [
          { name: 'rate', label: 'Rate', min: 0.1, max: 10, default: 0.5, unit: 'Hz' },
          { name: 'depth', label: 'Depth', min: 0, max: 1, default: 0.5, unit: '' },
          { name: 'feedback', label: 'Feedback', min: 0, max: 0.95, default: 0.5, unit: '' },
          { name: 'wetDry', label: 'Mix', min: 0, max: 1, default: 0.5, unit: '' }
        ]
      }
    };

    return metadata[effectType] || null;
  }

  /**
   * Get all available effect types
   */
  static getAllEffectTypes() {
    return ['butterworth-filter', 'reverb', 'delay', 'flanger'];
  }
}
