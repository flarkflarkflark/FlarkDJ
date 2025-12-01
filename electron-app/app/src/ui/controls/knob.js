/**
 * Knob Control - Rotary knob for parameter control
 */

export class KnobControl {
  constructor(name, label, min, max, defaultValue, unit = '') {
    this.name = name;
    this.label = label;
    this.min = min;
    this.max = max;
    this.value = defaultValue;
    this.unit = unit;

    this.element = null;
    this.knobElement = null;
    this.valueDisplay = null;

    this.listeners = [];
    this.isDragging = false;
    this.startY = 0;
    this.startValue = 0;

    this.createUI();
  }

  /**
   * Create the UI element
   */
  createUI() {
    // Main container
    this.element = document.createElement('div');
    this.element.className = 'knob-control';
    this.element.style.cssText = `
      display: inline-block;
      margin: 0.5rem;
      text-align: center;
      user-select: none;
    `;

    // Knob visual
    this.knobElement = document.createElement('div');
    this.knobElement.className = 'knob';
    this.knobElement.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
      border: 3px solid #ff8c42;
      position: relative;
      cursor: ns-resize;
      margin: 0 auto 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    `;

    // Knob indicator
    const indicator = document.createElement('div');
    indicator.className = 'knob-indicator';
    indicator.style.cssText = `
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 15px;
      background: #ff8c42;
      border-radius: 2px;
    `;
    this.knobElement.appendChild(indicator);

    // Label
    const labelElement = document.createElement('div');
    labelElement.className = 'knob-label';
    labelElement.textContent = this.label;
    labelElement.style.cssText = `
      font-size: 0.75rem;
      color: #adb5bd;
      margin-bottom: 0.25rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    // Value display
    this.valueDisplay = document.createElement('div');
    this.valueDisplay.className = 'knob-value';
    this.valueDisplay.style.cssText = `
      font-size: 0.875rem;
      color: #ff8c42;
      font-weight: 700;
      margin-top: 0.25rem;
    `;
    this.updateValueDisplay();

    // Assemble
    this.element.appendChild(labelElement);
    this.element.appendChild(this.knobElement);
    this.element.appendChild(this.valueDisplay);

    // Add event listeners
    this.knobElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
  }

  /**
   * Handle mouse down
   */
  onMouseDown(e) {
    this.isDragging = true;
    this.startY = e.clientY;
    this.startValue = this.value;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    e.preventDefault();
  }

  /**
   * Handle mouse move
   */
  onMouseMove = (e) => {
    if (!this.isDragging) return;

    const deltaY = this.startY - e.clientY;
    const sensitivity = (this.max - this.min) / 200;
    const newValue = Math.max(this.min, Math.min(this.max, this.startValue + deltaY * sensitivity));

    this.setValue(newValue);
  }

  /**
   * Handle mouse up
   */
  onMouseUp = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  /**
   * Set value
   */
  setValue(value) {
    this.value = value;
    this.updateKnobRotation();
    this.updateValueDisplay();
    this.emit('change', value);
  }

  /**
   * Get value
   */
  getValue() {
    return this.value;
  }

  /**
   * Update knob rotation
   */
  updateKnobRotation() {
    const percentage = (this.value - this.min) / (this.max - this.min);
    const rotation = -135 + percentage * 270; // -135deg to +135deg range
    this.knobElement.style.transform = `rotate(${rotation}deg)`;
  }

  /**
   * Update value display
   */
  updateValueDisplay() {
    let displayValue = this.value;

    // Format value based on range
    if (Math.abs(this.max - this.min) > 100) {
      displayValue = Math.round(displayValue);
    } else if (Math.abs(this.max - this.min) > 10) {
      displayValue = displayValue.toFixed(1);
    } else {
      displayValue = displayValue.toFixed(2);
    }

    this.valueDisplay.textContent = `${displayValue}${this.unit}`;
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  /**
   * Emit event
   */
  emit(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }

  /**
   * Get the element
   */
  getElement() {
    return this.element;
  }

  /**
   * Dispose
   */
  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.element.remove();
  }
}
