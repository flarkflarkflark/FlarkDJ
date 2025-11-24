#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <memory>
#include "FlarkDJDSP.h"

/**
 * FlarkDJ Native Audio Processor
 *
 * This is the main audio processor class for the native plugin.
 * It bridges the C++ JUCE framework with the TypeScript/JavaScript FlarkDJ engine.
 *
 * Build Requirements:
 * - JUCE 7.x or later
 * - C++17 or later
 * - VST3 SDK (for VST3)
 * - Audio Unit SDK (for AU, included with Xcode)
 * - AAX SDK (for AAX, requires Avid Developer account)
 */

class FlarkDJProcessor : public juce::AudioProcessor
{
public:
    FlarkDJProcessor();
    ~FlarkDJProcessor() override;

    //==============================================================================
    // AudioProcessor overrides
    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;

    bool isBusesLayoutSupported(const BusesLayout& layouts) const override;

    void processBlock(juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    //==============================================================================
    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    //==============================================================================
    const juce::String getName() const override;

    bool acceptsMidi() const override;
    bool producesMidi() const override;
    bool isMidiEffect() const override;
    double getTailLengthSeconds() const override;

    //==============================================================================
    int getNumPrograms() override;
    int getCurrentProgram() override;
    void setCurrentProgram(int index) override;
    const juce::String getProgramName(int index) override;
    void changeProgramName(int index, const juce::String& newName) override;

    //==============================================================================
    void getStateInformation(juce::MemoryBlock& destData) override;
    void setStateInformation(const void* data, int sizeInBytes) override;

    //==============================================================================
    // Parameter management
    juce::AudioProcessorValueTreeState& getParameters() { return parameters; }

    // Get current output RMS level for spectrum display (0.0 to 1.0)
    float getOutputLevel() const { return outputLevel.load(); }

private:
    //==============================================================================
    // FlarkDJ engine interface
    void initializeFlarkDJ();
    void processAudio(float* leftIn, float* rightIn,
                     float* leftOut, float* rightOut, int numSamples);

    //==============================================================================
    // Parameters
    juce::AudioProcessorValueTreeState parameters;

    std::atomic<float>* filterEnabled = nullptr;
    std::atomic<float>* filterCutoff = nullptr;
    std::atomic<float>* filterResonance = nullptr;
    std::atomic<float>* filterType = nullptr;

    std::atomic<float>* reverbEnabled = nullptr;
    std::atomic<float>* reverbRoomSize = nullptr;
    std::atomic<float>* reverbDamping = nullptr;
    std::atomic<float>* reverbWetDry = nullptr;

    std::atomic<float>* delayEnabled = nullptr;
    std::atomic<float>* delayTime = nullptr;
    std::atomic<float>* delayFeedback = nullptr;
    std::atomic<float>* delayWetDry = nullptr;

    std::atomic<float>* flangerEnabled = nullptr;
    std::atomic<float>* flangerRate = nullptr;
    std::atomic<float>* flangerDepth = nullptr;
    std::atomic<float>* flangerFeedback = nullptr;
    std::atomic<float>* flangerWetDry = nullptr;

    std::atomic<float>* sidechainEnabled = nullptr;
    std::atomic<float>* sidechainThreshold = nullptr;

    std::atomic<float>* lfoRate = nullptr;
    std::atomic<float>* lfoDepth = nullptr;
    std::atomic<float>* lfoWaveform = nullptr;

    std::atomic<float>* masterMix = nullptr;
    std::atomic<float>* masterBypass = nullptr;

    //==============================================================================
    // Audio processing state
    double currentSampleRate = 44100.0;
    int currentBlockSize = 512;
    std::atomic<float> outputLevel{0.0f};

    //==============================================================================
    // FlarkDJ DSP components (pure C++ implementations)
    // Stereo processing - one instance per channel
    FlarkFilter filterLeft, filterRight;
    FlarkReverb reverbLeft, reverbRight;
    FlarkDelay delayLeft, delayRight;
    FlarkFlanger flangerLeft, flangerRight;
    FlarkLFO lfo;

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(FlarkDJProcessor)
};
