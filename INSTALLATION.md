# FlarkDJ Installation Guide

## Installation Methods

### Method 1: From npm Registry (Recommended)

Once published to npm:

```bash
npm install flark-dj
```

or with yarn:

```bash
yarn add flark-dj
```

### Method 2: From Distribution Package

If you have a local distribution tarball:

```bash
npm install /path/to/flark-dj-1.0.0.tgz
```

### Method 3: From Source

Clone and build from source:

```bash
git clone https://github.com/flarkflarkflark/FlarkDJ.git
cd FlarkDJ
npm install
npm run build
npm link
```

## Platform-Specific Notes

### macOS

No additional dependencies required. Works with Node.js 18.x or 20.x.

### Windows

Ensure you have:
- Node.js 18.x or 20.x
- Visual Studio Build Tools (for native modules)

```bash
npm install --global windows-build-tools
```

### Linux

Install audio development libraries:

**Ubuntu/Debian:**
```bash
sudo apt-get install libasound2-dev
```

**Fedora/RHEL:**
```bash
sudo dnf install alsa-lib-devel
```

**Arch Linux:**
```bash
sudo pacman -S alsa-lib
```

## Verify Installation

After installation, verify it works:

```javascript
const { FlarkDJ } = require('flark-dj');

const flark = new FlarkDJ(44100);
console.log('FlarkDJ version:', flark.getVersion());
```

Expected output: `FlarkDJ version: 1.0.0`

## Development Installation

For contributing or development:

```bash
git clone https://github.com/flarkflarkflark/FlarkDJ.git
cd FlarkDJ
npm install
npm test          # Run tests
npm run build     # Compile TypeScript
npm run dev       # Watch mode
```

## Creating Distribution Packages

### NPM Tarball

```bash
npm run dist
```

This creates `release/flark-dj-1.0.0.tgz`

### Cross-Platform Distribution

For distribution to users without npm:

```bash
# Create standalone bundle
npm run package
```

### Publishing to NPM

```bash
npm login
npm publish
```

## Troubleshooting

### Import Errors

If you get module not found errors:

```bash
npm cache clean --force
npm install
```

### TypeScript Errors

Ensure TypeScript is properly installed:

```bash
npm install --save-dev typescript
npm run build
```

### Test Failures

Run with verbose output:

```bash
npm test -- --verbose
```

### Audio Context Issues

If you see AudioContext errors in Node.js:
- These are expected in Node environment
- Tests use mocked AudioContext
- In browser, native AudioContext is used

## Platform Requirements

- **Node.js**: 18.x or 20.x
- **npm**: 9.x or higher
- **OS**: macOS 10.15+, Windows 10+, Linux (kernel 4.x+)
- **Memory**: 512MB minimum, 1GB recommended
- **Storage**: 50MB for package + dependencies

## Support

- Issues: https://github.com/flarkflarkflark/FlarkDJ/issues
- Documentation: https://github.com/flarkflarkflark/FlarkDJ
- Email: support@flarkdj.com
