#!/bin/bash

# Build script for Isometric Hell C++ Engine

# Save the root directory first
ROOT_DIR=$(pwd)

# Create logs directory if it doesn't exist
mkdir -p "$ROOT_DIR/logs"

# Log file with timestamp
LOG_FILE="$ROOT_DIR/logs/build-$(date +%Y%m%d-%H%M%S).log"

# Create the log file first
touch "$LOG_FILE"

# Function to log messages to both console and file
log() {
    echo "$1" | tee -a "$LOG_FILE"
}

log "========================================"
log "  Building Isometric Hell C++ Engine"
log "========================================"
log "Build started at: $(date)"
log ""

# Create build directory if it doesn't exist
if [ ! -d "$ROOT_DIR/build" ]; then
    log "Creating build directory..."
    mkdir "$ROOT_DIR/build"
fi

cd "$ROOT_DIR/build"

# Run CMake
log "Running CMake..."
log ""
cmake .. -DCMAKE_BUILD_TYPE=Release 2>&1 | tee -a "$LOG_FILE"
CMAKE_EXIT_CODE=${PIPESTATUS[0]}

if [ $CMAKE_EXIT_CODE -ne 0 ]; then
    log ""
    log "========================================"
    log "ERROR: CMake configuration failed!"
    log "========================================"
    log ""
    log "Common issues and solutions:"
    log "1. Missing OpenGL libraries:"
    log "   Ubuntu/Debian: sudo apt-get install libopengl-dev libgl-dev libglu1-mesa-dev"
    log "   Fedora/RHEL: sudo dnf install mesa-libGL-devel mesa-libGLU-devel"
    log "   Arch: sudo pacman -S mesa glu"
    log ""
    log "2. Missing X11 development libraries (required by GLFW):"
    log "   Ubuntu/Debian: sudo apt-get install libx11-dev libxrandr-dev libxinerama-dev libxcursor-dev libxi-dev"
    log ""
    log "Build log saved to: $LOG_FILE"
    log ""
    exit 1
fi

# Build
log ""
log "Building..."
log ""
cmake --build . --config Release 2>&1 | tee -a "$LOG_FILE"
BUILD_EXIT_CODE=${PIPESTATUS[0]}

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    log ""
    log "========================================"
    log "ERROR: Build failed!"
    log "========================================"
    log "Build log saved to: $LOG_FILE"
    log ""
    exit 1
fi

log ""
log "========================================"
log "  Build completed successfully!"
log "========================================"
log "Build finished at: $(date)"
log ""
log "To run the game:"
log "  ./build/IsometricHell"
log ""
log "Or use the launch script:"
log "  ./launch-engine.sh"
log ""
log "Build log saved to: $LOG_FILE"
log ""
