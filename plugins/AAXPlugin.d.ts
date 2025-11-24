/**
 * AAX (Avid Audio Extension) Plugin Wrapper for FlarkDJ
 *
 * This is a TypeScript/JavaScript representation of the AAX plugin interface.
 * To create an actual AAX plugin for Pro Tools, this code would need to be wrapped with:
 * - JUCE framework (C++)
 * - AAX SDK (requires Avid Developer account)
 * - Native Node.js addons (N-API)
 *
 * AAX is Avid's proprietary plugin format for Pro Tools.
 * Note: AAX SDK requires signing NDA with Avid.
 */
export interface AAXPluginInfo {
    pluginName: string;
    manufacturerName: string;
    productName: string;
    pluginID: string;
    manufacturerID: string;
    version: string;
    category: string;
}
export declare class AAXPlugin {
    private wrapper;
    private info;
    private sampleRate;
    constructor(sampleRate?: number);
    getPluginInfo(): AAXPluginInfo;
    initialize(sampleRate: number): boolean;
    processAudio(inputBuffers: Float32Array[], outputBuffers: Float32Array[], numSamples: number): void;
    setParameter(parameterID: number, normalizedValue: number): void;
    getParameter(parameterID: number): number;
    getParameterCount(): number;
    getParameterInfo(parameterID: number): {
        id: number;
        name: string;
        shortName: string;
        minValue: number;
        maxValue: number;
        defaultValue: number;
        unit: string | undefined;
        automatable: boolean;
        type: string;
    } | null;
    private getParameterType;
    getLatency(): number;
    getTailLength(): number;
    reset(): void;
    bypass(shouldBypass: boolean): void;
    saveChunk(): ArrayBuffer;
    loadChunk(data: ArrayBuffer): void;
    getSignalLatency(): number;
    getMIDINodeCount(): number;
    getStemFormat(): string;
}
export declare function createAAXPlugin(sampleRate: number): AAXPlugin;
