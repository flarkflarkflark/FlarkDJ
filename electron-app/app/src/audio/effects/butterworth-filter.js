/**
 * Butterworth Filter Effect
 * Resonant filter with lowpass/highpass/bandpass modes
 */

import { BaseEffect } from './base-effect.js';

export class ButterworthFilter extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'butterworth-filter', 'Butterworth Filter');

    // Create filter node
    this.filterNode = audioContext.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 1000;
    this.filterNode.Q.value = 1;

    // Connect signal chain: input -> filter -> output
    this.inputNode.connect(this.filterNode);
    this.filterNode.connect(this.outputNode);

    // Register parameters
    this.registerParameter('cutoff', 1000, 20, 20000, 'Hz');
    this.registerParameter('resonance', 1, 0.1, 20, '');
    this.registerParameter('mode', 0, 0, 2, ''); // 0=lowpass, 1=highpass, 2=bandpass
  }

  updateParameter(name, value) {
    switch (name) {
      case 'cutoff':
        this.filterNode.frequency.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;

      case 'resonance':
        this.filterNode.Q.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;

      case 'mode':
        const modes = ['lowpass', 'highpass', 'bandpass'];
        this.filterNode.type = modes[Math.floor(value)] || 'lowpass';
        break;
    }
  }

  dispose() {
    try {
      this.filterNode.disconnect();
    } catch (e) {}
    super.dispose();
  }
}
