#!/bin/bash

set -e

echo "Creating FlarkDJ distribution packages..."

# Clean and build
echo "Building TypeScript..."
npm run build

# Create npm package
echo "Creating npm package tarball..."
npm pack

# Create release directory
mkdir -p release

# Move tarball to release
mv *.tgz release/

echo "Distribution packages created in ./release directory"
echo ""
echo "Available packages:"
ls -lh release/

echo ""
echo "Installation instructions:"
echo "  npm install release/flark-dj-*.tgz"
echo ""
echo "To publish to npm registry:"
echo "  npm publish"
