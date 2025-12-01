# FlarkDJ Pedalboard - Complete Integration Guide

The FlarkDJ Pedalboard is a beautiful, visual effect chain designer inspired by the WASABI Dynamic Pedalboard. It provides an intuitive drag-and-drop interface for creating and experimenting with audio effects in real-time.

## 🎨 Three Ways to Experience the Pedalboard

We've implemented **three different integration options** so you can use the pedalboard in the way that best suits your workflow:

### **Option 1: Web Application** 🌐
A standalone web app that runs in your browser.

**Best for:**
- Quick experimentation
- No installation required
- Cross-platform (any modern browser)
- Sharing with others

**Location:** `web-app/`

[**View Documentation →**](web-app/README.md)

### **Option 2: Electron Desktop App** 🖥️
A native desktop application with OS integration.

**Best for:**
- Offline use
- Native file system access
- Application menus and shortcuts
- Dedicated audio processing

**Location:** `electron-app/`

[**View Documentation →**](electron-app/README.md)

### **Option 3: JUCE Plugin Web View** 🔌
Embedded in the native VST3/LV2 plugin.

**Best for:**
- DAW integration
- Real-time parameter sync
- Professional studio workflows
- Alongside other plugins

**Location:** `native/FlarkDJWebView.h`

---

## 🚀 Quick Start Guide

### Web App (Option 1)

```bash
cd web-app
python3 server.py
# Open http://localhost:8000
```

### Electron App (Option 2)

```bash
cd electron-app
npm install
npm start
```

### JUCE Plugin (Option 3)

1. Build the native plugin with web view support:
```bash
cd native
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
```

2. Copy `web-app/` to plugin resources directory
3. Load plugin in your DAW
4. Click "Switch to Web View" button

---

## 📊 Feature Comparison

| Feature | Web App | Electron | JUCE Plugin |
|---------|---------|----------|-------------|
| **Installation** | None | App install | Plugin + web assets |
| **Platform** | Browser | Win/Mac/Linux | DAW-dependent |
| **File Access** | Limited | Full | Full |
| **Audio I/O** | Mic/File | Mic/File | DAW routing |
| **Menus** | None | Native | DAW menus |
| **Offline** | Partial | Full | Full |
| **Parameter Sync** | N/A | N/A | Bi-directional |
| **Updates** | Auto | Manual/Auto | With plugin |

---

## 🎛️ Features (All Versions)

### Visual Interface
- **Drag & Drop**: Drag effects from palette onto canvas
- **Visual Cables**: SVG Bezier curves connecting effects
- **Interactive Knobs**: Rotary controls with real-time feedback
- **Live VU Meters**: Audio level monitoring
- **Responsive Design**: Works on desktop, tablet, and mobile

### Audio Effects
- **Butterworth Filter**: Resonant filter with lowpass/highpass/bandpass modes
- **Reverb**: Algorithmic reverb with room size and damping
- **Delay**: Stereo delay with up to 2 seconds and feedback
- **Flanger**: Classic LFO-based modulation effect

### Configuration Management
- **Save/Load**: Store and recall effect chains
- **LocalStorage** (Web/Electron): Browser-based persistence
- **File System** (Electron): Native `.flarkdj` files
- **DAW State** (JUCE): Saved with project

---

## 🔧 Development

### Architecture

All three implementations share the same core web application code:

```
web-app/
├── index.html              # Main interface
├── assets/styles/          # CSS
└── src/
    ├── audio/             # Web Audio API effects
    ├── ui/                # Visual components
    ├── interactions/      # Drag & drop, connections
    ├── utils/             # Config management
    ├── juce-bridge.js     # JUCE integration
    └── electron-bridge.js # Electron integration (in electron-app only)
```

### Adding a New Effect

1. **Create effect class** in `web-app/src/audio/effects/`:
```javascript
import { BaseEffect } from './base-effect.js';

export class MyEffect extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'my-effect', 'My Effect');
    // Create audio nodes
    // Register parameters
    // Connect signal chain
  }
}
```

2. **Register in factory** (`effect-factory.js`):
```javascript
case 'my-effect':
  return new MyEffect(audioContext);
```

3. **Add metadata** for UI:
```javascript
'my-effect': {
  name: 'My Effect',
  description: 'Description',
  parameters: [...]
}
```

4. **Add to palette** (`index.html`):
```html
<div class="palette-item" draggable="true" data-effect-type="my-effect">
  <div class="effect-icon">🎵</div>
  <span class="effect-name">My Effect</span>
</div>
```

---

## 🎯 Integration Details

### Option 1: Web App

**Technologies:**
- Pure JavaScript ES6 modules
- Web Audio API
- SVG for cables
- CSS3 Grid & Flexbox

**Deployment:**
- Static hosting (GitHub Pages, Netlify, Vercel)
- Or local server (`python3 -m http.server`)

**Limitations:**
- Browser audio format support
- No direct file system access
- Requires microphone permissions

### Option 2: Electron

**Technologies:**
- Electron 28+
- Node.js integration
- IPC for main/renderer communication

**Build Process:**
```bash
npm run dist        # All platforms
npm run dist:mac    # macOS only
npm run dist:win    # Windows only
npm run dist:linux  # Linux only
```

**Distribution:**
- DMG/ZIP (macOS)
- NSIS installer/Portable (Windows)
- AppImage/DEB (Linux)

**Additional Features:**
- Native file dialogs
- Application menus
- System notifications (optional)
- Auto-updates (optional)

### Option 3: JUCE Plugin

**Technologies:**
- JUCE WebBrowserComponent
- JavaScript-C++ bridge
- Parameter automation

**Setup:**

1. **Include web view header**:
```cpp
#include "FlarkDJWebView.h"
```

2. **Add to editor**:
```cpp
webView = std::make_unique<FlarkDJWebView>(processor);
addAndMakeVisible(webView.get());
```

3. **Copy web assets**:
- macOS: `YourPlugin.vst3/Contents/Resources/web-app/`
- Windows: Next to `YourPlugin.vst3/web-app/`
- Linux: `~/.vst3/YourPlugin.vst3/web-app/`

**Parameter Mapping:**

JUCE parameters automatically sync with web interface:
- C++ → JavaScript: Parameter changes update web knobs
- JavaScript → C++ Parameter adjustments update DAW automation

---

## 🐛 Troubleshooting

### Web App

**Problem:** Audio not working
- **Solution:** Check microphone permissions, try different browser

**Problem:** Effects not loading
- **Solution:** Check browser console for errors, ensure ES6 module support

### Electron

**Problem:** App won't start
- **Solution:** Check logs in DevTools, reinstall application

**Problem:** File dialogs not appearing
- **Solution:** Grant necessary permissions in system settings

### JUCE Plugin

**Problem:** Web view shows "Not Found" error
- **Solution:** Ensure `web-app/` directory is in correct location

**Problem:** Parameters not syncing
- **Solution:** Check JavaScript console in web view, verify parameter mappings in `juce-bridge.js`

**Problem:** WebBrowserComponent not available
- **Solution:** Ensure JUCE 7.0.9+ is installed, check platform support

---

## 📦 Distribution

### Web App
- Host on static file server
- GitHub Pages: Push to `gh-pages` branch
- Netlify: Connect repository for auto-deploy

### Electron
- Create installers with `electron-builder`
- Code sign for macOS/Windows (production)
- Distribute via GitHub Releases

### JUCE Plugin
- Include `web-app/` in plugin resources
- Document installation location for users
- Consider embedding as binary resources (advanced)

---

## 🔮 Future Enhancements

- [ ] More effects (chorus, phaser, EQ, compressor)
- [ ] Preset library with cloud sync
- [ ] MIDI controller mapping
- [ ] Audio recording/export
- [ ] Collaborative editing (multiplayer pedalboard)
- [ ] Mobile app (React Native or Capacitor)
- [ ] VSCode extension for effect development

---

## 📝 License

MIT License - Same as FlarkDJ

## 🙏 Credits

- Inspired by [WASABI Dynamic Pedalboard](https://wasabi.i3s.unice.fr/dynamicPedalboard/)
- Built with Web Audio API
- JUCE framework for native plugin
- Electron for desktop app

---

## 📚 Additional Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [JUCE Documentation](https://juce.com/learn/documentation)
- [Electron Documentation](https://www.electronjs.org/docs)
- [FlarkDJ Main Repository](https://github.com/flarkflarkflark/FlarkDJ)

---

**Made with ❤️ for the FlarkDJ project**
