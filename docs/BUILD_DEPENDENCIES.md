# Build Dependencies

This document explains the dependencies required to build The Daily Grind C++ Engine.

## Required Dependencies

### OpenGL Development Libraries

The engine requires OpenGL for graphics rendering. The following packages must be installed:

#### Ubuntu/Debian (including this environment)
```bash
sudo apt-get update
sudo apt-get install -y \
    libopengl-dev \
    libgl-dev \
    libglu1-mesa-dev
```

#### Fedora/RHEL/CentOS
```bash
sudo dnf install -y \
    mesa-libGL-devel \
    mesa-libGLU-devel
```

#### Arch Linux
```bash
sudo pacman -S mesa glu
```

### X11 Development Libraries (for GLFW)

GLFW (the windowing library) requires X11 development headers:

#### Ubuntu/Debian
```bash
sudo apt-get install -y \
    libx11-dev \
    libxrandr-dev \
    libxinerama-dev \
    libxcursor-dev \
    libxi-dev \
    libxext-dev
```

#### Fedora/RHEL/CentOS
```bash
sudo dnf install -y \
    libX11-devel \
    libXrandr-devel \
    libXinerama-devel \
    libXcursor-devel \
    libXi-devel
```

#### Arch Linux
```bash
sudo pacman -S libx11 libxrandr libxinerama libxcursor libxi
```

### Build Tools

The following build tools are also required:

- **CMake** >= 3.10
- **C++ Compiler** with C++17 support (GCC 7+, Clang 5+, or MSVC 2017+)
- **Git** (for fetching dependencies)

## Quick Install (Ubuntu/Debian)

Install all required dependencies with a single command:

```bash
sudo apt-get update && sudo apt-get install -y \
    build-essential \
    cmake \
    git \
    libopengl-dev \
    libgl-dev \
    libglu1-mesa-dev \
    libx11-dev \
    libxrandr-dev \
    libxinerama-dev \
    libxcursor-dev \
    libxi-dev \
    libxext-dev
```

## Verifying Installation

After installing the dependencies, verify they are properly installed:

```bash
# Check for OpenGL headers
ls /usr/include/GL/gl.h
ls /usr/include/GL/glu.h

# Check for X11 headers
ls /usr/include/X11/Xlib.h

# Check CMake version
cmake --version
```

## Dependencies Automatically Fetched by CMake

The following dependencies are automatically downloaded and built by CMake if not found on your system:

- **GLFW** 3.3.8 - Windowing and input library
- **GLM** 0.9.9.8 - OpenGL Mathematics library

Additional dependencies included in the source:

- **GLAD** - OpenGL loader (included in `cpp/external/glad/`)
- **stb_image** - Image loading library (included in `cpp/external/stb/`)

## Current Missing Dependencies in This Environment

Based on the build failure, the following packages are missing:

1. ✗ **libopengl-dev** - OpenGL development headers
2. ✗ **libgl-dev** - GL development headers  
3. ✗ **libglu1-mesa-dev** - GLU (OpenGL Utility) development headers
4. ✗ **libx11-dev** - X11 development headers
5. ✗ **libxrandr-dev** - X11 RandR extension development headers
6. ✗ **libxinerama-dev** - X11 Xinerama extension development headers
7. ✗ **libxcursor-dev** - X11 cursor management development headers
8. ✗ **libxi-dev** - X11 Input extension development headers
9. ✗ **libxext-dev** - X11 extensions development headers

## Headless/Server Environment Considerations

If you're building in a headless environment (no X11 display), you have a few options:

### Option 1: Use OSMesa (Software Rendering)
```bash
sudo apt-get install libosmesa6-dev
```

Then modify CMakeLists.txt to use OSMesa instead of standard OpenGL.

### Option 2: Install Minimal X11 Libraries
You can install just the development headers without a full X11 server:
```bash
sudo apt-get install -y \
    libopengl-dev \
    libgl-dev \
    libglu1-mesa-dev \
    libx11-dev \
    libxrandr-dev \
    libxinerama-dev \
    libxcursor-dev \
    libxi-dev
```

The libraries will be installed, but you won't be able to run the graphical application without an X server.

### Option 3: Use Xvfb (Virtual Framebuffer)
For testing in CI/CD environments:
```bash
sudo apt-get install xvfb
xvfb-run ./build/IsometricHell
```

## Troubleshooting

### CMake Can't Find OpenGL
```
CMake Error: Could NOT find OpenGL (missing: OPENGL_opengl_LIBRARY OPENGL_glx_LIBRARY OPENGL_INCLUDE_DIR)
```

**Solution:** Install the OpenGL development packages as described above.

### GLFW Build Fails
```
Could not find X11 libraries
```

**Solution:** Install the X11 development packages as described above.

### Linker Errors
```
undefined reference to `glXCreateContext'
```

**Solution:** Ensure both the development headers AND the runtime libraries are installed.

## CI/CD Integration

For automated builds in CI/CD pipelines, add this to your workflow:

```yaml
- name: Install Dependencies
  run: |
    sudo apt-get update
    sudo apt-get install -y \
      libopengl-dev \
      libgl-dev \
      libglu1-mesa-dev \
      libx11-dev \
      libxrandr-dev \
      libxinerama-dev \
      libxcursor-dev \
      libxi-dev
```

## Next Steps

After installing all dependencies:

1. Clean any previous failed build:
   ```bash
   rm -rf build
   ```

2. Run the build script:
   ```bash
   ./build-engine.sh
   ```

3. Check the build log in `logs/build-YYYYMMDD-HHMMSS.log` for any issues.
