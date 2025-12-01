/**
 * Drag and Drop Handler - Manages dragging effects from palette to canvas
 */

import { EffectFactory } from '../audio/effects/effect-factory.js';

export class DragDropHandler {
  constructor(pedalboard, audioEngine) {
    this.pedalboard = pedalboard;
    this.audioEngine = audioEngine;

    this.setupDragHandlers();
  }

  setupDragHandlers() {
    // Get palette items
    const paletteItems = document.querySelectorAll('.palette-item[draggable="true"]');

    paletteItems.forEach(item => {
      item.addEventListener('dragstart', (e) => this.onDragStart(e));
    });

    // Get drop zone (pedalboard canvas)
    const pedalboardElement = document.getElementById('pedalboard');

    pedalboardElement.addEventListener('dragover', (e) => this.onDragOver(e));
    pedalboardElement.addEventListener('drop', (e) => this.onDrop(e));
    pedalboardElement.addEventListener('dragleave', (e) => this.onDragLeave(e));
  }

  onDragStart(e) {
    const effectType = e.target.dataset.effectType;
    e.dataTransfer.setData('text/plain', effectType);
    e.dataTransfer.effectAllowed = 'copy';
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    // Show drop zone indicator
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.remove('hidden');
  }

  onDragLeave(e) {
    // Hide drop zone indicator
    if (e.target.id === 'pedalboard') {
      const dropZone = document.getElementById('dropZone');
      dropZone.classList.add('hidden');
    }
  }

  onDrop(e) {
    e.preventDefault();

    // Hide drop zone indicator
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.add('hidden');

    // Get effect type
    const effectType = e.dataTransfer.getData('text/plain');

    // Skip input/output (not implemented yet)
    if (effectType === 'input' || effectType === 'output') {
      console.log('Input/Output not yet implemented');
      return;
    }

    // Calculate drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 90; // Center on cursor
    const y = e.clientY - rect.top - 100;

    // Create audio effect
    const audioEffect = EffectFactory.createEffect(effectType, this.audioEngine.getContext());

    if (!audioEffect) {
      console.error('Failed to create effect:', effectType);
      return;
    }

    // Add to pedalboard
    const effectPedal = this.pedalboard.addEffect(effectType, x, y, audioEffect);

    // Register with audio engine
    this.audioEngine.registerEffect(effectPedal.id, audioEffect);

    console.log(`✅ Added effect: ${effectType} at (${x}, ${y})`);
  }
}
