# Building FlarkDJ Native Plugins

This guide covers building the native C++ audio plugins from source.

## Overview

FlarkDJ can be compiled as native audio plugins using the JUCE framework. The build system supports:

- **VST3** (Steinberg Virtual Studio Technology 3)
- **AU** (Apple Audio Units - macOS only)
- **Standalone** (Independent desktop application)

## Prerequisites

### All Platforms

- **CMake** 3.22 or later
- **C++17 compatible compiler**
- **Git** (for downloading JUCE)

### macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install CMake
brew install cmake
```

Required for AU plugins:
- Xcode with Audio Unit SDK (included)

### Windows

- **Visual Studio 2022** or later with C++ development tools
- **CMake** (download from cmake.org or use `winget install Kitware.CMake`)

### Linux

Install development dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install \
    cmake \
    build-essential \
    pkg-config \
    libasound2-dev \
    libfreetype6-dev \
    libx11-dev \
    libxcomposite-dev \
    libxcursor-dev \
    libxext-dev \
    libxinerama-dev \
    libxrandr-dev \
    libxrender-dev \
    libgl1-mesa-dev \
    libglu1-mesa-dev

# Fedora/RHEL
sudo dnf install \
    cmake \
    gcc-c++ \
    alsa-lib-devel \
    freetype-devel \
    libX11-devel \
    libXcomposite-devel \
    libXcursor-devel \
    libXext-devel \
    libXinerama-devel \
    libXrandr-devel \
    libXrender-devel \
    mesa-libGL-devel \
    mesa-libGLU-devel
```

## Building with CMake

### Basic Build

```bash
cd native
mkdir build
cd build

# Configure
cmake .. -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build . --config Release

# Optional: Install to system
sudo cmake --install .
```

### Build Types

**Debug Build** (for development):
```bash
cmake .. -DCMAKE_BUILD_TYPE=Debug
cmake --build . --config Debug
```

**Release Build** (for distribution):
```bash
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release
```

### Platform-Specific Notes

#### macOS

The build will create:
- `FlarkDJ.vst3` - VST3 plugin
- `FlarkDJ.component` - Audio Unit plugin
- `FlarkDJ.app` - Standalone application

Install locations (if using `cmake --install`):
- VST3: `~/Library/Audio/Plug-Ins/VST3/`
- AU: `~/Library/Audio/Plug-Ins/Components/`

**Code Signing** (required for distribution):
```bash
# Edit CMakeLists.txt and uncomment the code signing section
# Set your Team ID:
cmake .. -DCMAKE_BUILD_TYPE=Release \
    -DCODE_SIGN_IDENTITY="Developer ID Application" \
    -DDEVELOPMENT_TEAM="YOUR_TEAM_ID"
```

#### Windows

The build will create:
- `FlarkDJ.vst3` - VST3 plugin
- `FlarkDJ.exe` - Standalone application

Install locations:
- VST3: `C:\Program Files\Common Files\VST3\`

**Using Visual Studio**:
```powershell
cd native
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022"
cmake --build . --config Release
```

#### Linux

The build will create:
- `FlarkDJ.vst3` - VST3 plugin
- `FlarkDJ` - Standalone application

Install locations (if using `sudo cmake --install`):
- VST3: `~/.vst3/`
- Standalone: `/usr/local/bin/`

## Building with Projucer

Projucer is JUCE's project management tool that can generate native IDE projects.

### Setup

1. Download JUCE from https://juce.com/
2. Extract to a location like `~/JUCE` or `C:\JUCE`
3. Open Projucer (in `JUCE/Projucer.app` or `JUCE\Projucer.exe`)

### Generate Project

1. Open `native/FlarkDJ.jucer`
2. Update the JUCE module paths if needed (should point to `../JUCE/modules`)
3. Click "Save Project and Open in IDE"

This will generate:
- **Xcode project** on macOS
- **Visual Studio solution** on Windows
- **Linux Makefile** on Linux

### Build in IDE

- **Xcode**: Select scheme (VST3/AU/Standalone) → Product → Build
- **Visual Studio**: Select configuration (Debug/Release) → Build → Build Solution
- **Linux**: Run `make` in the generated `Builds/LinuxMakefile/` directory

## Plugin Formats

### VST3

Built by default on all platforms. Compatible with:
- Ableton Live
- FL Studio
- Cubase
- Reaper
- Logic Pro (via VST3 wrapper)
- And many more

### Audio Unit (AU)

macOS only. Compatible with:
- Logic Pro
- GarageBand
- Ableton Live
- MainStage

### Standalone

Can be run as a desktop application. Useful for:
- Testing without a DAW
- Live performance
- Educational purposes

## Optimization

### Release Optimizations

The CMake build includes:
- Link-Time Optimization (LTO)
- Compiler optimizations (`-O3` or equivalent)
- Recommended JUCE flags
- Warning flags for code quality

### Additional Optimizations

For maximum performance:

```bash
cmake .. -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_CXX_FLAGS="-O3 -march=native -mtune=native"
```

**Note**: `-march=native` optimizes for your CPU but may not work on other systems.

## Troubleshooting

### CMake can't find JUCE

The CMakeLists.txt automatically downloads JUCE via FetchContent. If this fails:

```bash
# Download JUCE manually
git clone --depth 1 --branch 7.0.9 https://github.com/juce-framework/JUCE.git ../JUCE

# Edit CMakeLists.txt to use local copy:
# Comment out FetchContent section
# Uncomment: add_subdirectory(../JUCE)
```

### Missing Dependencies on Linux

```bash
# Check what packages provide the missing headers
apt-file search <missing-header>.h

# Install the -dev or -devel package
sudo apt-get install <package>-dev
```

### Plugin Not Recognized by DAW

1. Check install location matches DAW's plugin paths
2. Rescan plugins in DAW settings
3. On macOS, ensure the plugin is code-signed
4. Check plugin validation in DAW (some DAWs show validation errors)

### Audio Glitches

If you experience audio glitches:
1. Increase DAW buffer size
2. Use Release build (Debug builds are slower)
3. Check CPU usage in DAW performance monitor
4. Disable other CPU-intensive plugins

## Development

### Adding New Features

1. Edit `FlarkDJProcessor.h/cpp` for audio processing
2. Edit `FlarkDJEditor.h/cpp` for GUI
3. Add DSP code to `FlarkDJDSP.h`
4. Rebuild with CMake or Projucer

### Debugging

**macOS/Linux**:
```bash
cmake .. -DCMAKE_BUILD_TYPE=Debug
cmake --build . --config Debug
lldb ./FlarkDJ_artefacts/Debug/Standalone/FlarkDJ.app
```

**Windows**:
```powershell
cmake .. -G "Visual Studio 17 2022"
cmake --build . --config Debug
# Open in Visual Studio and press F5
```

### Testing

Load the plugin in a DAW with test audio:
1. Create an audio track with a test tone or sample
2. Add FlarkDJ to the track
3. Enable effects and adjust parameters
4. Monitor CPU usage and audio quality

## Distribution

### Code Signing

**macOS**:
```bash
# Sign the plugin
codesign --deep --force --verify --verbose \
    --sign "Developer ID Application: Your Name (TEAM_ID)" \
    FlarkDJ.vst3

# Verify signature
codesign --verify --verbose FlarkDJ.vst3

# Notarize for macOS 10.15+
xcrun notarytool submit FlarkDJ.vst3.zip \
    --apple-id your@email.com \
    --team-id TEAM_ID \
    --password app-specific-password
```

**Windows**:
```powershell
# Sign with SignTool (requires certificate)
signtool sign /f certificate.pfx /p password /tr http://timestamp.digicert.com /td sha256 /fd sha256 FlarkDJ.vst3
```

### Creating Installers

See `../DISTRIBUTION.md` for creating installer packages.

## Resources

- **JUCE Framework**: https://juce.com/
- **JUCE Documentation**: https://docs.juce.com/
- **JUCE Forum**: https://forum.juce.com/
- **VST3 SDK**: https://steinbergmedia.github.io/vst3_doc/
- **Audio Unit Programming Guide**: https://developer.apple.com/documentation/audiounit

## License

FlarkDJ is licensed under the MIT License. See `../LICENSE` for details.

JUCE is licensed separately. The free JUCE license requires GPL3 or commercial license.
See https://juce.com/juce-7-licence for details.
