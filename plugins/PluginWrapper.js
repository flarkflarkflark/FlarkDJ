"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginWrapper = void 0;
const index_1 = require("../index");
class PluginWrapper {
    constructor(sampleRate = 44100) {
        this.parameters = new Map();
        this.blockSize = 512;
        this.parameterIdCounter = 0;
        this.sampleRate = sampleRate;
        this.flark = new index_1.FlarkDJ(sampleRate);
        this.initializeParameters();
    }
    initializeParameters() {
        // Filter parameters
        this.addParameter('Filter Enabled', 0, 1, 1, '', true);
        this.addParameter('Filter Cutoff', 20, 20000, 1000, 'Hz', true);
        this.addParameter('Filter Resonance', 0.1, 10, 1, '', true);
        this.addParameter('Filter Type', 0, 2, 0, '', false); // 0=LP, 1=HP, 2=BP
        // Reverb parameters
        this.addParameter('Reverb Enabled', 0, 1, 0, '', true);
        this.addParameter('Reverb Room Size', 0, 1, 0.5, '', true);
        this.addParameter('Reverb Damping', 0, 1, 0.5, '', true);
        this.addParameter('Reverb Wet/Dry', 0, 1, 0.3, '', true);
        // Delay parameters
        this.addParameter('Delay Enabled', 0, 1, 0, '', true);
        this.addParameter('Delay Time', 0, 2, 0.5, 's', true);
        this.addParameter('Delay Feedback', 0, 0.95, 0.3, '', true);
        this.addParameter('Delay Wet/Dry', 0, 1, 0.5, '', true);
        // LFO parameters
        this.addParameter('LFO Rate', 0.1, 20, 1, 'Hz', true);
        this.addParameter('LFO Depth', 0, 1, 0, '', true);
        this.addParameter('LFO Waveform', 0, 3, 0, '', false); // 0=sine, 1=square, 2=tri, 3=saw
        // Master parameters
        this.addParameter('Master Mix', 0, 1, 1, '', true);
        this.addParameter('Master Bypass', 0, 1, 0, '', true);
    }
    addParameter(name, min, max, defaultValue, unit, automatable) {
        const id = this.parameterIdCounter++;
        this.parameters.set(id, {
            id,
            name,
            label: name,
            value: defaultValue,
            min,
            max,
            default: defaultValue,
            unit,
            automatable
        });
    }
    getParameter(id) {
        const param = this.parameters.get(id);
        return param ? param.value : 0;
    }
    setParameter(id, value) {
        const param = this.parameters.get(id);
        if (!param)
            return;
        param.value = Math.max(param.min, Math.min(param.max, value));
        this.applyParameterToEngine(id, param.value);
    }
    applyParameterToEngine(id, value) {
        const param = this.parameters.get(id);
        if (!param)
            return;
        // Map parameter IDs to FlarkDJ operations
        switch (id) {
            case 0: // Filter Enabled
                if (value > 0.5) {
                    const filter = this.flark.addFilterEffect('filter');
                    filter.setParameter('cutoff', this.getParameter(1));
                    filter.setParameter('resonance', this.getParameter(2));
                }
                break;
            case 1: // Filter Cutoff
                const filter = this.flark.engine.getEffect('filter');
                if (filter)
                    filter.setParameter('cutoff', value);
                break;
            case 2: // Filter Resonance
                const filter2 = this.flark.engine.getEffect('filter');
                if (filter2)
                    filter2.setParameter('resonance', value);
                break;
            case 4: // Reverb Enabled
                if (value > 0.5) {
                    const reverb = this.flark.addReverbEffect('reverb');
                    reverb.setParameter('roomSize', this.getParameter(5));
                    reverb.setParameter('damping', this.getParameter(6));
                    reverb.setParameter('wetDry', this.getParameter(7));
                }
                break;
            case 5: // Reverb Room Size
                const reverb = this.flark.engine.getEffect('reverb');
                if (reverb)
                    reverb.setParameter('roomSize', value);
                break;
            case 8: // Delay Enabled
                if (value > 0.5) {
                    const delay = this.flark.addDelayEffect('delay');
                    delay.setParameter('time', this.getParameter(9));
                    delay.setParameter('feedback', this.getParameter(10));
                    delay.setParameter('wetDry', this.getParameter(11));
                }
                break;
        }
    }
    processAudio(inputLeft, inputRight, outputLeft, outputRight) {
        const bypass = this.getParameter(16) > 0.5;
        const mix = this.getParameter(15);
        if (bypass) {
            outputLeft.set(inputLeft);
            outputRight.set(inputRight);
            return;
        }
        // Process left channel
        const processedLeft = this.flark.process(inputLeft);
        // Process right channel
        const processedRight = this.flark.process(inputRight);
        // Apply mix
        for (let i = 0; i < outputLeft.length; i++) {
            outputLeft[i] = inputLeft[i] * (1 - mix) + processedLeft[i] * mix;
            outputRight[i] = inputRight[i] * (1 - mix) + processedRight[i] * mix;
        }
    }
    getParameters() {
        return Array.from(this.parameters.values());
    }
    getPreset() {
        const parameters = new Map();
        this.parameters.forEach((param, id) => {
            parameters.set(id, param.value);
        });
        return { name: 'Current', parameters };
    }
    loadPreset(preset) {
        preset.parameters.forEach((value, id) => {
            this.setParameter(id, value);
        });
    }
    reset() {
        this.parameters.forEach((param, id) => {
            this.setParameter(id, param.default);
        });
    }
    getLatencySamples() {
        return 0; // Zero latency
    }
    getTailLengthSamples() {
        return this.sampleRate * 4; // 4 seconds for reverb tail
    }
}
exports.PluginWrapper = PluginWrapper;
