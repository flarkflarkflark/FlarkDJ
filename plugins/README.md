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
