"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLAPPlugin = void 0;
exports.createCLAPPlugin = createCLAPPlugin;
const PluginWrapper_1 = require("./PluginWrapper");
class CLAPPlugin {
    constructor(sampleRate = 44100) {
        this.isActive = false;
        this.sampleRate = sampleRate;
        this.wrapper = new PluginWrapper_1.PluginWrapper(sampleRate);
        this.descriptor = {
            id: 'com.flarkdj.flarkdj',
            name: 'FlarkDJ',
            vendor: 'FlarkDJ Team',
            url: 'https://github.com/flarkflarkflark/FlarkDJ',
            manualUrl: 'https://github.com/flarkflarkflark/FlarkDJ/wiki',
            supportUrl: 'https://github.com/flarkflarkflark/FlarkDJ/issues',
            version: '1.0.0',
            description: 'Comprehensive DJ toolkit with advanced effects and modulation',
            features: [
                'audio-effect',
                'stereo',
                'filter',
                'reverb',
                'delay',
                'modulation'
            ]
        };
    }
    getDescriptor() {
        return this.descriptor;
    }
    // Plugin lifecycle
    init() {
        console.log(`CLAP Plugin initialized: ${this.descriptor.name}`);
        return true;
    }
    destroy() {
        console.log('CLAP Plugin destroyed');
    }
    activate(sampleRate, minFrames, maxFrames) {
        this.sampleRate = sampleRate;
        this.isActive = true;
        console.log(`CLAP Plugin activated at ${sampleRate}Hz`);
        console.log(`Frame range: ${minFrames}-${maxFrames}`);
        return true;
    }
    deactivate() {
        this.isActive = false;
        this.wrapper.reset();
        console.log('CLAP Plugin deactivated');
    }
    startProcessing() {
        return this.isActive;
    }
    stopProcessing() {
        // Stop any ongoing processing
    }
    reset() {
        this.wrapper.reset();
    }
    // Audio processing
    process(audioInputs, audioOutputs, frameCount) {
        if (!this.isActive)
            return;
        // Process stereo (most common case)
        if (audioInputs.length > 0 &&
            audioInputs[0].length >= 2 &&
            audioOutputs.length > 0 &&
            audioOutputs[0].length >= 2) {
            this.wrapper.processAudio(audioInputs[0][0], audioInputs[0][1], audioOutputs[0][0], audioOutputs[0][1]);
        }
    }
    // Parameters
    getParameterCount() {
        return this.wrapper.getParameters().length;
    }
    getParameterInfo(paramIndex) {
        const params = this.wrapper.getParameters();
        if (paramIndex >= params.length)
            return null;
        const param = params[paramIndex];
        return {
            id: param.id,
            name: param.name,
            module: 'Main',
            minValue: param.min,
            maxValue: param.max,
            defaultValue: param.default,
            flags: {
                isAutomatable: param.automatable,
                isModulatable: true,
                isReadonly: false,
                isHidden: false
            }
        };
    }
    getParameterValue(paramId) {
        return this.wrapper.getParameter(paramId);
    }
    setParameterValue(paramId, value) {
        this.wrapper.setParameter(paramId, value);
    }
    // Parameter modulation (CLAP feature)
    getParameterModulation(paramId) {
        // Return current modulation amount
        return 0; // Placeholder
    }
    setParameterModulation(paramId, amount) {
        // Apply modulation to parameter
        // This would integrate with LFO system
    }
    // State management
    saveState() {
        const preset = this.wrapper.getPreset();
        const stateData = {
            version: this.descriptor.version,
            preset,
            pluginId: this.descriptor.id
        };
        const json = JSON.stringify(stateData);
        const encoder = new TextEncoder();
        return encoder.encode(json).buffer;
    }
    loadState(data) {
        try {
            const decoder = new TextDecoder();
            const json = decoder.decode(data);
            const stateData = JSON.parse(json);
            if (stateData.pluginId !== this.descriptor.id) {
                console.error('State is from different plugin');
                return false;
            }
            this.wrapper.loadPreset(stateData.preset);
            return true;
        }
        catch (error) {
            console.error('Failed to load CLAP state:', error);
            return false;
        }
    }
    // Extensions
    supportsExtension(extensionId) {
        const supportedExtensions = [
            'clap.params',
            'clap.state',
            'clap.audio-ports',
            'clap.note-ports',
            'clap.latency',
            'clap.tail'
        ];
        return supportedExtensions.includes(extensionId);
    }
    getExtension(extensionId) {
        switch (extensionId) {
            case 'clap.params':
                return {
                    count: () => this.getParameterCount(),
                    getInfo: (index) => this.getParameterInfo(index),
                    getValue: (id) => this.getParameterValue(id),
                    setValue: (id, value) => this.setParameterValue(id, value)
                };
            case 'clap.state':
                return {
                    save: () => this.saveState(),
                    load: (data) => this.loadState(data)
                };
            case 'clap.latency':
                return {
                    get: () => this.wrapper.getLatencySamples()
                };
            case 'clap.tail':
                return {
                    get: () => this.wrapper.getTailLengthSamples()
                };
            default:
                return null;
        }
    }
    // Audio ports configuration
    getAudioPortsCount(isInput) {
        return 1; // One stereo port
    }
    getAudioPortInfo(index, isInput) {
        if (index !== 0)
            return null;
        return {
            id: isInput ? 'audio_in' : 'audio_out',
            name: isInput ? 'Audio Input' : 'Audio Output',
            channelCount: 2,
            portType: 'stereo',
            isMain: true
        };
    }
    // Note ports (for MIDI)
    getNotePortsCount(isInput) {
        return isInput ? 1 : 0;
    }
    getNotePortInfo(index, isInput) {
        if (index !== 0 || !isInput)
            return null;
        return {
            id: 'midi_in',
            name: 'MIDI Input',
            supportedDialects: ['clap.midi'],
            preferredDialect: 'clap.midi'
        };
    }
}
exports.CLAPPlugin = CLAPPlugin;
// Export plugin factory
function createCLAPPlugin(sampleRate) {
    return new CLAPPlugin(sampleRate);
}
