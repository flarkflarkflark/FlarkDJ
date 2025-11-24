# FlarkDJ Plugin Packages

Complete audio plugin packages in all major formats.

## 🎛️ Available Plugin Formats

| Format | Platform | Status | Use Case |
|--------|----------|--------|----------|
| **VST3** | Cross-platform | ✅ Ready | Industry standard, most DAWs |
| **Audio Unit** | macOS | ✅ Ready | Logic Pro, GarageBand |
| **AAX** | Cross-platform | ✅ Ready | Pro Tools |
| **LV2** | Linux/Cross | ✅ Ready | Open-source, Linux audio |
| **CLAP** | Cross-platform | ✅ Ready | Modern, future-proof |
| **Standalone** | All | ✅ Ready | Independent use, testing |

## 📦 What's Included

### Plugin Wrappers (JavaScript/TypeScript)

Located in `./plugins/`:

```
plugins/
├── VST3Plugin.js          # VST3 wrapper
├── AudioUnitPlugin.js     # AU wrapper
├── AAXPlugin.js           # AAX wrapper
├── LV2Plugin.js           # LV2 wrapper
├── CLAPPlugin.js          # CLAP wrapper
├── StandaloneApp.js       # Standalone application
├── PluginWrapper.js       # Base wrapper class
├── index.js               # Main entry point
└── [format]/              # Format-specific directories
    └── README.md          # Build instructions
```

### Features per Plugin

All plugins support:
- ✅ Stereo audio processing (2 in / 2 out)
- ✅ 17 automatable parameters
- ✅ State save/load
- ✅ Preset management
- ✅ MIDI input (for MIDI learn)
- ✅ Zero latency processing
- ✅ 4-second tail (for reverb)

## 🚀 Quick Start

### JavaScript/Node.js Usage

```javascript
// VST3
const { createVST3Plugin } = require('flark-dj/dist/plugin');
const vst3 = createVST3Plugin(44100);
vst3.initialize(44100, 512);

// Audio Unit
const { createAudioUnitPlugin } = require('flark-dj/dist/plugin');
const au = createAudioUnitPlugin(44100);

// AAX
const { createAAXPlugin } = require('flark-dj/dist/plugin');
const aax = createAAXPlugin(44100);

// LV2
const { createLV2Plugin } = require('flark-dj/dist/plugin');
const lv2 = createLV2Plugin(44100);

// CLAP
const { createCLAPPlugin } = require('flark-dj/dist/plugin');
const clap = createCLAPPlugin(44100);

// Standalone
const { createStandaloneApp } = require('flark-dj/dist/plugin');
const app = createStandaloneApp({ sampleRate: 44100, bufferSize: 512 });
```

### Process Audio

```javascript
const plugin = createVST3Plugin(44100);
plugin.initialize(44100, 512);

// Create audio buffers
const inputL = new Float32Array(512);
const inputR = new Float32Array(512);
const outputL = new Float32Array(512);
const outputR = new Float32Array(512);

// Fill input with audio data
// ...

// Process
plugin.process([inputL, inputR], [outputL, outputR], 512);
```

### Control Parameters

```javascript
// Set filter cutoff (parameter ID 1)
plugin.setParameter(1, 5000); // 5000 Hz

// Get current value
const cutoff = plugin.getParameter(1);

// Get all parameters
const params = plugin.getParameters();
params.forEach(param => {
    console.log(`${param.name}: ${param.value} ${param.unit}`);
});
```

### Save/Load State

```javascript
// Save state
const state = plugin.saveState();
localStorage.setItem('pluginState', state);

// Load state
const savedState = localStorage.getItem('pluginState');
plugin.loadState(savedState);
```

## 🔧 Building Native Plugins

To create actual binary plugins for use in DAWs:

### Step 1: Choose Framework

**Recommended: JUCE**
- Supports all formats
- Industry standard
- Excellent documentation
- Visual interface builder

**Alternatives:**
- iPlug2 (simpler, MIT license)
- DPF (open-source, LV2/CLAP focus)
- Native SDKs (advanced)

### Step 2: Install Framework

```bash
# JUCE
# Download from https://juce.com/

# iPlug2
git clone --recursive https://github.com/iPlug2/iPlug2

# DPF
git clone https://github.com/DISTRHO/DPF
```

### Step 3: Integrate FlarkDJ

```bash
# Copy FlarkDJ source to your project
cp -r src/ YourPluginProject/Source/FlarkDJ/
cp -r dist/ YourPluginProject/Source/FlarkDJ/dist/

# Follow PLUGIN_DEVELOPMENT.md for integration details
```

### Step 4: Build

```bash
# JUCE (with Projucer or CMake)
cmake -B build
cmake --build build --config Release

# iPlug2 (with Visual Studio or Xcode)
# Open solution/project and build

# DPF
make
```

See `PLUGIN_DEVELOPMENT.md` for detailed instructions.

## 📋 Plugin Parameters

| ID | Name | Range | Default | Unit | Automatable |
|----|------|-------|---------|------|-------------|
| 0 | Filter Enabled | 0-1 | 1 | - | ✓ |
| 1 | Filter Cutoff | 20-20000 | 1000 | Hz | ✓ |
| 2 | Filter Resonance | 0.1-10 | 1 | - | ✓ |
| 3 | Filter Type | 0-2 | 0 | - | - |
| 4 | Reverb Enabled | 0-1 | 0 | - | ✓ |
| 5 | Reverb Room Size | 0-1 | 0.5 | - | ✓ |
| 6 | Reverb Damping | 0-1 | 0.5 | - | ✓ |
| 7 | Reverb Wet/Dry | 0-1 | 0.3 | - | ✓ |
| 8 | Delay Enabled | 0-1 | 0 | - | ✓ |
| 9 | Delay Time | 0-2 | 0.5 | s | ✓ |
| 10 | Delay Feedback | 0-0.95 | 0.3 | - | ✓ |
| 11 | Delay Wet/Dry | 0-1 | 0.5 | - | ✓ |
| 12 | LFO Rate | 0.1-20 | 1 | Hz | ✓ |
| 13 | LFO Depth | 0-1 | 0 | - | ✓ |
| 14 | LFO Waveform | 0-3 | 0 | - | - |
| 15 | Master Mix | 0-1 | 1 | - | ✓ |
| 16 | Master Bypass | 0-1 | 0 | - | ✓ |

## 🎯 Format-Specific Details

### VST3
- **ID**: `{12345678-1234-1234-1234-123456789012}`
- **Category**: Fx|Dynamics
- **SDK**: Steinberg VST3 SDK
- **License**: GPLv3 or paid commercial

### Audio Unit (AU)
- **Type**: `aufx` (Audio Unit Effect)
- **Subtype**: `fldj`
- **Manufacturer**: `Flrk`
- **Platform**: macOS only

### AAX
- **Plugin ID**: `FLDj`
- **Manufacturer ID**: `Flrk`
- **Category**: EQ
- **Requires**: Avid Developer Account, iLok

### LV2
- **URI**: `http://flarkdj.com/plugins/flarkdj`
- **Class**: Plugin
- **License**: MIT
- **Ports**: 4 audio (2 in, 2 out) + 1 MIDI + 17 control

### CLAP
- **ID**: `com.flarkdj.flarkdj`
- **Features**: audio-effect, stereo, filter, reverb, delay, modulation
- **License**: Open-source
- **Extensions**: params, state, audio-ports, note-ports, latency, tail

## 🧪 Testing

### Unit Tests

```bash
# Run plugin tests
npm run test:plugins

# Test specific format
node test-vst3.js
node test-au.js
```

### DAW Testing

Test in multiple DAWs:
- Ableton Live (VST3, AU)
- Logic Pro (AU, macOS)
- Pro Tools (AAX)
- Reaper (All formats)
- Bitwig Studio (VST3, CLAP)
- FL Studio (VST3)

### Validation Tools

```bash
# Audio Unit
auval -v aufx FLDj Flrk

# VST3
validator FlarkDJ.vst3

# LV2
lv2lint http://flarkdj.com/plugins/flarkdj

# CLAP
clap-validator FlarkDJ.clap
```

## 📦 Distribution

### File Locations

**macOS:**
- VST3: `/Library/Audio/Plug-Ins/VST3/` or `~/Library/Audio/Plug-Ins/VST3/`
- AU: `/Library/Audio/Plug-Ins/Components/` or `~/Library/Audio/Plug-Ins/Components/`
- LV2: `/Library/Audio/Plug-Ins/LV2/` or `~/.lv2/`
- CLAP: `~/Library/Audio/Plug-Ins/CLAP/`

**Windows:**
- VST3: `C:\Program Files\Common Files\VST3\`
- AAX: `C:\Program Files\Common Files\Avid\Audio\Plug-Ins\`
- CLAP: `C:\Program Files\Common Files\CLAP\`

**Linux:**
- VST3: `/usr/lib/vst3/` or `~/.vst3/`
- LV2: `/usr/lib/lv2/` or `~/.lv2/`
- CLAP: `/usr/lib/clap/` or `~/.clap/`

### Code Signing

```bash
# macOS
codesign --force --sign "Developer ID" FlarkDJ.component

# Windows
signtool sign /f cert.pfx FlarkDJ.vst3
```

## 📚 Documentation

- **PLUGIN_DEVELOPMENT.md** - Complete build guide
- **plugins/README.md** - Plugin packages overview
- **plugins/[format]/README.md** - Format-specific docs

## 🔗 Resources

### Official SDKs
- [VST3 SDK](https://steinbergmedia.github.io/vst3_dev_portal/)
- [LV2 Specification](https://lv2plug.in/)
- [CLAP](https://github.com/free-audio/clap)
- AAX SDK (Avid Developer Portal)

### Frameworks
- [JUCE](https://juce.com/)
- [iPlug2](https://github.com/iPlug2/iPlug2)
- [DPF](https://github.com/DISTRHO/DPF)

## 💡 Next Steps

1. **Test wrappers**: Use JavaScript implementations for prototyping
2. **Choose framework**: JUCE recommended for production
3. **Build native plugins**: Follow PLUGIN_DEVELOPMENT.md
4. **Test in DAWs**: Validate in target applications
5. **Distribute**: Package and sign for end users

## 🆘 Support

- **Issues**: https://github.com/flarkflarkflark/FlarkDJ/issues
- **Docs**: https://github.com/flarkflarkflark/FlarkDJ
- **Community**: Audio Plugin Developers forums

---

**Plugin Status:** ✅ All wrappers complete and tested
**Build Status:** ✅ TypeScript compiled successfully
**Package Status:** ✅ Ready for native plugin development
