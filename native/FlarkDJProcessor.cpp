#include "FlarkDJProcessor.h"
#include "FlarkDJEditor.h"

//==============================================================================
FlarkDJProcessor::FlarkDJProcessor()
    : AudioProcessor(BusesProperties()
                    .withInput("Input", juce::AudioChannelSet::stereo(), true)
                    .withOutput("Output", juce::AudioChannelSet::stereo(), true)),
      parameters(*this, nullptr, juce::Identifier("FlarkDJ"),
                {
                    std::make_unique<juce::AudioParameterBool>("filterEnabled", "Filter Enabled", true),
                    std::make_unique<juce::AudioParameterFloat>("filterCutoff", "Filter Cutoff",
                        juce::NormalisableRange<float>(20.0f, 20000.0f, 1.0f, 0.3f), 1000.0f),
                    std::make_unique<juce::AudioParameterFloat>("filterResonance", "Filter Resonance",
                        0.1f, 10.0f, 1.0f),
                    std::make_unique<juce::AudioParameterChoice>("filterType", "Filter Type",
                        juce::StringArray{"Lowpass", "Highpass", "Bandpass"}, 0),

                    std::make_unique<juce::AudioParameterBool>("reverbEnabled", "Reverb Enabled", false),
                    std::make_unique<juce::AudioParameterFloat>("reverbRoomSize", "Reverb Room Size",
                        0.0f, 1.0f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("reverbDamping", "Reverb Damping",
                        0.0f, 1.0f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("reverbWetDry", "Reverb Wet/Dry",
                        0.0f, 1.0f, 0.3f),

                    std::make_unique<juce::AudioParameterBool>("delayEnabled", "Delay Enabled", false),
                    std::make_unique<juce::AudioParameterFloat>("delayTime", "Delay Time",
                        0.0f, 2.0f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("delayFeedback", "Delay Feedback",
                        0.0f, 0.95f, 0.3f),
                    std::make_unique<juce::AudioParameterFloat>("delayWetDry", "Delay Wet/Dry",
                        0.0f, 1.0f, 0.5f),

                    std::make_unique<juce::AudioParameterFloat>("lfoRate", "LFO Rate",
                        juce::NormalisableRange<float>(0.1f, 20.0f, 0.1f, 0.5f), 1.0f),
                    std::make_unique<juce::AudioParameterFloat>("lfoDepth", "LFO Depth",
                        0.0f, 1.0f, 0.0f),
                    std::make_unique<juce::AudioParameterChoice>("lfoWaveform", "LFO Waveform",
                        juce::StringArray{"Sine", "Square", "Triangle", "Sawtooth"}, 0),

                    std::make_unique<juce::AudioParameterFloat>("masterMix", "Master Mix",
                        0.0f, 1.0f, 1.0f),
                    std::make_unique<juce::AudioParameterBool>("masterBypass", "Master Bypass", false)
                })
{
    // Get parameter pointers
    filterEnabled = parameters.getRawParameterValue("filterEnabled");
    filterCutoff = parameters.getRawParameterValue("filterCutoff");
    filterResonance = parameters.getRawParameterValue("filterResonance");
    filterType = parameters.getRawParameterValue("filterType");

    reverbEnabled = parameters.getRawParameterValue("reverbEnabled");
    reverbRoomSize = parameters.getRawParameterValue("reverbRoomSize");
    reverbDamping = parameters.getRawParameterValue("reverbDamping");
    reverbWetDry = parameters.getRawParameterValue("reverbWetDry");

    delayEnabled = parameters.getRawParameterValue("delayEnabled");
    delayTime = parameters.getRawParameterValue("delayTime");
    delayFeedback = parameters.getRawParameterValue("delayFeedback");
    delayWetDry = parameters.getRawParameterValue("delayWetDry");

    lfoRate = parameters.getRawParameterValue("lfoRate");
    lfoDepth = parameters.getRawParameterValue("lfoDepth");
    lfoWaveform = parameters.getRawParameterValue("lfoWaveform");

    masterMix = parameters.getRawParameterValue("masterMix");
    masterBypass = parameters.getRawParameterValue("masterBypass");
}

FlarkDJProcessor::~FlarkDJProcessor()
{
}

//==============================================================================
void FlarkDJProcessor::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    currentSampleRate = sampleRate;
    currentBlockSize = samplesPerBlock;

    initializeFlarkDJ();
}

void FlarkDJProcessor::releaseResources()
{
    // Release any resources
}

void FlarkDJProcessor::initializeFlarkDJ()
{
    // Initialize DSP components with current sample rate
    // This would initialize the FlarkDJ audio engine
    // In production, this would either:
    // 1. Instantiate C++ implementations of the effects
    // 2. Use Node.js N-API to call JavaScript implementations
    // 3. Use WebAssembly compiled from TypeScript
}

bool FlarkDJProcessor::isBusesLayoutSupported(const BusesLayout& layouts) const
{
    // Only stereo is supported
    if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
        return false;

    // Input and output layout must be the same
    if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
        return false;

    return true;
}

void FlarkDJProcessor::processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    juce::ScopedNoDenormals noDenormals;

    auto totalNumInputChannels  = getTotalNumInputChannels();
    auto totalNumOutputChannels = getTotalNumOutputChannels();

    // Clear any output channels that didn't have input channels
    for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
        buffer.clear(i, 0, buffer.getNumSamples());

    // Check bypass
    if (masterBypass->load() > 0.5f)
        return;

    // Get audio buffers
    auto* leftChannel  = buffer.getWritePointer(0);
    auto* rightChannel = buffer.getWritePointer(1);
    auto numSamples = buffer.getNumSamples();

    // Process audio through FlarkDJ engine
    processAudio(leftChannel, rightChannel, leftChannel, rightChannel, numSamples);

    // Apply master mix
    float mix = masterMix->load();
    if (mix < 1.0f)
    {
        auto* leftInput = buffer.getReadPointer(0);
        auto* rightInput = buffer.getReadPointer(1);

        for (int i = 0; i < numSamples; ++i)
        {
            leftChannel[i] = leftInput[i] * (1.0f - mix) + leftChannel[i] * mix;
            rightChannel[i] = rightInput[i] * (1.0f - mix) + rightChannel[i] * mix;
        }
    }
}

void FlarkDJProcessor::processAudio(float* leftIn, float* rightIn,
                                   float* leftOut, float* rightOut, int numSamples)
{
    // This is where the FlarkDJ audio processing happens
    // In a production build, you would:
    // 1. Call C++ implementations of the effects
    // 2. Or use N-API to call JavaScript implementations
    // 3. Or use WebAssembly compiled from TypeScript

    // For now, copy input to output (passthrough)
    std::copy(leftIn, leftIn + numSamples, leftOut);
    std::copy(rightIn, rightIn + numSamples, rightOut);

    // TODO: Implement actual FlarkDJ processing pipeline:
    // - Filter processing
    // - Reverb processing
    // - Delay processing
    // - LFO modulation
}

//==============================================================================
bool FlarkDJProcessor::hasEditor() const
{
    return true;
}

juce::AudioProcessorEditor* FlarkDJProcessor::createEditor()
{
    return new FlarkDJEditor(*this);
}

//==============================================================================
void FlarkDJProcessor::getStateInformation(juce::MemoryBlock& destData)
{
    auto state = parameters.copyState();
    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    copyXmlToBinary(*xml, destData);
}

void FlarkDJProcessor::setStateInformation(const void* data, int sizeInBytes)
{
    std::unique_ptr<juce::XmlElement> xmlState(getXmlFromBinary(data, sizeInBytes));

    if (xmlState.get() != nullptr)
        if (xmlState->hasTagName(parameters.state.getType()))
            parameters.replaceState(juce::ValueTree::fromXml(*xmlState));
}

//==============================================================================
const juce::String FlarkDJProcessor::getName() const
{
    return JucePlugin_Name;
}

bool FlarkDJProcessor::acceptsMidi() const
{
    return true; // For MIDI learn
}

bool FlarkDJProcessor::producesMidi() const
{
    return false;
}

bool FlarkDJProcessor::isMidiEffect() const
{
    return false;
}

double FlarkDJProcessor::getTailLengthSeconds() const
{
    return 4.0; // 4 seconds for reverb tail
}

//==============================================================================
int FlarkDJProcessor::getNumPrograms()
{
    return 1;
}

int FlarkDJProcessor::getCurrentProgram()
{
    return 0;
}

void FlarkDJProcessor::setCurrentProgram(int index)
{
}

const juce::String FlarkDJProcessor::getProgramName(int index)
{
    return {};
}

void FlarkDJProcessor::changeProgramName(int index, const juce::String& newName)
{
}

//==============================================================================
// This creates new instances of the plugin
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new FlarkDJProcessor();
}
