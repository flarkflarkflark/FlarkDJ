/**
 * Base Effect Class - Foundation for all audio effects
 */

export class BaseEffect {
  constructor(audioContext, effectType, effectName) {
    this.audioContext = audioContext;
    this.effectType = effectType;
    this.effectName = effectName;

    // Audio nodes
    this.inputNode = audioContext.createGain();
    this.outputNode = audioContext.createGain();
    this.bypassNode = audioContext.createGain();

    // Effect state
    this.enabled = true;
    this.bypassed = false;

    // Parameters
    this.parameters = new Map();

    // Connect bypass path
    this.inputNode.connect(this.bypassNode);
    this.bypassNode.connect(this.outputNode);
    this.bypassNode.gain.value = 0; // Initially bypassed signal is off
  }

  /**
   * Get the input node for this effect
   */
  getInputNode() {
    return this.inputNode;
  }

  /**
   * Get the output node for this effect
   */
  getOutputNode() {
    return this.outputNode;
  }

  /**
   * Set parameter value
   */
  setParameter(name, value) {
    const param = this.parameters.get(name);
    if (param) {
      param.value = value;
      this.updateParameter(name, value);
    }
  }

  /**
   * Get parameter value
   */
  getParameter(name) {
    const param = this.parameters.get(name);
    return param ? param.value : null;
  }

  /**
   * Get all parameters
   */
  getAllParameters() {
    const params = {};
    this.parameters.forEach((param, name) => {
      params[name] = param.value;
    });
    return params;
  }

  /**
   * Register a parameter
   */
  registerParameter(name, defaultValue, min, max, unit = '') {
    this.parameters.set(name, {
      value: defaultValue,
      min,
      max,
      unit
    });
  }

  /**
   * Update parameter (override in subclasses)
   */
  updateParameter(name, value) {
    // Override in subclasses
  }

  /**
   * Enable the effect
   */
  enable() {
    this.enabled = true;
    if (!this.bypassed) {
      this.bypassNode.gain.value = 0;
    }
  }

  /**
   * Disable the effect (bypass)
   */
  disable() {
    this.enabled = false;
    this.bypassNode.gain.value = 1;
  }

  /**
   * Toggle bypass
   */
  toggleBypass() {
    this.bypassed = !this.bypassed;
    this.bypassNode.gain.setValueAtTime(
      this.bypassed ? 1 : 0,
      this.audioContext.currentTime
    );
  }

  /**
   * Serialize the effect state
   */
  serialize() {
    return {
      effectType: this.effectType,
      effectName: this.effectName,
      enabled: this.enabled,
      bypassed: this.bypassed,
      parameters: this.getAllParameters()
    };
  }

  /**
   * Deserialize the effect state
   */
  deserialize(data) {
    this.enabled = data.enabled;
    this.bypassed = data.bypassed;

    Object.entries(data.parameters).forEach(([name, value]) => {
      this.setParameter(name, value);
    });
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    try {
      this.inputNode.disconnect();
      this.outputNode.disconnect();
      this.bypassNode.disconnect();
    } catch (e) {
      // Already disconnected
    }
  }
}
