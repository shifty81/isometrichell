#!/bin/bash

# Build script for Isometric Hell C++ Engine

echo "========================================"
echo "  Building Isometric Hell C++ Engine"
echo "========================================"
echo ""

# Create build directory if it doesn't exist
if [ ! -d "build" ]; then
    echo "Creating build directory..."
    mkdir build
fi

cd build

# Run CMake
echo "Running CMake..."
cmake .. -DCMAKE_BUILD_TYPE=Release

if [ $? -ne 0 ]; then
    echo "CMake configuration failed!"
    exit 1
fi

# Build
echo ""
echo "Building..."
cmake --build . --config Release

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "  Build completed successfully!"
echo "========================================"
echo ""
echo "To run the game:"
echo "  ./build/IsometricHell"
echo ""
echo "Or use the launch script:"
echo "  ./launch-engine.sh"
echo ""
