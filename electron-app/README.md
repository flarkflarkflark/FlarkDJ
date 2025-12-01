# FlarkDJ Pedalboard - Desktop Edition

A native desktop application built with Electron that wraps the FlarkDJ Pedalboard web interface, providing a standalone experience with native OS integration.

## Features

### Desktop Native Features
- 🖥️ **Native Menus**: Full menu bar integration (File, Edit, View, Audio, Help)
- 💾 **Native File Dialogs**: Save/load configurations using OS file pickers
- 📁 **File System Access**: Direct access to audio files without browser restrictions
- ⌨️ **System Keyboard Shortcuts**: Full keyboard shortcut support
- 🔔 **Native Notifications**: System-level notifications (if implemented)
- 🎨 **Custom Window**: Frameless or custom-styled window options

### All Web App Features Included
- Drag & drop effect chain building
- Visual SVG cable routing
- Interactive rotary knobs
- Real-time audio processing
- Microphone and audio file input
- Live VU meters
- Configuration save/load

## Installation

### From Pre-Built Binaries

1. **Download** the latest release for your platform:
   - **macOS**: `FlarkDJ-Pedalboard-mac-x64.dmg` or `FlarkDJ-Pedalboard-mac-arm64.dmg`
   - **Windows**: `FlarkDJ-Pedalboard-win-x64.exe`
   - **Linux**: `FlarkDJ-Pedalboard-linux-x86_64.AppImage` or `.deb`

2. **Install**:
   - **macOS**: Open DMG and drag to Applications
   - **Windows**: Run the installer
   - **Linux**: Make AppImage executable or install .deb package

### Building from Source

#### Prerequisites
- Node.js 18+ and npm
- Git

#### Steps

```bash
# Clone the repository
git clone https://github.com/flarkflarkflark/FlarkDJ.git
cd FlarkDJ/electron-app

# Install dependencies
npm install

# Run in development mode
npm start

# Build for your platform
npm run dist

# Or build for specific platforms
npm run dist:mac      # macOS
npm run dist:win      # Windows
npm run dist:linux    # Linux
```

## Usage

### Running the App

**Development Mode:**
```bash
npm start
```

**Production Build:**
- Launch the installed application from your Applications folder (macOS)
- Launch from Start Menu (Windows)
- Launch from application menu (Linux)

### Menu Bar

**File Menu**
- `New` (Ctrl/Cmd+N): Start a new configuration
- `Open Configuration` (Ctrl/Cmd+O): Load a saved configuration from file
- `Save Configuration` (Ctrl/Cmd+S): Save current configuration to file
- `Import Audio File` (Ctrl/Cmd+I): Load an audio file for processing
- `Quit`: Exit the application

**Edit Menu**
- Standard edit operations (Undo, Redo, Cut, Copy, Paste)

**View Menu**
- `Reload`: Reload the application
- `Toggle DevTools`: Open Chromium DevTools for debugging
- `Zoom In/Out`: Adjust zoom level
- `Toggle Fullscreen`: Enter/exit fullscreen mode

**Audio Menu**
- `Use Microphone`: Toggle microphone input
- `Play` (Space): Start audio playback
- `Stop`: Stop audio playback

**Help Menu**
- `Documentation`: Open GitHub documentation
- `Report Issue`: Open GitHub issues page
- `About`: Show app information

### File Formats

**Configuration Files (`.flarkdj`)**
- JSON format containing effect chain and parameters
- Can be shared between users
- Compatible with web version (can load in browser too)

**Supported Audio Formats**
- MP3, WAV, OGG, FLAC, M4A
- Any format supported by Chromium's Audio element

## Development

### Project Structure

```
electron-app/
├── main.js                 # Electron main process
├── preload.js             # Preload script (IPC bridge)
├── package.json           # Dependencies and build config
├── app/                   # Web app files (copied from web-app/)
│   ├── index.html
│   ├── assets/
│   └── src/
│       ├── electron-bridge.js  # Electron-specific integrations
│       └── ...
└── build/                 # Build resources (icons, etc.)
```

### Adding Features

**IPC Communication:**

1. Add handler in `main.js`:
```javascript
ipcMain.handle('my-feature', async (event, data) => {
  // Handle feature
  return result;
});
```

2. Expose in `preload.js`:
```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  myFeature: (data) => ipcRenderer.invoke('my-feature', data)
});
```

3. Use in `electron-bridge.js`:
```javascript
const result = await window.electronAPI.myFeature(data);
```

### Building Installers

**Configuration** is in `package.json` under the `build` key.

**Create distributables:**
```bash
npm run dist           # All platforms
npm run dist:mac       # macOS only (.dmg + .zip)
npm run dist:win       # Windows only (.exe installer + portable)
npm run dist:linux     # Linux only (.AppImage + .deb)
```

**Output** is in `dist/` directory.

### Code Signing (macOS/Windows)

For production releases, you need to sign the application:

**macOS:**
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAMID)"
    }
  }
}
```

**Windows:**
```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/cert.p12",
      "certificatePassword": "password"
    }
  }
}
```

## Troubleshooting

### App Won't Start

- **Check logs**: Look in DevTools console (View > Toggle DevTools)
- **Clear cache**: Delete `~/Library/Application Support/FlarkDJ Pedalboard` (macOS)
- **Reinstall**: Remove and reinstall the application

### Audio Not Working

- **Check permissions**: Ensure microphone access is granted
- **Try different source**: Switch between microphone and file input
- **Restart app**: Close and reopen the application

### File Dialog Issues

- **macOS Security**: Grant Full Disk Access in System Preferences > Security & Privacy
- **Linux**: Ensure file manager is installed

## Comparison: Web vs Desktop

| Feature | Web App | Desktop App |
|---------|---------|-------------|
| Installation | None (browser) | Required |
| File System | Limited | Full access |
| Menus | None | Native menus |
| Shortcuts | Browser limits | Full support |
| Audio Formats | Browser-dependent | All Chromium formats |
| Updates | Automatic | Manual/auto-update |
| Offline | Partial | Full |
| Performance | Good | Better (dedicated) |

## License

MIT License - Same as FlarkDJ

## Contributing

Contributions welcome! Please submit PRs to the main FlarkDJ repository.

## Links

- [Main FlarkDJ Repository](https://github.com/flarkflarkflark/FlarkDJ)
- [Web Version](../web-app)
- [JUCE Native Plugin](../native)
- [Issue Tracker](https://github.com/flarkflarkflark/FlarkDJ/issues)
