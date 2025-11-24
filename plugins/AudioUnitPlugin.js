"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioUnitPlugin = void 0;
exports.createAudioUnitPlugin = createAudioUnitPlugin;
const PluginWrapper_1 = require("./PluginWrapper");
class AudioUnitPlugin {
    constructor(sampleRate = 44100) {
        this.wrapper = new PluginWrapper_1.PluginWrapper(sampleRate);
        this.info = {
            name: 'FlarkDJ',
            manufacturer: 'FlarkDJ Team',
            version: '1.0.0',
            type: 'aufx', // Audio Unit Effect
            subtype: 'fldj',
            manufacturerCode: 'Flrk'
        };
    }
    getPluginInfo() {
        return this.info;
    }
    initialize(sampleRate, channelsIn, channelsOut) {
        console.log(`AU Plugin initialized: ${sampleRate}Hz, ${channelsIn} in, ${channelsOut} out`);
        return true;
    }
    process(inBufferL, inBufferR, outBufferL, outBufferR, numFrames) {
        this.wrapper.processAudio(inBufferL.subarray(0, numFrames), inBufferR.subarray(0, numFrames), outBufferL.subarray(0, numFrames), outBufferR.subarray(0, numFrames));
    }
    setParameter(parameterID, value) {
        this.wrapper.setParameter(parameterID, value);
    }
    getParameter(parameterID) {
        return this.wrapper.getParameter(parameterID);
    }
    getParameterInfo(parameterID) {
        const params = this.wrapper.getParameters();
        const param = params.find(p => p.id === parameterID);
        if (!param)
            return null;
        return {
            id: param.id,
            name: param.name,
            unit: param.unit,
            minValue: param.min,
            maxValue: param.max,
            defaultValue: param.default,
            flags: param.automatable ? 'kAudioUnitParameterFlag_IsWritable' : ''
        };
    }
    getTailTime() {
        return this.wrapper.getTailLengthSamples() / 44100;
    }
    getLatency() {
        return this.wrapper.getLatencySamples();
    }
    reset() {
        this.wrapper.reset();
    }
    saveState() {
        const preset = this.wrapper.getPreset();
        const json = JSON.stringify(preset);
        const encoder = new TextEncoder();
        return encoder.encode(json).buffer;
    }
    loadState(data) {
        try {
            const decoder = new TextDecoder();
            const json = decoder.decode(data);
            const preset = JSON.parse(json);
            this.wrapper.loadPreset(preset);
        }
        catch (error) {
            console.error('Failed to load AU state:', error);
        }
    }
}
exports.AudioUnitPlugin = AudioUnitPlugin;
// Export plugin factory
function createAudioUnitPlugin(sampleRate) {
    return new AudioUnitPlugin(sampleRate);
}
