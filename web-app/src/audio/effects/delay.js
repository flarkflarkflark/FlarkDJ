/**
 * Delay Effect
 * Stereo delay with feedback and wet/dry mix
 */

import { BaseEffect } from './base-effect.js';

export class Delay extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'delay', 'Delay');

    // Create delay nodes (stereo)
    this.delayNodeL = audioContext.createDelay(2.0);
    this.delayNodeR = audioContext.createDelay(2.0);

    // Create feedback nodes
    this.feedbackNodeL = audioContext.createGain();
    this.feedbackNodeR = audioContext.createGain();

    // Create wet/dry mix
    this.wetGain = audioContext.createGain();
    this.dryGain = audioContext.createGain();

    // Create splitter and merger for stereo
    this.splitter = audioContext.createChannelSplitter(2);
    this.merger = audioContext.createChannelMerger(2);

    // Connect signal chain
    // Dry path
    this.inputNode.connect(this.dryGain);
    this.dryGain.connect(this.outputNode);

    // Wet path
    this.inputNode.connect(this.splitter);

    // Left channel
    this.splitter.connect(this.delayNodeL, 0);
    this.delayNodeL.connect(this.feedbackNodeL);
    this.feedbackNodeL.connect(this.delayNodeL); // Feedback loop
    this.feedbackNodeL.connect(this.merger, 0, 0);

    // Right channel
    this.splitter.connect(this.delayNodeR, 1);
    this.delayNodeR.connect(this.feedbackNodeR);
    this.feedbackNodeR.connect(this.delayNodeR); // Feedback loop
    this.feedbackNodeR.connect(this.merger, 0, 1);

    // Merger to wet gain to output
    this.merger.connect(this.wetGain);
    this.wetGain.connect(this.outputNode);

    // Register parameters
    this.registerParameter('time', 0.5, 0, 2, 's');
    this.registerParameter('feedback', 0.3, 0, 0.95, '');
    this.registerParameter('wetDry', 0.5, 0, 1, '');

    // Initialize
    this.updateParameter('time', 0.5);
    this.updateParameter('feedback', 0.3);
    this.updateParameter('wetDry', 0.5);
  }

  updateParameter(name, value) {
    switch (name) {
      case 'time':
        this.delayNodeL.delayTime.setValueAtTime(value, this.audioContext.currentTime);
        this.delayNodeR.delayTime.setValueAtTime(value * 1.02, this.audioContext.currentTime); // Slight offset for stereo
        break;

      case 'feedback':
        this.feedbackNodeL.gain.setValueAtTime(value, this.audioContext.currentTime);
        this.feedbackNodeR.gain.setValueAtTime(value, this.audioContext.currentTime);
        break;

      case 'wetDry':
        this.wetGain.gain.setValueAtTime(value, this.audioContext.currentTime);
        this.dryGain.gain.setValueAtTime(1 - value, this.audioContext.currentTime);
        break;
    }
  }

  dispose() {
    try {
      this.delayNodeL.disconnect();
      this.delayNodeR.disconnect();
      this.feedbackNodeL.disconnect();
      this.feedbackNodeR.disconnect();
      this.wetGain.disconnect();
      this.dryGain.disconnect();
      this.splitter.disconnect();
      this.merger.disconnect();
    } catch (e) {}
    super.dispose();
  }
}
