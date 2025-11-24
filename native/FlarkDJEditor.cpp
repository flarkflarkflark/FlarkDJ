#include "FlarkDJEditor.h"

//==============================================================================
FlarkDJEditor::FlarkDJEditor(FlarkDJProcessor& p)
    : AudioProcessorEditor(&p), audioProcessor(p)
{
    auto& params = audioProcessor.getParameters();

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

    // ========== ISOLATOR SECTION ==========
    addAndMakeVisible(isolatorEnabledButton);
    setupButton(isolatorEnabledButton);
    isolatorEnabledButton.setButtonText("Isolator");
    isolatorEnabledAttachment.reset(new ButtonAttachment(params, "isolatorEnabled", isolatorEnabledButton));

    addAndMakeVisible(isolatorPositionSlider);
    setupSlider(isolatorPositionSlider, juce::Slider::LinearHorizontal); // Horizontal slider for position
    isolatorPositionAttachment.reset(new SliderAttachment(params, "isolatorPosition", isolatorPositionSlider));
    createLabel("Position (L=Low, R=High)", isolatorPositionSlider);

    addAndMakeVisible(isolatorQSlider);
    setupSlider(isolatorQSlider);
    isolatorQAttachment.reset(new SliderAttachment(params, "isolatorQ", isolatorQSlider));
    createLabel("Q / Bandwidth", isolatorQSlider);

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

    addAndMakeVisible(lfoSyncButton);
    setupButton(lfoSyncButton);
    lfoSyncButton.setButtonText("BPM Sync");
    lfoSyncAttachment.reset(new ButtonAttachment(params, "lfoSync", lfoSyncButton));

    addAndMakeVisible(lfoSyncRateCombo);
    setupComboBox(lfoSyncRateCombo);
    lfoSyncRateCombo.addItemList(juce::StringArray{"1/4", "1/8", "1/16", "1/32", "1/2", "1 Bar"}, 1);
    lfoSyncRateAttachment.reset(new ComboBoxAttachment(params, "lfoSyncRate", lfoSyncRateCombo));

    // Enable resizing with constraints (AFTER all components are initialized)
    setResizable(true, true);
    setResizeLimits(1200, 650, 1800, 1100);
    setSize(1400, 750);
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
    float scale = getWidth() / 1400.0f;
    int sectionWidth = static_cast<int>(400 * scale);
    int sectionHeight = 280;  // Increased to fit all LFO controls

    // Section borders
    juce::Colour borderColour = orangeGlow.withAlpha(0.7f);
    g.setColour(borderColour);

    int yPos = 93;
    int xPos = 10;
    int spacing = 10;

    // 2 rows of 3 effects each
    const char* titles[] = {"FILTER", "REVERB", "DELAY", "FLANGER", "ISOLATOR", "LFO"};

    for (int row = 0; row < 2; ++row)
    {
        int rowY = yPos + row * (sectionHeight + spacing);

        for (int col = 0; col < 3; ++col)
        {
            int idx = row * 3 + col;
            int boxX = xPos + col * (sectionWidth + spacing);

            // Draw box
            g.drawRect(boxX, rowY, sectionWidth, sectionHeight, 3);

            // Draw title with glow effect
            g.setFont(juce::Font(13.0f, juce::Font::bold));

            // Glow
            g.setColour(orangeGlow.withAlpha(0.4f));
            g.drawText(titles[idx], boxX, rowY, sectionWidth, 20, juce::Justification::centred);

            // Main text
            g.setColour(juce::Colours::white);
            g.drawText(titles[idx], boxX, rowY, sectionWidth, 20, juce::Justification::centred);
        }
    }
}

void FlarkDJEditor::resized()
{
    auto area = getLocalBounds();
    area.removeFromTop(83); // Logo area + accent line

    float scale = getWidth() / 1400.0f;
    int sectionWidth = static_cast<int>(400 * scale);
    int sectionHeight = 280;  // Increased from 250 to fit all LFO controls
    int spacing = 10;

    // ========== FIRST ROW - Filter, Reverb, Delay ==========
    auto firstRow = area.removeFromTop(sectionHeight);

    // Filter section
    auto filterArea = firstRow.removeFromLeft(sectionWidth).reduced(15, 15);
    filterArea.removeFromTop(25);
    filterEnabledButton.setBounds(filterArea.removeFromTop(25));
    filterArea.removeFromTop(12);
    filterCutoffSlider.setBounds(filterArea.removeFromTop(75));
    filterArea.removeFromTop(12);
    filterResonanceSlider.setBounds(filterArea.removeFromTop(75));
    filterArea.removeFromTop(8);
    filterTypeCombo.setBounds(filterArea.removeFromTop(22));
    firstRow.removeFromLeft(spacing);

    // Reverb section
    auto reverbArea = firstRow.removeFromLeft(sectionWidth).reduced(15, 15);
    reverbArea.removeFromTop(25);
    reverbEnabledButton.setBounds(reverbArea.removeFromTop(25));
    reverbArea.removeFromTop(12);
    reverbRoomSizeSlider.setBounds(reverbArea.removeFromTop(65));
    reverbArea.removeFromTop(12);
    reverbDampingSlider.setBounds(reverbArea.removeFromTop(65));
    reverbArea.removeFromTop(12);
    reverbWetDrySlider.setBounds(reverbArea.removeFromTop(65));
    firstRow.removeFromLeft(spacing);

    // Delay section
    auto delayArea = firstRow.removeFromLeft(sectionWidth).reduced(15, 15);
    delayArea.removeFromTop(25);
    delayEnabledButton.setBounds(delayArea.removeFromTop(25));
    delayArea.removeFromTop(12);
    delayTimeSlider.setBounds(delayArea.removeFromTop(65));
    delayArea.removeFromTop(12);
    delayFeedbackSlider.setBounds(delayArea.removeFromTop(65));
    delayArea.removeFromTop(12);
    delayWetDrySlider.setBounds(delayArea.removeFromTop(65));

    area.removeFromTop(spacing);

    // ========== SECOND ROW - Flanger, Isolator, LFO ==========
    auto secondRow = area.removeFromTop(sectionHeight);

    // Flanger section
    auto flangerArea = secondRow.removeFromLeft(sectionWidth).reduced(15, 15);
    flangerArea.removeFromTop(25);
    flangerEnabledButton.setBounds(flangerArea.removeFromTop(25));
    flangerArea.removeFromTop(12);
    flangerRateSlider.setBounds(flangerArea.removeFromTop(65));
    flangerArea.removeFromTop(12);
    flangerDepthSlider.setBounds(flangerArea.removeFromTop(65));
    flangerArea.removeFromTop(12);
    flangerFeedbackSlider.setBounds(flangerArea.removeFromTop(65));
    secondRow.removeFromLeft(spacing);

    // Isolator section
    auto isolatorArea = secondRow.removeFromLeft(sectionWidth).reduced(15, 15);
    isolatorArea.removeFromTop(25);
    isolatorEnabledButton.setBounds(isolatorArea.removeFromTop(25));
    isolatorArea.removeFromTop(12);
    isolatorPositionSlider.setBounds(isolatorArea.removeFromTop(40)); // Horizontal slider
    isolatorArea.removeFromTop(12);
    isolatorQSlider.setBounds(isolatorArea.removeFromTop(80));
    secondRow.removeFromLeft(spacing);

    // LFO section (with BPM sync)
    auto lfoArea = secondRow.removeFromLeft(sectionWidth).reduced(15, 15);
    lfoArea.removeFromTop(25);
    lfoRateSlider.setBounds(lfoArea.removeFromTop(60));
    lfoArea.removeFromTop(6);
    lfoDepthSlider.setBounds(lfoArea.removeFromTop(60));
    lfoArea.removeFromTop(8);
    lfoWaveformCombo.setBounds(lfoArea.removeFromTop(24));
    lfoArea.removeFromTop(10);
    lfoSyncButton.setBounds(lfoArea.removeFromTop(26));
    lfoArea.removeFromTop(10);
    lfoSyncRateCombo.setBounds(lfoArea.removeFromTop(26));
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
