/**
 * VST3 Plugin Wrapper for FlarkDJ
 *
 * This is a TypeScript/JavaScript representation of the VST3 plugin interface.
 * To create an actual VST3 plugin, this code would need to be wrapped with:
 * - JUCE framework (C++)
 * - VST3 SDK
 * - Native Node.js addons (N-API)
 *
 * For production use, consider using:
 * - JUCE (https://juce.com/) - Cross-platform audio plugin framework
 * - DPF (https://github.com/DISTRHO/DPF) - DISTRHO Plugin Framework
 * - iPlug2 (https://github.com/iPlug2/iPlug2) - C++ audio plugin framework
 */
export interface VST3PluginInfo {
    pluginName: string;
    vendor: string;
    version: string;
    category: string;
    vst3ID: string;
}
export declare class VST3Plugin {
    private wrapper;
    private info;
    constructor(sampleRate?: number);
    getPluginInfo(): VST3PluginInfo;
    initialize(sampleRate: number, maxBlockSize: number): boolean;
    process(inputs: Float32Array[], outputs: Float32Array[], numSamples: number): void;
    setParameter(index: number, value: number): void;
    getParameter(index: number): number;
    getParameterCount(): number;
    getParameterInfo(index: number): import("./PluginWrapper").PluginParameter;
    suspend(): void;
    resume(): void;
    saveState(): string;
    loadState(state: string): void;
}
export declare function createVST3Plugin(sampleRate: number): VST3Plugin;
