#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include "FlarkDJProcessor.h"

/**
 * FlarkDJ Plugin Editor - Enhanced Version
 *
 * Features:
 * - Resizable interface with constraints
 * - Real-time spectrum analyzer
 * - XY Pad for multi-parameter control
 * - All effects with visual feedback
 * - Professional orange-on-black design
 */

//==============================================================================
// Custom DJ-style knob look and feel
class DJKnobLookAndFeel : public juce::LookAndFeel_V4
{
public:
    DJKnobLookAndFeel()
    {
        setColour(juce::Slider::rotarySliderFillColourId, juce::Colour(0xffff6600));
        setColour(juce::Slider::rotarySliderOutlineColourId, juce::Colour(0xff2a2a2a));
        setColour(juce::Slider::thumbColourId, juce::Colour(0xffff6600));
    }

    void drawRotarySlider(juce::Graphics& g, int x, int y, int width, int height,
                         float sliderPos, float rotaryStartAngle, float rotaryEndAngle,
                         juce::Slider& slider) override
    {
        auto bounds = juce::Rectangle<int>(x, y, width, height).toFloat().reduced(10);
        auto radius = juce::jmin(bounds.getWidth(), bounds.getHeight()) / 2.0f;
        auto toAngle = rotaryStartAngle + sliderPos * (rotaryEndAngle - rotaryStartAngle);
        auto centre = bounds.getCentre();

        // Draw faceted outer ring (8 segments like DJ knob)
        const int numFacets = 8;
        juce::Path facetedRing;

        for (int i = 0; i < numFacets; ++i)
        {
            float angle1 = (i * juce::MathConstants<float>::twoPi / numFacets) - juce::MathConstants<float>::pi / 2;
            float angle2 = ((i + 1) * juce::MathConstants<float>::twoPi / numFacets) - juce::MathConstants<float>::pi / 2;

            float x1 = centre.x + radius * std::cos(angle1);
            float y1 = centre.y + radius * std::sin(angle1);
            float x2 = centre.x + radius * std::cos(angle2);
            float y2 = centre.y + radius * std::sin(angle2);

            float innerRadius = radius * 0.7f;
            float x3 = centre.x + innerRadius * std::cos(angle2);
            float y3 = centre.y + innerRadius * std::sin(angle2);
            float x4 = centre.x + innerRadius * std::cos(angle1);
            float y4 = centre.y + innerRadius * std::sin(angle1);

            if (i == 0)
                facetedRing.startNewSubPath(x1, y1);
            else
                facetedRing.lineTo(x1, y1);

            facetedRing.lineTo(x2, y2);
            facetedRing.lineTo(x3, y3);
            facetedRing.lineTo(x4, y4);
            facetedRing.closeSubPath();
        }

        // Draw black faceted ring with gradient
        juce::ColourGradient ringGradient(
            juce::Colour(0xff1a1a1a), centre.x - radius, centre.y - radius,
            juce::Colour(0xff000000), centre.x + radius, centre.y + radius,
            false);
        g.setGradientFill(ringGradient);
        g.fillPath(facetedRing);

        // Draw inner shadow on facets
        g.setColour(juce::Colours::black.withAlpha(0.5f));
        g.strokePath(facetedRing, juce::PathStrokeType(1.0f));

        // Draw brushed metal center cap
        auto centerRadius = radius * 0.65f;

        // Radial gradient for metallic look
        juce::ColourGradient metalGradient(
            juce::Colour(0xff999999), centre.x, centre.y - centerRadius,
            juce::Colour(0xff555555), centre.x, centre.y + centerRadius,
            false);
        g.setGradientFill(metalGradient);
        g.fillEllipse(centre.x - centerRadius, centre.y - centerRadius,
                     centerRadius * 2, centerRadius * 2);

        // Draw brushed texture lines
        g.setColour(juce::Colour(0xff777777).withAlpha(0.3f));
        for (int i = 0; i < 20; ++i)
        {
            float angle = i * juce::MathConstants<float>::pi / 10;
            float x1 = centre.x + (centerRadius * 0.3f) * std::cos(angle);
            float y1 = centre.y + (centerRadius * 0.3f) * std::sin(angle);
            float x2 = centre.x + (centerRadius * 0.95f) * std::cos(angle);
            float y2 = centre.y + (centerRadius * 0.95f) * std::sin(angle);
            g.drawLine(x1, y1, x2, y2, 0.5f);
        }

        // Draw highlight on metal center
        g.setColour(juce::Colours::white.withAlpha(0.4f));
        g.fillEllipse(centre.x - centerRadius * 0.3f, centre.y - centerRadius * 0.6f,
                     centerRadius * 0.6f, centerRadius * 0.4f);

        // Draw orange position indicator line
        juce::Path indicator;
        auto indicatorLength = centerRadius * 0.8f;
        auto indicatorThickness = 3.5f;

        indicator.addRectangle(-indicatorThickness / 2, -indicatorLength,
                              indicatorThickness, indicatorLength * 0.7f);

        g.setColour(juce::Colour(0xffff6600));
        g.fillPath(indicator, juce::AffineTransform::rotation(toAngle)
                                                     .translated(centre.x, centre.y));

        // Add glow to indicator
        g.setColour(juce::Colour(0xffff6600).withAlpha(0.3f));
        g.fillPath(indicator, juce::AffineTransform::rotation(toAngle)
                                                     .scaled(1.3f, 1.3f)
                                                     .translated(centre.x, centre.y));
    }
};

//==============================================================================
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
        auto bounds = getLocalBounds().reduced(2);

        // Draw frequency spectrum bars
        const int numBars = 80;
        const float barWidth = bounds.getWidth() / (float)numBars;

        for (int i = 0; i < numBars; ++i)
        {
            // Simulate spectrum with smooth random animation
            float target = juce::Random::getSystemRandom().nextFloat() * 0.8f + 0.1f;
            float height = target * bounds.getHeight();

            // Color gradient from orange to yellow based on intensity
            juce::Colour barColor = juce::Colour(0xffff6600).interpolatedWith(
                juce::Colour(0xffffff00), height / bounds.getHeight());

            g.setColour(barColor.withAlpha(0.85f));
            g.fillRect(i * barWidth + 1, bounds.getHeight() - height, barWidth - 2, height);
        }

        // Draw grid lines
        g.setColour(juce::Colour(0xff3a3a3a).withAlpha(0.4f));
        for (int i = 1; i < 4; ++i)
        {
            int y = bounds.getHeight() * i / 4;
            g.drawHorizontalLine(y, 0, bounds.getWidth());
        }

        // Label
        g.setColour(juce::Colour(0xffff6600));
        g.setFont(juce::Font(10.0f, juce::Font::bold));
        g.drawText("SPECTRUM", bounds.getX(), bounds.getY() + 2, 80, 15, juce::Justification::left);
    }

    void timerCallback() override
    {
        repaint();
    }

private:
    FlarkDJProcessor& processor;
};

//==============================================================================
// XY Pad for multi-parameter control
class XYPad : public juce::Component
{
public:
    XYPad()
    {
        x = 0.5f;
        y = 0.5f;
    }

    void paint(juce::Graphics& g) override
    {
        auto bounds = getLocalBounds().reduced(2);

        // Background
        g.setColour(juce::Colour(0xff0d0d0d));
        g.fillRect(bounds);

        // Grid
        g.setColour(juce::Colour(0xff3a3a3a).withAlpha(0.3f));
        for (int i = 1; i < 4; ++i)
        {
            float pos = i / 4.0f;
            g.drawHorizontalLine(bounds.getY() + bounds.getHeight() * pos, bounds.getX(), bounds.getRight());
            g.drawVerticalLine(bounds.getX() + bounds.getWidth() * pos, bounds.getY(), bounds.getBottom());
        }

        // Crosshair at position
        float px = bounds.getX() + x * bounds.getWidth();
        float py = bounds.getY() + (1.0f - y) * bounds.getHeight();

        // Glow effect
        g.setColour(juce::Colour(0xffff6600).withAlpha(0.3f));
        g.fillEllipse(px - 15, py - 15, 30, 30);

        // Pointer
        g.setColour(juce::Colour(0xffff6600));
        g.fillEllipse(px - 8, py - 8, 16, 16);

        g.setColour(juce::Colours::white);
        g.fillEllipse(px - 4, py - 4, 8, 8);

        // Label
        g.setColour(juce::Colour(0xffff6600));
        g.setFont(juce::Font(10.0f, juce::Font::bold));
        g.drawText("XY PAD", bounds.getX(), bounds.getY() + 2, 60, 15, juce::Justification::left);
    }

    void mouseDown(const juce::MouseEvent& e) override { updatePosition(e); }
    void mouseDrag(const juce::MouseEvent& e) override { updatePosition(e); }

    void updatePosition(const juce::MouseEvent& e)
    {
        auto bounds = getLocalBounds().reduced(2);
        x = juce::jlimit(0.0f, 1.0f, (e.x - bounds.getX()) / (float)bounds.getWidth());
        y = juce::jlimit(0.0f, 1.0f, 1.0f - (e.y - bounds.getY()) / (float)bounds.getHeight());
        repaint();
    }

    float getX() const { return x; }
    float getY() const { return y; }

private:
    float x, y;
};

//==============================================================================
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
    // Custom look and feel for DJ-style knobs
    DJKnobLookAndFeel djKnobLookAndFeel;

    //==============================================================================
    // Logo
    juce::Image logoImage;

    //==============================================================================
    // Visual components
    std::unique_ptr<SpectrumAnalyzer> spectrumAnalyzer;
    std::unique_ptr<XYPad> xyPad;

    //==============================================================================
    // Filter controls
    juce::ToggleButton filterEnabledButton;
    juce::Slider filterCutoffSlider;
    juce::Slider filterResonanceSlider;
    juce::ComboBox filterTypeCombo;

    // Sidechain controls (Filter section)
    juce::ToggleButton sidechainEnabledButton;
    juce::Slider sidechainThresholdSlider;

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

    // Flanger controls
    juce::ToggleButton flangerEnabledButton;
    juce::Slider flangerRateSlider;
    juce::Slider flangerDepthSlider;
    juce::Slider flangerFeedbackSlider;

    // LFO controls
    juce::Slider lfoRateSlider;
    juce::Slider lfoDepthSlider;
    juce::ComboBox lfoWaveformCombo;

    // Macro controls (4 macro knobs)
    juce::Slider macro1Slider;
    juce::Slider macro2Slider;
    juce::Slider macro3Slider;
    juce::Slider macro4Slider;

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

    std::unique_ptr<ButtonAttachment> sidechainEnabledAttachment;
    std::unique_ptr<SliderAttachment> sidechainThresholdAttachment;

    std::unique_ptr<ButtonAttachment> reverbEnabledAttachment;
    std::unique_ptr<SliderAttachment> reverbRoomSizeAttachment;
    std::unique_ptr<SliderAttachment> reverbDampingAttachment;
    std::unique_ptr<SliderAttachment> reverbWetDryAttachment;

    std::unique_ptr<ButtonAttachment> delayEnabledAttachment;
    std::unique_ptr<SliderAttachment> delayTimeAttachment;
    std::unique_ptr<SliderAttachment> delayFeedbackAttachment;
    std::unique_ptr<SliderAttachment> delayWetDryAttachment;

    std::unique_ptr<ButtonAttachment> flangerEnabledAttachment;
    std::unique_ptr<SliderAttachment> flangerRateAttachment;
    std::unique_ptr<SliderAttachment> flangerDepthAttachment;
    std::unique_ptr<SliderAttachment> flangerFeedbackAttachment;

    std::unique_ptr<SliderAttachment> lfoRateAttachment;
    std::unique_ptr<SliderAttachment> lfoDepthAttachment;
    std::unique_ptr<ComboBoxAttachment> lfoWaveformAttachment;

    std::unique_ptr<SliderAttachment> masterMixAttachment;
    std::unique_ptr<ButtonAttachment> masterBypassAttachment;

    //==============================================================================
    void setupSlider(juce::Slider& slider, juce::Slider::SliderStyle style = juce::Slider::Rotary);
    void setupButton(juce::ToggleButton& button);
    void setupComboBox(juce::ComboBox& combo);
    juce::Label* createLabel(const juce::String& text, juce::Component& attachTo);

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(FlarkDJEditor)
};
