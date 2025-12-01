/**
 * Flanger Effect
 * Classic modulation effect with LFO-controlled delay
 */

import { BaseEffect } from './base-effect.js';

export class Flanger extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'flanger', 'Flanger');

    // Create delay node
    this.delayNode = audioContext.createDelay(0.02);

    // Create LFO (oscillator)
    this.lfo = audioContext.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.5;

    // Create LFO gain (depth control)
    this.lfoGain = audioContext.createGain();
    this.lfoGain.gain.value = 0.002;

    // Create feedback
    this.feedbackNode = audioContext.createGain();
    this.feedbackNode.gain.value = 0.5;

    // Create wet/dry mix
    this.wetGain = audioContext.createGain();
    this.dryGain = audioContext.createGain();

    // Connect LFO to delay time
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.delayNode.delayTime);

    // Connect signal chain
    // Dry path
    this.inputNode.connect(this.dryGain);
    this.dryGain.connect(this.outputNode);

    // Wet path with feedback
    this.inputNode.connect(this.delayNode);
    this.delayNode.connect(this.feedbackNode);
    this.feedbackNode.connect(this.delayNode); // Feedback loop
    this.feedbackNode.connect(this.wetGain);
    this.wetGain.connect(this.outputNode);

    // Start LFO
    this.lfo.start();

    // Register parameters
    this.registerParameter('rate', 0.5, 0.1, 10, 'Hz');
    this.registerParameter('depth', 0.5, 0, 1, '');
    this.registerParameter('feedback', 0.5, 0, 0.95, '');
    this.registerParameter('wetDry', 0.5, 0, 1, '');

    // Initialize
    this.updateParameter('rate', 0.5);
    this.updateParameter('depth', 0.5);
    this.updateParameter('feedback', 0.5);
    this.updateParameter('wetDry', 0.5);
  }

  updateParameter(name, value) {
    switch (name) {
      case 'rate':
        this.lfo.frequency.setValueAtTime(value, this.audioContext.currentTime);
        break;

      case 'depth':
        this.lfoGain.gain.setValueAtTime(value * 0.005, this.audioContext.currentTime);
        this.delayNode.delayTime.setValueAtTime(0.005 + value * 0.005, this.audioContext.currentTime);
        break;

      case 'feedback':
        this.feedbackNode.gain.setValueAtTime(value, this.audioContext.currentTime);
        break;

      case 'wetDry':
        this.wetGain.gain.setValueAtTime(value, this.audioContext.currentTime);
        this.dryGain.gain.setValueAtTime(1 - value, this.audioContext.currentTime);
        break;
    }
  }

  dispose() {
    try {
      this.lfo.stop();
      this.lfo.disconnect();
      this.lfoGain.disconnect();
      this.delayNode.disconnect();
      this.feedbackNode.disconnect();
      this.wetGain.disconnect();
      this.dryGain.disconnect();
    } catch (e) {}
    super.dispose();
  }
}
