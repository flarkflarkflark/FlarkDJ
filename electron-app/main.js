/**
 * FlarkDJ Pedalboard - Electron Main Process
 */

const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#1a1a2e',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'build/icon.png'),
    title: 'FlarkDJ Pedalboard',
    show: false
  });

  // Load the app
  mainWindow.loadFile(path.join(__dirname, 'app/index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Create application menu
  createMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Create application menu
 */
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new');
          }
        },
        {
          label: 'Open Configuration...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-open');
          }
        },
        {
          label: 'Save Configuration...',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save');
          }
        },
        { type: 'separator' },
        {
          label: 'Import Audio File...',
          accelerator: 'CmdOrCtrl+I',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });

            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send('audio-file-selected', result.filePaths[0]);
            }
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Audio',
      submenu: [
        {
          label: 'Use Microphone',
          type: 'checkbox',
          click: (menuItem) => {
            mainWindow.webContents.send('audio-source-changed',
              menuItem.checked ? 'microphone' : 'none'
            );
          }
        },
        { type: 'separator' },
        {
          label: 'Play',
          accelerator: 'Space',
          click: () => {
            mainWindow.webContents.send('audio-play');
          }
        },
        {
          label: 'Stop',
          click: () => {
            mainWindow.webContents.send('audio-stop');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/flarkflarkflark/FlarkDJ');
          }
        },
        {
          label: 'Report Issue',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/flarkflarkflark/FlarkDJ/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About FlarkDJ Pedalboard',
              message: 'FlarkDJ Pedalboard',
              detail: `Version: ${app.getVersion()}\n\nA beautiful visual effect chain designer for audio processing.\n\nBuilt with Electron and Web Audio API.\n\n© 2024 FlarkDJ Team`,
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * IPC Handlers
 */

// Save configuration to file
ipcMain.handle('save-config-to-file', async (event, config) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Configuration',
    defaultPath: `${config.name}.flarkdj`,
    filters: [
      { name: 'FlarkDJ Configuration', extensions: ['flarkdj'] },
      { name: 'JSON', extensions: ['json'] }
    ]
  });

  if (!result.canceled) {
    try {
      fs.writeFileSync(result.filePath, JSON.stringify(config, null, 2));
      return { success: true, path: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, canceled: true };
});

// Load configuration from file
ipcMain.handle('load-config-from-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Load Configuration',
    filters: [
      { name: 'FlarkDJ Configuration', extensions: ['flarkdj', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const data = fs.readFileSync(result.filePaths[0], 'utf-8');
      const config = JSON.parse(data);
      return { success: true, config, path: result.filePaths[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, canceled: true };
});

/**
 * App Events
 */

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// macOS specific: Show window when clicking dock icon
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

console.log('🎛️ FlarkDJ Pedalboard Desktop starting...');
