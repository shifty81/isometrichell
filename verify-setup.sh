#!/usr/bin/env bash

# Verification Script for The Daily Grind
# Tests that all required files and dependencies are present

echo "=========================================="
echo "  The Daily Grind - Setup Verification"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check if file/directory exists
check_exists() {
    if [ -e "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check if command exists
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 found: $(command -v $1)"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $2 not found"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

echo "1. Checking Core Files..."
echo "-------------------------------------------"
check_exists "index.html" "Main HTML file"
check_exists "package.json" "Package configuration"
check_exists "CMakeLists.txt" "CMake configuration"
check_exists "README.md" "README documentation"
echo ""

echo "2. Checking Scripts..."
echo "-------------------------------------------"
check_exists "launch-editor.sh" "Web editor launcher"
check_exists "launch-engine.sh" "C++ engine launcher"
check_exists "build-engine.sh" "Build script"
echo ""

echo "3. Checking Engine Code (JavaScript)..."
echo "-------------------------------------------"
check_exists "engine/core/Engine.js" "Core engine"
check_exists "engine/core/Time.js" "Time management"
check_exists "engine/core/Input.js" "Input handling"
check_exists "engine/assets/AssetLoader.js" "Asset loader"
check_exists "engine/audio/AudioManager.js" "Audio manager"
check_exists "engine/rendering/Renderer.js" "Renderer"
check_exists "engine/rendering/IsometricRenderer.js" "Isometric renderer"
check_exists "engine/rendering/Camera.js" "Camera system"
echo ""

echo "4. Checking Game Code (JavaScript)..."
echo "-------------------------------------------"
check_exists "src/Game.js" "Main game class"
check_exists "src/main.js" "Entry point"
check_exists "src/world/World.js" "World system"
check_exists "src/world/Tile.js" "Tile system"
check_exists "src/entities/Entity.js" "Entity base class"
check_exists "src/entities/Boat.js" "Boat entity"
check_exists "src/building/Building.js" "Building class"
check_exists "src/building/BuildingSystem.js" "Building system"
check_exists "src/editor/EditorUI.js" "Asset editor UI"
echo ""

echo "5. Checking C++ Engine Code..."
echo "-------------------------------------------"
check_exists "cpp/src/main.cpp" "C++ entry point"
check_exists "cpp/include/engine" "Engine headers"
check_exists "cpp/include/rendering" "Rendering headers"
check_exists "cpp/include/world" "World headers"
check_exists "cpp/src/engine" "Engine source"
check_exists "cpp/src/rendering" "Rendering source"
check_exists "cpp/external" "External libraries"
echo ""

echo "6. Checking Assets..."
echo "-------------------------------------------"
check_exists "assets" "Assets directory"
check_exists "assets/ground_tiles_sheets" "Ground tiles"
check_exists "assets/isometric_trees_pack" "Trees"
check_exists "assets/MusicAndSFX" "Audio files"

if [ -d "assets/ground_tiles_sheets" ]; then
    GROUND_COUNT=$(find assets/ground_tiles_sheets -name "*.png" 2>/dev/null | wc -l)
    if [ "$GROUND_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Found $GROUND_COUNT ground tile sheets"
    else
        echo -e "${YELLOW}⚠${NC} No ground tile sheets found"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

if [ -d "assets/isometric_trees_pack" ]; then
    TREE_COUNT=$(find assets/isometric_trees_pack -name "*.png" 2>/dev/null | wc -l)
    if [ "$TREE_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Found $TREE_COUNT tree assets"
    else
        echo -e "${YELLOW}⚠${NC} No tree assets found"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

echo "7. Checking Documentation..."
echo "-------------------------------------------"
if check_exists "docs/README.md" "Docs index"; then
    :
else
    check_exists "docs" "Docs directory"
fi
check_exists "docs/TESTING_GUIDE.md" "Testing guide"
check_exists "docs/CPP_BUILD.md" "C++ build guide"
check_exists "docs/PROJECT_SUMMARY.md" "Project summary"
check_exists "docs/ARCHITECTURE.md" "Architecture docs"
echo ""

echo "8. Checking Dependencies..."
echo "-------------------------------------------"

# Check for Node.js/npm
if check_command "node" "Node.js"; then
    NODE_VERSION=$(node --version)
    echo "  Version: $NODE_VERSION"
fi

if check_command "npm" "npm"; then
    NPM_VERSION=$(npm --version)
    echo "  Version: $NPM_VERSION"
fi

# Check for Python
if check_command "python3" "Python 3"; then
    PYTHON_VERSION=$(python3 --version)
    echo "  Version: $PYTHON_VERSION"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found - run 'npm install'"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

echo "9. Checking C++ Build Dependencies..."
echo "-------------------------------------------"

# These are optional since web editor works without them
check_command "cmake" "CMake" || true
check_command "g++" "C++ compiler" || true
check_command "make" "Make" || true

# Check for OpenGL (pkg-config)
if command -v pkg-config &> /dev/null; then
    if pkg-config --exists gl 2>/dev/null; then
        echo -e "${GREEN}✓${NC} OpenGL development libraries found"
    else
        echo -e "${YELLOW}⚠${NC} OpenGL development libraries not found (needed for C++ engine)"
        echo "  See docs/BUILD_DEPENDENCIES.md for installation instructions"
    fi
else
    echo -e "${YELLOW}⚠${NC} pkg-config not found (cannot check OpenGL)"
fi

echo ""

echo "=========================================="
echo "  Verification Summary"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "The web editor is ready to use:"
    echo "  ./launch-editor.sh"
    echo ""
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
        echo "  These are optional and don't affect the web editor."
        echo ""
    fi
    
    echo "To test the system:"
    echo "  See docs/TESTING_GUIDE.md for detailed testing instructions"
    echo ""
    
    exit 0
else
    echo -e "${RED}✗ $ERRORS critical error(s) found${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    
    echo ""
    echo "Please fix the errors above before running the editor."
    echo "See README.md for setup instructions."
    echo ""
    
    exit 1
fi
