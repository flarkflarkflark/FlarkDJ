# FlarkDJ v1.1.0 - Multi-Platform Release

Released: November 27, 2024

## 🎉 What's New

### Multi-Platform Support
- **Windows**: VST3 + Standalone (.exe)
- **macOS**: VST3 + Standalone (.app)
- **Linux**: VST3 + LV2 + Standalone

### Major Features Added

#### Preset Management System
- Save, load, and delete effect presets
- Presets stored as `.fxp` files in `~/Documents/FlarkDJ/Presets/`
- Quick access dropdown menu
- Full parameter state preservation

#### XY Pad Control Surface
- Interactive 2D parameter control
- Assignable X/Y axes to any effect parameters
- Visual feedback with orange indicator and crosshair guides
- Real-time parameter morphing

#### A/B Snapshot System
- Capture two complete effect states
- Instant switching between snapshots
- Copy A to B functionality
- Perfect for A/B comparison and live performance

#### Output Limiter
- Prevents clipping and DAW channel muting
- Soft limiting using tanh() saturation
- Threshold at -0.5dB (~0.95 amplitude)
- Maintains audio character while staying safe

### User Interface Improvements
- **32% Smaller Window**: 1400x1020 → 950x900 default size
- **50% Smaller Knobs**: Large knobs 120px → 60px, medium 100px → 50px
- **Fully Resizable**: All controls scale proportionally (800-1400px width)
- **Better Layout**: Effect labels repositioned, top control bar added
- **DJ-Style Design**: Orange theme with clear value indicators

### Audio Enhancements
- **BPM Sync for LFO**: Lock to DAW tempo with note divisions (1/4, 1/8, 1/16, etc.)
- **Improved Modulation**: LFO modulates filter cutoff up to 3x variation
- **Better Stability**: Fixed various UI and parameter handling bugs

## Installation

### Windows
1. Extract `FlarkDJ-Windows-x64.zip`
2. Copy `FlarkDJ.vst3` to `C:\Program Files\Common Files\VST3\`
3. Copy `FlarkDJ.exe` anywhere for standalone use
4. Rescan plugins in your DAW

### macOS
1. Extract `FlarkDJ-macOS-Universal.zip`
2. Copy `FlarkDJ.vst3` to `~/Library/Audio/Plug-Ins/VST3/`
3. Copy `FlarkDJ.app` to `/Applications/` for standalone use
4. Rescan plugins in your DAW

### Linux
1. Extract: `tar xzf FlarkDJ-Linux-x86_64.tar.gz`
2. Copy `FlarkDJ.vst3` to `~/.vst3/`
3. Copy `FlarkDJ.lv2` to `~/.lv2/`
4. Copy `FlarkDJ` to `~/bin/` or `/usr/local/bin/` for standalone use
5. Rescan plugins in your DAW

## DAW Compatibility

FlarkDJ works in all major DAWs:
- Ableton Live, FL Studio, Bitwig Studio
- Logic Pro, GarageBand (macOS)
- Cubase, Nuendo
- Reaper, Studio One
- Pro Tools (VST3)
- Ardour, Mixbus (Linux)

## Technical Details

### Build System
- **Automated CI/CD**: GitHub Actions builds for all platforms
- **JUCE Framework**: 7.0.9
- **Optimization**: Link-Time Optimization (LTO) enabled
- **macOS Compatibility**: Uses macOS 13 runner for JUCE compatibility

### Plugin Formats
- **VST3**: Universal format, works on all platforms
- **LV2**: Linux-native open-source format
- **Standalone**: Desktop application for all platforms

## Known Issues

- **AU Format**: Temporarily disabled on macOS (VST3 works in all DAWs)
- **Preset Dialog**: First time may not show text cursor immediately (click in text field)

## Breaking Changes

None - all changes are additive and backward compatible.

## Full Changelog

### New Features
- Multi-platform builds (Windows, macOS, Linux)
- Preset manager with save/load/delete
- XY pad for 2D parameter control
- A/B snapshot system
- Output limiter (soft clipping prevention)
- BPM sync for LFO

### Improvements
- Compact UI (32% smaller window)
- Smaller knobs (50% reduction)
- Fully scalable interface (800-1400px)
- Better effect label positioning
- Top control bar for presets and snapshots
- Improved preset save dialog with text input

### Bug Fixes
- Fixed effect labels being covered by UI elements
- Fixed preset save dialog not accepting text input
- Added validation for empty/invalid preset names
- Improved error messages for preset operations

### Technical
- Added GitHub Actions CI/CD pipeline
- Platform-specific plugin format selection
- Fixed JUCE 7.0.9 compatibility on macOS 15
- Removed webkit dependency
- Disabled COPY_PLUGIN_AFTER_BUILD for CI compatibility

## Credits

Built with [JUCE Framework](https://juce.com/) 7.0.9

## License

MIT License - see LICENSE file for details
