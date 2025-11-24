"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandaloneApp = void 0;
exports.createStandaloneApp = createStandaloneApp;
const PluginWrapper_1 = require("./PluginWrapper");
class StandaloneApp {
    constructor(config) {
        this.isProcessing = false;
        this.audioContext = null;
        this.config = {
            sampleRate: 44100,
            bufferSize: 512,
            inputChannels: 2,
            outputChannels: 2,
            ...config
        };
        this.wrapper = new PluginWrapper_1.PluginWrapper(this.config.sampleRate);
    }
    async initialize() {
        try {
            // Initialize Web Audio API (for browser/electron)
            if (typeof AudioContext !== 'undefined') {
                this.audioContext = new AudioContext({
                    sampleRate: this.config.sampleRate
                });
            }
            console.log('Standalone app initialized');
            console.log(`Sample rate: ${this.config.sampleRate}Hz`);
            console.log(`Buffer size: ${this.config.bufferSize} samples`);
            return true;
        }
        catch (error) {
            console.error('Failed to initialize standalone app:', error);
            return false;
        }
    }
    async startProcessing() {
        if (this.isProcessing)
            return;
        try {
            if (this.audioContext) {
                await this.audioContext.resume();
            }
            this.isProcessing = true;
            console.log('Audio processing started');
        }
        catch (error) {
            console.error('Failed to start processing:', error);
        }
    }
    stopProcessing() {
        if (!this.isProcessing)
            return;
        if (this.audioContext) {
            this.audioContext.suspend();
        }
        this.isProcessing = false;
        console.log('Audio processing stopped');
    }
    processBuffer(inputLeft, inputRight) {
        const outputLeft = new Float32Array(inputLeft.length);
        const outputRight = new Float32Array(inputRight.length);
        this.wrapper.processAudio(inputLeft, inputRight, outputLeft, outputRight);
        return { left: outputLeft, right: outputRight };
    }
    setParameter(id, value) {
        this.wrapper.setParameter(id, value);
    }
    getParameter(id) {
        return this.wrapper.getParameter(id);
    }
    getParameters() {
        return this.wrapper.getParameters();
    }
    savePreset(name) {
        const preset = this.wrapper.getPreset();
        preset.name = name;
        return JSON.stringify(preset);
    }
    loadPreset(presetJson) {
        try {
            const preset = JSON.parse(presetJson);
            this.wrapper.loadPreset(preset);
        }
        catch (error) {
            console.error('Failed to load preset:', error);
        }
    }
    reset() {
        this.wrapper.reset();
    }
    getConfig() {
        return { ...this.config };
    }
    getSampleRate() {
        return this.config.sampleRate;
    }
    getBufferSize() {
        return this.config.bufferSize;
    }
    isActive() {
        return this.isProcessing;
    }
    // File processing (for batch processing audio files)
    async processAudioFile(inputData, sampleRate) {
        if (inputData.length !== 2) {
            throw new Error('Only stereo input is supported');
        }
        const outputLeft = new Float32Array(inputData[0].length);
        const outputRight = new Float32Array(inputData[1].length);
        // Process in chunks
        const chunkSize = this.config.bufferSize;
        for (let i = 0; i < inputData[0].length; i += chunkSize) {
            const end = Math.min(i + chunkSize, inputData[0].length);
            const inL = inputData[0].subarray(i, end);
            const inR = inputData[1].subarray(i, end);
            const outL = outputLeft.subarray(i, end);
            const outR = outputRight.subarray(i, end);
            this.wrapper.processAudio(inL, inR, outL, outR);
        }
        return [outputLeft, outputRight];
    }
    shutdown() {
        this.stopProcessing();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        console.log('Standalone app shut down');
    }
}
exports.StandaloneApp = StandaloneApp;
// Create standalone application
function createStandaloneApp(config) {
    return new StandaloneApp(config);
}
