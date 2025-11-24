#!/bin/bash
#
# FlarkDJ Native Plugin Build Script
#
# This script builds the FlarkDJ native audio plugins for your platform.
# Requires: CMake 3.22+, C++17 compiler, platform SDKs
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="${SCRIPT_DIR}/build"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}FlarkDJ Native Plugin Build Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Parse arguments
BUILD_TYPE="Release"
CLEAN_BUILD=false
JOBS=$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)

while [[ $# -gt 0 ]]; do
    case $1 in
        --debug)
            BUILD_TYPE="Debug"
            shift
            ;;
        --clean)
            CLEAN_BUILD=true
            shift
            ;;
        --jobs)
            JOBS="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "Build type: ${GREEN}${BUILD_TYPE}${NC}"
echo -e "Jobs: ${GREEN}${JOBS}${NC}"
echo ""

# Check for dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"

if ! command -v cmake &> /dev/null; then
    echo -e "${RED}ERROR: CMake not found!${NC}"
    echo "Install CMake from https://cmake.org/ or your package manager"
    exit 1
fi

CMAKE_VERSION=$(cmake --version | head -1 | grep -oP '\d+\.\d+\.\d+')
echo -e "✓ CMake ${CMAKE_VERSION} found"

if ! command -v c++ &> /dev/null && ! command -v clang++ &> /dev/null; then
    echo -e "${RED}ERROR: C++ compiler not found!${NC}"
    echo "Install a C++ compiler (g++, clang++, or MSVC)"
    exit 1
fi

CXX_COMPILER="${CXX:-c++}"
echo -e "✓ C++ compiler found: ${CXX_COMPILER}"

# Platform-specific checks
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo ""
    echo -e "${YELLOW}Checking Linux dependencies...${NC}"

    MISSING_DEPS=()

    if ! pkg-config --exists alsa; then
        MISSING_DEPS+=("libasound2-dev")
    fi

    if ! pkg-config --exists x11; then
        MISSING_DEPS+=("libx11-dev")
    fi

    if ! pkg-config --exists xrandr; then
        MISSING_DEPS+=("libxrandr-dev")
    fi

    if ! pkg-config --exists freetype2; then
        MISSING_DEPS+=("libfreetype6-dev")
    fi

    if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
        echo -e "${RED}ERROR: Missing dependencies!${NC}"
        echo ""
        echo "Install with:"
        echo "  sudo apt-get install ${MISSING_DEPS[@]}"
        echo ""
        echo "Or for Fedora/RHEL:"
        echo "  sudo dnf install alsa-lib-devel libX11-devel libXrandr-devel freetype-devel"
        exit 1
    fi

    echo -e "✓ All Linux dependencies found"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "✓ macOS detected"
    if ! xcode-select -p &> /dev/null; then
        echo -e "${YELLOW}WARNING: Xcode Command Line Tools not found${NC}"
        echo "Install with: xcode-select --install"
    fi
fi

echo ""

# Clean build if requested
if [ "$CLEAN_BUILD" = true ]; then
    echo -e "${YELLOW}Cleaning build directory...${NC}"
    rm -rf "${BUILD_DIR}"
    echo -e "✓ Build directory cleaned"
    echo ""
fi

# Create build directory
mkdir -p "${BUILD_DIR}"
cd "${BUILD_DIR}"

# Configure
echo -e "${BLUE}Configuring with CMake...${NC}"
cmake .. \
    -DCMAKE_BUILD_TYPE="${BUILD_TYPE}" \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON

echo ""
echo -e "${GREEN}✓ Configuration complete${NC}"
echo ""

# Build
echo -e "${BLUE}Building plugins...${NC}"
cmake --build . --config "${BUILD_TYPE}" -j "${JOBS}"

echo ""
echo -e "${GREEN}✓ Build complete!${NC}"
echo ""

# Show output
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Build Output${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

ARTIFACTS_DIR="${BUILD_DIR}/FlarkDJ_artefacts/${BUILD_TYPE}"

if [ -d "${ARTIFACTS_DIR}" ]; then
    echo -e "Build artifacts location:"
    echo -e "  ${GREEN}${ARTIFACTS_DIR}${NC}"
    echo ""

    echo -e "Built plugins:"

    if [ -d "${ARTIFACTS_DIR}/VST3" ]; then
        VST3_SIZE=$(du -sh "${ARTIFACTS_DIR}/VST3" | cut -f1)
        echo -e "  ✓ VST3 plugin (${VST3_SIZE})"
    fi

    if [ -d "${ARTIFACTS_DIR}/AU" ]; then
        AU_SIZE=$(du -sh "${ARTIFACTS_DIR}/AU" | cut -f1)
        echo -e "  ✓ Audio Unit (${AU_SIZE})"
    fi

    if [ -d "${ARTIFACTS_DIR}/Standalone" ]; then
        STANDALONE_SIZE=$(du -sh "${ARTIFACTS_DIR}/Standalone" | cut -f1)
        echo -e "  ✓ Standalone app (${STANDALONE_SIZE})"
    fi

    echo ""
    echo -e "${YELLOW}Installation:${NC}"
    echo ""

    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS:"
        echo "  VST3:       cp -r ${ARTIFACTS_DIR}/VST3/FlarkDJ.vst3 ~/Library/Audio/Plug-Ins/VST3/"
        echo "  Audio Unit: cp -r ${ARTIFACTS_DIR}/AU/FlarkDJ.component ~/Library/Audio/Plug-Ins/Components/"
        echo "  Standalone: cp -r ${ARTIFACTS_DIR}/Standalone/FlarkDJ.app /Applications/"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux:"
        echo "  VST3:       mkdir -p ~/.vst3 && cp -r ${ARTIFACTS_DIR}/VST3/FlarkDJ.vst3 ~/.vst3/"
        echo "  Standalone: sudo cp ${ARTIFACTS_DIR}/Standalone/FlarkDJ /usr/local/bin/"
    fi

    echo ""
else
    echo -e "${RED}Warning: Build artifacts not found at expected location${NC}"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}"
