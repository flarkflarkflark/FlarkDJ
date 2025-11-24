"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LV2Plugin = void 0;
exports.createLV2Plugin = createLV2Plugin;
const PluginWrapper_1 = require("./PluginWrapper");
class LV2Plugin {
    constructor(sampleRate = 44100) {
        this.ports = [];
        this.sampleRate = sampleRate;
        this.wrapper = new PluginWrapper_1.PluginWrapper(sampleRate);
        this.info = {
            uri: 'http://flarkdj.com/plugins/flarkdj',
            name: 'FlarkDJ',
            project: 'FlarkDJ Audio Effects',
            author: 'FlarkDJ Team',
            license: 'MIT',
            version: '1.0.0',
            pluginClass: 'Plugin'
        };
        this.initializePorts();
    }
    initializePorts() {
        let portIndex = 0;
        // Audio ports
        this.ports.push({
            index: portIndex++,
            symbol: 'audio_in_l',
            name: 'Audio Input Left',
            type: 'audio',
            direction: 'input'
        });
        this.ports.push({
            index: portIndex++,
            symbol: 'audio_in_r',
            name: 'Audio Input Right',
            type: 'audio',
            direction: 'input'
        });
        this.ports.push({
            index: portIndex++,
            symbol: 'audio_out_l',
            name: 'Audio Output Left',
            type: 'audio',
            direction: 'output'
        });
        this.ports.push({
            index: portIndex++,
            symbol: 'audio_out_r',
            name: 'Audio Output Right',
            type: 'audio',
            direction: 'output'
        });
        // MIDI port
        this.ports.push({
            index: portIndex++,
            symbol: 'midi_in',
            name: 'MIDI Input',
            type: 'midi',
            direction: 'input'
        });
        // Control ports (parameters)
        const params = this.wrapper.getParameters();
        params.forEach(param => {
            this.ports.push({
                index: portIndex++,
                symbol: this.parameterNameToSymbol(param.name),
                name: param.name,
                type: 'control',
                direction: 'input',
                min: param.min,
                max: param.max,
                default: param.default,
                unit: param.unit
            });
        });
    }
    parameterNameToSymbol(name) {
        return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
    getPluginInfo() {
        return this.info;
    }
    getPorts() {
        return this.ports;
    }
    instantiate(sampleRate) {
        this.sampleRate = sampleRate;
        console.log(`LV2 Plugin instantiated at ${sampleRate}Hz`);
        return true;
    }
    activate() {
        console.log('LV2 Plugin activated');
    }
    deactivate() {
        console.log('LV2 Plugin deactivated');
        this.wrapper.reset();
    }
    run(nSamples, portData) {
        // Get audio ports
        const audioInL = portData.get(0) || new Float32Array(nSamples);
        const audioInR = portData.get(1) || new Float32Array(nSamples);
        const audioOutL = portData.get(2) || new Float32Array(nSamples);
        const audioOutR = portData.get(3) || new Float32Array(nSamples);
        // Update parameters from control ports
        const params = this.wrapper.getParameters();
        params.forEach((param, idx) => {
            const portIdx = 5 + idx; // Offset after audio and MIDI ports
            const controlData = portData.get(portIdx);
            if (controlData && controlData.length > 0) {
                this.wrapper.setParameter(param.id, controlData[0]);
            }
        });
        // Process audio
        this.wrapper.processAudio(audioInL, audioInR, audioOutL, audioOutR);
    }
    saveState() {
        const preset = this.wrapper.getPreset();
        return JSON.stringify({
            version: this.info.version,
            preset
        });
    }
    loadState(state) {
        try {
            const data = JSON.parse(state);
            this.wrapper.loadPreset(data.preset);
        }
        catch (error) {
            console.error('Failed to load LV2 state:', error);
        }
    }
    // LV2-specific extension support
    getExtensionData(uri) {
        switch (uri) {
            case 'http://lv2plug.in/ns/ext/state#interface':
                return {
                    save: () => this.saveState(),
                    restore: (state) => this.loadState(state)
                };
            case 'http://lv2plug.in/ns/ext/options#interface':
                return {
                    get: () => ({ sampleRate: this.sampleRate }),
                    set: (options) => { }
                };
            default:
                return null;
        }
    }
    // Generate LV2 TTL manifest
    generateManifest() {
        return `
@prefix lv2:  <http://lv2plug.in/ns/lv2core#> .
@prefix doap: <http://usefulinc.com/ns/doap#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<${this.info.uri}>
    a lv2:Plugin ;
    lv2:binary <flarkdj.so> ;
    rdfs:seeAlso <flarkdj.ttl> .
`;
    }
    // Generate detailed LV2 TTL description
    generateTTL() {
        const portDescriptions = this.ports.map((port, idx) => {
            const portType = port.type === 'audio' ? 'lv2:AudioPort' :
                port.type === 'control' ? 'lv2:ControlPort' : 'atom:AtomPort';
            const direction = port.direction === 'input' ? 'lv2:InputPort' : 'lv2:OutputPort';
            let portDesc = `[
        a ${portType} , ${direction} ;
        lv2:index ${port.index} ;
        lv2:symbol "${port.symbol}" ;
        lv2:name "${port.name}"`;
            if (port.min !== undefined)
                portDesc += ` ;\n        lv2:minimum ${port.min}`;
            if (port.max !== undefined)
                portDesc += ` ;\n        lv2:maximum ${port.max}`;
            if (port.default !== undefined)
                portDesc += ` ;\n        lv2:default ${port.default}`;
            if (port.unit)
                portDesc += ` ;\n        unit:unit unit:${port.unit}`;
            portDesc += '\n    ]';
            return portDesc;
        }).join(' ,\n    ');
        return `
@prefix lv2:  <http://lv2plug.in/ns/lv2core#> .
@prefix doap: <http://usefulinc.com/ns/doap#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix unit: <http://lv2plug.in/ns/extensions/units#> .
@prefix atom: <http://lv2plug.in/ns/ext/atom#> .

<${this.info.uri}>
    a lv2:Plugin ;
    doap:name "${this.info.name}" ;
    doap:license <${this.info.license}> ;
    doap:maintainer [
        foaf:name "${this.info.author}"
    ] ;
    lv2:port
    ${portDescriptions} .
`;
    }
}
exports.LV2Plugin = LV2Plugin;
// Export plugin factory
function createLV2Plugin(sampleRate) {
    return new LV2Plugin(sampleRate);
}
