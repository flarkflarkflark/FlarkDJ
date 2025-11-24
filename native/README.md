# FlarkDJ Native Plugins

Native C++ audio plugin implementation of FlarkDJ using the JUCE framework.

## Overview

This directory contains the native plugin implementation that allows FlarkDJ to run as:
- **VST3** plugin (all platforms)
- **Audio Unit** (macOS)
- **Standalone** application

The native plugins provide the same audio processing as the TypeScript version, but compiled to highly optimized native code for use in professional DAWs.

## Features

All FlarkDJ features are implemented in C++:

### Effects
- **Biquad Filter**: Lowpass, Highpass, Bandpass with resonance control
- **Reverb**: Algorithmic reverb with room size and damping
- **Delay**: Stereo delay with feedback and wet/dry mix

### Modulation
- **LFO**: 4 waveforms (Sine, Square, Triangle, Sawtooth)
- **Filter Modulation**: LFO modulates filter cutoff frequency

### Parameters (17 total)
- Filter: Enabled, Cutoff, Resonance, Type
- Reverb: Enabled, Room Size, Damping, Wet/Dry
- Delay: Enabled, Time, Feedback, Wet/Dry
- LFO: Rate, Depth, Waveform
- Master: Mix, Bypass

## Quick Start

### Requirements

- CMake 3.22+
- C++17 compiler
- Platform-specific dependencies (see BUILD.md)

### Build

```bash
cd native
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release
```

**See [BUILD.md](BUILD.md) for detailed build instructions.**

## Architecture

### File Structure

```
native/
├── FlarkDJProcessor.h/cpp    # Main audio processor
├── FlarkDJEditor.h/cpp        # Plugin GUI
├── FlarkDJDSP.h               # DSP effect implementations
├── CMakeLists.txt             # CMake build configuration
├── FlarkDJ.jucer              # Projucer project file
├── BUILD.md                   # Build instructions
└── README.md                  # This file
```

### Audio Processing Pipeline

```
Input → Filter → Reverb → Delay → Output
          ↑
          └── LFO Modulation
```

The audio processing is sample-by-sample with:
1. **Parameter updates** from UI
2. **LFO processing** generates modulation signal
3. **Filter processing** with LFO-modulated cutoff
4. **Reverb processing** (if enabled)
5. **Delay processing** (if enabled)
6. **Master mix** and bypass handling

### DSP Implementation

All effects are implemented in `FlarkDJDSP.h`:

- **`FlarkFilter`**: Biquad IIR filter with adjustable coefficients
- **`FlarkReverb`**: 8 parallel delay lines with damping
- **`FlarkDelay`**: Circular buffer with linear interpolation
- **`FlarkLFO`**: Phase-based oscillator with multiple waveforms

## Usage in DAWs

### Installation

After building, copy the plugins to:

**macOS**:
- VST3: `~/Library/Audio/Plug-Ins/VST3/`
- AU: `~/Library/Audio/Plug-Ins/Components/`

**Windows**:
- VST3: `C:\Program Files\Common Files\VST3\`

**Linux**:
- VST3: `~/.vst3/`

### Loading in DAW

1. Rescan plugins in your DAW
2. Create an audio or instrument track
3. Add "FlarkDJ" to the track's plugin chain
4. Adjust parameters to shape your sound

### Compatible DAWs

- Ableton Live
- Logic Pro
- FL Studio
- Cubase
- Reaper
- Pro Tools (VST3)
- Studio One
- Bitwig Studio
- And many more...

## Performance

The native C++ implementation offers:

- **Low latency**: Optimized for real-time audio processing
- **Low CPU usage**: Efficient algorithms with minimal overhead
- **No garbage collection**: Deterministic performance
- **SIMD optimizations**: Modern CPU instruction sets (in Release builds)

Typical CPU usage: < 1% on modern systems (44.1kHz, 512 samples buffer)

## Development

### Adding New Effects

1. **Add DSP class** to `FlarkDJDSP.h`:
   ```cpp
   class FlarkNewEffect {
   public:
       float process(float input);
       void setParameter(float value);
   };
   ```

2. **Add parameters** in `FlarkDJProcessor` constructor:
   ```cpp
   std::make_unique<juce::AudioParameterFloat>("newParam", "New Parameter", 0.0f, 1.0f, 0.5f)
   ```

3. **Add UI controls** in `FlarkDJEditor`:
   ```cpp
   addAndMakeVisible(newSlider);
   newAttachment.reset(new SliderAttachment(params, "newParam", newSlider));
   ```

4. **Process audio** in `FlarkDJProcessor::processAudio()`:
   ```cpp
   leftSample = newEffect.process(leftSample);
   ```

### Debugging

Enable debug logging in `FlarkDJProcessor.cpp`:
```cpp
DBG("Processing audio: " << numSamples << " samples");
DBG("Filter cutoff: " << filterCutoff->load());
```

View logs in your DAW's console or system log.

## Comparison with TypeScript Version

| Feature | TypeScript | Native C++ |
|---------|-----------|------------|
| Platform | Web, Node.js | VST3, AU, Standalone |
| Performance | Good | Excellent |
| Latency | Medium | Very Low |
| Memory | Managed | Manual |
| Development | Fast | Moderate |
| Distribution | npm package | Binary plugins |
| Use Case | Web apps, prototyping | Professional DAWs |

Both implementations share the same algorithm logic, ported directly from TypeScript to C++.

## Testing

### Manual Testing

1. Build the Standalone app
2. Run it and test audio processing:
   ```bash
   ./FlarkDJ_artefacts/Release/Standalone/FlarkDJ
   ```

3. Load test audio files
4. Adjust parameters and listen for artifacts
5. Monitor CPU usage

### Plugin Validation

Use plugin validators:
- **macOS**: `auval -v aufx FLDj Flrk` (for AU)
- **Windows/Linux**: Use DAW's plugin validator

### Stress Testing

Test with:
- High sample rates (96kHz, 192kHz)
- Small buffer sizes (64, 128 samples)
- Rapid parameter changes
- Multiple instances in DAW

## Known Issues

- GUI is basic functional design (can be enhanced)
- No preset browser yet (planned)
- No MIDI learn in native version (planned)
- Reverb algorithm is simple (could be improved)

## Roadmap

- [ ] Enhanced GUI with custom graphics
- [ ] Preset management and browser
- [ ] MIDI learn functionality
- [ ] Sidechain input support
- [ ] Additional effect types
- [ ] AAX format support (Pro Tools native)
- [ ] CLAP format support

## Contributing

Contributions welcome! Areas that need work:
- GUI design and graphics
- Additional DSP algorithms
- Optimization improvements
- Cross-platform testing
- Documentation

## License

MIT License - see `../LICENSE`

## Support

- Issues: https://github.com/flarkflarkflark/FlarkDJ/issues
- Documentation: See `BUILD.md` and `../PLUGIN_DEVELOPMENT.md`
- JUCE Forum: https://forum.juce.com/

## Credits

Built with:
- **JUCE Framework**: https://juce.com/
- **CMake**: https://cmake.org/
- DSP algorithms ported from the FlarkDJ TypeScript implementation

---

**Ready to build?** See [BUILD.md](BUILD.md) for detailed instructions.
