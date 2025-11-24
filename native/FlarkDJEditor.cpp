#include "FlarkDJEditor.h"

//==============================================================================
FlarkDJEditor::FlarkDJEditor(FlarkDJProcessor& p)
    : AudioProcessorEditor(&p), audioProcessor(p)
{
    auto& params = audioProcessor.getParameters();

    // Create spectrum analyzer
    spectrumAnalyzer = std::make_unique<SpectrumAnalyzer>(audioProcessor);
    addAndMakeVisible(*spectrumAnalyzer);

    // Create XY Pad
    xyPad = std::make_unique<XYPad>();
    addAndMakeVisible(*xyPad);

    // ========== FILTER SECTION ==========
    addAndMakeVisible(filterEnabledButton);
    setupButton(filterEnabledButton);
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
    setupComboBox(filterTypeCombo);
    filterTypeCombo.addItemList(juce::StringArray{"Lowpass", "Highpass", "Bandpass"}, 1);
    filterTypeAttachment.reset(new ComboBoxAttachment(params, "filterType", filterTypeCombo));

    // Sidechain controls
    addAndMakeVisible(sidechainEnabledButton);
    setupButton(sidechainEnabledButton);
    sidechainEnabledButton.setButtonText("Sidechain");
    sidechainEnabledAttachment.reset(new ButtonAttachment(params, "sidechainEnabled", sidechainEnabledButton));

    addAndMakeVisible(sidechainThresholdSlider);
    setupSlider(sidechainThresholdSlider, juce::Slider::LinearHorizontal);
    sidechainThresholdAttachment.reset(new SliderAttachment(params, "sidechainThreshold", sidechainThresholdSlider));
    createLabel("SC Threshold", sidechainThresholdSlider);

    // ========== REVERB SECTION ==========
    addAndMakeVisible(reverbEnabledButton);
    setupButton(reverbEnabledButton);
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

    // ========== DELAY SECTION ==========
    addAndMakeVisible(delayEnabledButton);
    setupButton(delayEnabledButton);
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

    // ========== FLANGER SECTION ==========
    addAndMakeVisible(flangerEnabledButton);
    setupButton(flangerEnabledButton);
    flangerEnabledButton.setButtonText("Flanger");
    flangerEnabledAttachment.reset(new ButtonAttachment(params, "flangerEnabled", flangerEnabledButton));

    addAndMakeVisible(flangerRateSlider);
    setupSlider(flangerRateSlider);
    flangerRateAttachment.reset(new SliderAttachment(params, "flangerRate", flangerRateSlider));
    createLabel("Rate", flangerRateSlider);

    addAndMakeVisible(flangerDepthSlider);
    setupSlider(flangerDepthSlider);
    flangerDepthAttachment.reset(new SliderAttachment(params, "flangerDepth", flangerDepthSlider));
    createLabel("Depth", flangerDepthSlider);

    addAndMakeVisible(flangerFeedbackSlider);
    setupSlider(flangerFeedbackSlider);
    flangerFeedbackAttachment.reset(new SliderAttachment(params, "flangerFeedback", flangerFeedbackSlider));
    createLabel("Feedback", flangerFeedbackSlider);

    // ========== LFO SECTION ==========
    addAndMakeVisible(lfoRateSlider);
    setupSlider(lfoRateSlider);
    lfoRateAttachment.reset(new SliderAttachment(params, "lfoRate", lfoRateSlider));
    createLabel("LFO Rate", lfoRateSlider);

    addAndMakeVisible(lfoDepthSlider);
    setupSlider(lfoDepthSlider);
    lfoDepthAttachment.reset(new SliderAttachment(params, "lfoDepth", lfoDepthSlider));
    createLabel("LFO Depth", lfoDepthSlider);

    addAndMakeVisible(lfoWaveformCombo);
    setupComboBox(lfoWaveformCombo);
    lfoWaveformCombo.addItemList(juce::StringArray{"Sine", "Square", "Triangle", "Sawtooth"}, 1);
    lfoWaveformAttachment.reset(new ComboBoxAttachment(params, "lfoWaveform", lfoWaveformCombo));

    // ========== MACRO SECTION ==========
    addAndMakeVisible(macro1Slider);
    setupSlider(macro1Slider);
    createLabel("Macro 1", macro1Slider);

    addAndMakeVisible(macro2Slider);
    setupSlider(macro2Slider);
    createLabel("Macro 2", macro2Slider);

    addAndMakeVisible(macro3Slider);
    setupSlider(macro3Slider);
    createLabel("Macro 3", macro3Slider);

    addAndMakeVisible(macro4Slider);
    setupSlider(macro4Slider);
    createLabel("Macro 4", macro4Slider);

    // ========== MASTER SECTION ==========
    addAndMakeVisible(masterMixSlider);
    setupSlider(masterMixSlider, juce::Slider::LinearHorizontal);
    masterMixAttachment.reset(new SliderAttachment(params, "masterMix", masterMixSlider));
    createLabel("Mix", masterMixSlider);

    addAndMakeVisible(masterBypassButton);
    setupButton(masterBypassButton);
    masterBypassButton.setButtonText("Bypass");
    masterBypassAttachment.reset(new ButtonAttachment(params, "masterBypass", masterBypassButton));

    // Enable resizing with constraints (AFTER all components are initialized)
    setResizable(true, true);
    setResizeLimits(900, 700, 1600, 1200);
    setSize(1200, 800);
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

    // Logo/Title area with enhanced gradient
    auto logoArea = bounds.removeFromTop(80);
    juce::ColourGradient logoGradient(
        juce::Colour(0xff2a2a2a), logoArea.getX(), logoArea.getY(),
        juce::Colour(0xff1a1a1a), logoArea.getX(), logoArea.getBottom(),
        false
    );
    g.setGradientFill(logoGradient);
    g.fillRect(logoArea);

    // Draw FlarkDJ logo - clean bold text style
    juce::Colour orangeGlow(0xffff6600);
    auto titleBounds = logoArea.reduced(10);

    // Main logo text with glow effect
    juce::Font logoFont(48.0f, juce::Font::bold);
    g.setFont(logoFont);

    // Draw glow layers
    for (int i = 3; i > 0; --i)
    {
        g.setColour(orangeGlow.withAlpha(0.15f * i));
        g.drawText("FlarkDJ", titleBounds.expanded(i * 2), juce::Justification::centred);
    }

    // Draw main text
    g.setColour(orangeGlow);
    g.drawText("FlarkDJ", titleBounds, juce::Justification::centred);

    // Subtitle
    g.setColour(orangeGlow.withAlpha(0.7f));
    g.setFont(juce::Font(11.0f));
    g.drawText("DJ Effects Plugin", titleBounds.getX(), titleBounds.getBottom() - 18,
               titleBounds.getWidth(), 15, juce::Justification::centred);

    // Orange accent line with glow
    g.setColour(orangeGlow.withAlpha(0.3f));
    g.fillRect(0, 79, getWidth(), 5);
    g.setColour(orangeGlow);
    g.fillRect(0, 80, getWidth(), 3);

    // Calculate section sizes based on current window size
    float scale = getWidth() / 1200.0f;
    int sectionWidth = static_cast<int>(220 * scale);
    int sectionHeight = 220;
    int visualHeight = 180;

    // Section borders
    juce::Colour borderColour = orangeGlow.withAlpha(0.7f);
    g.setColour(borderColour);

    int yPos = 93;
    int xPos = 10;
    int spacing = 10;

    // Top row - Effects (Filter, Reverb, Delay, Flanger, LFO)
    for (int i = 0; i < 5; ++i)
    {
        g.drawRect(xPos + i * (sectionWidth + spacing), yPos, sectionWidth, sectionHeight, 3);
    }

    // Middle row - Macros and XY Pad
    yPos += sectionHeight + spacing;
    g.drawRect(xPos, yPos, sectionWidth * 2 + spacing, visualHeight, 3);
    g.drawRect(xPos + sectionWidth * 2 + spacing * 2, yPos, sectionWidth * 3 + spacing * 2, visualHeight, 3);

    // Bottom row - Master + Spectrum
    yPos += visualHeight + spacing;
    int masterWidth = static_cast<int>((getWidth() - 20));
    g.drawRect(xPos, yPos, masterWidth, 150, 3);

    // Section titles with glow effect
    g.setFont(juce::Font(13.0f, juce::Font::bold));
    yPos = 93;

    const char* titles[] = {"FILTER", "REVERB", "DELAY", "FLANGER", "LFO"};
    for (int i = 0; i < 5; ++i)
    {
        int titleX = xPos + i * (sectionWidth + spacing);

        // Glow
        g.setColour(orangeGlow.withAlpha(0.4f));
        g.drawText(titles[i], titleX, yPos, sectionWidth, 20, juce::Justification::centred);

        // Main text
        g.setColour(juce::Colours::white);
        g.drawText(titles[i], titleX, yPos, sectionWidth, 20, juce::Justification::centred);
    }

    // Macros and Spectrum titles
    yPos += sectionHeight + spacing;
    g.setColour(orangeGlow.withAlpha(0.4f));
    g.drawText("MACROS", xPos, yPos, sectionWidth * 2 + spacing, 20, juce::Justification::centred);
    g.setColour(juce::Colours::white);
    g.drawText("MACROS", xPos, yPos, sectionWidth * 2 + spacing, 20, juce::Justification::centred);

    // Master title
    yPos += visualHeight + spacing;
    g.setColour(orangeGlow.withAlpha(0.4f));
    g.drawText("MASTER & SPECTRUM ANALYZER", xPos, yPos, masterWidth, 20, juce::Justification::centred);
    g.setColour(juce::Colours::white);
    g.drawText("MASTER & SPECTRUM ANALYZER", xPos, yPos, masterWidth, 20, juce::Justification::centred);
}

void FlarkDJEditor::resized()
{
    auto area = getLocalBounds();
    area.removeFromTop(83); // Logo area + accent line

    float scale = getWidth() / 1200.0f;
    int sectionWidth = static_cast<int>(220 * scale);
    int sectionHeight = 220;
    int visualHeight = 180;
    int spacing = 10;

    // ========== TOP ROW - EFFECTS ==========
    auto topRow = area.removeFromTop(sectionHeight);

    // Filter section
    auto filterArea = topRow.removeFromLeft(sectionWidth).reduced(15, 15);
    filterArea.removeFromTop(25); // Title space
    filterEnabledButton.setBounds(filterArea.removeFromTop(25));
    filterArea.removeFromTop(12);
    filterCutoffSlider.setBounds(filterArea.removeFromTop(75));
    filterArea.removeFromTop(12);
    filterResonanceSlider.setBounds(filterArea.removeFromTop(75));
    filterArea.removeFromTop(8);
    filterTypeCombo.setBounds(filterArea.removeFromTop(22));
    topRow.removeFromLeft(spacing);

    // Reverb section
    auto reverbArea = topRow.removeFromLeft(sectionWidth).reduced(15, 15);
    reverbArea.removeFromTop(25);
    reverbEnabledButton.setBounds(reverbArea.removeFromTop(25));
    reverbArea.removeFromTop(12);
    reverbRoomSizeSlider.setBounds(reverbArea.removeFromTop(65));
    reverbArea.removeFromTop(12);
    reverbDampingSlider.setBounds(reverbArea.removeFromTop(65));
    reverbArea.removeFromTop(12);
    reverbWetDrySlider.setBounds(reverbArea.removeFromTop(65));
    topRow.removeFromLeft(spacing);

    // Delay section
    auto delayArea = topRow.removeFromLeft(sectionWidth).reduced(15, 15);
    delayArea.removeFromTop(25);
    delayEnabledButton.setBounds(delayArea.removeFromTop(25));
    delayArea.removeFromTop(12);
    delayTimeSlider.setBounds(delayArea.removeFromTop(65));
    delayArea.removeFromTop(12);
    delayFeedbackSlider.setBounds(delayArea.removeFromTop(65));
    delayArea.removeFromTop(12);
    delayWetDrySlider.setBounds(delayArea.removeFromTop(65));
    topRow.removeFromLeft(spacing);

    // Flanger section
    auto flangerArea = topRow.removeFromLeft(sectionWidth).reduced(15, 15);
    flangerArea.removeFromTop(25);
    flangerEnabledButton.setBounds(flangerArea.removeFromTop(25));
    flangerArea.removeFromTop(12);
    flangerRateSlider.setBounds(flangerArea.removeFromTop(65));
    flangerArea.removeFromTop(12);
    flangerDepthSlider.setBounds(flangerArea.removeFromTop(65));
    flangerArea.removeFromTop(12);
    flangerFeedbackSlider.setBounds(flangerArea.removeFromTop(65));
    topRow.removeFromLeft(spacing);

    // LFO section
    auto lfoArea = topRow.removeFromLeft(sectionWidth).reduced(15, 15);
    lfoArea.removeFromTop(25);
    lfoArea.removeFromTop(5);
    lfoRateSlider.setBounds(lfoArea.removeFromTop(80));
    lfoArea.removeFromTop(12);
    lfoDepthSlider.setBounds(lfoArea.removeFromTop(80));
    lfoArea.removeFromTop(8);
    lfoWaveformCombo.setBounds(lfoArea.removeFromTop(22));

    area.removeFromTop(spacing);

    // ========== MIDDLE ROW - MACROS & XY PAD ==========
    auto middleRow = area.removeFromTop(visualHeight);

    // Macros section (4 knobs)
    auto macroArea = middleRow.removeFromLeft(sectionWidth * 2 + spacing).reduced(15, 15);
    macroArea.removeFromTop(25);
    int macroKnobSize = (macroArea.getWidth() - 30) / 4;
    auto macroRow = macroArea.removeFromTop(macroKnobSize + 30);
    macro1Slider.setBounds(macroRow.removeFromLeft(macroKnobSize));
    macroRow.removeFromLeft(10);
    macro2Slider.setBounds(macroRow.removeFromLeft(macroKnobSize));
    macroRow.removeFromLeft(10);
    macro3Slider.setBounds(macroRow.removeFromLeft(macroKnobSize));
    macroRow.removeFromLeft(10);
    macro4Slider.setBounds(macroRow.removeFromLeft(macroKnobSize));
    middleRow.removeFromLeft(spacing);

    // XY Pad section
    auto xyPadArea = middleRow.removeFromLeft(sectionWidth * 3 + spacing * 2).reduced(15, 15);
    xyPadArea.removeFromTop(25);
    xyPad->setBounds(xyPadArea);

    area.removeFromTop(spacing);

    // ========== BOTTOM ROW - MASTER & SPECTRUM ==========
    auto masterArea = area.removeFromTop(150).reduced(15, 15);
    masterArea.removeFromTop(25);

    // Bypass and Mix at left side
    auto controlsArea = masterArea.removeFromLeft(300);
    masterBypassButton.setBounds(controlsArea.removeFromTop(30));
    controlsArea.removeFromTop(10);
    masterMixSlider.setBounds(controlsArea.removeFromTop(40));

    // Spectrum analyzer takes remaining space
    masterArea.removeFromLeft(10);
    spectrumAnalyzer->setBounds(masterArea);

    // Sidechain controls positioned over filter section (overlay)
    sidechainEnabledButton.setBounds(10 + 15, 93 + 25 + 180, 80, 20);
    sidechainThresholdSlider.setBounds(10 + 100, 93 + 25 + 180, 105, 20);
}

//==============================================================================
void FlarkDJEditor::setupSlider(juce::Slider& slider, juce::Slider::SliderStyle style)
{
    slider.setSliderStyle(style);
    slider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 70, 18);

    // Apply DJ knob look and feel for rotary sliders only
    if (style == juce::Slider::Rotary)
    {
        slider.setLookAndFeel(&djKnobLookAndFeel);
    }
    else
    {
        // Linear sliders use default styling
        slider.setColour(juce::Slider::thumbColourId, juce::Colour(0xffff6600));
        slider.setColour(juce::Slider::trackColourId, juce::Colour(0xffff6600).withAlpha(0.6f));
    }

    // Text box colors for all sliders
    slider.setColour(juce::Slider::textBoxTextColourId, juce::Colours::white);
    slider.setColour(juce::Slider::textBoxBackgroundColourId, juce::Colour(0xff1a1a1a));
    slider.setColour(juce::Slider::textBoxOutlineColourId, juce::Colour(0xff3a3a3a));
}

void FlarkDJEditor::setupButton(juce::ToggleButton& button)
{
    button.setColour(juce::ToggleButton::tickColourId, juce::Colour(0xffff6600));
    button.setColour(juce::ToggleButton::tickDisabledColourId, juce::Colour(0xff3a3a3a));
    button.setColour(juce::ToggleButton::textColourId, juce::Colours::white);
}

void FlarkDJEditor::setupComboBox(juce::ComboBox& combo)
{
    combo.setColour(juce::ComboBox::backgroundColourId, juce::Colour(0xff1a1a1a));
    combo.setColour(juce::ComboBox::outlineColourId, juce::Colour(0xffff6600).withAlpha(0.5f));
    combo.setColour(juce::ComboBox::textColourId, juce::Colours::white);
    combo.setColour(juce::ComboBox::arrowColourId, juce::Colour(0xffff6600));
}

juce::Label* FlarkDJEditor::createLabel(const juce::String& text, juce::Component& attachTo)
{
    auto label = std::make_unique<juce::Label>();
    label->setText(text, juce::dontSendNotification);
    label->setJustificationType(juce::Justification::centred);
    label->attachToComponent(&attachTo, false);

    // Professional label styling
    label->setColour(juce::Label::textColourId, juce::Colour(0xffcccccc));
    label->setFont(juce::Font(10.0f));

    addAndMakeVisible(*label);

    auto* labelPtr = label.get();
    labels.push_back(std::move(label));
    return labelPtr;
}
