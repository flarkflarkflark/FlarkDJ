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
