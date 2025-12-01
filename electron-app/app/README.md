# FlarkDJ Pedalboard - Visual Effect Chain Designer

A beautiful web-based interface for designing audio effect chains with FlarkDJ effects. Inspired by the WASABI Dynamic Pedalboard, this application lets you visually create, connect, and experiment with audio effects in real-time.

## Features

### Visual Design
- 🎨 **Drag & Drop Interface**: Drag effects from the palette onto the canvas
- 🔌 **Visual Cable Routing**: Click connectors to create audio connections with beautiful SVG cables
- 🎛️ **Interactive Knobs**: Real-time parameter control with rotary knobs
- 📊 **Live VU Meters**: Monitor audio levels in real-time

### Audio Effects
- **Butterworth Filter**: Resonant filter with lowpass/highpass/bandpass modes
- **Reverb**: Algorithmic reverb with room size and damping controls
- **Delay**: Stereo delay with up to 2 seconds and feedback
- **Flanger**: Classic modulation effect with LFO

### Audio Sources
- 🎤 **Microphone Input**: Process audio from your mic in real-time
- 📁 **Audio File Playback**: Load and process audio files (MP3, WAV, etc.)

### Configuration Management
- 💾 **Save/Load**: Save your effect chains and load them later
- ⌨️ **Keyboard Shortcuts**:
  - `Ctrl/Cmd + S`: Save configuration
  - `Ctrl/Cmd + O`: Load configuration
  - `Ctrl/Cmd + K`: Clear board
  - `Space`: Play/Pause
  - `Esc`: Close modals

## Quick Start

### Method 1: Python HTTP Server (Recommended)

```bash
cd web-app
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

### Method 2: Node.js HTTP Server

```bash
cd web-app
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.

### Method 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` and select "Open with Live Server"

## How to Use

### Basic Workflow

1. **Select an Audio Source**:
   - Choose "Microphone" to process live audio
   - Choose "Audio File" to load and process a file
   - Click "Play" to start audio

2. **Add Effects**:
   - Drag effect pedals from the left palette
   - Drop them onto the canvas wherever you want

3. **Connect Effects**:
   - Click on an effect's **output** connector (right side, red)
   - Drag to another effect's **input** connector (left side, green)
   - The cable will be created automatically

4. **Adjust Parameters**:
   - Click and drag knobs up/down to adjust values
   - Watch the value display update in real-time
   - Hear the changes immediately

5. **Save Your Work**:
   - Click the "Save" button in the header
   - Give your configuration a name
   - Load it anytime using the "Load" button

### Tips

- **Organize Your Board**: Drag effects around to keep your signal chain organized
- **Delete Effects**: Right-click an effect and choose "Delete"
- **Master Volume**: Use the master volume slider in the right panel
- **VU Meters**: Watch the level meters to avoid clipping

## Architecture

### Directory Structure

```
web-app/
├── index.html                      # Main HTML file
├── assets/
│   └── styles/
│       └── pedalboard.css          # All styles
├── src/
│   ├── main.js                     # Application entry point
│   ├── audio/
│   │   ├── audio-engine.js         # Audio context and I/O management
│   │   └── effects/
│   │       ├── base-effect.js      # Base effect class
│   │       ├── butterworth-filter.js
│   │       ├── reverb.js
│   │       ├── delay.js
│   │       ├── flanger.js
│   │       └── effect-factory.js   # Effect instantiation
│   ├── ui/
│   │   ├── pedalboard.js           # Pedalboard manager
│   │   ├── effect-pedal.js         # Visual effect component
│   │   ├── ui-controller.js        # UI state management
│   │   └── controls/
│   │       └── knob.js             # Rotary knob control
│   ├── interactions/
│   │   ├── drag-drop.js            # Drag & drop handler
│   │   ├── connection-manager.js   # Audio routing and cables
│   │   └── context-menu.js         # Right-click menu
│   └── utils/
│       └── config-manager.js       # Save/load configurations
└── README.md                       # This file
```

### Technology Stack

- **Pure JavaScript**: No frameworks, just vanilla ES6+ modules
- **Web Audio API**: For all audio processing
- **SVG**: For cable rendering with Bezier curves
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **LocalStorage**: For configuration persistence

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+

**Note**: Requires a modern browser with Web Audio API and ES6 module support.

## Future Enhancements

See the main FlarkDJ README for plans to integrate this web app as:
- **Option 2**: Electron desktop application
- **Option 3**: Embedded web view in JUCE native plugin

## Troubleshooting

### Audio Not Playing

- **Check permissions**: Allow microphone access when prompted
- **Check volume**: Ensure master volume is turned up
- **Check connections**: Make sure effects are connected
- **Check browser console**: Look for error messages

### Effects Not Working

- **Verify connections**: Ensure input → effects → output chain
- **Check bypass**: Make sure effects aren't bypassed
- **Refresh page**: Sometimes a fresh start helps

### Performance Issues

- **Limit effects**: Too many effects can cause audio glitches
- **Close other tabs**: Free up system resources
- **Use Chrome**: Generally has the best Web Audio performance

## License

MIT License - Same as FlarkDJ

## Credits

Inspired by the excellent [WASABI Dynamic Pedalboard](https://wasabi.i3s.unice.fr/dynamicPedalboard/) project from i3s.unice.fr.

Built with ❤️ for the FlarkDJ project.
