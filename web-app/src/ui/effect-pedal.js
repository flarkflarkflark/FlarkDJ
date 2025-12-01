/**
 * Effect Pedal - Visual representation of an audio effect
 */

import { EffectFactory } from '../audio/effects/effect-factory.js';
import { KnobControl } from './controls/knob.js';

export class EffectPedal {
  constructor(id, effectType, x, y, audioEffect) {
    this.id = id;
    this.effectType = effectType;
    this.x = x;
    this.y = y;
    this.audioEffect = audioEffect;

    this.element = null;
    this.controls = [];

    this.createUI();
  }

  /**
   * Create the UI element
   */
  createUI() {
    // Create main pedal element
    this.element = document.createElement('div');
    this.element.className = 'effect-pedal';
    this.element.id = this.id;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    // Get effect metadata
    const metadata = EffectFactory.getEffectMetadata(this.effectType);

    // Create header
    const header = document.createElement('div');
    header.className = 'effect-header';

    const title = document.createElement('div');
    title.className = 'effect-title';
    title.textContent = metadata.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'effect-delete';
    deleteBtn.innerHTML = '×';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dispatchEvent('delete', { id: this.id });
    });

    header.appendChild(title);
    header.appendChild(deleteBtn);
    this.element.appendChild(header);

    // Create body with controls
    const body = document.createElement('div');
    body.className = 'effect-body';

    metadata.parameters.forEach(param => {
      const control = new KnobControl(
        param.name,
        param.label,
        param.min,
        param.max,
        param.default,
        param.unit
      );

      // Listen for value changes
      control.on('change', (value) => {
        this.audioEffect.setParameter(param.name, value);
      });

      body.appendChild(control.getElement());
      this.controls.push(control);
    });

    this.element.appendChild(body);

    // Create connectors
    const connectors = document.createElement('div');
    connectors.className = 'effect-connectors';

    const inputConnector = document.createElement('div');
    inputConnector.className = 'connector input';
    inputConnector.dataset.connectorType = 'input';
    inputConnector.dataset.effectId = this.id;

    const outputConnector = document.createElement('div');
    outputConnector.className = 'connector output';
    outputConnector.dataset.connectorType = 'output';
    outputConnector.dataset.effectId = this.id;

    connectors.appendChild(inputConnector);
    connectors.appendChild(outputConnector);
    this.element.appendChild(connectors);

    // Make draggable
    this.makeDraggable();
  }

  /**
   * Make the pedal draggable
   */
  makeDraggable() {
    let isDragging = false;
    let startX, startY;

    const onMouseDown = (e) => {
      // Only allow dragging from header or body (not controls)
      if (e.target.closest('.connector') || e.target.closest('.effect-delete')) {
        return;
      }

      isDragging = true;
      startX = e.clientX - this.x;
      startY = e.clientY - this.y;

      this.element.classList.add('dragging');

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;

      this.x = e.clientX - startX;
      this.y = e.clientY - startY;

      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;

      // Dispatch move event for cable updates
      this.dispatchEvent('move', { id: this.id, x: this.x, y: this.y });
    };

    const onMouseUp = () => {
      isDragging = false;
      this.element.classList.remove('dragging');

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    this.element.addEventListener('mousedown', onMouseDown);
  }

  /**
   * Get the element
   */
  getElement() {
    return this.element;
  }

  /**
   * Get connector position
   */
  getConnectorPosition(type) {
    const rect = this.element.getBoundingClientRect();
    const containerRect = this.element.parentElement.getBoundingClientRect();

    if (type === 'input') {
      return {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top + rect.height / 2
      };
    } else {
      return {
        x: rect.right - containerRect.left,
        y: rect.top - containerRect.top + rect.height / 2
      };
    }
  }

  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`effect-${eventName}`, {
      detail,
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  /**
   * Dispose of the pedal
   */
  dispose() {
    this.controls.forEach(control => control.dispose());
    this.element.remove();
  }
}
