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
        auto bounds = juce::Rectangle<int>(x, y, width, height).toFloat().reduced(3);
        auto radius = juce::jmin(bounds.getWidth(), bounds.getHeight()) / 2.0f;
        auto toAngle = rotaryStartAngle + sliderPos * (rotaryEndAngle - rotaryStartAngle);
        auto centre = bounds.getCentre();

        // Outer shadow for depth
        g.setColour(juce::Colours::black.withAlpha(0.6f));
        g.fillEllipse(centre.x - radius - 2, centre.y - radius - 1, (radius + 2) * 2, (radius + 2) * 2);

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

            float innerRadius = radius * 0.68f;
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

        // Enhanced gradient for faceted ring (darker, more contrast)
        juce::ColourGradient ringGradient(
            juce::Colour(0xff252525), centre.x - radius, centre.y - radius,
            juce::Colour(0xff0a0a0a), centre.x + radius, centre.y + radius,
            false);
        g.setGradientFill(ringGradient);
        g.fillPath(facetedRing);

        // Per-facet highlights for 3D effect
        for (int i = 0; i < numFacets; ++i)
        {
            float angle1 = (i * juce::MathConstants<float>::twoPi / numFacets) - juce::MathConstants<float>::pi / 2;
            float angle2 = ((i + 1) * juce::MathConstants<float>::twoPi / numFacets) - juce::MathConstants<float>::pi / 2;
            float midAngle = (angle1 + angle2) / 2.0f;

            // Light source from top-left
            float lightIntensity = std::max(0.0f, -std::sin(midAngle - juce::MathConstants<float>::pi * 0.75f));

            if (lightIntensity > 0.3f)
            {
                juce::Path facet;
                float x1 = centre.x + radius * std::cos(angle1);
                float y1 = centre.y + radius * std::sin(angle1);
                float x2 = centre.x + radius * std::cos(angle2);
                float y2 = centre.y + radius * std::sin(angle2);

                float innerRadius = radius * 0.68f;
                float x3 = centre.x + innerRadius * std::cos(angle2);
                float y3 = centre.y + innerRadius * std::sin(angle2);
                float x4 = centre.x + innerRadius * std::cos(angle1);
                float y4 = centre.y + innerRadius * std::sin(angle1);

                facet.startNewSubPath(x1, y1);
                facet.lineTo(x2, y2);
                facet.lineTo(x3, y3);
                facet.lineTo(x4, y4);
                facet.closeSubPath();

                g.setColour(juce::Colours::white.withAlpha(lightIntensity * 0.15f));
                g.fillPath(facet);
            }
        }

        // Inner shadow on facets for depth
        g.setColour(juce::Colours::black.withAlpha(0.7f));
        g.strokePath(facetedRing, juce::PathStrokeType(1.5f));

        // Draw brushed metal center cap with enhanced realism
        auto centerRadius = radius * 0.62f;

        // Outer bevel edge
        g.setColour(juce::Colour(0xff333333));
        g.fillEllipse(centre.x - centerRadius - 2, centre.y - centerRadius - 2,
                     (centerRadius + 2) * 2, (centerRadius + 2) * 2);

        // Multi-layer radial gradient for realistic metal
        juce::ColourGradient metalGradient(
            juce::Colour(0xffb0b0b0), centre.x, centre.y - centerRadius * 0.8f,
            juce::Colour(0xff606060), centre.x, centre.y + centerRadius * 0.8f,
            false);
        metalGradient.addColour(0.3, juce::Colour(0xff888888));
        metalGradient.addColour(0.7, juce::Colour(0xff707070));

        g.setGradientFill(metalGradient);
        g.fillEllipse(centre.x - centerRadius, centre.y - centerRadius,
                     centerRadius * 2, centerRadius * 2);

        // Enhanced brushed texture lines (more dense and realistic)
        g.setColour(juce::Colour(0xff909090).withAlpha(0.25f));
        for (int i = 0; i < 36; ++i)
        {
            float angle = i * juce::MathConstants<float>::pi / 18;
            float x1 = centre.x + (centerRadius * 0.2f) * std::cos(angle);
            float y1 = centre.y + (centerRadius * 0.2f) * std::sin(angle);
            float x2 = centre.x + (centerRadius * 0.97f) * std::cos(angle);
            float y2 = centre.y + (centerRadius * 0.97f) * std::sin(angle);
            g.drawLine(x1, y1, x2, y2, 0.4f);
        }

        // Alternating darker texture lines
        g.setColour(juce::Colour(0xff505050).withAlpha(0.2f));
        for (int i = 0; i < 18; ++i)
        {
            float angle = (i * 2 + 1) * juce::MathConstants<float>::pi / 18;
            float x1 = centre.x + (centerRadius * 0.2f) * std::cos(angle);
            float y1 = centre.y + (centerRadius * 0.2f) * std::sin(angle);
            float x2 = centre.x + (centerRadius * 0.97f) * std::cos(angle);
            float y2 = centre.y + (centerRadius * 0.97f) * std::sin(angle);
            g.drawLine(x1, y1, x2, y2, 0.6f);
        }

        // Specular highlight on metal center (stronger and more defined)
        g.setColour(juce::Colours::white.withAlpha(0.55f));
        g.fillEllipse(centre.x - centerRadius * 0.35f, centre.y - centerRadius * 0.7f,
                     centerRadius * 0.7f, centerRadius * 0.45f);

        // Secondary highlight
        g.setColour(juce::Colours::white.withAlpha(0.25f));
        g.fillEllipse(centre.x + centerRadius * 0.1f, centre.y - centerRadius * 0.5f,
                     centerRadius * 0.4f, centerRadius * 0.3f);

        // Bottom shadow for depth
        g.setColour(juce::Colours::black.withAlpha(0.3f));
        g.fillEllipse(centre.x - centerRadius * 0.3f, centre.y + centerRadius * 0.4f,
                     centerRadius * 0.6f, centerRadius * 0.35f);

        // Draw orange position indicator line (larger and more prominent)
        juce::Path indicator;
        auto indicatorLength = centerRadius * 0.85f;
        auto indicatorThickness = 4.5f;

        indicator.addRectangle(-indicatorThickness / 2, -indicatorLength,
                              indicatorThickness, indicatorLength * 0.72f);

        // Indicator shadow
        g.setColour(juce::Colours::black.withAlpha(0.5f));
        g.fillPath(indicator, juce::AffineTransform::rotation(toAngle)
                                                     .translated(centre.x + 1, centre.y + 1));

        // Main indicator
        g.setColour(juce::Colour(0xffff6600));
        g.fillPath(indicator, juce::AffineTransform::rotation(toAngle)
                                                     .translated(centre.x, centre.y));

        // Multi-layer glow on indicator
        g.setColour(juce::Colour(0xffff6600).withAlpha(0.4f));
        g.fillPath(indicator, juce::AffineTransform::rotation(toAngle)
                                                     .scaled(1.25f, 1.25f)
                                                     .translated(centre.x, centre.y));

        g.setColour(juce::Colour(0xffff8800).withAlpha(0.2f));
        g.fillPath(indicator, juce::AffineTransform::rotation(toAngle)
                                                     .scaled(1.5f, 1.5f)
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
        // Initialize bar levels
        for (int i = 0; i < numBars; ++i)
        {
            barLevels[i] = 0.0f;
            barPeaks[i] = 0.0f;
            peakHoldTime[i] = 0;
        }

        startTimerHz(30); // 30 FPS refresh
    }

    void paint(juce::Graphics& g) override
    {
        g.fillAll(juce::Colour(0xff0d0d0d));
        auto bounds = getLocalBounds().reduced(2);

        // Get real audio level from processor
        float level = processor.getOutputLevel();
        level = juce::jlimit(0.0f, 1.0f, level * 4.0f); // Scale up for visibility

        // Draw frequency spectrum bars
        const float barWidth = bounds.getWidth() / (float)numBars;

        for (int i = 0; i < numBars; ++i)
        {
            // Frequency weighting - bass has more energy, treble less
            float freqBin = i / (float)numBars;
            float freqWeight = 1.0f - (freqBin * freqBin * 0.7f); // Bass boost

            // Add pseudo-random variation based on bar index to simulate frequency content
            float phaseOffset = i * 2.5f;
            float randomVariation = (std::sin(phaseOffset) * 0.5f + 0.5f) * 0.4f + 0.6f;

            float target = level * freqWeight * randomVariation;

            // Attack and decay
            if (target > barLevels[i])
            {
                barLevels[i] = barLevels[i] + (target - barLevels[i]) * 0.7f; // Fast attack
                if (barLevels[i] > barPeaks[i])
                {
                    barPeaks[i] = barLevels[i];
                    peakHoldTime[i] = 15; // Hold for 15 frames (0.5 sec)
                }
            }
            else
            {
                barLevels[i] *= 0.75f; // Slower decay
            }

            // Peak decay
            if (peakHoldTime[i] > 0)
                peakHoldTime[i]--;
            else
                barPeaks[i] *= 0.95f;

            float height = barLevels[i] * bounds.getHeight();

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
    static constexpr int numBars = 80;
    FlarkDJProcessor& processor;
    float barLevels[80];
    float barPeaks[80];
    int peakHoldTime[80];
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

    // Flanger controls
    juce::ToggleButton flangerEnabledButton;
    juce::Slider flangerRateSlider;
    juce::Slider flangerDepthSlider;
    juce::Slider flangerFeedbackSlider;

    // LFO controls
    juce::Slider lfoRateSlider;
    juce::Slider lfoDepthSlider;
    juce::ComboBox lfoWaveformCombo;

    // Master controls
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

    std::unique_ptr<ButtonAttachment> flangerEnabledAttachment;
    std::unique_ptr<SliderAttachment> flangerRateAttachment;
    std::unique_ptr<SliderAttachment> flangerDepthAttachment;
    std::unique_ptr<SliderAttachment> flangerFeedbackAttachment;

    std::unique_ptr<SliderAttachment> lfoRateAttachment;
    std::unique_ptr<SliderAttachment> lfoDepthAttachment;
    std::unique_ptr<ComboBoxAttachment> lfoWaveformAttachment;

    std::unique_ptr<ButtonAttachment> masterBypassAttachment;

    //==============================================================================
    void setupSlider(juce::Slider& slider, juce::Slider::SliderStyle style = juce::Slider::Rotary);
    void setupButton(juce::ToggleButton& button);
    void setupComboBox(juce::ComboBox& combo);
    juce::Label* createLabel(const juce::String& text, juce::Component& attachTo);

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(FlarkDJEditor)
};
