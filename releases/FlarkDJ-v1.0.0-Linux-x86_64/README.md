# FlarkDJ v1.0.0 - Linux x86_64 Release

**Professional DJ Toolkit Plugin**

---

## 📦 What's Included

This release package contains FlarkDJ in three formats:

- **FlarkDJ.vst3** - VST3 plugin (3.3 MB)
- **FlarkDJ.lv2** - LV2 plugin bundle (3.0 MB)
- **FlarkDJ** - Standalone application (3.9 MB)

---

## 🎨 Features

### Audio Effects
- **Biquad Filter**: Lowpass, Highpass, Bandpass with resonance control
- **Algorithmic Reverb**: 8 parallel delay lines with room size and damping
- **Stereo Delay**: Up to 2 seconds with feedback
- **LFO Modulation**: 4 waveforms modulating filter cutoff

### User Interface
- Professional orange-on-black design
- Large "FlarkDJ" title with glow effects
- Gradient backgrounds and modern styling
- 17 automatable parameters
- Section-based layout (Filter, Reverb, Delay, LFO, Master)

### Performance
- Zero latency (sample-by-sample processing)
- < 1% CPU usage @ 44.1kHz, 512 samples
- Optimized with LTO and -O3 flags

---

## 🚀 Installation

### VST3 Plugin

**User Installation** (recommended):
```bash
mkdir -p ~/.vst3
cp -r FlarkDJ.vst3 ~/.vst3/
```

**System Installation**:
```bash
sudo mkdir -p /usr/lib/vst3
sudo cp -r FlarkDJ.vst3 /usr/lib/vst3/
```

**Rescan plugins in your DAW**:
- Reaper: Options → Preferences → Plug-ins → VST → Re-scan
- Bitwig: Settings → Locations → VST3 → Rescan
- Ardour: Window → Plugin Manager → Rescan

### LV2 Plugin

**User Installation** (recommended):
```bash
mkdir -p ~/.lv2
cp -r FlarkDJ.lv2 ~/.lv2/
```

**System Installation**:
```bash
sudo mkdir -p /usr/lib/lv2
sudo cp -r FlarkDJ.lv2 /usr/lib/lv2/
```

**Compatible DAWs**:
- Ardour
- Carla
- Qtractor
- Harrison Mixbus
- Tracktion Waveform

### Standalone Application

**Run directly**:
```bash
chmod +x FlarkDJ
./FlarkDJ
```

**Install to system PATH**:
```bash
sudo cp FlarkDJ /usr/local/bin/flarkdj
chmod +x /usr/local/bin/flarkdj
flarkdj  # Run from anywhere
```

---

## 🎛️ Parameters

### Filter Section
- **Enabled**: Toggle filter on/off
- **Cutoff**: 20 Hz - 20 kHz
- **Resonance**: 0.1 - 10.0
- **Type**: Lowpass, Highpass, Bandpass

### Reverb Section
- **Enabled**: Toggle reverb on/off
- **Room Size**: 0.0 - 1.0
- **Damping**: 0.0 - 1.0
- **Wet/Dry**: 0.0 - 1.0

### Delay Section
- **Enabled**: Toggle delay on/off
- **Time**: 0.0 - 2.0 seconds
- **Feedback**: 0.0 - 0.95
- **Wet/Dry**: 0.0 - 1.0

### LFO Section
- **Rate**: 0.1 - 20 Hz
- **Depth**: 0.0 - 1.0 (modulation amount)
- **Waveform**: Sine, Square, Triangle, Sawtooth

### Master Section
- **Mix**: 0.0 - 1.0 (wet/dry blend)
- **Bypass**: Global bypass switch

---

## 💡 Quick Start

### In a DAW

1. **Install the plugin** using instructions above
2. **Rescan plugins** in your DAW
3. **Create an audio track**
4. **Add "FlarkDJ"** to the track's plugin chain
5. **Adjust parameters** to shape your sound!

### Standalone

1. **Run**: `./FlarkDJ`
2. **Configure audio**: Settings → Audio Device
3. **Select inputs/outputs**: Choose your audio interface
4. **Adjust buffer size**: 256-512 samples recommended
5. **Process audio**: Adjust effects in real-time

---

## 🔧 Technical Specifications

**Plugin Details**:
- **Format**: VST3, LV2, Standalone
- **Architecture**: x86_64 (64-bit)
- **Platform**: Linux (Ubuntu 24.04, kernel 4.4+)
- **Channels**: Stereo (2 in / 2 out)
- **Sample Rate**: Any (tested up to 192 kHz)
- **Bit Depth**: 32-bit float processing

**Build Info**:
- **Compiler**: GCC 13.3.0
- **JUCE Version**: 7.0.9
- **C++ Standard**: C++17
- **Optimization**: -O3 with LTO

**Dependencies**:
- ALSA (`libasound2`)
- X11 (`libX11`, `libXrandr`)
- FreeType (`libfreetype6`)
- OpenGL (`libGL`)

---

## 🎵 Compatible DAWs

### VST3 Support
- ✅ Reaper
- ✅ Bitwig Studio
- ✅ Ardour
- ✅ Renoise
- ✅ Tracktion Waveform
- ✅ LMMS
- ✅ Mixbus

### LV2 Support
- ✅ Ardour
- ✅ Carla
- ✅ Qtractor
- ✅ Harrison Mixbus
- ✅ Non Mixer
- ✅ Jalv

---

## 📝 License

MIT License - Free and open-source

---

## 🐛 Bug Reports

If you encounter any issues:
- **GitHub Issues**: https://github.com/flarkflarkflark/FlarkDJ/issues
- **Email**: support@flarkdj.com

---

## 🔗 Links

- **Homepage**: https://github.com/flarkflarkflark/FlarkDJ
- **Documentation**: See BUILD.md and PLUGIN_DEVELOPMENT.md
- **Source Code**: https://github.com/flarkflarkflark/FlarkDJ

---

**Built with ❤️ using JUCE Framework**
**FlarkDJ Team © 2025**
