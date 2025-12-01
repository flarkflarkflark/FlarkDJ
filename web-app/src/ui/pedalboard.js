/**
 * Pedalboard - Manages the canvas and effect pedals
 */

import { EffectPedal } from './effect-pedal.js';

export class Pedalboard {
  constructor(container) {
    this.container = container;
    this.effects = new Map();
    this.effectCounter = 0;
  }

  /**
   * Add an effect to the pedalboard
   */
  addEffect(effectType, x, y, audioEffect) {
    const id = `effect-${this.effectCounter++}`;

    const effectPedal = new EffectPedal(id, effectType, x, y, audioEffect);
    this.effects.set(id, effectPedal);

    this.container.appendChild(effectPedal.getElement());

    return effectPedal;
  }

  /**
   * Remove an effect from the pedalboard
   */
  removeEffect(id) {
    const effectPedal = this.effects.get(id);
    if (effectPedal) {
      effectPedal.dispose();
      this.effects.delete(id);
    }
  }

  /**
   * Get an effect by ID
   */
  getEffect(id) {
    return this.effects.get(id);
  }

  /**
   * Get all effects
   */
  getAllEffects() {
    return Array.from(this.effects.values());
  }

  /**
   * Get effect count
   */
  getEffectCount() {
    return this.effects.size;
  }

  /**
   * Clear all effects
   */
  clear() {
    this.effects.forEach(effect => effect.dispose());
    this.effects.clear();
    this.container.innerHTML = '';
  }

  /**
   * Serialize pedalboard state
   */
  serialize() {
    const effects = [];

    this.effects.forEach((effectPedal, id) => {
      effects.push({
        id,
        type: effectPedal.effectType,
        x: effectPedal.x,
        y: effectPedal.y,
        parameters: effectPedal.audioEffect.getAllParameters()
      });
    });

    return effects;
  }

  /**
   * Deserialize pedalboard state
   */
  deserialize(data) {
    // Note: This will be called by the main app
    // which will create audio effects and add them
    return data;
  }
}
