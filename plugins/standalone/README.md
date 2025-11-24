# FlarkDJ Standalone Application

Run FlarkDJ without a DAW.

## Usage

```javascript
const { createStandaloneApp } = require('flark-dj/dist/plugin');

const app = createStandaloneApp({
  sampleRate: 44100,
  bufferSize: 512
});

await app.initialize();
await app.startProcessing();
```

## Building Desktop App

Use Electron to package as desktop application:

```bash
npm install --save-dev electron electron-builder
# Configure electron build
```
