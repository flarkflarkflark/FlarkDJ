/**
 * LV2 (LADSPA Version 2) Plugin Wrapper for FlarkDJ
 *
 * LV2 is an open-source plugin format primarily used on Linux.
 * It's also supported on macOS and Windows.
 *
 * To create an actual LV2 plugin, this code would need to be wrapped with:
 * - LV2 SDK (https://lv2plug.in/)
 * - DPF framework (https://github.com/DISTRHO/DPF)
 * - JUCE framework with LV2 support
 *
 * LV2 advantages:
 * - Open-source and royalty-free
 * - Extensive feature set
 * - Good for Linux audio production
 */
export interface LV2PluginInfo {
    uri: string;
    name: string;
    project: string;
    author: string;
    license: string;
    version: string;
    pluginClass: string;
}
export interface LV2Port {
    index: number;
    symbol: string;
    name: string;
    type: 'audio' | 'control' | 'midi';
    direction: 'input' | 'output';
    min?: number;
    max?: number;
    default?: number;
    unit?: string;
}
export declare class LV2Plugin {
    private wrapper;
    private info;
    private ports;
    private sampleRate;
    constructor(sampleRate?: number);
    private initializePorts;
    private parameterNameToSymbol;
    getPluginInfo(): LV2PluginInfo;
    getPorts(): LV2Port[];
    instantiate(sampleRate: number): boolean;
    activate(): void;
    deactivate(): void;
    run(nSamples: number, portData: Map<number, Float32Array>): void;
    saveState(): string;
    loadState(state: string): void;
    getExtensionData(uri: string): any;
    generateManifest(): string;
    generateTTL(): string;
}
export declare function createLV2Plugin(sampleRate: number): LV2Plugin;
