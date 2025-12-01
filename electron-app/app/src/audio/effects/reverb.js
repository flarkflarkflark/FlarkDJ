/**
 * Reverb Effect
 * Algorithmic reverb using convolver with procedural impulse response
 */

import { BaseEffect } from './base-effect.js';

export class Reverb extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'reverb', 'Reverb');

    // Create convolver for reverb
    this.convolverNode = audioContext.createConvolver();

    // Create wet/dry mix
    this.wetGain = audioContext.createGain();
    this.dryGain = audioContext.createGain();

    // Connect signal chain
    // Dry path: input -> dryGain -> output
    this.inputNode.connect(this.dryGain);
    this.dryGain.connect(this.outputNode);

    // Wet path: input -> convolver -> wetGain -> output
    this.inputNode.connect(this.convolverNode);
    this.convolverNode.connect(this.wetGain);
    this.wetGain.connect(this.outputNode);

    // Register parameters
    this.registerParameter('roomSize', 0.5, 0, 1, '');
    this.registerParameter('damping', 0.5, 0, 1, '');
    this.registerParameter('wetDry', 0.3, 0, 1, '');

    // Generate initial impulse response
    this.updateImpulseResponse(0.5, 0.5);
    this.updateWetDryMix(0.3);
  }

  updateParameter(name, value) {
    switch (name) {
      case 'roomSize':
      case 'damping':
        const roomSize = this.getParameter('roomSize');
        const damping = this.getParameter('damping');
        this.updateImpulseResponse(roomSize, damping);
        break;

      case 'wetDry':
        this.updateWetDryMix(value);
        break;
    }
  }

  /**
   * Generate reverb impulse response
   */
  updateImpulseResponse(roomSize, damping) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * (0.5 + roomSize * 2.5); // 0.5 to 3 seconds
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    const leftChannel = impulse.getChannelData(0);
    const rightChannel = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / sampleRate;

      // Exponential decay
      const decay = Math.exp(-n * (2 + damping * 8));

      // Add randomness for texture
      const noise = (Math.random() * 2 - 1) * decay;

      leftChannel[i] = noise;
      rightChannel[i] = noise * 0.95; // Slightly different for stereo width
    }

    this.convolverNode.buffer = impulse;
  }

  /**
   * Update wet/dry mix
   */
  updateWetDryMix(wetDry) {
    this.wetGain.gain.setValueAtTime(wetDry, this.audioContext.currentTime);
    this.dryGain.gain.setValueAtTime(1 - wetDry, this.audioContext.currentTime);
  }

  dispose() {
    try {
      this.convolverNode.disconnect();
      this.wetGain.disconnect();
      this.dryGain.disconnect();
    } catch (e) {}
    super.dispose();
  }
}
