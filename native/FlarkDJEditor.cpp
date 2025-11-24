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
    filterEnabledButton.setColour(juce::ToggleButton::tickColourId, juce::Colour(0xffff6600));
    filterEnabledButton.setColour(juce::ToggleButton::tickDisabledColourId, juce::Colour(0xff3a3a3a));
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
    filterTypeCombo.setColour(juce::ComboBox::backgroundColourId, juce::Colour(0xff1a1a1a));
    filterTypeCombo.setColour(juce::ComboBox::outlineColourId, juce::Colour(0xffff6600).withAlpha(0.4f));
    filterTypeCombo.setColour(juce::ComboBox::textColourId, juce::Colours::white);
    filterTypeCombo.setColour(juce::ComboBox::arrowColourId, juce::Colour(0xffff6600));
    filterTypeAttachment.reset(new ComboBoxAttachment(params, "filterType", filterTypeCombo));

    // Reverb section
    addAndMakeVisible(reverbEnabledButton);
    reverbEnabledButton.setButtonText("Reverb");
    reverbEnabledButton.setColour(juce::ToggleButton::tickColourId, juce::Colour(0xffff6600));
    reverbEnabledButton.setColour(juce::ToggleButton::tickDisabledColourId, juce::Colour(0xff3a3a3a));
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
    delayEnabledButton.setColour(juce::ToggleButton::tickColourId, juce::Colour(0xffff6600));
    delayEnabledButton.setColour(juce::ToggleButton::tickDisabledColourId, juce::Colour(0xff3a3a3a));
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
    lfoWaveformCombo.setColour(juce::ComboBox::backgroundColourId, juce::Colour(0xff1a1a1a));
    lfoWaveformCombo.setColour(juce::ComboBox::outlineColourId, juce::Colour(0xffff6600).withAlpha(0.4f));
    lfoWaveformCombo.setColour(juce::ComboBox::textColourId, juce::Colours::white);
    lfoWaveformCombo.setColour(juce::ComboBox::arrowColourId, juce::Colour(0xffff6600));
    lfoWaveformAttachment.reset(new ComboBoxAttachment(params, "lfoWaveform", lfoWaveformCombo));

    // Master section
    addAndMakeVisible(masterMixSlider);
    setupSlider(masterMixSlider, juce::Slider::LinearHorizontal);
    masterMixAttachment.reset(new SliderAttachment(params, "masterMix", masterMixSlider));
    createLabel("Mix", masterMixSlider);

    addAndMakeVisible(masterBypassButton);
    masterBypassButton.setButtonText("Bypass");
    masterBypassButton.setColour(juce::ToggleButton::tickColourId, juce::Colour(0xffff6600));
    masterBypassButton.setColour(juce::ToggleButton::tickDisabledColourId, juce::Colour(0xff3a3a3a));
    masterBypassAttachment.reset(new ButtonAttachment(params, "masterBypass", masterBypassButton));
}

FlarkDJEditor::~FlarkDJEditor()
{
}

//==============================================================================
void FlarkDJEditor::paint(juce::Graphics& g)
{
    // Background gradient
    auto bounds = getLocalBounds();
    juce::ColourGradient bgGradient(
        juce::Colour(0xff1a1a1a), 0.0f, 0.0f,
        juce::Colour(0xff0d0d0d), 0.0f, static_cast<float>(getHeight()),
        false
    );
    g.setGradientFill(bgGradient);
    g.fillAll();

    // Logo/Title area with gradient background
    auto logoArea = bounds.removeFromTop(90);
    juce::ColourGradient logoGradient(
        juce::Colour(0xff2a2a2a), logoArea.getX(), logoArea.getY(),
        juce::Colour(0xff1a1a1a), logoArea.getX(), logoArea.getBottom(),
        false
    );
    g.setGradientFill(logoGradient);
    g.fillRect(logoArea);

    // Draw "FlarkDJ" title with glow effect
    auto titleBounds = logoArea.reduced(10);
    juce::Colour orangeGlow(0xffff6600);

    // Multi-pass glow effect
    for (int i = 3; i > 0; --i)
    {
        g.setColour(orangeGlow.withAlpha(0.15f * i));
        g.setFont(juce::Font(42.0f + i * 2, juce::Font::bold));
        g.drawText("FlarkDJ", titleBounds, juce::Justification::centred);
    }

    // Main title text
    g.setColour(juce::Colours::white);
    g.setFont(juce::Font(42.0f, juce::Font::bold));
    g.drawText("FlarkDJ", titleBounds, juce::Justification::centred);

    // Subtitle
    g.setColour(orangeGlow);
    g.setFont(juce::Font(13.0f));
    auto subtitleArea = titleBounds.removeFromBottom(20);
    g.drawText("Professional DJ Toolkit", subtitleArea, juce::Justification::centred);

    // Orange accent line below logo
    g.setColour(orangeGlow);
    g.fillRect(0, 90, getWidth(), 3);

    // Draw section boxes with enhanced borders
    juce::Colour borderColour = orangeGlow.withAlpha(0.6f);
    g.setColour(borderColour);

    // Thicker borders (3px)
    g.drawRect(10, 103, 190, 250, 3);
    g.drawRect(210, 103, 190, 250, 3);
    g.drawRect(410, 103, 190, 250, 3);
    g.drawRect(610, 103, 180, 250, 3);
    g.drawRect(10, 363, 780, 120, 3);

    // Section titles with glow
    g.setFont(juce::Font(14.0f, juce::Font::bold));

    // Glow for section titles
    g.setColour(orangeGlow.withAlpha(0.3f));
    g.drawText("FILTER", 10, 103, 190, 22, juce::Justification::centred);
    g.drawText("REVERB", 210, 103, 190, 22, juce::Justification::centred);
    g.drawText("DELAY", 410, 103, 190, 22, juce::Justification::centred);
    g.drawText("LFO", 610, 103, 180, 22, juce::Justification::centred);
    g.drawText("MASTER", 10, 363, 780, 22, juce::Justification::centred);

    // Main text
    g.setColour(juce::Colours::white);
    g.drawText("FILTER", 10, 103, 190, 22, juce::Justification::centred);
    g.drawText("REVERB", 210, 103, 190, 22, juce::Justification::centred);
    g.drawText("DELAY", 410, 103, 190, 22, juce::Justification::centred);
    g.drawText("LFO", 610, 103, 180, 22, juce::Justification::centred);
    g.drawText("MASTER", 10, 363, 780, 22, juce::Justification::centred);

    // Add subtle inner shadows for depth
    g.setColour(juce::Colours::black.withAlpha(0.3f));
    g.drawRect(10, 103, 190, 250, 1);
    g.drawRect(210, 103, 190, 250, 1);
    g.drawRect(410, 103, 190, 250, 1);
    g.drawRect(610, 103, 180, 250, 1);
    g.drawRect(10, 363, 780, 120, 1);
}

void FlarkDJEditor::resized()
{
    auto area = getLocalBounds();
    area.removeFromTop(93); // Logo area (90px) + accent line (3px)

    // Filter section
    auto filterArea = area.removeFromLeft(200).reduced(18, 15);
    filterArea.removeFromTop(25); // Section title space
    filterEnabledButton.setBounds(filterArea.removeFromTop(30));
    filterArea.removeFromTop(20); // Label
    filterCutoffSlider.setBounds(filterArea.removeFromTop(70));
    filterArea.removeFromTop(20); // Label
    filterResonanceSlider.setBounds(filterArea.removeFromTop(70));
    filterArea.removeFromTop(10);
    filterTypeCombo.setBounds(filterArea.removeFromTop(25));

    // Reverb section
    auto reverbArea = area.removeFromLeft(200).reduced(18, 15);
    reverbArea.removeFromTop(25); // Section title space
    reverbEnabledButton.setBounds(reverbArea.removeFromTop(30));
    reverbArea.removeFromTop(20);
    reverbRoomSizeSlider.setBounds(reverbArea.removeFromTop(55));
    reverbArea.removeFromTop(20);
    reverbDampingSlider.setBounds(reverbArea.removeFromTop(55));
    reverbArea.removeFromTop(20);
    reverbWetDrySlider.setBounds(reverbArea.removeFromTop(55));

    // Delay section
    auto delayArea = area.removeFromLeft(200).reduced(18, 15);
    delayArea.removeFromTop(25); // Section title space
    delayEnabledButton.setBounds(delayArea.removeFromTop(30));
    delayArea.removeFromTop(20);
    delayTimeSlider.setBounds(delayArea.removeFromTop(55));
    delayArea.removeFromTop(20);
    delayFeedbackSlider.setBounds(delayArea.removeFromTop(55));
    delayArea.removeFromTop(20);
    delayWetDrySlider.setBounds(delayArea.removeFromTop(55));

    // LFO section
    auto lfoArea = area.removeFromLeft(200).reduced(18, 15);
    lfoArea.removeFromTop(25); // Section title space
    lfoArea.removeFromTop(5);
    lfoRateSlider.setBounds(lfoArea.removeFromTop(75));
    lfoArea.removeFromTop(20);
    lfoDepthSlider.setBounds(lfoArea.removeFromTop(75));
    lfoArea.removeFromTop(10);
    lfoWaveformCombo.setBounds(lfoArea.removeFromTop(25));

    // Master section
    area.removeFromTop(260); // Skip to bottom
    auto masterArea = area.reduced(18, 15);
    masterArea.removeFromTop(25); // Section title space
    masterBypassButton.setBounds(masterArea.removeFromTop(30));
    masterArea.removeFromTop(10);
    masterMixSlider.setBounds(masterArea.removeFromTop(40));
}

//==============================================================================
void FlarkDJEditor::setupSlider(juce::Slider& slider, juce::Slider::SliderStyle style)
{
    slider.setSliderStyle(style);
    slider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);

    // Apply professional color scheme
    slider.setColour(juce::Slider::thumbColourId, juce::Colour(0xffff6600));
    slider.setColour(juce::Slider::trackColourId, juce::Colour(0xffff6600).withAlpha(0.6f));
    slider.setColour(juce::Slider::rotarySliderFillColourId, juce::Colour(0xffff6600));
    slider.setColour(juce::Slider::rotarySliderOutlineColourId, juce::Colour(0xff3a3a3a));
    slider.setColour(juce::Slider::textBoxTextColourId, juce::Colours::white);
    slider.setColour(juce::Slider::textBoxBackgroundColourId, juce::Colour(0xff1a1a1a));
    slider.setColour(juce::Slider::textBoxOutlineColourId, juce::Colour(0xff3a3a3a));
}

juce::Label* FlarkDJEditor::createLabel(const juce::String& text, juce::Component& attachTo)
{
    auto label = std::make_unique<juce::Label>();
    label->setText(text, juce::dontSendNotification);
    label->setJustificationType(juce::Justification::centred);
    label->attachToComponent(&attachTo, false);

    // Apply professional label styling
    label->setColour(juce::Label::textColourId, juce::Colour(0xffcccccc));
    label->setFont(juce::Font(11.0f));

    addAndMakeVisible(*label);

    auto* labelPtr = label.get();
    labels.push_back(std::move(label));
    return labelPtr;
}
