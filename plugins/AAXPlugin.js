"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AAXPlugin = void 0;
exports.createAAXPlugin = createAAXPlugin;
const PluginWrapper_1 = require("./PluginWrapper");
class AAXPlugin {
    constructor(sampleRate = 44100) {
        this.sampleRate = sampleRate;
        this.wrapper = new PluginWrapper_1.PluginWrapper(sampleRate);
        this.info = {
            pluginName: 'FlarkDJ',
            manufacturerName: 'FlarkDJ Team',
            productName: 'FlarkDJ Audio Effects',
            pluginID: 'FLDj', // 4-char unique ID
            manufacturerID: 'Flrk', // 4-char manufacturer ID
            version: '1.0.0',
            category: 'EQ'
        };
    }
    getPluginInfo() {
        return this.info;
    }
    initialize(sampleRate) {
        this.sampleRate = sampleRate;
        console.log(`AAX Plugin initialized at ${sampleRate}Hz`);
        return true;
    }
    processAudio(inputBuffers, outputBuffers, numSamples) {
        // AAX supports various channel configurations
        // Here we handle stereo (most common)
        if (inputBuffers.length >= 2 && outputBuffers.length >= 2) {
            this.wrapper.processAudio(inputBuffers[0], inputBuffers[1], outputBuffers[0], outputBuffers[1]);
        }
        else if (inputBuffers.length === 1 && outputBuffers.length === 1) {
            // Mono processing
            this.wrapper.processAudio(inputBuffers[0], inputBuffers[0], outputBuffers[0], outputBuffers[0]);
        }
    }
    setParameter(parameterID, normalizedValue) {
        // AAX uses normalized 0-1 values
        const param = this.wrapper.getParameters().find(p => p.id === parameterID);
        if (param) {
            const actualValue = param.min + (param.max - param.min) * normalizedValue;
            this.wrapper.setParameter(parameterID, actualValue);
        }
    }
    getParameter(parameterID) {
        const value = this.wrapper.getParameter(parameterID);
        const param = this.wrapper.getParameters().find(p => p.id === parameterID);
        if (!param)
            return 0;
        // Return normalized 0-1 value
        return (value - param.min) / (param.max - param.min);
    }
    getParameterCount() {
        return this.wrapper.getParameters().length;
    }
    getParameterInfo(parameterID) {
        const params = this.wrapper.getParameters();
        const param = params.find(p => p.id === parameterID);
        if (!param)
            return null;
        return {
            id: param.id,
            name: param.name,
            shortName: param.name.substring(0, 8), // AAX has short name limit
            minValue: param.min,
            maxValue: param.max,
            defaultValue: param.default,
            unit: param.unit,
            automatable: param.automatable,
            type: this.getParameterType(param)
        };
    }
    getParameterType(param) {
        if (param.min === 0 && param.max === 1 && param.unit === '') {
            return 'Boolean';
        }
        else if (Number.isInteger(param.min) && Number.isInteger(param.max)) {
            return 'Discrete';
        }
        return 'Continuous';
    }
    getLatency() {
        return this.wrapper.getLatencySamples();
    }
    getTailLength() {
        return this.wrapper.getTailLengthSamples();
    }
    reset() {
        this.wrapper.reset();
    }
    bypass(shouldBypass) {
        // Set bypass parameter (ID 16)
        this.wrapper.setParameter(16, shouldBypass ? 1 : 0);
    }
    saveChunk() {
        const preset = this.wrapper.getPreset();
        const json = JSON.stringify({
            version: this.info.version,
            preset
        });
        const encoder = new TextEncoder();
        return encoder.encode(json).buffer;
    }
    loadChunk(data) {
        try {
            const decoder = new TextDecoder();
            const json = decoder.decode(data);
            const { preset } = JSON.parse(json);
            this.wrapper.loadPreset(preset);
        }
        catch (error) {
            console.error('Failed to load AAX chunk:', error);
        }
    }
    // AAX-specific methods
    getSignalLatency() {
        return this.getLatency();
    }
    getMIDINodeCount() {
        return 1; // Support MIDI for MIDI learn
    }
    getStemFormat() {
        return 'Stereo'; // Or 'Mono', '5.1', '7.1' etc.
    }
}
exports.AAXPlugin = AAXPlugin;
// Export plugin factory
function createAAXPlugin(sampleRate) {
    return new AAXPlugin(sampleRate);
}
