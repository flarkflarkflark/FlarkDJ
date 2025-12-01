/**
 * Configuration Manager - Save/load pedalboard configurations
 */

export class ConfigManager {
  constructor() {
    this.storageKey = 'flarkdj-pedalboard-configs';
    this.configurations = [];
  }

  /**
   * Load configurations from localStorage
   */
  loadConfigurations() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.configurations = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load configurations:', error);
    }
  }

  /**
   * Save configurations to localStorage
   */
  saveConfigurations() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.configurations));
    } catch (error) {
      console.error('Failed to save configurations:', error);
    }
  }

  /**
   * Save a configuration
   */
  saveConfiguration(config) {
    config.id = Date.now().toString();
    this.configurations.push(config);
    this.saveConfigurations();
    return config.id;
  }

  /**
   * Get a configuration by ID
   */
  getConfiguration(id) {
    return this.configurations.find(config => config.id === id);
  }

  /**
   * Get all configurations
   */
  getAllConfigurations() {
    return this.configurations;
  }

  /**
   * Delete a configuration
   */
  deleteConfiguration(id) {
    this.configurations = this.configurations.filter(config => config.id !== id);
    this.saveConfigurations();
  }

  /**
   * Clear all configurations
   */
  clearAll() {
    this.configurations = [];
    this.saveConfigurations();
  }
}
