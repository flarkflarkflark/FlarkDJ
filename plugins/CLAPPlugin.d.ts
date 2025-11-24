/**
 * CLAP (CLever Audio Plugin) Wrapper for FlarkDJ
 *
 * CLAP is a modern, open-source plugin format created by Bitwig and u-he.
 * It's designed to address limitations of older formats like VST.
 *
 * To create an actual CLAP plugin, this code would need to be wrapped with:
 * - CLAP SDK (https://github.com/free-audio/clap)
 * - clap-wrapper (https://github.com/free-audio/clap-wrapper)
 * - JUCE with CLAP support
 *
 * CLAP advantages:
 * - Modern, future-proof design
 * - Open-source and royalty-free
 * - Better MIDI 2.0 support
 * - Improved modulationrouting
 * - Per-voice automation
 */
export interface CLAPPluginDescriptor {
    id: string;
    name: string;
    vendor: string;
    url: string;
    manualUrl: string;
    supportUrl: string;
    version: string;
    description: string;
    features: string[];
}
export interface CLAPParameter {
    id: number;
    name: string;
    module: string;
    minValue: number;
    maxValue: number;
    defaultValue: number;
    flags: {
        isAutomatable: boolean;
        isModulatable: boolean;
        isReadonly: boolean;
        isHidden: boolean;
    };
}
export declare class CLAPPlugin {
    private wrapper;
    private descriptor;
    private sampleRate;
    private isActive;
    constructor(sampleRate?: number);
    getDescriptor(): CLAPPluginDescriptor;
    init(): boolean;
    destroy(): void;
    activate(sampleRate: number, minFrames: number, maxFrames: number): boolean;
    deactivate(): void;
    startProcessing(): boolean;
    stopProcessing(): void;
    reset(): void;
    process(audioInputs: Float32Array[][], audioOutputs: Float32Array[][], frameCount: number): void;
    getParameterCount(): number;
    getParameterInfo(paramIndex: number): CLAPParameter | null;
    getParameterValue(paramId: number): number;
    setParameterValue(paramId: number, value: number): void;
    getParameterModulation(paramId: number): number;
    setParameterModulation(paramId: number, amount: number): void;
    saveState(): ArrayBuffer;
    loadState(data: ArrayBuffer): boolean;
    supportsExtension(extensionId: string): boolean;
    getExtension(extensionId: string): any;
    getAudioPortsCount(isInput: boolean): number;
    getAudioPortInfo(index: number, isInput: boolean): {
        id: string;
        name: string;
        channelCount: number;
        portType: string;
        isMain: boolean;
    } | null;
    getNotePortsCount(isInput: boolean): number;
    getNotePortInfo(index: number, isInput: boolean): {
        id: string;
        name: string;
        supportedDialects: string[];
        preferredDialect: string;
    } | null;
}
export declare function createCLAPPlugin(sampleRate: number): CLAPPlugin;
