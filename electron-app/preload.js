/**
 * FlarkDJ Pedalboard - Electron Preload Script
 * Bridge between main process and renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  isElectron: true,

  // File operations
  saveConfigToFile: (config) => ipcRenderer.invoke('save-config-to-file', config),
  loadConfigFromFile: () => ipcRenderer.invoke('load-config-from-file'),

  // Menu event listeners
  onMenuNew: (callback) => ipcRenderer.on('menu-new', callback),
  onMenuOpen: (callback) => ipcRenderer.on('menu-open', callback),
  onMenuSave: (callback) => ipcRenderer.on('menu-save', callback),
  onAudioFileSelected: (callback) => ipcRenderer.on('audio-file-selected', (event, path) => callback(path)),
  onAudioSourceChanged: (callback) => ipcRenderer.on('audio-source-changed', (event, source) => callback(source)),
  onAudioPlay: (callback) => ipcRenderer.on('audio-play', callback),
  onAudioStop: (callback) => ipcRenderer.on('audio-stop', callback),

  // Remove event listeners
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback)
});

console.log('🔌 Electron preload script loaded');
