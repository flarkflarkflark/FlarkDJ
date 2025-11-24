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
