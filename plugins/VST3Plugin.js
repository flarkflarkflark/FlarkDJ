"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VST3Plugin = void 0;
exports.createVST3Plugin = createVST3Plugin;
const PluginWrapper_1 = require("./PluginWrapper");
class VST3Plugin {
    constructor(sampleRate = 44100) {
        this.wrapper = new PluginWrapper_1.PluginWrapper(sampleRate);
        this.info = {
            pluginName: 'FlarkDJ',
            vendor: 'FlarkDJ Team',
            version: '1.0.0',
            category: 'Fx|Dynamics',
            vst3ID: '{12345678-1234-1234-1234-123456789012}'
        };
    }
    getPluginInfo() {
        return this.info;
    }
    initialize(sampleRate, maxBlockSize) {
        // VST3 initialization
        console.log(`VST3 Plugin initialized at ${sampleRate}Hz, block size: ${maxBlockSize}`);
        return true;
    }
    process(inputs, outputs, numSamples) {
        if (inputs.length >= 2 && outputs.length >= 2) {
            this.wrapper.processAudio(inputs[0], inputs[1], outputs[0], outputs[1]);
        }
    }
    setParameter(index, value) {
        this.wrapper.setParameter(index, value);
    }
    getParameter(index) {
        return this.wrapper.getParameter(index);
    }
    getParameterCount() {
        return this.wrapper.getParameters().length;
    }
    getParameterInfo(index) {
        const params = this.wrapper.getParameters();
        return params[index];
    }
    suspend() {
        // Suspend processing
        this.wrapper.reset();
    }
    resume() {
        // Resume processing
    }
    saveState() {
        const preset = this.wrapper.getPreset();
        return JSON.stringify(preset);
    }
    loadState(state) {
        try {
            const preset = JSON.parse(state);
            this.wrapper.loadPreset(preset);
        }
        catch (error) {
            console.error('Failed to load state:', error);
        }
    }
}
exports.VST3Plugin = VST3Plugin;
// Export plugin factory
function createVST3Plugin(sampleRate) {
    return new VST3Plugin(sampleRate);
}
