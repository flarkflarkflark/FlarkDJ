/**
 * Standalone Application for FlarkDJ
 *
 * This creates a standalone application that can run without a DAW.
 * Useful for:
 * - Testing the plugin
 * - Live performance
 * - Audio file processing
 * - Demo purposes
 */
export interface AudioDeviceInfo {
    id: string;
    name: string;
    channels: number;
    sampleRate: number;
}
export interface StandaloneConfig {
    inputDevice?: string;
    outputDevice?: string;
    sampleRate: number;
    bufferSize: number;
    inputChannels: number;
    outputChannels: number;
}
export declare class StandaloneApp {
    private wrapper;
    private config;
    private isProcessing;
    private audioContext;
    constructor(config?: Partial<StandaloneConfig>);
    initialize(): Promise<boolean>;
    startProcessing(): Promise<void>;
    stopProcessing(): void;
    processBuffer(inputLeft: Float32Array, inputRight: Float32Array): {
        left: Float32Array;
        right: Float32Array;
    };
    setParameter(id: number, value: number): void;
    getParameter(id: number): number;
    getParameters(): import("./PluginWrapper").PluginParameter[];
    savePreset(name: string): string;
    loadPreset(presetJson: string): void;
    reset(): void;
    getConfig(): StandaloneConfig;
    getSampleRate(): number;
    getBufferSize(): number;
    isActive(): boolean;
    processAudioFile(inputData: Float32Array[], sampleRate: number): Promise<Float32Array[]>;
    shutdown(): void;
}
export declare function createStandaloneApp(config?: Partial<StandaloneConfig>): StandaloneApp;
