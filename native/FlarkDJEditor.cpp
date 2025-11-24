#include "FlarkDJEditor.h"

//==============================================================================
FlarkDJEditor::FlarkDJEditor(FlarkDJProcessor& p)
    : AudioProcessorEditor(&p), audioProcessor(p)
{
    setSize(800, 600);

    auto& params = audioProcessor.getParameters();

    // Filter section
    addAndMakeVisible(filterEnabledButton);
    filterEnabledButton.setButtonText("Filter");
    filterEnabledAttachment.reset(new ButtonAttachment(params, "filterEnabled", filterEnabledButton));

    addAndMakeVisible(filterCutoffSlider);
    setupSlider(filterCutoffSlider);
    filterCutoffAttachment.reset(new SliderAttachment(params, "filterCutoff", filterCutoffSlider));
    createLabel("Cutoff", filterCutoffSlider);

    addAndMakeVisible(filterResonanceSlider);
    setupSlider(filterResonanceSlider);
    filterResonanceAttachment.reset(new SliderAttachment(params, "filterResonance", filterResonanceSlider));
    createLabel("Resonance", filterResonanceSlider);

    addAndMakeVisible(filterTypeCombo);
    filterTypeCombo.addItemList(juce::StringArray{"Lowpass", "Highpass", "Bandpass"}, 1);
    filterTypeAttachment.reset(new ComboBoxAttachment(params, "filterType", filterTypeCombo));

    // Reverb section
    addAndMakeVisible(reverbEnabledButton);
    reverbEnabledButton.setButtonText("Reverb");
    reverbEnabledAttachment.reset(new ButtonAttachment(params, "reverbEnabled", reverbEnabledButton));

    addAndMakeVisible(reverbRoomSizeSlider);
    setupSlider(reverbRoomSizeSlider);
    reverbRoomSizeAttachment.reset(new SliderAttachment(params, "reverbRoomSize", reverbRoomSizeSlider));
    createLabel("Room Size", reverbRoomSizeSlider);

    addAndMakeVisible(reverbDampingSlider);
    setupSlider(reverbDampingSlider);
    reverbDampingAttachment.reset(new SliderAttachment(params, "reverbDamping", reverbDampingSlider));
    createLabel("Damping", reverbDampingSlider);

    addAndMakeVisible(reverbWetDrySlider);
    setupSlider(reverbWetDrySlider);
    reverbWetDryAttachment.reset(new SliderAttachment(params, "reverbWetDry", reverbWetDrySlider));
    createLabel("Wet/Dry", reverbWetDrySlider);

    // Delay section
    addAndMakeVisible(delayEnabledButton);
    delayEnabledButton.setButtonText("Delay");
    delayEnabledAttachment.reset(new ButtonAttachment(params, "delayEnabled", delayEnabledButton));

    addAndMakeVisible(delayTimeSlider);
    setupSlider(delayTimeSlider);
    delayTimeAttachment.reset(new SliderAttachment(params, "delayTime", delayTimeSlider));
    createLabel("Time", delayTimeSlider);

    addAndMakeVisible(delayFeedbackSlider);
    setupSlider(delayFeedbackSlider);
    delayFeedbackAttachment.reset(new SliderAttachment(params, "delayFeedback", delayFeedbackSlider));
    createLabel("Feedback", delayFeedbackSlider);

    addAndMakeVisible(delayWetDrySlider);
    setupSlider(delayWetDrySlider);
    delayWetDryAttachment.reset(new SliderAttachment(params, "delayWetDry", delayWetDrySlider));
    createLabel("Wet/Dry", delayWetDrySlider);

    // LFO section
    addAndMakeVisible(lfoRateSlider);
    setupSlider(lfoRateSlider);
    lfoRateAttachment.reset(new SliderAttachment(params, "lfoRate", lfoRateSlider));
    createLabel("LFO Rate", lfoRateSlider);

    addAndMakeVisible(lfoDepthSlider);
    setupSlider(lfoDepthSlider);
    lfoDepthAttachment.reset(new SliderAttachment(params, "lfoDepth", lfoDepthSlider));
    createLabel("LFO Depth", lfoDepthSlider);

    addAndMakeVisible(lfoWaveformCombo);
    lfoWaveformCombo.addItemList(juce::StringArray{"Sine", "Square", "Triangle", "Sawtooth"}, 1);
    lfoWaveformAttachment.reset(new ComboBoxAttachment(params, "lfoWaveform", lfoWaveformCombo));

    // Master section
    addAndMakeVisible(masterMixSlider);
    setupSlider(masterMixSlider, juce::Slider::LinearHorizontal);
    masterMixAttachment.reset(new SliderAttachment(params, "masterMix", masterMixSlider));
    createLabel("Mix", masterMixSlider);

    addAndMakeVisible(masterBypassButton);
    masterBypassButton.setButtonText("Bypass");
    masterBypassAttachment.reset(new ButtonAttachment(params, "masterBypass", masterBypassButton));
}

FlarkDJEditor::~FlarkDJEditor()
{
}

//==============================================================================
void FlarkDJEditor::paint(juce::Graphics& g)
{
    g.fillAll(juce::Colours::darkgrey);

    g.setColour(juce::Colours::white);
    g.setFont(24.0f);
    g.drawText("FlarkDJ", getLocalBounds().removeFromTop(50), juce::Justification::centred);

    // Draw section boxes
    g.setColour(juce::Colours::grey);
    g.drawRect(10, 60, 190, 250, 2);
    g.drawRect(210, 60, 190, 250, 2);
    g.drawRect(410, 60, 190, 250, 2);
    g.drawRect(610, 60, 180, 250, 2);
    g.drawRect(10, 320, 780, 120, 2);

    g.setFont(14.0f);
    g.drawText("FILTER", 10, 60, 190, 20, juce::Justification::centred);
    g.drawText("REVERB", 210, 60, 190, 20, juce::Justification::centred);
    g.drawText("DELAY", 410, 60, 190, 20, juce::Justification::centred);
    g.drawText("LFO", 610, 60, 180, 20, juce::Justification::centred);
    g.drawText("MASTER", 10, 320, 780, 20, juce::Justification::centred);
}

void FlarkDJEditor::resized()
{
    auto area = getLocalBounds();
    area.removeFromTop(60); // Title space

    // Filter section
    auto filterArea = area.removeFromLeft(200).reduced(15);
    filterEnabledButton.setBounds(filterArea.removeFromTop(30));
    filterArea.removeFromTop(20); // Label
    filterCutoffSlider.setBounds(filterArea.removeFromTop(80));
    filterArea.removeFromTop(20); // Label
    filterResonanceSlider.setBounds(filterArea.removeFromTop(80));
    filterArea.removeFromTop(10);
    filterTypeCombo.setBounds(filterArea.removeFromTop(25));

    // Reverb section
    auto reverbArea = area.removeFromLeft(200).reduced(15);
    reverbEnabledButton.setBounds(reverbArea.removeFromTop(30));
    reverbArea.removeFromTop(20);
    reverbRoomSizeSlider.setBounds(reverbArea.removeFromTop(60));
    reverbArea.removeFromTop(20);
    reverbDampingSlider.setBounds(reverbArea.removeFromTop(60));
    reverbArea.removeFromTop(20);
    reverbWetDrySlider.setBounds(reverbArea.removeFromTop(60));

    // Delay section
    auto delayArea = area.removeFromLeft(200).reduced(15);
    delayEnabledButton.setBounds(delayArea.removeFromTop(30));
    delayArea.removeFromTop(20);
    delayTimeSlider.setBounds(delayArea.removeFromTop(60));
    delayArea.removeFromTop(20);
    delayFeedbackSlider.setBounds(delayArea.removeFromTop(60));
    delayArea.removeFromTop(20);
    delayWetDrySlider.setBounds(delayArea.removeFromTop(60));

    // LFO section
    auto lfoArea = area.removeFromLeft(200).reduced(15);
    lfoArea.removeFromTop(10);
    lfoRateSlider.setBounds(lfoArea.removeFromTop(80));
    lfoArea.removeFromTop(20);
    lfoDepthSlider.setBounds(lfoArea.removeFromTop(80));
    lfoArea.removeFromTop(10);
    lfoWaveformCombo.setBounds(lfoArea.removeFromTop(25));

    // Master section
    area.removeFromTop(270); // Skip to bottom
    auto masterArea = area.reduced(15);
    masterArea.removeFromTop(30);
    masterBypassButton.setBounds(masterArea.removeFromTop(30));
    masterArea.removeFromTop(10);
    masterMixSlider.setBounds(masterArea.removeFromTop(40));
}

//==============================================================================
void FlarkDJEditor::setupSlider(juce::Slider& slider, juce::Slider::SliderStyle style)
{
    slider.setSliderStyle(style);
    slider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
}

juce::Label* FlarkDJEditor::createLabel(const juce::String& text, juce::Component& attachTo)
{
    auto label = std::make_unique<juce::Label>();
    label->setText(text, juce::dontSendNotification);
    label->setJustificationType(juce::Justification::centred);
    label->attachToComponent(&attachTo, false);
    addAndMakeVisible(*label);

    auto* labelPtr = label.get();
    labels.push_back(std::move(label));
    return labelPtr;
}
