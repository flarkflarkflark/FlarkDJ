#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_gui_extra/juce_gui_extra.h>
#include "FlarkDJProcessor.h"

/**
 * FlarkDJ Web View Component
 *
 * Embeds the web-based pedalboard interface into the JUCE plugin
 * Provides bi-directional communication between JUCE and JavaScript
 */

class FlarkDJWebView : public juce::Component
{
public:
    FlarkDJWebView(FlarkDJAudioProcessor& p)
        : audioProcessor(p)
    {
        // Create web browser component
        webView = std::make_unique<juce::WebBrowserComponent>(
            juce::WebBrowserComponent::Options()
                .withBackend(juce::WebBrowserComponent::Options::Backend::webview2)
                .withWinWebView2Options(juce::WebBrowserComponent::Options::WinWebView2{}
                    .withUserDataFolder(juce::File::getSpecialLocation(
                        juce::File::SpecialLocationType::tempDirectory)))
        );

        addAndMakeVisible(webView.get());

        // Setup JavaScript integration
        setupJavaScriptInterface();

        // Load the pedalboard interface
        loadPedalboardInterface();

        // Start parameter sync timer
        startTimer(100); // Update every 100ms
    }

    ~FlarkDJWebView() override
    {
        stopTimer();
    }

    void resized() override
    {
        if (webView)
            webView->setBounds(getLocalBounds());
    }

    void paint(juce::Graphics& g) override
    {
        g.fillAll(juce::Colour(0xff1a1a2e));
    }

private:
    FlarkDJAudioProcessor& audioProcessor;
    std::unique_ptr<juce::WebBrowserComponent> webView;

    /**
     * Setup JavaScript interface for bi-directional communication
     */
    void setupJavaScriptInterface()
    {
        if (!webView) return;

        // Register native functions callable from JavaScript
        webView->evaluateJavascript(R"(
            // Create bridge object
            window.juceInterface = {
                // Get parameter value from native plugin
                getParameter: function(paramId) {
                    return window.juce_getParameter(paramId);
                },

                // Set parameter value in native plugin
                setParameter: function(paramId, value) {
                    window.juce_setParameter(paramId, value);
                },

                // Get all parameters
                getAllParameters: function() {
                    return window.juce_getAllParameters();
                },

                // Notify that web interface is ready
                ready: function() {
                    window.juce_webViewReady();
                }
            };
        )");
    }

    /**
     * Load the pedalboard web interface
     */
    void loadPedalboardInterface()
    {
        if (!webView) return;

        // Get the plugin's resource path
        auto pluginDir = juce::File::getSpecialLocation(
            juce::File::SpecialLocationType::currentExecutableFile
        ).getParentDirectory();

        // Look for web-app directory in several locations
        juce::File webAppDir;

        // 1. Try plugin directory/Resources/web-app (macOS bundle)
        webAppDir = pluginDir.getChildFile("../Resources/web-app");
        if (!webAppDir.exists())
        {
            // 2. Try plugin directory/web-app
            webAppDir = pluginDir.getChildFile("web-app");
        }
        if (!webAppDir.exists())
        {
            // 3. Try development location (relative to build directory)
            webAppDir = pluginDir.getChildFile("../../web-app");
        }

        if (webAppDir.exists())
        {
            auto indexFile = webAppDir.getChildFile("index.html");
            if (indexFile.existsAsFile())
            {
                webView->goToURL(indexFile.getFullPathName());
                DBG("Loaded pedalboard from: " + indexFile.getFullPathName());
                return;
            }
        }

        // Fallback: Load from embedded HTML
        loadEmbeddedInterface();
    }

    /**
     * Load embedded minimal interface (fallback)
     */
    void loadEmbeddedInterface()
    {
        juce::String html = R"HTML(
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FlarkDJ Pedalboard</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a2e;
            color: #e9ecef;
            font-family: 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #ff8c42;
            margin-bottom: 20px;
        }
        .error {
            background: #2c3e50;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
        }
        .info {
            margin-top: 20px;
            padding: 15px;
            background: #16213e;
            border-radius: 6px;
        }
        code {
            background: #0f3460;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎛️ FlarkDJ Pedalboard</h1>
        <div class="error">
            <h2>⚠️ Web Interface Not Found</h2>
            <p>The pedalboard web interface files could not be located.</p>
        </div>
        <div class="info">
            <h3>Expected Location:</h3>
            <p>Place the <code>web-app</code> directory in one of these locations:</p>
            <ul style="text-align: left;">
                <li><code>[Plugin]/Resources/web-app/</code> (macOS)</li>
                <li><code>[Plugin]/web-app/</code> (Windows/Linux)</li>
                <li><code>[Build]/web-app/</code> (Development)</li>
            </ul>
        </div>
        <div class="info">
            <p>For now, please use the <strong>Native View</strong> button to access the plugin controls.</p>
        </div>
    </div>
</body>
</html>
)HTML";

        webView->goToURL("data:text/html;charset=utf-8," + juce::URL::addEscapeChars(html, false));
    }

    /**
     * Timer callback for syncing parameters
     */
    void timerCallback() override
    {
        // Sync parameter changes from native to web
        syncParametersToWeb();
    }

    /**
     * Sync native parameter values to web interface
     */
    void syncParametersToWeb()
    {
        if (!webView) return;

        // Build JavaScript to update web interface parameters
        juce::String js = "if (window.juceParameterUpdate) { window.juceParameterUpdate({";

        auto& params = audioProcessor.getParameters();
        for (int i = 0; i < params.size(); ++i)
        {
            if (auto* param = dynamic_cast<juce::AudioProcessorParameter*>(params[i]))
            {
                if (i > 0) js << ",";
                js << "'" << param->getName(32) << "': " << juce::String(param->getValue());
            }
        }

        js << "}); }";

        webView->evaluateJavascript(js);
    }

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(FlarkDJWebView)
};

/**
 * Enhanced FlarkDJ Editor with Web View Support
 *
 * This is a wrapper that provides both native and web views
 * with a toggle button to switch between them
 */

class FlarkDJDualModeEditor : public juce::AudioProcessorEditor,
                               private juce::Button::Listener
{
public:
    FlarkDJDualModeEditor(FlarkDJAudioProcessor& p)
        : AudioProcessorEditor(&p), audioProcessor(p)
    {
        // Create view toggle button
        viewToggleButton.setButtonText("Switch to Web View");
        viewToggleButton.addListener(this);
        addAndMakeVisible(viewToggleButton);

        // Start with native view (create it externally)
        showingWebView = false;

        // Create web view (lazy loaded)
        webView = std::make_unique<FlarkDJWebView>(p);
        webView->setVisible(false);
        addAndMakeVisible(webView.get());

        // Set initial size
        setSize(950, 900);
        setResizable(true, true);
        setResizeLimits(800, 700, 1400, 1200);
    }

    void resized() override
    {
        auto bounds = getLocalBounds();

        // Toggle button at top
        viewToggleButton.setBounds(bounds.removeFromTop(40).reduced(10));

        // Rest for current view
        if (showingWebView && webView)
        {
            webView->setBounds(bounds);
        }
        // Native view bounds handled externally
    }

    void paint(juce::Graphics& g) override
    {
        g.fillAll(juce::Colour(0xff1a1a2e));
    }

    void buttonClicked(juce::Button* button) override
    {
        if (button == &viewToggleButton)
        {
            showingWebView = !showingWebView;

            if (showingWebView)
            {
                viewToggleButton.setButtonText("Switch to Native View");
                if (webView) webView->setVisible(true);
                // Hide native view (handled externally)
            }
            else
            {
                viewToggleButton.setButtonText("Switch to Web View");
                if (webView) webView->setVisible(false);
                // Show native view (handled externally)
            }

            resized();
        }
    }

    bool isShowingWebView() const { return showingWebView; }

private:
    FlarkDJAudioProcessor& audioProcessor;
    juce::TextButton viewToggleButton;
    std::unique_ptr<FlarkDJWebView> webView;
    bool showingWebView = false;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(FlarkDJDualModeEditor)
};
