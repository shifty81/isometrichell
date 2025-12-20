# C++ Engine Build Instructions

## Overview

This project contains two components:
1. **C++ OpenGL Game Engine** - The actual game runtime
2. **Web-based Map Editor** - Tool for creating and editing game levels/scenes

## Prerequisites

### For C++ Engine

- **CMake** 3.10 or higher
- **C++ Compiler** with C++17 support:
  - Linux: GCC 7+ or Clang 5+
  - macOS: Xcode 10+ or Command Line Tools
  - Windows: Visual Studio 2017+ or MinGW-w64
- **OpenGL** 3.3 or higher
- **Development Libraries**:
  - On Ubuntu/Debian: `sudo apt-get install build-essential cmake libglfw3-dev libglm-dev`
  - On Fedora: `sudo dnf install gcc-c++ cmake glfw-devel glm-devel`
  - On macOS: `brew install cmake glfw glm`
  - On Windows: Libraries will be fetched automatically by CMake

### For Web Map Editor

- **Node.js** (recommended) or **Python 3**
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Start

### Option 1: Using Launch Scripts (Easiest)

#### Build and Run C++ Engine:
```bash
./launch-engine.sh
```

This script will automatically build the engine if needed and then run it.

#### Run Web Map Editor:
```bash
./launch-editor.sh
```

This script will start a local web server and open the map editor.

### Option 2: Manual Build

#### Building the C++ Engine:

```bash
# Create build directory
mkdir build
cd build

# Configure with CMake
cmake ..

# Build
cmake --build .

# Run
./IsometricHell
```

#### Running the Map Editor:

```bash
# Using npm
npm start

# Or using Python
python3 -m http.server 8000
```

Then open your browser to http://localhost:8000

## Project Structure

```
isometrichell/
├── cpp/                          # C++ Engine source code
│   ├── include/                  # Header files
│   │   ├── engine/              # Core engine (Engine, Time, Input)
│   │   ├── rendering/           # Rendering system (OpenGL, Shaders, Textures)
│   │   ├── world/               # Game world (Tiles, World)
│   │   ├── entities/            # Game entities
│   │   ├── building/            # Building system
│   │   ├── game/                # Main game logic
│   │   └── utils/               # Utilities (Isometric math)
│   ├── src/                     # Implementation files
│   │   └── [mirrors include structure]
│   ├── external/                # Third-party libraries
│   │   ├── glad/               # OpenGL loader
│   │   └── stb/                # Image loading (stb_image)
│   └── shaders/                 # GLSL shaders (embedded in code)
│
├── engine/                       # Web version engine (JavaScript)
├── src/                         # Web version game code (JavaScript)
├── assets/                      # Shared game assets (textures, audio)
├── index.html                   # Web editor entry point
│
├── CMakeLists.txt               # CMake build configuration
├── build-engine.sh              # Build script for C++ engine
├── launch-engine.sh             # Launch script for C++ engine
├── launch-editor.sh             # Launch script for web editor
└── README.md                    # Main project documentation
```

## Building on Different Platforms

### Linux

```bash
# Install dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install build-essential cmake libglfw3-dev libglm-dev

# Build
./build-engine.sh

# Run
./launch-engine.sh
```

### macOS

```bash
# Install dependencies
brew install cmake glfw glm

# Build
./build-engine.sh

# Run
./launch-engine.sh
```

### Windows

#### Using Visual Studio:

1. Install Visual Studio 2017 or later with C++ support
2. Install CMake for Windows
3. Open CMake GUI:
   - Set source directory to project root
   - Set build directory to `build`
   - Click "Configure" and select your Visual Studio version
   - Click "Generate"
4. Open `build/IsometricHell.sln` in Visual Studio
5. Build and run

#### Using MinGW:

```bash
# In Git Bash or MinGW shell
mkdir build
cd build
cmake -G "MinGW Makefiles" ..
mingw32-make
./IsometricHell.exe
```

## Controls

### C++ Engine (Game):

- **WASD / Arrow Keys** - Move camera
- **B** - Toggle building mode
- **1** - Select House (in building mode)
- **2** - Select Tower (in building mode)
- **3** - Select Warehouse (in building mode)
- **Left Click** - Place building (in building mode)
- **ESC** - Exit game

### Web Editor:

- **WASD / Arrow Keys** - Move camera
- **B** - Toggle building mode
- **1/2/3** - Select building type
- **Left Click** - Place building
- **Space** - Spawn boat on water tile
- **Mouse Hover** - Preview placement

## Dependencies

The project uses the following libraries:

- **GLFW** - Window management and input handling
- **GLAD** - OpenGL function loader
- **GLM** - Mathematics library for OpenGL
- **stb_image** - Image loading library

CMake will automatically fetch GLFW and GLM if they're not found on your system. GLAD and stb_image are included in the repository.

## Troubleshooting

### "GLFW not found" error:
Install GLFW development libraries for your system (see Prerequisites).

### "OpenGL version not supported":
Make sure your graphics drivers are up to date. The engine requires OpenGL 3.3 or higher.

### Compilation errors on Windows:
Make sure you have Visual Studio 2017 or later, or MinGW-w64 with GCC 7+.

### Black screen on launch:
Check the console for error messages. Ensure assets folder is in the same directory as the executable.

## Scene File Format (Future)

The map editor will export scenes in JSON format that can be loaded by the C++ engine:

```json
{
  "width": 30,
  "height": 30,
  "tiles": [...],
  "buildings": [...],
  "entities": [...]
}
```

## Next Steps

1. Create scenes in the web-based map editor
2. Export scenes to JSON files
3. Load scenes in the C++ engine
4. Extend with new features (NPCs, items, etc.)

## License

Open source - available for modification and use.
