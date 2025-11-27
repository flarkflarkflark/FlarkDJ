# FlarkDJ v1.1.0 - Installation Guide

## What's Included

This release package contains:
- **FlarkDJ.vst3** - VST3 plugin (all platforms)
- **FlarkDJ** - Standalone application (Linux)
- **RELEASE_NOTES.md** - Detailed changelog and features

## System Requirements

### Linux
- Ubuntu 20.04+ or equivalent
- x86_64 architecture
- ALSA or JACK audio
- VST3-compatible DAW (optional)

### Windows
- Windows 10 or later
- x86_64 architecture
- VST3-compatible DAW

### macOS
- macOS 10.13 or later
- Intel or Apple Silicon
- VST3/AU-compatible DAW

## Installation

### Linux VST3 Plugin

```bash
# Create VST3 directory if it doesn't exist
mkdir -p ~/.vst3

# Copy the plugin
cp -r FlarkDJ.vst3 ~/.vst3/

# Verify installation
ls ~/.vst3/FlarkDJ.vst3
```

### Linux Standalone

```bash
# Copy to system binaries
sudo cp FlarkDJ /usr/local/bin/

# Make executable (if needed)
sudo chmod +x /usr/local/bin/FlarkDJ

# Run from terminal
FlarkDJ
```

### Windows VST3 Plugin

1. Locate your VST3 folder:
   - Default: `C:\Program Files\Common Files\VST3\`
   - Or your DAW's custom VST3 folder

2. Copy `FlarkDJ.vst3` folder to the VST3 directory

3. Restart your DAW

4. Scan for new plugins (if needed)

### macOS VST3/AU Plugin

```bash
# VST3 installation
sudo cp -r FlarkDJ.vst3 /Library/Audio/Plug-Ins/VST3/

# AU installation (if built)
sudo cp -r FlarkDJ.component /Library/Audio/Plug-Ins/Components/

# Verify installation
ls /Library/Audio/Plug-Ins/VST3/FlarkDJ.vst3
```

## Quick Start

### Using in a DAW

1. Open your DAW (Reaper, Ableton, FL Studio, etc.)
2. Insert FlarkDJ on an audio track or bus
3. Enable desired effects (Filter, Reverb, Delay, Flanger, Isolator)
4. Adjust parameters to taste
5. Enable LFO BPM Sync for tempo-synchronized modulation

### Using Standalone

```bash
# Run the application
FlarkDJ

# The standalone version includes:
# - Audio device selection
# - MIDI input support
# - All plugin features
# - Settings persistence
```

## Key Features Quick Reference

### Effects Chain (Left to Right, Top to Bottom)

**Row 1:**
- **Filter** - 3-stage Butterworth (Lowpass/Highpass/Bandpass)
- **Reverb** - Room Size, Damping, Wet/Dry
- **Delay** - Time, Feedback, Wet/Dry

**Row 2:**
- **Flanger** - Rate, Depth, Feedback
- **Isolator** - DJ-style sweep filter
- **LFO** - Rate, Depth, Waveform, BPM Sync

### Pro Tips

1. **Resizable Interface** - Drag any corner to scale the plugin
2. **BPM Sync** - Enable in LFO section for tempo-locked effects
3. **Isolator** - Perfect for live frequency sweeps (left=bass, right=treble)
4. **Label Position** - Labels are on the left of knobs for clarity
5. **Effect Order** - Processed in display order (Filter → Reverb → Delay → Flanger → Isolator)

## Troubleshooting

### Plugin doesn't appear in DAW
- Ensure you copied to the correct VST3 directory
- Restart your DAW completely
- Run a plugin scan/rescan in your DAW settings
- Check DAW plugin blacklist (if applicable)

### No audio output
- Check that at least one effect is enabled
- Verify audio routing in your DAW
- Ensure the plugin is on an active audio track
- Check input/output levels

### Standalone won't start
- Verify audio device is connected
- Check file permissions: `chmod +x FlarkDJ`
- Run from terminal to see error messages
- Check ALSA/JACK configuration

### Interface scaling issues
- Minimum window size: 1200×870
- Maximum window size: 1800×1300
- Try restarting the DAW/standalone if scaling looks wrong
- Report unusual behavior on GitHub

## Performance

- **CPU Usage:** Low to moderate (depends on enabled effects)
- **Latency:** Minimal processing delay
- **Memory:** ~10-20MB RAM
- **Sample Rates:** Supports 44.1kHz to 192kHz

## Support

For issues, feature requests, or questions:
- GitHub Issues: https://github.com/flarkflarkflark/FlarkDJ/issues
- Read RELEASE_NOTES.md for detailed feature documentation

## License

FlarkDJ is licensed under the MIT License.
See the main repository for full license text.

---

**Version:** 1.1.0
**Build Date:** November 24, 2025
**Architecture:** x86_64
**Framework:** JUCE 7.0.9
