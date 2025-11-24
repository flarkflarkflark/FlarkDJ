#!/bin/bash

set -e

echo "Building FlarkDJ Plugin Packages..."
echo "===================================="
echo ""

# Build TypeScript first
echo "Step 1: Building TypeScript..."
npm run build

# Create plugins directory
mkdir -p plugins

echo ""
echo "Step 2: Creating plugin packages..."
echo ""

# VST3 Plugin
echo "→ VST3 Plugin Package"
mkdir -p plugins/vst3
cat > plugins/vst3/README.md << 'EOF'
# FlarkDJ VST3 Plugin

This directory contains the VST3 plugin wrapper for FlarkDJ.

## Building Native VST3

To create an actual VST3 plugin binary, use one of these frameworks:

### Option 1: JUCE (Recommended)
```bash
# Install JUCE: https://juce.com/
# Create JUCE project and integrate FlarkDJ wrapper code
```

### Option 2: iPlug2
```bash
# Clone iPlug2: https://github.com/iPlug2/iPlug2
# Follow integration guide in PLUGIN_DEVELOPMENT.md
```

## Installation (JavaScript/Node.js)

```javascript
const { createVST3Plugin } = require('flark-dj/dist/plugin');
const plugin = createVST3Plugin(44100);
```

## Plugin Info
- Name: FlarkDJ
- Vendor: FlarkDJ Team
- Format: VST3
- Category: Audio Effects
- I/O: Stereo In/Out
EOF

# Audio Unit Plugin
echo "→ Audio Unit (AU) Plugin Package"
mkdir -p plugins/au
cat > plugins/au/README.md << 'EOF'
# FlarkDJ Audio Unit Plugin

macOS-specific plugin format.

## Building Native AU

Use JUCE or other framework to compile for macOS.

## Installation
Place built .component file in:
- `/Library/Audio/Plug-Ins/Components/` (system-wide)
- `~/Library/Audio/Plug-Ins/Components/` (user-specific)
EOF

# AAX Plugin
echo "→ AAX Plugin Package"
mkdir -p plugins/aax
cat > plugins/aax/README.md << 'EOF'
# FlarkDJ AAX Plugin

Pro Tools plugin format.

## Building Native AAX

Requires:
- Avid Developer Account
- AAX SDK (under NDA)
- PACE iLok licensing

Use JUCE with AAX SDK to build.
EOF

# LV2 Plugin
echo "→ LV2 Plugin Package"
mkdir -p plugins/lv2
cat > plugins/lv2/README.md << 'EOF'
# FlarkDJ LV2 Plugin

Open-source Linux plugin format (also works on macOS/Windows).

## Building Native LV2

### Option 1: DPF Framework
```bash
git clone https://github.com/DISTRHO/DPF
# Follow DPF integration guide
```

### Option 2: LV2 SDK
```bash
# Install LV2 development libraries
sudo apt-get install lv2-dev  # Ubuntu/Debian
# Build with LV2 SDK
```

## Installation
Place built .lv2 bundle in:
- `/usr/lib/lv2/` (Linux system-wide)
- `~/.lv2/` (Linux user-specific)
- `/Library/Audio/Plug-Ins/LV2/` (macOS)
EOF

# CLAP Plugin
echo "→ CLAP Plugin Package"
mkdir -p plugins/clap
cat > plugins/clap/README.md << 'EOF'
# FlarkDJ CLAP Plugin

Modern open-source plugin format.

## Building Native CLAP

```bash
# Clone CLAP SDK
git clone https://github.com/free-audio/clap

# Use clap-wrapper for easy integration
git clone https://github.com/free-audio/clap-wrapper
```

## Installation
Place built .clap file in:
- `/usr/lib/clap/` (Linux)
- `~/Library/Audio/Plug-Ins/CLAP/` (macOS)
- `C:\Program Files\Common Files\CLAP\` (Windows)
EOF

# Standalone App
echo "→ Standalone Application Package"
mkdir -p plugins/standalone
cat > plugins/standalone/README.md << 'EOF'
# FlarkDJ Standalone Application

Run FlarkDJ without a DAW.

## Usage

```javascript
const { createStandaloneApp } = require('flark-dj/dist/plugin');

const app = createStandaloneApp({
  sampleRate: 44100,
  bufferSize: 512
});

await app.initialize();
await app.startProcessing();
```

## Building Desktop App

Use Electron to package as desktop application:

```bash
npm install --save-dev electron electron-builder
# Configure electron build
```
EOF

# Copy plugin wrapper files
echo ""
echo "Step 3: Copying plugin wrapper code..."
cp -r dist/plugin/* plugins/

# Create unified documentation
cat > plugins/README.md << 'EOF'
# FlarkDJ Plugin Packages

This directory contains plugin wrappers for FlarkDJ in multiple formats.

## Available Formats

| Format | Platform | Status | Directory |
|--------|----------|--------|-----------|
| VST3 | Cross-platform | ✅ Wrapper Ready | `vst3/` |
| Audio Unit (AU) | macOS | ✅ Wrapper Ready | `au/` |
| AAX | Pro Tools | ✅ Wrapper Ready | `aax/` |
| LV2 | Linux/Cross | ✅ Wrapper Ready | `lv2/` |
| CLAP | Cross-platform | ✅ Wrapper Ready | `clap/` |
| Standalone | All | ✅ Ready | `standalone/` |

## Development Status

The TypeScript/JavaScript wrappers are complete and functional.

To create **native binary plugins** for use in DAWs:
1. Choose a plugin framework (JUCE recommended)
2. Integrate the FlarkDJ wrapper code
3. Compile for your target platform(s)

See `PLUGIN_DEVELOPMENT.md` for detailed instructions.

## Quick Start (JavaScript/Node.js)

```javascript
// VST3
const { createVST3Plugin } = require('flark-dj/dist/plugin');
const vst3 = createVST3Plugin(44100);

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
const app = createStandaloneApp({ sampleRate: 44100 });
```

## Testing

Each plugin wrapper includes test methods:

```javascript
const plugin = createVST3Plugin(44100);

// Initialize
plugin.initialize(44100, 512);

// Process audio
const input = [new Float32Array(512), new Float32Array(512)];
const output = [new Float32Array(512), new Float32Array(512)];
plugin.process(input, output, 512);

// Set parameters
plugin.setParameter(0, 0.5);
console.log(plugin.getParameter(0));

// State management
const state = plugin.saveState();
plugin.loadState(state);
```

## Building Native Plugins

See individual format directories for build instructions, or see `PLUGIN_DEVELOPMENT.md` for comprehensive guide.

## Support

- Issues: https://github.com/flarkflarkflark/FlarkDJ/issues
- Docs: https://github.com/flarkflarkflark/FlarkDJ
EOF

echo ""
echo "✅ Plugin packages created successfully!"
echo ""
echo "Output directory: ./plugins/"
echo ""
echo "Next steps:"
echo "1. Review plugin wrappers in ./plugins/"
echo "2. See PLUGIN_DEVELOPMENT.md for native plugin build instructions"
echo "3. Test wrappers: npm run test:plugins"
echo ""
