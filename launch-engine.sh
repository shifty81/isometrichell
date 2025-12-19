#!/bin/bash

# Launch script for Isometric Hell C++ Engine

echo "========================================"
echo "  Launching Isometric Hell C++ Engine"
echo "========================================"
echo ""

# Check if build exists
if [ ! -f "build/IsometricHell" ]; then
    echo "Engine not built yet. Building now..."
    ./build-engine.sh
    
    if [ $? -ne 0 ]; then
        echo "Build failed! Cannot launch."
        exit 1
    fi
fi

# Run the engine
cd build
./IsometricHell
