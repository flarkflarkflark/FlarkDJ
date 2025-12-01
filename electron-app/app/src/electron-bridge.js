/**
 * Electron Bridge - Integration with Electron APIs
 */

export class ElectronBridge {
  constructor(app) {
    this.app = app;
    this.isElectron = typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron;

    if (this.isElectron) {
      this.setupElectronIntegration();
    }
  }

  /**
   * Setup Electron-specific integrations
   */
  setupElectronIntegration() {
    console.log('🔌 Setting up Electron integration...');

    // Menu event handlers
    window.electronAPI.onMenuNew(() => {
      if (confirm('Start a new configuration? This will clear the current board.')) {
        this.app.clearBoard();
      }
    });

    window.electronAPI.onMenuOpen(async () => {
      await this.loadConfigFromFile();
    });

    window.electronAPI.onMenuSave(async () => {
      await this.saveConfigToFile();
    });

    window.electronAPI.onAudioFileSelected(async (filePath) => {
      await this.loadAudioFromPath(filePath);
    });

    window.electronAPI.onAudioSourceChanged((source) => {
      const radio = document.querySelector(`input[name="audioSource"][value="${source}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    });

    window.electronAPI.onAudioPlay(() => {
      if (!document.getElementById('playBtn').disabled) {
        this.app.play();
      }
    });

    window.electronAPI.onAudioStop(() => {
      this.app.stop();
    });

    // Update UI to show Electron-specific features
    this.updateUIForElectron();

    console.log('✅ Electron integration ready');
  }

  /**
   * Save configuration to file (Electron)
   */
  async saveConfigToFile() {
    const config = {
      name: prompt('Enter a name for this configuration:') || 'Untitled',
      timestamp: Date.now(),
      effects: this.app.pedalboard.serialize(),
      connections: this.app.connectionManager.serialize()
    };

    const result = await window.electronAPI.saveConfigToFile(config);

    if (result.success) {
      alert(`Configuration saved to:\n${result.path}`);
      console.log('💾 Configuration saved to file:', result.path);
    } else if (!result.canceled) {
      alert(`Failed to save configuration:\n${result.error}`);
    }
  }

  /**
   * Load configuration from file (Electron)
   */
  async loadConfigFromFile() {
    const result = await window.electronAPI.loadConfigFromFile();

    if (result.success) {
      // Clear current board
      this.app.clearBoard();

      // Load configuration
      this.app.pedalboard.deserialize(result.config.effects);
      this.app.connectionManager.deserialize(result.config.connections);

      alert(`Configuration loaded from:\n${result.path}`);
      console.log('📁 Configuration loaded from file:', result.path);
    } else if (!result.canceled) {
      alert(`Failed to load configuration:\n${result.error}`);
    }
  }

  /**
   * Load audio file from path (Electron)
   */
  async loadAudioFromPath(filePath) {
    try {
      // Create a file URL for the local file
      const fileUrl = `file://${filePath}`;

      // Create audio element
      const audioElement = new Audio(fileUrl);
      audioElement.loop = true;

      // Wait for audio to be loadable
      await new Promise((resolve, reject) => {
        audioElement.addEventListener('canplaythrough', resolve, { once: true });
        audioElement.addEventListener('error', reject, { once: true });
      });

      // Stop current input
      await this.app.audioEngine.stopInput();

      // Create source from audio element
      const audioContext = this.app.audioEngine.getContext();
      const audioElementSource = audioContext.createMediaElementSource(audioElement);

      // Set up audio engine
      this.app.audioEngine.audioElement = audioElement;
      this.app.audioEngine.audioElementSource = audioElementSource;
      this.app.audioEngine.currentSource = audioElementSource;
      this.app.audioEngine.sourceType = 'file';

      // Connect to master gain
      audioElementSource.connect(this.app.audioEngine.getOutputNode());

      // Update UI
      document.querySelector('input[value="file"]').checked = true;
      document.getElementById('playBtn').disabled = false;

      console.log('📁 Audio file loaded:', filePath);
      alert(`Audio file loaded:\n${filePath.split('/').pop()}`);

    } catch (error) {
      console.error('Failed to load audio file:', error);
      alert('Failed to load audio file. Please try another file.');
    }
  }

  /**
   * Update UI for Electron
   */
  updateUIForElectron() {
    // Hide the browser-based file input (we use native dialogs)
    const fileInputSection = document.getElementById('selectFileBtn');
    if (fileInputSection) {
      fileInputSection.style.display = 'none';
    }

    // Add Electron indicator to header
    const tagline = document.querySelector('.tagline');
    if (tagline) {
      tagline.textContent = 'Desktop Edition • Visual Effect Chain Designer';
    }

    // Update file selection radio label
    const fileRadioLabel = document.querySelector('input[value="file"] + span');
    if (fileRadioLabel) {
      fileRadioLabel.textContent = '📁 Audio File (Use File > Import)';
    }
  }

  /**
   * Check if running in Electron
   */
  static isElectron() {
    return typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron;
  }
}
