# FlarkDJ Plugin Development Guide

Complete guide for creating native audio plugins from FlarkDJ.

## Overview

FlarkDJ provides TypeScript/JavaScript wrappers for all major plugin formats:

- **VST3** - Cross-platform (Steinberg)
- **Audio Unit (AU)** - macOS (Apple)
- **AAX** - Pro Tools (Avid)
- **LV2** - Open-source Linux
- **CLAP** - Modern open-source
- **Standalone** - Independent application

## Quick Start

### Build Plugin Wrappers

```bash
# Build TypeScript and create plugin packages
npm run build
bash scripts/build-plugins.sh
```

Output: `./plugins/` directory with all plugin formats

## Plugin Frameworks

### Option 1: JUCE (Recommended)

**Best for:** All formats, professional projects

```bash
# 1. Download JUCE from https://juce.com/

# 2. Create new Audio Plug-In project in Projucer

# 3. Configure plugin formats:
#    - VST3: ✓
#    - AU: ✓ (macOS only)
#    - AAX: ✓ (requires AAX SDK)
#    - Standalone: ✓

# 4. Copy FlarkDJ source to project:
cp -r src/ YourJUCEProject/Source/FlarkDJ/
cp -r dist/ YourJUCEProject/Source/FlarkDJ/dist/

# 5. Integrate PluginProcessor with FlarkDJ wrapper
#    See examples/juce-integration/ for sample code

# 6. Build in Projucer or with CMake
```

**Pros:**
- Industry standard
- Excellent documentation
- All plugin formats
- Visual interface builder
- Active community

**Cons:**
- GPL license (or paid commercial license)
- Large framework

### Option 2: iPlug2

**Best for:** Simpler projects, learning

```bash
# 1. Clone iPlug2
git clone --recursive https://github.com/iPlug2/iPlug2

# 2. Duplicate example project
cd iPlug2/Examples
cp -r IPlugEffect MyFlarkDJPlugin

# 3. Integrate FlarkDJ wrapper
# See examples/iplug2-integration/

# 4. Build with Visual Studio/Xcode
```

**Pros:**
- MIT license
- Simpler than JUCE
- Good documentation

**Cons:**
- No CLAP/LV2 support yet
- Smaller community

### Option 3: DPF (DISTRHO Plugin Framework)

**Best for:** LV2, CLAP, open-source projects

```bash
# 1. Clone DPF
git clone https://github.com/DISTRHO/DPF

# 2. Create plugin based on examples
cd DPF/examples

# 3. Integrate FlarkDJ
# See examples/dpf-integration/

# 4. Build
make
```

**Pros:**
- ISC license (very permissive)
- LV2 and CLAP support
- Lightweight

**Cons:**
- No AAX support
- Less documentation

### Option 4: CLAP Wrapper

**Best for:** CLAP-only plugins

```bash
# Use free-audio/clap-wrapper
git clone https://github.com/free-audio/clap-wrapper

# Follow clap-wrapper integration guide
```

## Platform-Specific Instructions

### macOS

#### Audio Unit (AU)

```bash
# 1. Use JUCE or iPlug2

# 2. Build AU target

# 3. Sign the plugin
codesign --force --sign "Developer ID" YourPlugin.component

# 4. Install
cp -r YourPlugin.component ~/Library/Audio/Plug-Ins/Components/

# 5. Validate
auval -v aufx FLDj Flrk
```

#### macOS Universal Binary

```bash
# Build for both Intel and Apple Silicon
cmake -DCMAKE_OSX_ARCHITECTURES="x86_64;arm64" ..
make
```

### Windows

#### VST3

```bash
# 1. Install Visual Studio 2019/2022

# 2. Build with CMake
cmake -G "Visual Studio 17 2022" -A x64 ..
cmake --build . --config Release

# 3. Install
copy YourPlugin.vst3 "C:\Program Files\Common Files\VST3\"
```

#### AAX (Pro Tools)

```bash
# 1. Get AAX SDK from Avid (requires NDA)

# 2. Install PACE iLok SDK

# 3. Configure JUCE with AAX paths

# 4. Build and sign with PACE wraptool
wraptool sign --account YourAccount --wcguid ... --in YourPlugin.aaxplugin --out YourPlugin_signed.aaxplugin
```

### Linux

#### LV2

```bash
# 1. Install dependencies
sudo apt-get install lv2-dev build-essential

# 2. Use DPF or build with LV2 SDK

# 3. Build
make

# 4. Install
make install
# Or manually:
cp -r YourPlugin.lv2 ~/.lv2/
```

#### System-wide installation

```bash
sudo cp -r YourPlugin.lv2 /usr/lib/lv2/
```

## Integration Example

### JUCE PluginProcessor

```cpp
#include "PluginProcessor.h"
#include "FlarkDJ/dist/plugin/PluginWrapper.h"

FlarkDJProcessor::FlarkDJProcessor()
{
    // Initialize FlarkDJ wrapper
    flarkWrapper = new FlarkDJ::PluginWrapper(44100);
}

void FlarkDJProcessor::processBlock(AudioBuffer<float>& buffer)
{
    auto* leftChannel = buffer.getWritePointer(0);
    auto* rightChannel = buffer.getWritePointer(1);

    // Process with FlarkDJ
    flarkWrapper->processAudio(
        leftChannel,
        rightChannel,
        leftChannel,
        rightChannel
    );
}
```

## Parameters

### Exposing Parameters to DAW

```cpp
// JUCE example
AudioProcessorValueTreeState::ParameterLayout createParameterLayout()
{
    std::vector<std::unique_ptr<RangedAudioParameter>> params;

    // Get parameters from FlarkDJ
    auto flarkParams = flarkWrapper->getParameters();

    for (auto& param : flarkParams) {
        params.push_back(std::make_unique<AudioParameterFloat>(
            param.name,
            param.name,
            param.min,
            param.max,
            param.default
        ));
    }

    return { params.begin(), params.end() };
}
```

## State Management

### Save/Load State

```cpp
void getStateInformation(MemoryBlock& destData) override
{
    auto state = flarkWrapper->saveState();
    destData.append(state.data(), state.size());
}

void setStateInformation(const void* data, int sizeInBytes) override
{
    flarkWrapper->loadState(std::string((char*)data, sizeInBytes));
}
```

## Testing Plugins

### Plugin Validation

```bash
# Audio Unit (macOS)
auval -v aufx FLDj Flrk

# VST3 (with Steinberg VST3 SDK)
validator YourPlugin.vst3

# LV2
lv2lint http://flarkdj.com/plugins/flarkdj

# CLAP
clap-validator YourPlugin.clap
```

### DAW Testing

Test in multiple DAWs:
- **Ableton Live** (VST3, AU)
- **Logic Pro** (AU only, macOS)
- **Pro Tools** (AAX only)
- **Reaper** (VST3, AU, LV2, CLAP)
- **Bitwig Studio** (VST3, CLAP)
- **FL Studio** (VST3)

## Distribution

### Code Signing

#### macOS
```bash
codesign --force --sign "Developer ID Application: Your Name" --timestamp YourPlugin.component
```

#### Windows
```bash
signtool sign /f certificate.pfx /p password /t http://timestamp.server.com YourPlugin.vst3
```

### Installer Creation

#### macOS
```bash
pkgbuild --root ./plugins --identifier com.flarkdj.installer --version 1.0.0 FlarkDJ.pkg
```

#### Windows
Use Inno Setup or NSIS:
```iss
[Setup]
AppName=FlarkDJ
AppVersion=1.0.0
DefaultDirName={commoncf}\VST3
```

#### Linux
```bash
# Create .deb package
dpkg-deb --build flarkdj_1.0.0_amd64

# Create .rpm package
rpmbuild -bb flarkdj.spec
```

## Licensing

- **GPL**: Can use JUCE free tier, DPF
- **Commercial**: Need JUCE commercial license for proprietary plugins
- **AAX**: Requires Avid Developer Agreement

## Resources

### Official SDKs
- VST3 SDK: https://steinbergmedia.github.io/vst3_dev_portal/
- AU SDK: Built into macOS
- AAX SDK: https://my.avid.com/products/pro-tools-sdk
- LV2 SDK: https://lv2plug.in/
- CLAP: https://github.com/free-audio/clap

### Frameworks
- JUCE: https://juce.com/
- iPlug2: https://github.com/iPlug2/iPlug2
- DPF: https://github.com/DISTRHO/DPF

### Communities
- JUCE Forum: https://forum.juce.com/
- KVR Audio: https://www.kvraudio.com/forum/
- Audio Plugin Developers: Various Discord servers

## Troubleshooting

### Plugin Not Loading
1. Check file permissions
2. Validate with format-specific validator
3. Check code signing
4. Review DAW error logs

### Audio Issues
1. Verify buffer sizes match
2. Check sample rate conversion
3. Test with different buffer sizes
4. Monitor CPU usage

### Parameter Automation
1. Ensure parameters are flagged as automatable
2. Test parameter changes while playing
3. Verify parameter smoothing

## Next Steps

1. Choose your plugin framework
2. Follow integration guide above
3. Build for your target platform
4. Test in multiple DAWs
5. Package and distribute

For questions: https://github.com/flarkflarkflark/FlarkDJ/issues
