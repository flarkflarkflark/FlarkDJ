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
    setResizeLimits(1200, 870, 1800, 1300);
    setSize(1400, 920);
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

    // Calculate section sizes based on current window size (same scaling as resized())
    float scale = getWidth() / 1400.0f;
    int sectionWidth = static_cast<int>(400 * scale);
    int sectionHeight = static_cast<int>(400 * scale);  // Scaled proportionally

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

    // Scale all dimensions based on window width
    float scale = getWidth() / 1400.0f;

    // Scaled dimensions (all controls scale proportionally)
    int sectionWidth = static_cast<int>(400 * scale);
    int sectionHeight = static_cast<int>(400 * scale);
    int spacing = static_cast<int>(10 * scale);
    int padding = static_cast<int>(15 * scale);

    // Scaled control sizes
    int buttonHeight = static_cast<int>(20 * scale);      // 66% of original 30px
    int largeKnobSize = static_cast<int>(120 * scale);    // Filter knobs
    int mediumKnobSize = static_cast<int>(100 * scale);   // Reverb/Delay/Flanger/LFO knobs
    int comboHeight = static_cast<int>(20 * scale);       // 66% of original 26-30px
    int sliderHeight = static_cast<int>(50 * scale);      // Isolator position slider
    int smallSpacing = static_cast<int>(10 * scale);
    int mediumSpacing = static_cast<int>(15 * scale);
    int titleSpace = static_cast<int>(25 * scale);

    // ========== FIRST ROW - Filter, Reverb, Delay ==========
    auto firstRow = area.removeFromTop(sectionHeight);

    // Filter section
    auto filterArea = firstRow.removeFromLeft(sectionWidth).reduced(padding, padding);
    filterArea.removeFromTop(titleSpace);
    filterEnabledButton.setBounds(filterArea.removeFromTop(buttonHeight));
    filterArea.removeFromTop(smallSpacing);

    // Bigger knobs with labels on left
    filterCutoffSlider.setBounds(filterArea.removeFromTop(largeKnobSize));
    filterArea.removeFromTop(smallSpacing);
    filterResonanceSlider.setBounds(filterArea.removeFromTop(largeKnobSize));
    filterArea.removeFromTop(smallSpacing);
    filterTypeCombo.setBounds(filterArea.removeFromLeft(static_cast<int>(270 * scale)).removeFromTop(comboHeight));
    firstRow.removeFromLeft(spacing);

    // Reverb section
    auto reverbArea = firstRow.removeFromLeft(sectionWidth).reduced(padding, padding);
    reverbArea.removeFromTop(titleSpace);
    reverbEnabledButton.setBounds(reverbArea.removeFromTop(buttonHeight));
    reverbArea.removeFromTop(smallSpacing);
    reverbRoomSizeSlider.setBounds(reverbArea.removeFromTop(mediumKnobSize));
    reverbArea.removeFromTop(smallSpacing);
    reverbDampingSlider.setBounds(reverbArea.removeFromTop(mediumKnobSize));
    reverbArea.removeFromTop(smallSpacing);
    reverbWetDrySlider.setBounds(reverbArea.removeFromTop(mediumKnobSize));
    firstRow.removeFromLeft(spacing);

    // Delay section
    auto delayArea = firstRow.removeFromLeft(sectionWidth).reduced(padding, padding);
    delayArea.removeFromTop(titleSpace);
    delayEnabledButton.setBounds(delayArea.removeFromTop(buttonHeight));
    delayArea.removeFromTop(smallSpacing);
    delayTimeSlider.setBounds(delayArea.removeFromTop(mediumKnobSize));
    delayArea.removeFromTop(smallSpacing);
    delayFeedbackSlider.setBounds(delayArea.removeFromTop(mediumKnobSize));
    delayArea.removeFromTop(smallSpacing);
    delayWetDrySlider.setBounds(delayArea.removeFromTop(mediumKnobSize));

    area.removeFromTop(spacing);

    // ========== SECOND ROW - Flanger, Isolator, LFO ==========
    auto secondRow = area.removeFromTop(sectionHeight);

    // Flanger section
    auto flangerArea = secondRow.removeFromLeft(sectionWidth).reduced(padding, padding);
    flangerArea.removeFromTop(titleSpace);
    flangerEnabledButton.setBounds(flangerArea.removeFromTop(buttonHeight));
    flangerArea.removeFromTop(smallSpacing);
    flangerRateSlider.setBounds(flangerArea.removeFromTop(mediumKnobSize));
    flangerArea.removeFromTop(smallSpacing);
    flangerDepthSlider.setBounds(flangerArea.removeFromTop(mediumKnobSize));
    flangerArea.removeFromTop(smallSpacing);
    flangerFeedbackSlider.setBounds(flangerArea.removeFromTop(mediumKnobSize));
    secondRow.removeFromLeft(spacing);

    // Isolator section
    auto isolatorArea = secondRow.removeFromLeft(sectionWidth).reduced(padding, padding);
    isolatorArea.removeFromTop(titleSpace);
    isolatorEnabledButton.setBounds(isolatorArea.removeFromTop(buttonHeight));
    isolatorArea.removeFromTop(mediumSpacing);
    isolatorPositionSlider.setBounds(isolatorArea.removeFromTop(sliderHeight));
    isolatorArea.removeFromTop(static_cast<int>(20 * scale));
    isolatorQSlider.setBounds(isolatorArea.removeFromTop(largeKnobSize));
    secondRow.removeFromLeft(spacing);

    // LFO section (with BPM sync)
    auto lfoArea = secondRow.removeFromLeft(sectionWidth).reduced(padding, padding);
    lfoArea.removeFromTop(titleSpace);
    lfoRateSlider.setBounds(lfoArea.removeFromTop(mediumKnobSize));
    lfoArea.removeFromTop(smallSpacing);
    lfoDepthSlider.setBounds(lfoArea.removeFromTop(mediumKnobSize));
    lfoArea.removeFromTop(mediumSpacing);
    lfoWaveformCombo.setBounds(lfoArea.removeFromTop(comboHeight));
    lfoArea.removeFromTop(mediumSpacing);
    lfoSyncButton.setBounds(lfoArea.removeFromTop(buttonHeight));
    lfoArea.removeFromTop(mediumSpacing);
    lfoSyncRateCombo.setBounds(lfoArea.removeFromTop(comboHeight));
}

//==============================================================================
void FlarkDJEditor::setupSlider(juce::Slider& slider, juce::Slider::SliderStyle style)
{
    slider.setSliderStyle(style);

    // Show value on right side for rotary knobs, below for linear sliders
    if (style == juce::Slider::Rotary)
    {
        slider.setTextBoxStyle(juce::Slider::TextBoxRight, false, 50, 18);
        slider.setLookAndFeel(&djKnobLookAndFeel);
    }
    else
    {
        slider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 70, 18);
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
    label->setJustificationType(juce::Justification::centredLeft);
    label->attachToComponent(&attachTo, true);  // true = label on left side

    // Larger, more readable label styling
    label->setColour(juce::Label::textColourId, juce::Colour(0xffdddddd));
    label->setFont(juce::Font(13.0f, juce::Font::bold));

    addAndMakeVisible(*label);

    auto* labelPtr = label.get();
    labels.push_back(std::move(label));
    return labelPtr;
}
