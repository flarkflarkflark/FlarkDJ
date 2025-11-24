# FlarkDJ LV2 Plugin

Open-source Linux plugin format (also works on macOS/Windows).

## Building Native LV2

### Option 1: DPF Framework
```bash
git clone https://github.com/DISTRHO/DPF
# Follow DPF integration guide
```

### Option 2: LV2 SDK
```bash
# Install LV2 development libraries
sudo apt-get install lv2-dev  # Ubuntu/Debian
# Build with LV2 SDK
```

## Installation
Place built .lv2 bundle in:
- `/usr/lib/lv2/` (Linux system-wide)
- `~/.lv2/` (Linux user-specific)
- `/Library/Audio/Plug-Ins/LV2/` (macOS)
