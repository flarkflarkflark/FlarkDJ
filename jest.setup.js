// Mock Web Audio API for Node.js testing environment

class MockAnalyserNode {
  constructor() {
    this.fftSize = 2048;
    this.frequencyBinCount = 1024;
    this.smoothingTimeConstant = 0.8;
    this.context = { sampleRate: 44100 };
  }

  getFloatFrequencyData(array) {
    // Cast to any to avoid TypeScript type issues with Float32Array
    const arr = array;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = -100 + Math.random() * 100;
    }
  }

  getFloatTimeDomainData(array) {
    // Cast to any to avoid TypeScript type issues with Float32Array
    const arr = array;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.sin(2 * Math.PI * i / arr.length);
    }
  }
}

class MockAudioContext {
  constructor(options = {}) {
    this.sampleRate = options.sampleRate || 44100;
  }

  createAnalyser() {
    return new MockAnalyserNode();
  }
}

// Mock navigator.requestMIDIAccess
global.navigator = {
  requestMIDIAccess: async () => ({
    inputs: {
      values: () => []
    }
  })
};

global.AudioContext = MockAudioContext;
