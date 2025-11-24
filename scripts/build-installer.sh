#!/bin/bash

set -e

echo "Building FlarkDJ installers..."

npm run build

echo "Creating installers for all platforms..."

if [ "$1" == "mac" ] || [ -z "$1" ]; then
  echo "Building macOS installer..."
  npx electron-builder --mac
fi

if [ "$1" == "win" ] || [ -z "$1" ]; then
  echo "Building Windows installer..."
  npx electron-builder --win
fi

if [ "$1" == "linux" ] || [ -z "$1" ]; then
  echo "Building Linux installer..."
  npx electron-builder --linux
fi

echo "Installers created in ./release directory"
