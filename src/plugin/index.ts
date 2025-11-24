/**
 * FlarkDJ Plugin Packages
 *
 * This module exports plugin wrappers for different formats:
 * - VST3: Cross-platform plugin format (Steinberg)
 * - Audio Unit (AU): macOS plugin format (Apple)
 * - AAX: Pro Tools plugin format (Avid)
 * - LV2: Open-source Linux plugin format
 * - CLAP: Modern open-source plugin format
 * - Standalone: Independent application
 *
 * Note: These are TypeScript/JavaScript wrappers. To create actual
 * binary plugins for DAWs, you'll need to use frameworks like:
 * - JUCE (https://juce.com/) - Supports all formats
 * - iPlug2 (https://github.com/iPlug2/iPlug2) - VST, AU, AAX
 * - DPF (https://github.com/DISTRHO/DPF) - VST, LV2, CLAP
 * - clap-wrapper (https://github.com/free-audio/clap-wrapper) - CLAP
 */

export { PluginWrapper, PluginParameter, PluginPreset } from './PluginWrapper';
export { VST3Plugin, createVST3Plugin, VST3PluginInfo } from './VST3Plugin';
export { AudioUnitPlugin, createAudioUnitPlugin, AudioUnitInfo } from './AudioUnitPlugin';
export { AAXPlugin, createAAXPlugin, AAXPluginInfo } from './AAXPlugin';
export { LV2Plugin, createLV2Plugin, LV2PluginInfo } from './LV2Plugin';
export { CLAPPlugin, createCLAPPlugin, CLAPPluginDescriptor } from './CLAPPlugin';
export { StandaloneApp, createStandaloneApp, StandaloneConfig } from './StandaloneApp';

// Re-export FlarkDJ for convenience
export { FlarkDJ } from '../index';
