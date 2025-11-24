export interface PluginParameter {
    id: number;
    name: string;
    label: string;
    value: number;
    min: number;
    max: number;
    default: number;
    unit?: string;
    automatable: boolean;
}
export interface PluginPreset {
    name: string;
    parameters: Map<number, number>;
}
export declare class PluginWrapper {
    private flark;
    private parameters;
    private sampleRate;
    private blockSize;
    private parameterIdCounter;
    constructor(sampleRate?: number);
    private initializeParameters;
    private addParameter;
    getParameter(id: number): number;
    setParameter(id: number, value: number): void;
    private applyParameterToEngine;
    processAudio(inputLeft: Float32Array, inputRight: Float32Array, outputLeft: Float32Array, outputRight: Float32Array): void;
    getParameters(): PluginParameter[];
    getPreset(): PluginPreset;
    loadPreset(preset: PluginPreset): void;
    reset(): void;
    getLatencySamples(): number;
    getTailLengthSamples(): number;
}
