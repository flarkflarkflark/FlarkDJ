# FlarkDJ v1.1.0 Release Notes

**Release Date:** November 24, 2025
**Version:** 1.1.0
**Type:** Feature Release

## Overview

FlarkDJ v1.1.0 is a major feature release that adds professional DJ effects inspired by Airwindows audio processing, BPM synchronization, and a completely redesigned, fully scalable interface.

## New Features

### 🎛️ Airwindows-Inspired Effects

#### Butterworth Filter
- 3-stage cascaded biquad filter design
- ~18 dB/octave rolloff (vs 6 dB/octave in previous versions)
- Significantly more audible LFO modulation
- Professional-grade frequency shaping

#### DJ Isolator
- Single-slider sweep control
- Left position: Lowpass filter
- Center position: Full-range (bypass)
- Right position: Highpass filter
- Adjustable Q/Bandwidth control
- Logarithmic frequency mapping (100Hz - 10kHz)

### 🎵 BPM Sync System

- Reads host DAW tempo via AudioPlayHead API
- Musical note division options:
  - 1/4 note
  - 1/8 note
  - 1/16 note
  - 1/32 note
  - 1/2 note
  - 1 Bar
- Automatic conversion from BPM to Hz
- Falls back to manual Hz control when sync disabled

### 🖥️ Interface Improvements

#### Scalable Design
- **All controls scale proportionally** when resizing the plugin window
- Maintains usability and aesthetics at any size
- Window size range: 1200x870 to 1800x1300

#### Layout Reorganization
- Changed from cramped 1×6 horizontal layout to spacious 2×3 grid
- Row 1: Filter, Reverb, Delay
- Row 2: Flanger, Isolator, LFO
- Removed redundant Master section

#### Enhanced Control Design
- **2x larger knobs** for easier adjustment and precision
- **Labels moved to left side** of controls for better readability
- **66% smaller buttons** for cleaner visual appearance
- **13pt bold font** for control labels (Room Size, Damping, Wet/Dry, etc.)
- Values displayed on right side of rotary knobs
- Professional DJ-style rotary knob design

## Technical Details

### DSP Improvements
- Replaced basic filter with cascaded Butterworth implementation
- Added dual Butterworth filters for Isolator with crossfading
- Optimized coefficient calculation using bilinear transform

### Architecture
- JUCE Framework 7.0.9
- VST3, LV2, Standalone, AU, CLAP formats supported
- C++17 standard
- MIT-licensed Airwindows algorithms

### Parameters Added
- `isolatorEnabled` - Enable/disable Isolator effect
- `isolatorPosition` - Sweep position (-1.0 to +1.0)
- `isolatorQ` - Bandwidth control (0.5 to 10.0)
- `lfoSync` - Enable BPM synchronization
- `lfoSyncRate` - Musical note division selection

### Parameters Removed
- `masterBypass` - Redundant bypass control
- `masterMix` - Redundant mix control

## Installation

### Linux

**VST3:**
```bash
mkdir -p ~/.vst3
cp -r FlarkDJ.vst3 ~/.vst3/
```

**Standalone:**
```bash
sudo cp FlarkDJ /usr/local/bin/
```

### Usage Notes
- The interface is fully resizable - drag any corner to scale
- Enable BPM Sync in the LFO section to lock to DAW tempo
- Use the Isolator for quick frequency sweeps during live performances
- All effects can be enabled/disabled independently

## Upgrade Notes

### From v1.0.0
- All existing parameters are preserved
- New parameters default to sensible values:
  - Isolator: Disabled, center position
  - LFO Sync: Disabled, 1/4 note division
- No preset compatibility issues
- Interface dimensions have changed - may need window resize

## Known Issues
- None at this time

## Credits
- Airwindows DSP algorithms by Chris Johnson (MIT License)
- JUCE Framework by ROLI Ltd.
- FlarkDJ Team

## What's Next?

Potential features for future releases:
- Spectrum analyzer visualization
- XY pad for parameter control
- Additional effect modules
- Preset management system
- MIDI learn functionality

---

**Full Changelog:** v1.0.0...v1.1.0

For support and bug reports, please visit:
https://github.com/flarkflarkflark/FlarkDJ/issues
