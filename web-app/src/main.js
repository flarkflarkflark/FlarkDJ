/**
 * FlarkDJ Pedalboard - Main Entry Point
 * Visual Effect Chain Designer for FlarkDJ
 */

import { AudioEngine } from './audio/audio-engine.js';
import { Pedalboard } from './ui/pedalboard.js';
import { DragDropHandler } from './interactions/drag-drop.js';
import { ConnectionManager } from './interactions/connection-manager.js';
import { ContextMenuHandler } from './interactions/context-menu.js';
import { ConfigManager } from './utils/config-manager.js';
import { UIController } from './ui/ui-controller.js';

class FlarkDJPedalboard {
  constructor() {
    this.audioEngine = null;
    this.pedalboard = null;
    this.dragDropHandler = null;
    this.connectionManager = null;
    this.contextMenuHandler = null;
    this.configManager = null;
    this.uiController = null;

    this.initialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('🎛️ Initializing FlarkDJ Pedalboard...');

    try {
      // Initialize modules
      this.audioEngine = new AudioEngine();
      this.pedalboard = new Pedalboard(document.getElementById('effectContainer'));
      this.configManager = new ConfigManager();
      this.uiController = new UIController(this.audioEngine);

      // Initialize audio engine
      await this.audioEngine.init();
      console.log('✅ Audio Engine initialized');

      // Initialize interaction handlers
      this.dragDropHandler = new DragDropHandler(this.pedalboard, this.audioEngine);
      this.connectionManager = new ConnectionManager(this.pedalboard, this.audioEngine);
      this.contextMenuHandler = new ContextMenuHandler(this.pedalboard, this.connectionManager);

      // Setup event listeners
      this.setupEventListeners();

      // Load saved configurations
      this.configManager.loadConfigurations();

      this.initialized = true;
      console.log('✅ FlarkDJ Pedalboard ready!');

      // Show welcome message
      this.showWelcomeMessage();

    } catch (error) {
      console.error('❌ Failed to initialize FlarkDJ Pedalboard:', error);
      this.showError('Failed to initialize application. Please refresh the page.');
    }
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Header controls
    document.getElementById('saveBtn').addEventListener('click', () => this.saveConfiguration());
    document.getElementById('loadBtn').addEventListener('click', () => this.showLoadModal());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearBoard());

    // Audio source selection
    const sourceRadios = document.querySelectorAll('input[name="audioSource"]');
    sourceRadios.forEach(radio => {
      radio.addEventListener('change', (e) => this.handleSourceChange(e.target.value));
    });

    // File input
    document.getElementById('audioFileInput').addEventListener('change', (e) => {
      this.handleFileSelect(e.target.files[0]);
    });

    document.getElementById('selectFileBtn').addEventListener('click', () => {
      document.getElementById('audioFileInput').click();
    });

    // Playback controls
    document.getElementById('playBtn').addEventListener('click', () => this.play());
    document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
    document.getElementById('stopBtn').addEventListener('click', () => this.stop());

    // Master volume
    const volumeSlider = document.getElementById('masterVolume');
    volumeSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      this.audioEngine.setMasterVolume(value / 100);
      document.getElementById('volumeValue').textContent = `${value}%`;
    });

    // Modal controls
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal());
    });

    document.getElementById('loadConfigBtn').addEventListener('click', () => this.loadSelectedConfiguration());
    document.getElementById('deleteConfigBtn').addEventListener('click', () => this.deleteSelectedConfiguration());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Window resize
    window.addEventListener('resize', () => this.handleResize());

    // Prevent context menu on canvas
    document.getElementById('pedalboard').addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Handle audio source change
   */
  async handleSourceChange(source) {
    console.log('🔊 Audio source changed:', source);

    const selectFileBtn = document.getElementById('selectFileBtn');
    const playBtn = document.getElementById('playBtn');

    switch (source) {
      case 'none':
        await this.audioEngine.stopInput();
        selectFileBtn.classList.add('hidden');
        playBtn.disabled = true;
        break;

      case 'microphone':
        try {
          await this.audioEngine.startMicrophoneInput();
          selectFileBtn.classList.add('hidden');
          playBtn.disabled = false;
          console.log('✅ Microphone input started');
        } catch (error) {
          console.error('❌ Failed to start microphone:', error);
          this.showError('Failed to access microphone. Please check permissions.');
          document.querySelector('input[value="none"]').checked = true;
        }
        break;

      case 'file':
        selectFileBtn.classList.remove('hidden');
        playBtn.disabled = true;
        break;
    }
  }

  /**
   * Handle audio file selection
   */
  async handleFileSelect(file) {
    if (!file) return;

    try {
      console.log('📁 Loading audio file:', file.name);
      await this.audioEngine.loadAudioFile(file);
      document.getElementById('playBtn').disabled = false;
      console.log('✅ Audio file loaded');
    } catch (error) {
      console.error('❌ Failed to load audio file:', error);
      this.showError('Failed to load audio file. Please try another file.');
    }
  }

  /**
   * Play audio
   */
  play() {
    this.audioEngine.play();
    document.getElementById('playBtn').classList.add('hidden');
    document.getElementById('pauseBtn').classList.remove('hidden');
    document.getElementById('stopBtn').disabled = false;
    console.log('▶️ Playing');
  }

  /**
   * Pause audio
   */
  pause() {
    this.audioEngine.pause();
    document.getElementById('playBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    console.log('⏸️ Paused');
  }

  /**
   * Stop audio
   */
  stop() {
    this.audioEngine.stop();
    document.getElementById('playBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    document.getElementById('stopBtn').disabled = true;
    console.log('⏹️ Stopped');
  }

  /**
   * Save current configuration
   */
  saveConfiguration() {
    const name = prompt('Enter a name for this configuration:');
    if (!name) return;

    const config = {
      name,
      timestamp: Date.now(),
      effects: this.pedalboard.serialize(),
      connections: this.connectionManager.serialize()
    };

    this.configManager.saveConfiguration(config);
    console.log('💾 Configuration saved:', name);
    alert(`Configuration "${name}" saved successfully!`);
  }

  /**
   * Show load modal
   */
  showLoadModal() {
    const configurations = this.configManager.getAllConfigurations();
    const select = document.getElementById('configSelect');

    // Clear existing options
    select.innerHTML = '';

    if (configurations.length === 0) {
      select.innerHTML = '<option disabled>No saved configurations</option>';
    } else {
      configurations.forEach(config => {
        const option = document.createElement('option');
        option.value = config.id;
        const date = new Date(config.timestamp).toLocaleString();
        option.textContent = `${config.name} - ${date}`;
        select.appendChild(option);
      });
    }

    document.getElementById('loadModal').classList.remove('hidden');
  }

  /**
   * Close modal
   */
  closeModal() {
    document.getElementById('loadModal').classList.add('hidden');
  }

  /**
   * Load selected configuration
   */
  loadSelectedConfiguration() {
    const select = document.getElementById('configSelect');
    const configId = select.value;

    if (!configId) {
      alert('Please select a configuration to load.');
      return;
    }

    const config = this.configManager.getConfiguration(configId);
    if (!config) {
      alert('Configuration not found.');
      return;
    }

    // Clear current board
    this.clearBoard();

    // Load configuration
    this.pedalboard.deserialize(config.effects);
    this.connectionManager.deserialize(config.connections);

    this.closeModal();
    console.log('📁 Configuration loaded:', config.name);
    alert(`Configuration "${config.name}" loaded successfully!`);
  }

  /**
   * Delete selected configuration
   */
  deleteSelectedConfiguration() {
    const select = document.getElementById('configSelect');
    const configId = select.value;

    if (!configId) {
      alert('Please select a configuration to delete.');
      return;
    }

    if (!confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    this.configManager.deleteConfiguration(configId);
    this.showLoadModal(); // Refresh the list
    console.log('🗑️ Configuration deleted');
  }

  /**
   * Clear the pedalboard
   */
  clearBoard() {
    if (this.pedalboard.getEffectCount() > 0) {
      if (!confirm('Are you sure you want to clear all effects?')) {
        return;
      }
    }

    this.pedalboard.clear();
    this.connectionManager.clearAll();
    console.log('🗑️ Board cleared');
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboard(e) {
    // Ctrl/Cmd + S: Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      this.saveConfiguration();
    }

    // Ctrl/Cmd + O: Load
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      this.showLoadModal();
    }

    // Ctrl/Cmd + K: Clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.clearBoard();
    }

    // Space: Play/Pause
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      const isPlaying = !document.getElementById('playBtn').classList.contains('hidden');
      if (isPlaying) {
        this.pause();
      } else {
        if (!document.getElementById('playBtn').disabled) {
          this.play();
        }
      }
    }

    // Escape: Close modal
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update cable positions
    this.connectionManager.updateAllCables();
  }

  /**
   * Show welcome message
   */
  showWelcomeMessage() {
    console.log(`
╔══════════════════════════════════════════════════╗
║     🎛️  FlarkDJ Pedalboard                      ║
║     Visual Effect Chain Designer                ║
║                                                  ║
║  Drag effects from the left panel               ║
║  Drop them on the canvas                        ║
║  Click connectors to create cables              ║
║  Enjoy designing your sound!                    ║
╚══════════════════════════════════════════════════╝
    `);
  }

  /**
   * Show error message
   */
  showError(message) {
    alert('❌ ' + message);
  }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new FlarkDJPedalboard();
    app.init();
    window.flarkDJ = app; // Expose for debugging
  });
} else {
  const app = new FlarkDJPedalboard();
  app.init();
  window.flarkDJ = app;
}

export { FlarkDJPedalboard };
