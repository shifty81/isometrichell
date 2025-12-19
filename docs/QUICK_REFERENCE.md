# Quick Reference Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Build the C++ Engine
```bash
./build-engine.sh
```

### Step 2: Run the Game
```bash
./launch-engine.sh
```

### Step 3: Create Maps
```bash
# Option A: Web Editor
./launch-editor.sh

# Option B: Tiled (Install from https://www.mapeditor.org/)
# Open: tiled_maps/template_map_highres.tmx
```

## 🎮 Controls

### C++ Game Engine
| Key | Action |
|-----|--------|
| WASD / Arrows | Move camera |
| B | Toggle building mode |
| 1 | House |
| 2 | Tower |
| 3 | Warehouse |
| Left Click | Place building |
| ESC | Exit |

### Web Map Editor
| Key | Action |
|-----|--------|
| WASD / Arrows | Move camera |
| B | Building mode |
| 1/2/3 | Building type |
| Left Click | Place |
| Space | Spawn boat |

## 📊 Tile Sizes Quick Reference

| Asset Type | Standard | High-Res | Ultra (Future) |
|-----------|----------|----------|----------------|
| Ground    | 64×32    | 128×64   | 256×128        |
| Trees     | 64×64    | 128×128  | 256×256        |
| Buildings | Varies   | 2× size  | 4× size        |

## 📁 Key Directories

```
Root/
├── cpp/           → C++ engine source
├── tilesheets/    → Tiled tileset configs
├── tiled_maps/    → Tiled map files
├── assets/        → Original asset images
├── engine/        → Web editor engine
├── src/           → Web editor game code
└── docs/          → All documentation
```

## 🔧 Common Commands

### Build
```bash
# Clean build
rm -rf build && ./build-engine.sh

# Manual build
mkdir build && cd build
cmake .. && cmake --build .
```

### Run
```bash
# C++ Game
./build/IsometricHell

# Web Editor (port 8000)
python3 -m http.server 8000
# OR
npm start
```

## 📚 Documentation Quick Links

| Need Help With | Read This |
|----------------|-----------|
| Building C++ engine | [CPP_BUILD.md](CPP_BUILD.md) |
| Using Tiled | [TILED_GUIDE.md](TILED_GUIDE.md) |
| Asset organization | [ASSET_CATALOG.md](ASSET_CATALOG.md) |
| Resolution/scaling | [TILESET_RESOLUTION.md](TILESET_RESOLUTION.md) |
| Overall summary | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |
| Architecture details | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Future plans | [ROADMAP.md](ROADMAP.md) |

## 🎨 Asset Paths

### Ground Tiles
```
Standard:  assets/ground_tiles_sheets/grass_green_64x32.png
High-Res:  assets/ground_tiles_sheets/grass_green_128x64.png
```

### Trees
```
Standard:  assets/isometric_trees_pack/sheets/trees_64x32_shaded.png
High-Res:  assets/isometric_trees_pack/sheets/trees_128x64_shaded.png
```

### Tilesets
```
Standard:  tilesheets/ground/grass_green.tsx
High-Res:  tilesheets/ground/grass_green_128.tsx
```

## 🔍 Troubleshooting

### Build Issues
```bash
# Missing dependencies (Ubuntu/Debian)
sudo apt-get install cmake libglfw3-dev libglm-dev

# Missing dependencies (macOS)
brew install cmake glfw glm

# Clear CMake cache
rm -rf build/CMakeCache.txt build/CMakeFiles
```

### Runtime Issues
```bash
# Check OpenGL version
glxinfo | grep "OpenGL version"

# Assets not loading
ls -la assets/  # Ensure assets folder exists

# Permission denied
chmod +x *.sh
```

### Tiled Issues
- Maps not loading: Check .tsx file paths are relative
- Tiles not showing: Verify image paths in .tsx files
- Wrong dimensions: Ensure map is "isometric" orientation

## 💡 Tips

### Performance
- Use HIGH quality for desktop
- Use MEDIUM for lower-end systems
- Enable vsync: `glfwSwapInterval(1)`

### Asset Creation
- Create at 2× resolution, scale down
- Use PNG with alpha transparency
- Keep sheets power-of-2 when possible

### Map Design
- Layer order: Ground → Details → Objects → Buildings
- Use properties for game logic
- Test frequently in-game

## 🆘 Need More Help?

1. Check `docs/` folder for detailed guides
2. Review example maps in `tiled_maps/`
3. Look at tileset configs in `tilesheets/`
4. Examine C++ source in `cpp/src/` for implementation details

## 📝 Quick Commands Cheatsheet

```bash
# Build engine
./build-engine.sh

# Run game
./launch-engine.sh

# Run editor
./launch-editor.sh

# View project structure
tree -L 2 -I 'build|node_modules'

# Check asset sizes
du -sh assets/*

# List tilesets
ls tilesheets/*/*.tsx

# Find all maps
find tiled_maps -name "*.tmx"
```

## 🎯 Next Steps

1. Build and test the engine: `./launch-engine.sh`
2. Open Tiled and load: `tiled_maps/template_map_highres.tmx`
3. Create your first custom map
4. Export to JSON and load in engine
5. Start adding gameplay features!

---

**Pro Tip**: Bookmark this file! It contains everything you need for daily development.
