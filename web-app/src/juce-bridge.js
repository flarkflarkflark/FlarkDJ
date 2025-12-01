/**
 * JUCE Bridge - Integration with JUCE Native Plugin
 * Provides bi-directional communication between web interface and native plugin
 */

export class JUCEBridge {
  constructor(app) {
    this.app = app;
    this.isJUCE = typeof window !== 'undefined' && window.juceInterface;
    this.parameterCache = {};

    if (this.isJUCE) {
      this.setupJUCEIntegration();
    }
  }

  /**
   * Setup JUCE-specific integrations
   */
  setupJUCEIntegration() {
    console.log('🔌 Setting up JUCE integration...');

    // Register parameter update callback
    window.juceParameterUpdate = (params) => {
      this.handleParameterUpdate(params);
    };

    // Notify JUCE that web view is ready
    if (window.juceInterface && window.juceInterface.ready) {
      window.juceInterface.ready();
    }

    // Setup parameter monitoring
    this.setupParameterMonitoring();

    // Update UI for JUCE
    this.updateUIForJUCE();

    console.log('✅ JUCE integration ready');
  }

  /**
   * Handle parameter updates from JUCE
   */
  handleParameterUpdate(params) {
    // Update effects based on JUCE parameter changes
    Object.entries(params).forEach(([name, value]) => {
      if (this.parameterCache[name] !== value) {
        this.parameterCache[name] = value;
        this.applyParameterToEffect(name, value);
      }
    });
  }

  /**
   * Apply JUCE parameter to effect
   */
  applyParameterToEffect(paramName, value) {
    // Map JUCE parameter names to effects
    // This is a simplified mapping - expand based on actual parameter names

    const paramMapping = {
      // Filter parameters
      'Filter Cutoff': { effect: 'filter', param: 'cutoff', transform: (v) => 20 + v * 19980 },
      'Filter Resonance': { effect: 'filter', param: 'resonance', transform: (v) => 0.1 + v * 19.9 },

      // Reverb parameters
      'Reverb Room Size': { effect: 'reverb', param: 'roomSize', transform: (v) => v },
      'Reverb Damping': { effect: 'reverb', param: 'damping', transform: (v) => v },
      'Reverb Mix': { effect: 'reverb', param: 'wetDry', transform: (v) => v },

      // Delay parameters
      'Delay Time': { effect: 'delay', param: 'time', transform: (v) => v * 2 },
      'Delay Feedback': { effect: 'delay', param: 'feedback', transform: (v) => v * 0.95 },
      'Delay Mix': { effect: 'delay', param: 'wetDry', transform: (v) => v },

      // Flanger parameters
      'Flanger Rate': { effect: 'flanger', param: 'rate', transform: (v) => 0.1 + v * 9.9 },
      'Flanger Depth': { effect: 'flanger', param: 'depth', transform: (v) => v },
      'Flanger Feedback': { effect: 'flanger', param: 'feedback', transform: (v) => v * 0.95 },
    };

    const mapping = paramMapping[paramName];
    if (mapping && this.app.pedalboard) {
      // Find effect by type
      const effects = this.app.pedalboard.getAllEffects();
      const effect = effects.find(e => e.effectType === mapping.effect);

      if (effect && effect.audioEffect) {
        const transformedValue = mapping.transform(value);
        effect.audioEffect.setParameter(mapping.param, transformedValue);

        // Update UI control
        const control = effect.controls.find(c => c.name === mapping.param);
        if (control) {
          control.setValue(transformedValue);
        }
      }
    }
  }

  /**
   * Setup parameter monitoring (web -> JUCE)
   */
  setupParameterMonitoring() {
    // Monitor effect parameter changes and send to JUCE
    // This will be called when user adjusts knobs in web interface

    // Store original setParameter function
    const originalSetParameter = this.setParameterToJUCE.bind(this);

    // Hook into effect creation
    if (this.app.pedalboard) {
      // Override effect pedal parameter changes
      const originalAddEffect = this.app.pedalboard.addEffect.bind(this.app.pedalboard);

      this.app.pedalboard.addEffect = (...args) => {
        const effectPedal = originalAddEffect(...args);

        // Hook into control changes
        effectPedal.controls.forEach(control => {
          control.on('change', (value) => {
            this.sendParameterToJUCE(effectPedal.effectType, control.name, value);
          });
        });

        return effectPedal;
      };
    }
  }

  /**
   * Send parameter change to JUCE
   */
  sendParameterToJUCE(effectType, paramName, value) {
    if (!this.isJUCE || !window.juceInterface) return;

    // Map web parameter to JUCE parameter name
    const juceParamName = this.mapToJUCEParameterName(effectType, paramName);

    // Normalize value (JUCE expects 0-1)
    const normalizedValue = this.normalizeParameterValue(effectType, paramName, value);

    // Send to JUCE
    if (window.juceInterface.setParameter) {
      window.juceInterface.setParameter(juceParamName, normalizedValue);
    }
  }

  /**
   * Map web parameter to JUCE parameter name
   */
  mapToJUCEParameterName(effectType, paramName) {
    const mapping = {
      'butterworth-filter': {
        cutoff: 'Filter Cutoff',
        resonance: 'Filter Resonance',
        mode: 'Filter Mode'
      },
      'reverb': {
        roomSize: 'Reverb Room Size',
        damping: 'Reverb Damping',
        wetDry: 'Reverb Mix'
      },
      'delay': {
        time: 'Delay Time',
        feedback: 'Delay Feedback',
        wetDry: 'Delay Mix'
      },
      'flanger': {
        rate: 'Flanger Rate',
        depth: 'Flanger Depth',
        feedback: 'Flanger Feedback'
      }
    };

    return mapping[effectType]?.[paramName] || paramName;
  }

  /**
   * Normalize parameter value to 0-1 range for JUCE
   */
  normalizeParameterValue(effectType, paramName, value) {
    // Define parameter ranges
    const ranges = {
      'butterworth-filter': {
        cutoff: { min: 20, max: 20000 },
        resonance: { min: 0.1, max: 20 },
        mode: { min: 0, max: 2 }
      },
      'reverb': {
        roomSize: { min: 0, max: 1 },
        damping: { min: 0, max: 1 },
        wetDry: { min: 0, max: 1 }
      },
      'delay': {
        time: { min: 0, max: 2 },
        feedback: { min: 0, max: 0.95 },
        wetDry: { min: 0, max: 1 }
      },
      'flanger': {
        rate: { min: 0.1, max: 10 },
        depth: { min: 0, max: 1 },
        feedback: { min: 0, max: 0.95 }
      }
    };

    const range = ranges[effectType]?.[paramName];
    if (range) {
      return (value - range.min) / (range.max - range.min);
    }

    return value; // Already normalized
  }

  /**
   * Update UI for JUCE environment
   */
  updateUIForJUCE() {
    // Hide audio source controls (JUCE handles audio I/O)
    const audioControls = document.querySelector('.audio-controls');
    if (audioControls) {
      // Hide source selection
      const sourceSection = audioControls.querySelector('.control-section');
      if (sourceSection) {
        sourceSection.style.display = 'none';
      }

      // Hide playback controls
      const playbackSection = audioControls.querySelectorAll('.control-section')[1];
      if (playbackSection) {
        playbackSection.style.display = 'none';
      }
    }

    // Update tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
      tagline.textContent = 'JUCE Plugin Edition • Real-Time Effect Chain';
    }

    // Add JUCE indicator
    const header = document.querySelector('.header-left');
    if (header) {
      const indicator = document.createElement('div');
      indicator.style.cssText = 'font-size: 0.75rem; color: #ff8c42; margin-top: 0.25rem;';
      indicator.textContent = '🔌 Connected to JUCE Plugin';
      header.appendChild(indicator);
    }
  }

  /**
   * Get parameter value from JUCE
   */
  getParameterFromJUCE(paramName) {
    if (this.isJUCE && window.juceInterface && window.juceInterface.getParameter) {
      return window.juceInterface.getParameter(paramName);
    }
    return null;
  }

  /**
   * Set parameter value in JUCE
   */
  setParameterToJUCE(paramName, value) {
    if (this.isJUCE && window.juceInterface && window.juceInterface.setParameter) {
      window.juceInterface.setParameter(paramName, value);
    }
  }

  /**
   * Check if running in JUCE
   */
  static isJUCE() {
    return typeof window !== 'undefined' && window.juceInterface;
  }
}
