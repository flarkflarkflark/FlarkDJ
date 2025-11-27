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
                        juce::NormalisableRange<float>(20.0f, 20000.0f, 1.0f, 0.3f), 400.0f),
                    std::make_unique<juce::AudioParameterFloat>("filterResonance", "Filter Resonance",
                        0.1f, 10.0f, 3.0f),
                    std::make_unique<juce::AudioParameterChoice>("filterType", "Filter Type",
                        juce::StringArray{"Lowpass", "Highpass", "Bandpass"}, 0),

                    std::make_unique<juce::AudioParameterBool>("reverbEnabled", "Reverb Enabled", false),
                    std::make_unique<juce::AudioParameterFloat>("reverbRoomSize", "Reverb Room Size",
                        0.0f, 1.0f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("reverbDamping", "Reverb Damping",
                        0.0f, 1.0f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("reverbWetDry", "Reverb Wet/Dry",
                        0.0f, 1.0f, 0.6f),

                    std::make_unique<juce::AudioParameterBool>("delayEnabled", "Delay Enabled", false),
                    std::make_unique<juce::AudioParameterFloat>("delayTime", "Delay Time",
                        0.0f, 2.0f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("delayFeedback", "Delay Feedback",
                        0.0f, 0.95f, 0.3f),
                    std::make_unique<juce::AudioParameterFloat>("delayWetDry", "Delay Wet/Dry",
                        0.0f, 1.0f, 0.5f),

                    std::make_unique<juce::AudioParameterBool>("flangerEnabled", "Flanger Enabled", false),
                    std::make_unique<juce::AudioParameterFloat>("flangerRate", "Flanger Rate",
                        juce::NormalisableRange<float>(0.1f, 10.0f, 0.1f), 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("flangerDepth", "Flanger Depth",
                        0.0f, 1.0f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("flangerFeedback", "Flanger Feedback",
                        0.0f, 0.95f, 0.5f),
                    std::make_unique<juce::AudioParameterFloat>("flangerWetDry", "Flanger Wet/Dry",
                        0.0f, 1.0f, 0.5f),

                    std::make_unique<juce::AudioParameterBool>("sidechainEnabled", "Sidechain Enabled", false),
                    std::make_unique<juce::AudioParameterFloat>("sidechainThreshold", "Sidechain Threshold",
                        0.0f, 1.0f, 0.5f),

                    std::make_unique<juce::AudioParameterFloat>("lfoRate", "LFO Rate",
                        juce::NormalisableRange<float>(0.1f, 20.0f, 0.1f, 0.5f), 1.0f),
                    std::make_unique<juce::AudioParameterFloat>("lfoDepth", "LFO Depth",
                        0.0f, 1.0f, 0.3f),
                    std::make_unique<juce::AudioParameterChoice>("lfoWaveform", "LFO Waveform",
                        juce::StringArray{"Sine", "Square", "Triangle", "Sawtooth"}, 0),
                    std::make_unique<juce::AudioParameterBool>("lfoSync", "LFO BPM Sync", false),
                    std::make_unique<juce::AudioParameterChoice>("lfoSyncRate", "LFO Sync Rate",
                        juce::StringArray{"1/4", "1/8", "1/16", "1/32", "1/2", "1 Bar"}, 0),

                    std::make_unique<juce::AudioParameterBool>("isolatorEnabled", "Isolator Enabled", false),
                    std::make_unique<juce::AudioParameterFloat>("isolatorPosition", "Isolator Position",
                        -1.0f, 1.0f, 0.0f),
                    std::make_unique<juce::AudioParameterFloat>("isolatorQ", "Isolator Q",
                        0.5f, 10.0f, 2.0f)
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

    flangerEnabled = parameters.getRawParameterValue("flangerEnabled");
    flangerRate = parameters.getRawParameterValue("flangerRate");
    flangerDepth = parameters.getRawParameterValue("flangerDepth");
    flangerFeedback = parameters.getRawParameterValue("flangerFeedback");
    flangerWetDry = parameters.getRawParameterValue("flangerWetDry");

    sidechainEnabled = parameters.getRawParameterValue("sidechainEnabled");
    sidechainThreshold = parameters.getRawParameterValue("sidechainThreshold");

    lfoRate = parameters.getRawParameterValue("lfoRate");
    lfoDepth = parameters.getRawParameterValue("lfoDepth");
    lfoWaveform = parameters.getRawParameterValue("lfoWaveform");
    lfoSync = parameters.getRawParameterValue("lfoSync");
    lfoSyncRate = parameters.getRawParameterValue("lfoSyncRate");

    isolatorEnabled = parameters.getRawParameterValue("isolatorEnabled");
    isolatorPosition = parameters.getRawParameterValue("isolatorPosition");
    isolatorQ = parameters.getRawParameterValue("isolatorQ");
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
    float sr = static_cast<float>(currentSampleRate);

    filterLeft.setSampleRate(sr);
    filterRight.setSampleRate(sr);

    reverbLeft.setSampleRate(sr);
    reverbRight.setSampleRate(sr);

    delayLeft.setSampleRate(sr);
    delayRight.setSampleRate(sr);

    flangerLeft.setSampleRate(sr);
    flangerRight.setSampleRate(sr);

    isolatorLeft.setSampleRate(sr);
    isolatorRight.setSampleRate(sr);

    lfo.setSampleRate(sr);
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

    // Get audio buffers
    auto* leftChannel  = buffer.getWritePointer(0);
    auto* rightChannel = buffer.getWritePointer(1);
    auto numSamples = buffer.getNumSamples();

    // Process audio through FlarkDJ engine
    processAudio(leftChannel, rightChannel, leftChannel, rightChannel, numSamples);

    // Calculate RMS level for spectrum display
    float rms = 0.0f;
    for (int i = 0; i < numSamples; ++i)
    {
        float sample = (leftChannel[i] + rightChannel[i]) * 0.5f;
        rms += sample * sample;
    }
    rms = std::sqrt(rms / numSamples);
    outputLevel.store(rms);
}

void FlarkDJProcessor::processAudio(float* leftIn, float* rightIn,
                                   float* leftOut, float* rightOut, int numSamples)
{
    // Update effect parameters from UI
    bool filterOn = filterEnabled->load() > 0.5f;
    bool reverbOn = reverbEnabled->load() > 0.5f;
    bool delayOn = delayEnabled->load() > 0.5f;
    bool flangerOn = flangerEnabled->load() > 0.5f;
    bool isolatorOn = isolatorEnabled->load() > 0.5f;

    // Update filter parameters
    if (filterOn)
    {
        filterLeft.setCutoff(filterCutoff->load());
        filterRight.setCutoff(filterCutoff->load());
        filterLeft.setResonance(filterResonance->load());
        filterRight.setResonance(filterResonance->load());

        int filterTypeInt = static_cast<int>(filterType->load());
        filterLeft.setType(static_cast<FlarkButterworthFilter::FilterType>(filterTypeInt));
        filterRight.setType(static_cast<FlarkButterworthFilter::FilterType>(filterTypeInt));
    }

    // Update reverb parameters
    if (reverbOn)
    {
        reverbLeft.setRoomSize(reverbRoomSize->load());
        reverbRight.setRoomSize(reverbRoomSize->load());
        reverbLeft.setDamping(reverbDamping->load());
        reverbRight.setDamping(reverbDamping->load());
        reverbLeft.setWetDryMix(reverbWetDry->load());
        reverbRight.setWetDryMix(reverbWetDry->load());
    }

    // Update delay parameters
    if (delayOn)
    {
        delayLeft.setDelayTime(delayTime->load());
        delayRight.setDelayTime(delayTime->load());
        delayLeft.setFeedback(delayFeedback->load());
        delayRight.setFeedback(delayFeedback->load());
        delayLeft.setWetDryMix(delayWetDry->load());
        delayRight.setWetDryMix(delayWetDry->load());
    }

    // Update flanger parameters
    if (flangerOn)
    {
        flangerLeft.setRate(flangerRate->load());
        flangerRight.setRate(flangerRate->load());
        flangerLeft.setDepth(flangerDepth->load());
        flangerRight.setDepth(flangerDepth->load());
        flangerLeft.setFeedback(flangerFeedback->load());
        flangerRight.setFeedback(flangerFeedback->load());
        flangerLeft.setWetDryMix(flangerWetDry->load());
        flangerRight.setWetDryMix(flangerWetDry->load());
    }

    // Update isolator parameters
    if (isolatorOn)
    {
        isolatorLeft.setPosition(isolatorPosition->load());
        isolatorRight.setPosition(isolatorPosition->load());
        isolatorLeft.setQ(isolatorQ->load());
        isolatorRight.setQ(isolatorQ->load());
    }

    // Update LFO parameters
    lfo.setRate(lfoRate->load());
    int lfoWaveformInt = static_cast<int>(lfoWaveform->load());
    lfo.setWaveform(static_cast<FlarkLFO::Waveform>(lfoWaveformInt));

    // BPM sync
    bool syncEnabled = lfoSync->load() > 0.5f;
    lfo.setSyncEnabled(syncEnabled);
    if (syncEnabled)
    {
        auto playHead = getPlayHead();
        if (playHead != nullptr)
        {
            if (auto posInfo = playHead->getPosition())
            {
                if (posInfo->getBpm().hasValue())
                {
                    lfo.setBPM(*posInfo->getBpm());
                }
            }
        }
        int syncRateInt = static_cast<int>(lfoSyncRate->load());
        lfo.setSyncRate(syncRateInt);
    }

    // Process each sample
    for (int i = 0; i < numSamples; ++i)
    {
        float leftSample = leftIn[i];
        float rightSample = rightIn[i];

        // Get LFO value for modulation
        float lfoValue = lfo.process();
        float lfoDepthValue = lfoDepth->load();

        // Apply filter with LFO modulation on cutoff
        if (filterOn)
        {
            // LFO modulates cutoff with much wider range (up to 3x variation)
            float cutoffMod = filterCutoff->load() * (1.0f + lfoValue * lfoDepthValue * 3.0f);
            filterLeft.setCutoff(cutoffMod);
            filterRight.setCutoff(cutoffMod);

            leftSample = filterLeft.process(leftSample);
            rightSample = filterRight.process(rightSample);
        }

        // Apply reverb
        if (reverbOn)
        {
            leftSample = reverbLeft.process(leftSample);
            rightSample = reverbRight.process(rightSample);
        }

        // Apply delay
        if (delayOn)
        {
            leftSample = delayLeft.process(leftSample);
            rightSample = delayRight.process(rightSample);
        }

        // Apply flanger
        if (flangerOn)
        {
            leftSample = flangerLeft.process(leftSample);
            rightSample = flangerRight.process(rightSample);
        }

        // Apply isolator (DJ-style filter sweep)
        if (isolatorOn)
        {
            leftSample = isolatorLeft.process(leftSample);
            rightSample = isolatorRight.process(rightSample);
        }

        // ========== OUTPUT LIMITER ==========
        // Soft limiting to prevent clipping and channel muting in DAWs
        // Uses tanh for smooth saturation with threshold at -0.5dB (~0.95)
        const float threshold = 0.95f;
        const float makeup = 1.0f / threshold; // Compensate for threshold reduction

        // Soft clip using tanh for smooth saturation
        leftSample = std::tanh(leftSample * makeup) * threshold;
        rightSample = std::tanh(rightSample * makeup) * threshold;

        // Write to output
        leftOut[i] = leftSample;
        rightOut[i] = rightSample;
    }
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
