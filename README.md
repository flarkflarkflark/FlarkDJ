# FlarkDJ

A professional DJ effects plugin with advanced audio processing, modulation, and real-time control features. Available as native VST3/LV2 plugins for Windows, macOS, and Linux.

## 🎉 What's New in v1.1.0

- **Multi-Platform Builds**: Windows, macOS, and Linux support with automated CI/CD
- **Preset Manager**: Save, load, and organize your favorite effect settings
- **XY Pad**: Interactive 2D control surface for expressive sound design
- **A/B Snapshots**: Instantly compare two effect states
- **Output Limiter**: Prevents clipping with smooth tanh saturation
- **Compact UI**: 32% smaller window, 50% smaller knobs, fully resizable
- **BPM Sync**: LFO locks to DAW tempo with note divisions

## Features

### Core Audio Effects
- **Butterworth Filter**: Airwindows-inspired resonant filter with lowpass/highpass/bandpass modes
- **DJ Isolator**: Sweep between frequency bands with adjustable Q
- **Reverb**: Algorithmic reverb with room size and damping controls
- **Delay**: Up to 2 seconds with feedback and wet/dry mix
- **Flanger**: Classic modulation effect with rate, depth, and feedback
- **Output Limiter**: Soft limiting to prevent clipping (tanh saturation @ -0.5dB)

### Advanced Features

#### Preset Manager
- Save, load, and delete effect presets to disk
- Presets stored in `~/Documents/FlarkDJ/Presets/` as `.fxp` files
- Quick access via dropdown menu
- Full parameter state capture and recall

#### XY Pad Control
- Interactive 2D control surface for real-time parameter manipulation
- Assignable X/Y axes to any effect parameters
- Visual feedback with orange indicator and crosshair guides
- Perfect for live performance and creative sound design

#### Effect Snapshots (A/B System)
- Capture and switch between two complete effect states
- Instant A/B comparison for quick effect evaluation
- Copy snapshot A to B for iterative sound design
- Full parameter state preservation

#### LFO Modulation
- Multiple waveforms: sine, square, triangle, sawtooth, random
- Adjustable rate and depth
- **BPM Sync**: Lock to DAW tempo with note divisions (1/4, 1/8, 1/16, etc.)
- Modulates filter cutoff with wide range (up to 3x variation)

### User Interface
- **Compact Design**: 950x900 default window (was 1400x1020)
- **Fully Resizable**: All controls scale proportionally (800-1400px width)
- **DJ-Style Knobs**: Orange theme with value labels
- **2x3 Grid Layout**: Filter, Reverb, Delay / Flanger, Isolator, LFO
- **Top Control Bar**: Preset manager and snapshot controls
- **Bottom Control**: XY pad with parameter assignment

## Distribution Formats

### Native Audio Plugins ⭐ Recommended

Professional-grade native C++ plugins built with JUCE framework:

- **VST3** (Windows, macOS, Linux) - Universal DAW support
- **LV2** (Linux) - Open-source plugin format
- **Standalone** - Run as desktop application on all platforms

**Platform Support:**
- ✅ **Windows**: VST3 + Standalone (.exe)
- ✅ **macOS**: VST3 + Standalone (.app)
- ✅ **Linux**: VST3 + LV2 + Standalone

**Automated Builds:**
Multi-platform builds are automatically created via GitHub Actions CI/CD pipeline. Download pre-built binaries from [Releases](https://github.com/flarkflarkflark/FlarkDJ/releases).

### TypeScript/JavaScript Package (Legacy)
- npm package for Node.js and web applications
- See TypeScript examples below for programmatic usage
- Platform: Cross-platform (Node.js, browsers)

## Installation

### Native Plugins (Recommended)

**Download Pre-Built Binaries:**
1. Go to [Releases](https://github.com/flarkflarkflark/FlarkDJ/releases)
2. Download the package for your platform
3. Follow platform-specific instructions below

#### Windows
1. Extract `FlarkDJ-Windows-x64.zip`
2. Copy `FlarkDJ.vst3` to `C:\Program Files\Common Files\VST3\`
3. Copy `FlarkDJ.exe` anywhere for standalone use
4. Rescan plugins in your DAW

#### macOS
1. Extract `FlarkDJ-macOS-Universal.zip`
2. Copy `FlarkDJ.vst3` to `~/Library/Audio/Plug-Ins/VST3/`
3. Copy `FlarkDJ.app` to `/Applications/` for standalone use
4. Rescan plugins in your DAW

#### Linux
1. Extract: `tar xzf FlarkDJ-Linux-x86_64.tar.gz`
2. Copy `FlarkDJ.vst3` to `~/.vst3/`
3. Copy `FlarkDJ.lv2` to `~/.lv2/`
4. Copy `FlarkDJ` to `~/bin/` or `/usr/local/bin/` for standalone use
5. Rescan plugins in your DAW

**Building from Source:**
See [`native/BUILD.md`](native/BUILD.md) for detailed build instructions.

### npm Package (Legacy)

```bash
npm install flark-dj
```

## Quick Start

### Using the Native Plugin

1. **Load in DAW**: Add FlarkDJ to an audio track in your DAW
2. **Choose Effects**: Enable desired effects with toggle buttons
3. **Adjust Parameters**: Use knobs to dial in your sound
4. **Save Preset**: Click "Save" to store your settings
5. **Use XY Pad**: Drag the orange dot to morph parameters in real-time
6. **A/B Compare**: Click "A" or "B" to switch between snapshots

### DAW Compatibility

FlarkDJ works in all major DAWs:
- Ableton Live, FL Studio, Bitwig Studio
- Logic Pro, GarageBand (macOS)
- Cubase, Nuendo
- Reaper, Studio One
- Pro Tools (VST3)
- Ardour, Mixbus (Linux)

### TypeScript/npm Usage (Legacy)

```typescript
import { FlarkDJ } from 'flark-dj';

// Initialize FlarkDJ
const flark = new FlarkDJ(44100);

// Add effects
const filter = flark.addFilterEffect('myFilter');
filter.setParameter('cutoff', 5000);
filter.setParameter('resonance', 2);

const reverb = flark.addReverbEffect('myReverb');
reverb.setParameter('roomSize', 0.7);
reverb.setParameter('wetDry', 0.3);

// Process audio
const input = new Float32Array(1024);
const output = flark.process(input);
```

## Usage Examples

### MIDI Learn

```typescript
// Start learning mode for a parameter
flark.midiLearn.startLearning('myFilter', 'cutoff');

// Move a MIDI controller - it will automatically map
// The mapping is now active!
```

### LFO Modulation

```typescript
// Create an LFO
const lfo = flark.lfo.createLFO('lfo1', 2, 'sine'); // 2 Hz sine wave

// Target a parameter
flark.lfo.setTarget('lfo1', 'myFilter', 'cutoff', 0.8);

// LFO will automatically modulate during processing
```

### Macro Controls

```typescript
// Create a macro
const macro = flark.macros.createMacro('master', 'Master Control');

// Add targets
flark.macros.addTarget('master', 'myFilter', 'cutoff', 100, 10000);
flark.macros.addTarget('master', 'myReverb', 'roomSize', 0, 1);

// Control everything with one knob
flark.macros.setMacroValue('master', 0.75);
```

### Effect Snapshots

```typescript
// Capture current state
const snapshot = flark.snapshots.captureSnapshot('Intro Sound');

// Make changes...
filter.setParameter('cutoff', 2000);

// Recall snapshot (crossfade over 2 seconds)
flark.snapshots.recallSnapshot(snapshot.id, 2);
```

### Presets

```typescript
// Create a preset
const effects = [{
  effectId: 'myFilter',
  effectType: 'filter',
  enabled: true,
  parameters: { cutoff: 5000, resonance: 2 }
}];

const preset = flark.presets.createPreset(
  'My Preset',
  'A custom filter preset',
  effects
);

// Load preset later
const loaded = flark.presets.loadPreset(preset.id);
```

### XY Pad

```typescript
// Create XY pad
const pad = flark.xyPad.createPad('pad1', 'myFilter', 'cutoff', 'resonance');

// Update position (0-1 range)
flark.xyPad.updatePadPosition('pad1', 0.5, 0.75);

// Morph between two effects
flark.xyPad.morphBetweenEffects('pad1', 'effect1', 'effect2', 0.3);
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Current test coverage targets:
- Overall: 80%+
- Core audio processing: 90%+
- Critical paths: 95%+

## Building

```bash
# Development build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint
```

## Creating Installers

```bash
# All platforms
./scripts/build-installer.sh

# Specific platform
./scripts/build-installer.sh mac
./scripts/build-installer.sh win
./scripts/build-installer.sh linux
```

## Architecture

### Native Plugin Architecture

```
FlarkDJ/
├── native/                     # C++ native plugin implementation
│   ├── FlarkDJProcessor.cpp/.h    # JUCE audio processor (DSP chain)
│   ├── FlarkDJEditor.cpp/.h       # JUCE GUI editor
│   ├── FlarkDJDSP.h               # DSP implementations:
│   │                              #   - FlarkButterworthFilter
│   │                              #   - FlarkReverb
│   │                              #   - FlarkDelay
│   │                              #   - FlarkFlanger
│   │                              #   - FlarkDJIsolator
│   │                              #   - FlarkLFO
│   ├── CMakeLists.txt             # CMake build configuration
│   ├── BUILD.md                   # Build instructions
│   └── build/                     # Build artifacts (VST3, LV2, etc.)
│
├── .github/
│   └── workflows/
│       ├── build-native.yml       # Multi-platform builds (Win/Mac/Linux)
│       └── ci.yml                 # TypeScript tests
│
├── src/                        # TypeScript/npm package (legacy)
│   ├── core/                   # Audio engine
│   ├── effects/                # Effect implementations
│   └── types/                  # TypeScript definitions
│
└── scripts/                    # Build and release scripts
```

### Effect Processing Chain

```
Audio Input
    ↓
Filter (Butterworth) → Resonant filtering with LFO modulation
    ↓
Reverb → Algorithmic reverb with room/damping control
    ↓
Delay → Stereo delay with feedback
    ↓
Flanger → Modulation effect
    ↓
DJ Isolator → Frequency band sweeping
    ↓
Output Limiter → Soft limiting (tanh saturation @ -0.5dB)
    ↓
Audio Output
```

## Automated Builds & CI/CD

FlarkDJ uses GitHub Actions to automatically build native plugins for all platforms:

### Build Pipeline
- **Triggers**: Push to main, pull requests, manual workflow dispatch
- **Platforms**: Windows (Visual Studio 2022), macOS 13, Ubuntu Latest
- **Artifacts**: Automatically uploaded with 30-day retention
- **Releases**: Draft releases auto-created on main branch merges

### Build Configuration
- **Windows**: VST3 + Standalone (.exe)
- **macOS**: VST3 + Standalone (.app) on macOS 13 runner
- **Linux**: VST3 + LV2 + Standalone binary

### JUCE Compatibility
- **Framework**: JUCE 7.0.9
- **macOS Runner**: Uses macOS 13 for JUCE 7.0.9 API compatibility
- **Optimization**: Link-Time Optimization (LTO) enabled for all builds

See [`.github/workflows/build-native.yml`](.github/workflows/build-native.yml) for full configuration.

## Development

### Building Locally

See [`native/BUILD.md`](native/BUILD.md) for complete build instructions.

**Quick build:**
```bash
cd native
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release --parallel
```

### Testing
```bash
# TypeScript tests
npm test
npm run test:coverage

# Native plugin testing
# Load in DAW or standalone app
```

## License

MIT

## Contributing

Contributions welcome! Please submit pull requests or open issues on GitHub.