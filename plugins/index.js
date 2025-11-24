"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlarkDJ = exports.createStandaloneApp = exports.StandaloneApp = exports.createCLAPPlugin = exports.CLAPPlugin = exports.createLV2Plugin = exports.LV2Plugin = exports.createAAXPlugin = exports.AAXPlugin = exports.createAudioUnitPlugin = exports.AudioUnitPlugin = exports.createVST3Plugin = exports.VST3Plugin = exports.PluginWrapper = void 0;
var PluginWrapper_1 = require("./PluginWrapper");
Object.defineProperty(exports, "PluginWrapper", { enumerable: true, get: function () { return PluginWrapper_1.PluginWrapper; } });
var VST3Plugin_1 = require("./VST3Plugin");
Object.defineProperty(exports, "VST3Plugin", { enumerable: true, get: function () { return VST3Plugin_1.VST3Plugin; } });
Object.defineProperty(exports, "createVST3Plugin", { enumerable: true, get: function () { return VST3Plugin_1.createVST3Plugin; } });
var AudioUnitPlugin_1 = require("./AudioUnitPlugin");
Object.defineProperty(exports, "AudioUnitPlugin", { enumerable: true, get: function () { return AudioUnitPlugin_1.AudioUnitPlugin; } });
Object.defineProperty(exports, "createAudioUnitPlugin", { enumerable: true, get: function () { return AudioUnitPlugin_1.createAudioUnitPlugin; } });
var AAXPlugin_1 = require("./AAXPlugin");
Object.defineProperty(exports, "AAXPlugin", { enumerable: true, get: function () { return AAXPlugin_1.AAXPlugin; } });
Object.defineProperty(exports, "createAAXPlugin", { enumerable: true, get: function () { return AAXPlugin_1.createAAXPlugin; } });
var LV2Plugin_1 = require("./LV2Plugin");
Object.defineProperty(exports, "LV2Plugin", { enumerable: true, get: function () { return LV2Plugin_1.LV2Plugin; } });
Object.defineProperty(exports, "createLV2Plugin", { enumerable: true, get: function () { return LV2Plugin_1.createLV2Plugin; } });
var CLAPPlugin_1 = require("./CLAPPlugin");
Object.defineProperty(exports, "CLAPPlugin", { enumerable: true, get: function () { return CLAPPlugin_1.CLAPPlugin; } });
Object.defineProperty(exports, "createCLAPPlugin", { enumerable: true, get: function () { return CLAPPlugin_1.createCLAPPlugin; } });
var StandaloneApp_1 = require("./StandaloneApp");
Object.defineProperty(exports, "StandaloneApp", { enumerable: true, get: function () { return StandaloneApp_1.StandaloneApp; } });
Object.defineProperty(exports, "createStandaloneApp", { enumerable: true, get: function () { return StandaloneApp_1.createStandaloneApp; } });
// Re-export FlarkDJ for convenience
var index_1 = require("../index");
Object.defineProperty(exports, "FlarkDJ", { enumerable: true, get: function () { return index_1.FlarkDJ; } });
