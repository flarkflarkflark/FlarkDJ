# FlarkDJ Distribution Packages

This directory contains pre-built distribution packages for FlarkDJ.

## Available Packages

### NPM Tarball

**File:** `flark-dj-1.0.0.tgz`
- **Size:** ~25KB
- **Platform:** All (Node.js)
- **Installation:**
  ```bash
  npm install flark-dj-1.0.0.tgz
  ```

## Package Contents

The npm package includes:

- Compiled JavaScript (CommonJS)
- TypeScript definitions (.d.ts files)
- Source TypeScript files
- Test files
- Documentation
- Configuration files

## Installation Instructions

### NPM/Yarn Installation

```bash
# Using npm
npm install ./flark-dj-1.0.0.tgz

# Using yarn
yarn add ./flark-dj-1.0.0.tgz

# Using pnpm
pnpm add ./flark-dj-1.0.0.tgz
```

### Verification

After installation, verify it works:

```javascript
const { FlarkDJ } = require('flark-dj');

const dj = new FlarkDJ(44100);
console.log('Version:', dj.getVersion());

// Add a filter effect
const filter = dj.addFilterEffect('test');
filter.setParameter('cutoff', 1000);

// Process audio
const input = new Float32Array(1024).fill(0.5);
const output = dj.process(input);

console.log('FlarkDJ is working!');
```

## Distribution Options

### For End Users

Distribute the `.tgz` file with installation instructions:
1. Download `flark-dj-1.0.0.tgz`
2. Run `npm install flark-dj-1.0.0.tgz`
3. Import and use in your project

### For Developers

Include in `package.json`:

```json
{
  "dependencies": {
    "flark-dj": "file:./flark-dj-1.0.0.tgz"
  }
}
```

### For Production Deployment

1. **Copy to internal registry:**
   ```bash
   npm publish flark-dj-1.0.0.tgz --registry=https://your-registry.com
   ```

2. **Use in CI/CD:**
   ```bash
   npm ci --production
   ```

## Package Integrity

Verify package integrity:

```bash
npm pack --dry-run
```

Check package contents:

```bash
tar -tzf flark-dj-1.0.0.tgz
```

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| macOS    | ✅ Tested | macOS 10.15+ |
| Windows  | ✅ Tested | Windows 10+ |
| Linux    | ✅ Tested | Ubuntu 20.04+, Fedora 35+ |
| Node.js  | ✅ 18.x, 20.x | LTS versions |

## File Size Breakdown

- **Total Package:** 24.9 KB
- **Unpacked:** 112.8 KB
- **Source Files:** 59 files
- **Dependencies:** web-audio-api (runtime)

## Changelog

### Version 1.0.0 (Initial Release)

**Optional Enhancements:**
- ✅ GitHub Actions CI/CD
- ✅ Preset system
- ✅ XY pad for effect morphing
- ✅ Effect chaining
- ✅ Spectrum analyzer
- ✅ Installer packages

**Advanced Features:**
- ✅ MIDI learn for parameters
- ✅ Sidechain input
- ✅ LFO modulation system
- ✅ Macro controls
- ✅ Effect snapshots/scenes

**Core:**
- Audio engine with effect chaining
- Filter, Reverb, Delay effects
- 55 comprehensive tests
- Full TypeScript support

## Support

For issues or questions:
- GitHub: https://github.com/flarkflarkflark/FlarkDJ/issues
- Docs: See INSTALLATION.md for detailed instructions
