#pragma once

#include <juce_core/juce_core.h>
#include <vector>
#include <cmath>

/**
 * FlarkDJ DSP Effects
 *
 * Native C++ implementations of the audio effects from the TypeScript version.
 */

//==============================================================================
// LFO (Low Frequency Oscillator)
//==============================================================================
class FlarkLFO
{
public:
    enum Waveform
    {
        Sine = 0,
        Square = 1,
        Triangle = 2,
        Sawtooth = 3
    };

    FlarkLFO() : phase(0.0f), sampleRate(44100.0f) {}

    void setSampleRate(float sr)
    {
        sampleRate = sr;
    }

    void setWaveform(Waveform wf)
    {
        waveform = wf;
    }

    void setRate(float rateHz)
    {
        rate = rateHz;
    }

    float process()
    {
        float output = 0.0f;

        switch (waveform)
        {
            case Sine:
                output = std::sin(phase * juce::MathConstants<float>::twoPi);
                break;
            case Square:
                output = phase < 0.5f ? 1.0f : -1.0f;
                break;
            case Triangle:
                output = 2.0f * std::abs(2.0f * (phase - std::floor(phase + 0.5f))) - 1.0f;
                break;
            case Sawtooth:
                output = 2.0f * phase - 1.0f;
                break;
        }

        // Advance phase
        phase += rate / sampleRate;
        if (phase >= 1.0f)
            phase -= 1.0f;

        return output;
    }

private:
    float phase;
    float rate = 1.0f;
    float sampleRate;
    Waveform waveform = Sine;
};

//==============================================================================
// Biquad Filter
//==============================================================================
class FlarkFilter
{
public:
    enum FilterType
    {
        Lowpass = 0,
        Highpass = 1,
        Bandpass = 2
    };

    FlarkFilter() : sampleRate(44100.0f)
    {
        reset();
    }

    void setSampleRate(float sr)
    {
        sampleRate = sr;
        updateCoefficients();
    }

    void setType(FilterType type)
    {
        filterType = type;
        updateCoefficients();
    }

    void setCutoff(float cutoffHz)
    {
        cutoff = cutoffHz;
        updateCoefficients();
    }

    void setResonance(float q)
    {
        resonance = q;
        updateCoefficients();
    }

    float process(float input)
    {
        float output = b0 * input + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;

        x2 = x1;
        x1 = input;
        y2 = y1;
        y1 = output;

        return output;
    }

    void reset()
    {
        x1 = x2 = y1 = y2 = 0.0f;
    }

private:
    void updateCoefficients()
    {
        float omega = juce::MathConstants<float>::twoPi * cutoff / sampleRate;
        float sinOmega = std::sin(omega);
        float cosOmega = std::cos(omega);
        float alpha = sinOmega / (2.0f * resonance);

        float a0 = 1.0f + alpha;

        switch (filterType)
        {
            case Lowpass:
                b0 = (1.0f - cosOmega) / (2.0f * a0);
                b1 = (1.0f - cosOmega) / a0;
                b2 = (1.0f - cosOmega) / (2.0f * a0);
                a1 = (-2.0f * cosOmega) / a0;
                a2 = (1.0f - alpha) / a0;
                break;

            case Highpass:
                b0 = (1.0f + cosOmega) / (2.0f * a0);
                b1 = -(1.0f + cosOmega) / a0;
                b2 = (1.0f + cosOmega) / (2.0f * a0);
                a1 = (-2.0f * cosOmega) / a0;
                a2 = (1.0f - alpha) / a0;
                break;

            case Bandpass:
                b0 = alpha / a0;
                b1 = 0.0f;
                b2 = -alpha / a0;
                a1 = (-2.0f * cosOmega) / a0;
                a2 = (1.0f - alpha) / a0;
                break;
        }
    }

    float sampleRate;
    float cutoff = 1000.0f;
    float resonance = 1.0f;
    FilterType filterType = Lowpass;

    // Biquad coefficients
    float b0 = 1.0f, b1 = 0.0f, b2 = 0.0f;
    float a1 = 0.0f, a2 = 0.0f;

    // State variables
    float x1 = 0.0f, x2 = 0.0f;
    float y1 = 0.0f, y2 = 0.0f;
};

//==============================================================================
// Delay Effect
//==============================================================================
class FlarkDelay
{
public:
    FlarkDelay()
    {
        setMaxDelayTime(2.0f);
    }

    void setSampleRate(float sr)
    {
        sampleRate = sr;
        setMaxDelayTime(maxDelayTime);
    }

    void setMaxDelayTime(float seconds)
    {
        maxDelayTime = seconds;
        int bufferSize = static_cast<int>(sampleRate * maxDelayTime) + 1;
        buffer.resize(bufferSize, 0.0f);
        writePos = 0;
    }

    void setDelayTime(float seconds)
    {
        delayTime = juce::jlimit(0.0f, maxDelayTime, seconds);
    }

    void setFeedback(float fb)
    {
        feedback = juce::jlimit(0.0f, 0.95f, fb);
    }

    void setWetDryMix(float mix)
    {
        wetDry = juce::jlimit(0.0f, 1.0f, mix);
    }

    float process(float input)
    {
        if (buffer.empty())
            return input;

        // Calculate read position
        float delaySamples = delayTime * sampleRate;
        float readPos = writePos - delaySamples;
        while (readPos < 0)
            readPos += buffer.size();

        // Linear interpolation
        int readPos1 = static_cast<int>(readPos) % buffer.size();
        int readPos2 = (readPos1 + 1) % buffer.size();
        float frac = readPos - std::floor(readPos);
        float delayed = buffer[readPos1] * (1.0f - frac) + buffer[readPos2] * frac;

        // Write with feedback
        buffer[writePos] = input + delayed * feedback;

        // Advance write position
        writePos = (writePos + 1) % buffer.size();

        // Mix wet/dry
        return input * (1.0f - wetDry) + delayed * wetDry;
    }

    void reset()
    {
        std::fill(buffer.begin(), buffer.end(), 0.0f);
        writePos = 0;
    }

private:
    std::vector<float> buffer;
    int writePos = 0;
    float sampleRate = 44100.0f;
    float maxDelayTime = 2.0f;
    float delayTime = 0.5f;
    float feedback = 0.3f;
    float wetDry = 0.5f;
};

//==============================================================================
// Reverb Effect
//==============================================================================
class FlarkReverb
{
public:
    FlarkReverb()
    {
        // Initialize delay lines with prime number lengths for diffusion
        delayLengths = { 1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116 };
        initializeDelayLines();
    }

    void setSampleRate(float sr)
    {
        sampleRate = sr;
        initializeDelayLines();
    }

    void setRoomSize(float size)
    {
        roomSize = juce::jlimit(0.0f, 1.0f, size);
        updateParameters();
    }

    void setDamping(float damp)
    {
        damping = juce::jlimit(0.0f, 1.0f, damp);
    }

    void setWetDryMix(float mix)
    {
        wetDry = juce::jlimit(0.0f, 1.0f, mix);
    }

    float process(float input)
    {
        float reverbOutput = 0.0f;

        // Process through parallel delay lines
        for (size_t i = 0; i < delayLines.size(); ++i)
        {
            auto& line = delayLines[i];
            auto& pos = delayPositions[i];
            auto& lastOut = lastOutputs[i];

            // Read from delay line
            float delayed = line[pos];

            // Apply damping (simple lowpass)
            delayed = lastOut + damping * (delayed - lastOut);
            lastOut = delayed;

            // Write to delay line with feedback
            line[pos] = input + delayed * 0.5f * roomSize;

            // Accumulate output
            reverbOutput += delayed;

            // Advance position
            pos = (pos + 1) % line.size();
        }

        // Average the delay lines
        reverbOutput /= delayLines.size();

        // Mix wet/dry
        return input * (1.0f - wetDry) + reverbOutput * wetDry;
    }

    void reset()
    {
        for (auto& line : delayLines)
            std::fill(line.begin(), line.end(), 0.0f);
        std::fill(delayPositions.begin(), delayPositions.end(), 0);
        std::fill(lastOutputs.begin(), lastOutputs.end(), 0.0f);
    }

private:
    void initializeDelayLines()
    {
        delayLines.clear();
        delayPositions.clear();
        lastOutputs.clear();

        for (auto length : delayLengths)
        {
            delayLines.push_back(std::vector<float>(length, 0.0f));
            delayPositions.push_back(0);
            lastOutputs.push_back(0.0f);
        }
    }

    void updateParameters()
    {
        // Room size affects delay line lengths
        // Could be expanded for more sophisticated control
    }

    std::vector<int> delayLengths;
    std::vector<std::vector<float>> delayLines;
    std::vector<int> delayPositions;
    std::vector<float> lastOutputs;

    float sampleRate = 44100.0f;
    float roomSize = 0.5f;
    float damping = 0.5f;
    float wetDry = 0.3f;
};

//==============================================================================
// Flanger Effect
//==============================================================================
class FlarkFlanger
{
public:
    FlarkFlanger()
    {
        buffer.resize(4410, 0.0f); // 100ms at 44.1kHz
    }

    void setSampleRate(float sr)
    {
        sampleRate = sr;
        int maxDelay = static_cast<int>(sampleRate * 0.01f); // 10ms max delay
        buffer.resize(maxDelay * 2, 0.0f);
        lfoPhase = 0.0f;
    }

    void setRate(float rateHz)
    {
        rate = juce::jlimit(0.1f, 10.0f, rateHz);
    }

    void setDepth(float depthAmount)
    {
        depth = juce::jlimit(0.0f, 1.0f, depthAmount);
    }

    void setFeedback(float fb)
    {
        feedback = juce::jlimit(0.0f, 0.95f, fb);
    }

    void setWetDryMix(float mix)
    {
        wetDry = juce::jlimit(0.0f, 1.0f, mix);
    }

    float process(float input)
    {
        // Update LFO
        lfoPhase += rate / sampleRate;
        if (lfoPhase >= 1.0f)
            lfoPhase -= 1.0f;

        // Calculate LFO value (sine wave)
        float lfoValue = std::sin(lfoPhase * 2.0f * juce::MathConstants<float>::pi);

        // Calculate delay time (1-10ms modulated by LFO)
        float minDelay = 1.0f;  // 1ms
        float maxDelay = 10.0f; // 10ms
        float delayMs = minDelay + (maxDelay - minDelay) * depth * (lfoValue * 0.5f + 0.5f);
        float delaySamples = (delayMs / 1000.0f) * sampleRate;

        // Read from delay buffer with interpolation
        int readPos1 = static_cast<int>(writePos - delaySamples);
        while (readPos1 < 0) readPos1 += buffer.size();
        readPos1 %= buffer.size();

        int readPos2 = (readPos1 + 1) % buffer.size();
        float frac = delaySamples - std::floor(delaySamples);

        float delayed = buffer[readPos1] * (1.0f - frac) + buffer[readPos2] * frac;

        // Write to buffer with feedback
        buffer[writePos] = input + delayed * feedback;

        // Advance write position
        writePos = (writePos + 1) % buffer.size();

        // Mix wet/dry
        return input * (1.0f - wetDry) + delayed * wetDry;
    }

    void reset()
    {
        std::fill(buffer.begin(), buffer.end(), 0.0f);
        writePos = 0;
        lfoPhase = 0.0f;
    }

private:
    std::vector<float> buffer;
    int writePos = 0;
    float sampleRate = 44100.0f;
    float rate = 0.5f;      // LFO rate in Hz
    float depth = 0.5f;     // Modulation depth
    float feedback = 0.5f;  // Feedback amount
    float wetDry = 0.5f;    // Wet/dry mix
    float lfoPhase = 0.0f;  // LFO phase
};

//==============================================================================
// Butterworth Filter (Cascaded Biquads for Steep Rolloff)
// Based on Airwindows Isolator technique - 3 stages = ~18 dB/octave
//==============================================================================
class FlarkButterworthFilter
{
public:
    enum FilterType
    {
        Lowpass = 0,
        Highpass = 1,
        Bandpass = 2
    };

    FlarkButterworthFilter() : sampleRate(44100.0f)
    {
        reset();
    }

    void setSampleRate(float sr)
    {
        sampleRate = sr;
        updateCoefficients();
    }

    void setType(FilterType type)
    {
        filterType = type;
        updateCoefficients();
    }

    void setCutoff(float cutoffHz)
    {
        cutoff = juce::jlimit(20.0f, 20000.0f, cutoffHz);
        updateCoefficients();
    }

    void setResonance(float q)
    {
        // Q for Butterworth stages (golden ratio approximation for smooth response)
        resonance = juce::jlimit(0.1f, 10.0f, q);
        updateCoefficients();
    }

    float process(float input)
    {
        // Process through 3 cascaded biquad stages for steep rolloff
        float output = input;

        // Stage 1
        output = b0_1 * output + b1_1 * x1_1 + b2_1 * x2_1 - a1_1 * y1_1 - a2_1 * y2_1;
        x2_1 = x1_1; x1_1 = input;
        y2_1 = y1_1; y1_1 = output;

        // Stage 2
        float input2 = output;
        output = b0_2 * output + b1_2 * x1_2 + b2_2 * x2_2 - a1_2 * y1_2 - a2_2 * y2_2;
        x2_2 = x1_2; x1_2 = input2;
        y2_2 = y1_2; y1_2 = output;

        // Stage 3
        float input3 = output;
        output = b0_3 * output + b1_3 * x1_3 + b2_3 * x2_3 - a1_3 * y1_3 - a2_3 * y2_3;
        x2_3 = x1_3; x1_3 = input3;
        y2_3 = y1_3; y1_3 = output;

        return output;
    }

    void reset()
    {
        x1_1 = x2_1 = y1_1 = y2_1 = 0.0f;
        x1_2 = x2_2 = y1_2 = y2_2 = 0.0f;
        x1_3 = x2_3 = y1_3 = y2_3 = 0.0f;
    }

private:
    void updateCoefficients()
    {
        // Butterworth biquad coefficients using bilinear transform
        float freq = cutoff / sampleRate;
        freq = juce::jlimit(0.0001f, 0.499f, freq);

        float K = std::tan(juce::MathConstants<float>::pi * freq);
        float Q = resonance;
        float norm = 1.0f / (1.0f + K / Q + K * K);

        switch (filterType)
        {
            case Lowpass:
                // All 3 stages use same coefficients for Butterworth response
                b0_1 = b0_2 = b0_3 = K * K * norm;
                b1_1 = b1_2 = b1_3 = 2.0f * b0_1;
                b2_1 = b2_2 = b2_3 = b0_1;
                a1_1 = a1_2 = a1_3 = 2.0f * (K * K - 1.0f) * norm;
                a2_1 = a2_2 = a2_3 = (1.0f - K / Q + K * K) * norm;
                break;

            case Highpass:
                b0_1 = b0_2 = b0_3 = 1.0f * norm;
                b1_1 = b1_2 = b1_3 = -2.0f * norm;
                b2_1 = b2_2 = b2_3 = 1.0f * norm;
                a1_1 = a1_2 = a1_3 = 2.0f * (K * K - 1.0f) * norm;
                a2_1 = a2_2 = a2_3 = (1.0f - K / Q + K * K) * norm;
                break;

            case Bandpass:
                b0_1 = b0_2 = b0_3 = K / Q * norm;
                b1_1 = b1_2 = b1_3 = 0.0f;
                b2_1 = b2_2 = b2_3 = -(K / Q) * norm;
                a1_1 = a1_2 = a1_3 = 2.0f * (K * K - 1.0f) * norm;
                a2_1 = a2_2 = a2_3 = (1.0f - K / Q + K * K) * norm;
                break;
        }
    }

    float sampleRate;
    float cutoff = 400.0f;
    float resonance = 3.0f;
    FilterType filterType = Lowpass;

    // Biquad coefficients for 3 stages
    float b0_1, b1_1, b2_1, a1_1, a2_1;
    float b0_2, b1_2, b2_2, a1_2, a2_2;
    float b0_3, b1_3, b2_3, a1_3, a2_3;

    // State variables for 3 stages
    float x1_1 = 0.0f, x2_1 = 0.0f, y1_1 = 0.0f, y2_1 = 0.0f;
    float x1_2 = 0.0f, x2_2 = 0.0f, y1_2 = 0.0f, y2_2 = 0.0f;
    float x1_3 = 0.0f, x2_3 = 0.0f, y1_3 = 0.0f, y2_3 = 0.0f;
};

//==============================================================================
// DJ Isolator (Airwindows Isolator3-inspired)
// Single slider: left=lowpass, center=fullrange, right=highpass
//==============================================================================
class FlarkIsolator
{
public:
    FlarkIsolator() : sampleRate(44100.0f)
    {
        reset();
    }

    void setSampleRate(float sr)
    {
        sampleRate = sr;
        lowpassFilter.setSampleRate(sr);
        highpassFilter.setSampleRate(sr);
    }

    // Position: -1.0 (full lowpass) to +1.0 (full highpass), 0.0 = fullrange
    void setPosition(float pos)
    {
        position = juce::jlimit(-1.0f, 1.0f, pos);
        updateFilters();
    }

    // Q/bandwidth control: higher = narrower band (more resonant)
    void setQ(float q)
    {
        qValue = juce::jlimit(0.5f, 10.0f, q);
        updateFilters();
    }

    float process(float input)
    {
        if (std::abs(position) < 0.01f)
            return input; // Fullrange bypass

        float output;

        if (position < 0.0f)
        {
            // Lowpass mode (sweep left)
            output = lowpassFilter.process(input);
            // Blend with dry based on position
            float blend = std::abs(position);
            output = input * (1.0f - blend) + output * blend;
        }
        else
        {
            // Highpass mode (sweep right)
            output = highpassFilter.process(input);
            // Blend with dry based on position
            float blend = std::abs(position);
            output = input * (1.0f - blend) + output * blend;
        }

        return output;
    }

    void reset()
    {
        lowpassFilter.reset();
        highpassFilter.reset();
    }

private:
    void updateFilters()
    {
        // Map position to frequency (logarithmic)
        // Center (0) = 1kHz, full left = 100Hz, full right = 10kHz
        float freq = 1000.0f * std::pow(10.0f, position); // 100Hz to 10kHz range

        lowpassFilter.setType(FlarkButterworthFilter::Lowpass);
        lowpassFilter.setCutoff(freq);
        lowpassFilter.setResonance(qValue);

        highpassFilter.setType(FlarkButterworthFilter::Highpass);
        highpassFilter.setCutoff(freq);
        highpassFilter.setResonance(qValue);
    }

    float sampleRate;
    float position = 0.0f;  // -1 to +1
    float qValue = 2.0f;

    FlarkButterworthFilter lowpassFilter;
    FlarkButterworthFilter highpassFilter;
};
