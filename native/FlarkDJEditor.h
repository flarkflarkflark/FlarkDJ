#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include "FlarkDJProcessor.h"

/**
 * FlarkDJ Plugin Editor
 *
 * This is the GUI for the native plugin.
 * Creates a modern, user-friendly interface with real-time visualizations.
 */

// Real-time spectrum analyzer component
class SpectrumAnalyzer : public juce::Component, public juce::Timer
{
public:
    SpectrumAnalyzer(FlarkDJProcessor& proc) : processor(proc)
    {
        startTimerHz(30); // 30 FPS refresh
    }

    void paint(juce::Graphics& g) override
    {
        g.fillAll(juce::Colour(0xff0d0d0d));

        auto bounds = getLocalBounds();

        // Draw frequency spectrum bars
        const int numBars = 64;
        const float barWidth = bounds.getWidth() / (float)numBars;

        for (int i = 0; i < numBars; ++i)
        {
            // Simulate spectrum data (in real implementation, get from audio buffer)
            float height = juce::Random::getSystemRandom().nextFloat() * 0.7f + 0.1f;
            height *= bounds.getHeight();

            // Color gradient from orange to white
            juce::Colour barColor = juce::Colour(0xffff6600).interpolatedWith(
                juce::Colours::white, height / bounds.getHeight());

            g.setColour(barColor.withAlpha(0.9f));
            g.fillRect(i * barWidth, bounds.getHeight() - height, barWidth - 2, height);
        }

        // Draw grid lines
        g.setColour(juce::Colour(0xff3a3a3a).withAlpha(0.3f));
        for (int i = 0; i < 4; ++i)
        {
            int y = bounds.getHeight() * i / 4;
            g.drawHorizontalLine(y, 0, bounds.getWidth());
        }
    }

    void timerCallback() override
    {
        repaint();
    }

private:
    FlarkDJProcessor& processor;
};

class FlarkDJEditor : public juce::AudioProcessorEditor
{
public:
    FlarkDJEditor(FlarkDJProcessor&);
    ~FlarkDJEditor() override;

    //==============================================================================
    void paint(juce::Graphics&) override;
    void resized() override;

private:
    FlarkDJProcessor& audioProcessor;

    //==============================================================================
    // Spectrum analyzer
    std::unique_ptr<SpectrumAnalyzer> spectrumAnalyzer;

    //==============================================================================
    // Filter controls
    juce::ToggleButton filterEnabledButton;
    juce::Slider filterCutoffSlider;
    juce::Slider filterResonanceSlider;
    juce::ComboBox filterTypeCombo;

    // Reverb controls
    juce::ToggleButton reverbEnabledButton;
    juce::Slider reverbRoomSizeSlider;
    juce::Slider reverbDampingSlider;
    juce::Slider reverbWetDrySlider;

    // Delay controls
    juce::ToggleButton delayEnabledButton;
    juce::Slider delayTimeSlider;
    juce::Slider delayFeedbackSlider;
    juce::Slider delayWetDrySlider;

    // LFO controls
    juce::Slider lfoRateSlider;
    juce::Slider lfoDepthSlider;
    juce::ComboBox lfoWaveformCombo;

    // Master controls
    juce::Slider masterMixSlider;
    juce::ToggleButton masterBypassButton;

    //==============================================================================
    // Labels
    std::vector<std::unique_ptr<juce::Label>> labels;

    //==============================================================================
    // Attachments
    using SliderAttachment = juce::AudioProcessorValueTreeState::SliderAttachment;
    using ButtonAttachment = juce::AudioProcessorValueTreeState::ButtonAttachment;
    using ComboBoxAttachment = juce::AudioProcessorValueTreeState::ComboBoxAttachment;

    std::unique_ptr<ButtonAttachment> filterEnabledAttachment;
    std::unique_ptr<SliderAttachment> filterCutoffAttachment;
    std::unique_ptr<SliderAttachment> filterResonanceAttachment;
    std::unique_ptr<ComboBoxAttachment> filterTypeAttachment;

    std::unique_ptr<ButtonAttachment> reverbEnabledAttachment;
    std::unique_ptr<SliderAttachment> reverbRoomSizeAttachment;
    std::unique_ptr<SliderAttachment> reverbDampingAttachment;
    std::unique_ptr<SliderAttachment> reverbWetDryAttachment;

    std::unique_ptr<ButtonAttachment> delayEnabledAttachment;
    std::unique_ptr<SliderAttachment> delayTimeAttachment;
    std::unique_ptr<SliderAttachment> delayFeedbackAttachment;
    std::unique_ptr<SliderAttachment> delayWetDryAttachment;

    std::unique_ptr<SliderAttachment> lfoRateAttachment;
    std::unique_ptr<SliderAttachment> lfoDepthAttachment;
    std::unique_ptr<ComboBoxAttachment> lfoWaveformAttachment;

    std::unique_ptr<SliderAttachment> masterMixAttachment;
    std::unique_ptr<ButtonAttachment> masterBypassAttachment;

    //==============================================================================
    void setupSlider(juce::Slider& slider, juce::Slider::SliderStyle style = juce::Slider::Rotary);
    juce::Label* createLabel(const juce::String& text, juce::Component& attachTo);

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(FlarkDJEditor)
};
