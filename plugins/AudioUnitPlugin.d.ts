/**
 * Audio Unit (AU) Plugin Wrapper for FlarkDJ
 *
 * This is a TypeScript/JavaScript representation of the Audio Unit plugin interface.
 * To create an actual AU plugin for macOS, this code would need to be wrapped with:
 * - JUCE framework (C++)
 * - Apple's Audio Unit SDK
 * - Native Node.js addons (N-API)
 *
 * Audio Units are macOS-specific plugin format.
 */
export interface AudioUnitInfo {
    name: string;
    manufacturer: string;
    version: string;
    type: string;
    subtype: string;
    manufacturerCode: string;
}
export declare class AudioUnitPlugin {
    private wrapper;
    private info;
    constructor(sampleRate?: number);
    getPluginInfo(): AudioUnitInfo;
    initialize(sampleRate: number, channelsIn: number, channelsOut: number): boolean;
    process(inBufferL: Float32Array, inBufferR: Float32Array, outBufferL: Float32Array, outBufferR: Float32Array, numFrames: number): void;
    setParameter(parameterID: number, value: number): void;
    getParameter(parameterID: number): number;
    getParameterInfo(parameterID: number): {
        id: number;
        name: string;
        unit: string | undefined;
        minValue: number;
        maxValue: number;
        defaultValue: number;
        flags: string;
    } | null;
    getTailTime(): number;
    getLatency(): number;
    reset(): void;
    saveState(): ArrayBuffer;
    loadState(data: ArrayBuffer): void;
}
export declare function createAudioUnitPlugin(sampleRate: number): AudioUnitPlugin;
