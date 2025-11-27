cmake_minimum_required(VERSION 3.22)

# FlarkDJ v1.1.0 - Multi-platform DJ effects plugin
project(FlarkDJ VERSION 1.1.0)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add JUCE
# Option 1: JUCE is in a subdirectory
# add_subdirectory(JUCE)

# Option 2: JUCE is installed system-wide
# find_package(JUCE CONFIG REQUIRED)

# If JUCE is not found, download it
include(FetchContent)
FetchContent_Declare(
    JUCE
    GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
    GIT_TAG        7.0.9
)
FetchContent_MakeAvailable(JUCE)

# Plugin formats to build (platform-specific)
set(FLARKDJ_FORMATS VST3 Standalone)

# Add platform-specific formats
if(APPLE)
    # Skip AU for now to avoid build issues on CI
    # list(APPEND FLARKDJ_FORMATS AU)
elseif(UNIX AND NOT APPLE)
    # Linux only
    list(APPEND FLARKDJ_FORMATS LV2)
endif()

# Optionally add AAX if SDK is available
# if(EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/SDKs/AAX")
#     list(APPEND FLARKDJ_FORMATS AAX)
# endif()

# Create the plugin
juce_add_plugin(FlarkDJ
    COMPANY_NAME "FlarkDJ Team"
    BUNDLE_ID com.flarkdj.flarkdj
    PLUGIN_MANUFACTURER_CODE Flrk
    PLUGIN_CODE FLDj
    FORMATS ${FLARKDJ_FORMATS}
    PRODUCT_NAME "FlarkDJ"

    # Plugin characteristics
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT TRUE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE

    # AAX settings (if building AAX)
    # AAX_IDENTIFIER com.flarkdj.flarkdj

    # VST3 settings
    VST3_CATEGORIES Fx Dynamics Filter Reverb Delay

    # AU settings
    AU_MAIN_TYPE kAudioUnitType_Effect

    # LV2 settings
    LV2URI https://flarkdj.com/plugins/flarkdj

    # CLAP settings
    CLAP_ID com.flarkdj.flarkdj

    # Copy plugin to system folders after build (disable on CI)
    COPY_PLUGIN_AFTER_BUILD FALSE
)

# Source files
target_sources(FlarkDJ PRIVATE
    FlarkDJProcessor.cpp
    FlarkDJProcessor.h
    FlarkDJEditor.cpp
    FlarkDJEditor.h
    FlarkDJDSP.h
)

# Compiler definitions
target_compile_definitions(FlarkDJ PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    JUCE_VST3_CAN_REPLACE_VST2=0
    JUCE_DISPLAY_SPLASH_SCREEN=0
    JUCE_REPORT_APP_USAGE=0
)

# Link JUCE modules
target_link_libraries(FlarkDJ PRIVATE
    juce::juce_audio_basics
    juce::juce_audio_devices
    juce::juce_audio_formats
    juce::juce_audio_plugin_client
    juce::juce_audio_processors
    juce::juce_audio_utils
    juce::juce_core
    juce::juce_data_structures
    juce::juce_events
    juce::juce_graphics
    juce::juce_gui_basics
    juce::juce_gui_extra
PUBLIC
    juce::juce_recommended_config_flags
    juce::juce_recommended_lto_flags
    juce::juce_recommended_warning_flags
)

# Platform-specific settings
if(APPLE)
    target_compile_definitions(FlarkDJ PRIVATE
        JUCE_MAC=1
    )

    # Code signing (optional)
    # set_target_properties(FlarkDJ PROPERTIES
    #     XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "Developer ID Application"
    #     XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "YOUR_TEAM_ID"
    # )
elseif(WIN32)
    target_compile_definitions(FlarkDJ PRIVATE
        JUCE_WINDOWS=1
    )
elseif(UNIX)
    target_compile_definitions(FlarkDJ PRIVATE
        JUCE_LINUX=1
    )
endif()

# Installation
install(TARGETS FlarkDJ
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
    RUNTIME DESTINATION bin
)

# Print build information
message(STATUS "FlarkDJ Plugin Configuration:")
message(STATUS "  Version: ${PROJECT_VERSION}")
message(STATUS "  Formats: ${FLARKDJ_FORMATS}")
message(STATUS "  C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "  Build Type: ${CMAKE_BUILD_TYPE}")
