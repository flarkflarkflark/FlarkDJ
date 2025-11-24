# FlarkDJ

A comprehensive DJ toolkit plugin with advanced effects, modulation, and control features.

## Features

### Core Audio Processing
- **Effect Chaining**: Run multiple effects in series with customizable order
- **Built-in Effects**:
  - Filter (lowpass/highpass/bandpass with resonance control)
  - Reverb (algorithmic reverb with room size and damping)
  - Delay (up to 2 seconds with feedback control)
- **High-Quality Processing**: 44.1kHz+ sample rate support

### Advanced Features

#### MIDI Learn
- Map any MIDI CC to effect parameters
- Support for multiple MIDI channels
- Visual feedback during learning mode
- Save and load MIDI mappings

#### LFO Modulation System
- Multiple waveforms: sine, square, triangle, sawtooth
- Adjustable rate and depth
- Target any effect parameter
- Multiple simultaneous LFOs

#### Macro Controls
- Create custom macro knobs
- Control multiple parameters simultaneously
- Three curve types: linear, exponential, logarithmic
- Perfect for live performance

#### Effect Snapshots/Scenes
- Save complete effect states
- Instant recall or smooth crossfade between scenes
- Export/import snapshots
- Timestamped scene history

### Optional Enhancements

#### XY Pad
- Morph between effects in real-time
- Map X and Y axes to any parameters
- Smooth interpolation
- Multiple simultaneous pads

#### Spectrum Analyzer
- Real-time frequency analysis
- FFT-based visualization
- Peak frequency detection
- RMS level metering

#### Preset System
- Save and load complete effect chains
- Search presets by name or description
- Export/import preset files
- Organized preset library

#### Sidechain Input
- Sidechain filter/gate effects
- Adjustable threshold and ratio
- Attack and release controls
- Perfect for ducking effects

#### CI/CD Pipeline
- Automated testing with GitHub Actions
- Multi-platform builds (Node 18.x, 20.x)
- Code coverage reporting
- Automatic deployment

#### Installer Packages
- Cross-platform installers
- macOS: DMG and ZIP
- Windows: NSIS and portable
- Linux: AppImage, DEB, and RPM

## Installation

```bash
npm install flark-dj
```

## Quick Start

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

```
FlarkDJ/
├── src/
│   ├── core/           # Audio engine
│   ├── effects/        # Effect implementations
│   ├── modulation/     # LFO, XY pad, macros
│   ├── midi/           # MIDI learn system
│   ├── presets/        # Preset management
│   ├── snapshots/      # Scene management
│   ├── analysis/       # Spectrum analyzer
│   └── types/          # TypeScript definitions
├── .github/
│   └── workflows/      # CI/CD configuration
└── scripts/            # Build scripts
```

## License

MIT

## Contributing

Contributions welcome! Please submit pull requests or open issues on GitHub.