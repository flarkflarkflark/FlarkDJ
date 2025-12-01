/**
 * UI Controller - Manages UI state and updates
 */

export class UIController {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Simple console log for now
    // Could be enhanced with toast notifications
    const icon = type === 'success' ? '✅' :
                 type === 'error' ? '❌' :
                 type === 'warning' ? '⚠️' : 'ℹ️';

    console.log(`${icon} ${message}`);
  }

  /**
   * Update UI state
   */
  updateState(state) {
    // Update UI based on state changes
    // Could be enhanced with more complex state management
  }
}
