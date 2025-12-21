# 🎮 The Daily Grind - 2D Life Simulation Game

> An isometric 2D life simulation game inspired by Project Zomboid and The Sims, featuring deep survival mechanics, complex AI, and social interactions. Experience the daily grind of life - work, relationships, survival, and personal growth - all built with custom technology.

[![License](https://img.shields.io/badge/license-Open%20Source-blue.svg)](LICENSE)
[![Project Status](https://img.shields.io/badge/status-Active%20Development-green.svg)](docs/ROADMAP.md)
[![Documentation](https://img.shields.io/badge/docs-Comprehensive-brightgreen.svg)](docs/)

---

## 📚 **Quick Links for Visual Learners**

| Document | Purpose | Visual Aids |
|----------|---------|-------------|
| 📋 **[DIRECTORY_STRUCTURE.md](docs/DIRECTORY_STRUCTURE.md)** | **REQUIRED READING** - File organization & naming conventions | ✅ Trees & Diagrams |
| 🤝 **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** | How to contribute to this project | ✅ Checklists & Examples |
| 🎨 **[ASSET_CATALOG.md](docs/ASSET_CATALOG.md)** | Complete asset inventory | ✅ Tables & Categories |
| 🏗️ **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Technical architecture | ✅ System Diagrams |
| 🗺️ **[ROADMAP.md](docs/ROADMAP.md)** | Development roadmap | ✅ Phase Breakdown |

---

## 🎮 Dual Architecture

This project features a unique **dual-system architecture**:

1. **🎮 C++ OpenGL Game Engine** - High-performance game runtime
   - Native C++ with OpenGL rendering
   - Optimized for gameplay performance
   - Cross-platform (Windows, Linux, macOS)
   
2. **🗺️ Web-based Map Editor** - Scene creation and level design tool
   - Browser-based editor for creating game levels
   - Visual tileset assembly
   - Export scenes for the C++ engine to load

This architecture allows for rapid level design in the web editor while maintaining high performance in the game engine.

## 🎨 Features

### Game Engine (C++ OpenGL)
- **Native Performance**: C++ OpenGL rendering at 60+ FPS
- **Isometric Rendering**: Proper diamond-shaped tile rendering with depth sorting
- **Building System**: Place houses, towers, and warehouses
- **Camera System**: Smooth camera movement with WASD controls
- **Entity System**: Extensible framework for game objects
- **Tile-Based World**: Procedurally generated worlds with varied terrain

### Map Editors

#### Web-based Editor
- **Visual Scene Builder**: Create levels visually in your browser
- **Asset System**: Professional asset loader with progress tracking
- **Audio System**: Background music and sound effects
- **Rich Asset Library**: Ground tiles, trees, bushes, characters, vehicles, buildings
- **Export Functionality**: Save scenes as JSON for C++ engine

#### WorldEd & TileZed (Professional Tools)
- **WorldEd**: Create large outdoor maps with neighborhoods, towns, and cities
- **TileZed/BuildingEd**: Design detailed building interiors with multi-floor support
- **Professional Features**: Zone management, road tools, advanced tile painting
- **TMX Export**: Export maps in Tiled Map XML format for use in both engines
- **See**: [WorldEdit/TileZed Setup Guide](docs/WORLDEDIT_TILEZED_SETUP.md)

## 🚀 Getting Started

### Quick Start & Testing

#### 1. Verify Setup (Recommended First Step):
```bash
npm test
# or
./verify-setup.sh
```

#### 2. Run the Web Map Editor:
```bash
./launch-editor.sh
```
Then open `http://localhost:8000` in your browser.

#### 3. Test Features:
See [QUICK_TEST.md](QUICK_TEST.md) for a 2-minute feature test, or [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) for comprehensive testing.

#### 4. Run the C++ Game Engine (Optional):
```bash
./launch-engine.sh
```
Note: Requires OpenGL dependencies. See [Prerequisites](#prerequisites) below.

### Prerequisites

#### For C++ Engine:
- CMake 3.10+
- C++17 compatible compiler
- OpenGL 3.3+ with development headers
- X11 development libraries (Linux)

**Quick Install (Ubuntu/Debian):**
```bash
sudo apt-get update && sudo apt-get install -y \
    build-essential cmake git \
    libopengl-dev libgl-dev libglu1-mesa-dev \
    libx11-dev libxrandr-dev libxinerama-dev libxcursor-dev libxi-dev
```

For other platforms and detailed dependency information, see [docs/BUILD_DEPENDENCIES.md](docs/BUILD_DEPENDENCIES.md)

#### For Web Editor:
- Node.js (recommended) or Python 3
- Modern web browser

#### For WorldEd/TileZed (Optional):
- p7zip-full (for .7z extraction) or unzip (for .zip files)
- Java Runtime Environment (required by the tools)

**Quick Install:**
```bash
# Ubuntu/Debian
sudo apt-get install p7zip-full default-jre

# macOS
brew install p7zip openjdk
```

**Setup WorldEd/TileZed:**
1. Download worlded.7z and tilezed.7z from [The Indie Stone Forums](https://theindiestone.com/forums/index.php?/topic/59675-latest-tilezed-worlded-and-tilesets-september-8-2022/)
2. Place the .7z files in the project root directory
3. Run: `./tools/setup-editors.sh`
4. Launch with: `./launch-tilezed.sh` or `./launch-worlded.sh`

See [docs/WORLDEDIT_TILEZED_SETUP.md](docs/WORLDEDIT_TILEZED_SETUP.md) for complete setup guide.

### Detailed Setup

#### C++ Engine - Manual Build:

```bash
# Build the engine
./build-engine.sh

# Or manually:
mkdir build && cd build
cmake ..
cmake --build .

# Run
./build/IsometricHell
```

See [docs/CPP_BUILD.md](docs/CPP_BUILD.md) for detailed build instructions.

#### Web Editor - Manual Start:

```bash
# Using npm
npm start

# Or using Python
python3 -m http.server 8000
```

Then open your browser to `http://localhost:8000`

## 🎯 Controls

### C++ Engine (Game):
| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move camera |
| B | Toggle building mode |
| 1 | Select house (in building mode) |
| 2 | Select tower (in building mode) |
| 3 | Select warehouse (in building mode) |
| Left Click | Place building |
| ESC | Exit game |

### Web Editor:
| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move camera |
| B | Toggle building mode |
| 1/2/3 | Select building type |
| Left Click | Place building |
| Space | Spawn boat on water tile |
| Mouse | Hover to preview placement |

## 📁 Project Structure

> **📋 For complete structure details and naming conventions, see [DIRECTORY_STRUCTURE.md](docs/DIRECTORY_STRUCTURE.md)**

```
TheDailyGrind/
│
├── 🎨 assets/                     # Shared Game Assets
│   ├── 📦 TBD/                    # ⚠️ Unintegrated Assets (See TBD/README.md)
│   │   ├── dungeon_pack/         # 747 dungeon tiles (not yet integrated)
│   │   ├── snow_tilesets/        # 528 winter assets (not yet integrated)
│   │   ├── cave_extras/          # Cave decorations
│   │   ├── vehicles/             # Vehicle sprites
│   │   └── [more categories]     # Other unintegrated assets
│   │
│   ├── ✅ ground_tiles_sheets/    # Integrated terrain tiles
│   ├── ✅ isometric_trees_pack/   # Integrated trees and vegetation
│   ├── ✅ Charachters/            # Integrated character sprites
│   ├── ✅ MusicAndSFX/            # Integrated audio files
│   └── ✅ [other integrated]/     # Other integrated assets
│
├── 💻 cpp/                        # C++ OpenGL Game Engine
│   ├── include/                  # Header files (.h, .hpp)
│   │   ├── engine/              # Core engine systems
│   │   ├── rendering/           # OpenGL rendering
│   │   ├── world/               # Game world
│   │   ├── entities/            # Game entities
│   │   └── building/            # Building system
│   ├── src/                     # Implementation files (.cpp)
│   ├── external/                # Third-party libraries (GLAD, STB)
│   └── shaders/                 # GLSL shader files
│
├── 💻 engine/                     # Web Editor - Core Engine
│   ├── core/                    # Game loop, time, input
│   ├── assets/                  # Asset loading system
│   ├── audio/                   # Audio management
│   └── rendering/               # Rendering systems
│
├── 💻 src/                        # Web Editor - Game Logic
│   ├── world/                   # World management
│   ├── entities/                # Game entities
│   ├── building/                # Building system
│   └── Game.js                  # Main game coordinator
│
├── 📚 docs/                       # Documentation
│   ├── 🖼️ visual/                # Visual diagrams (for visual learners)
│   ├── DIRECTORY_STRUCTURE.md   # **REQUIRED READING** 📋
│   ├── CONTRIBUTING.md          # Contribution guidelines 🤝
│   ├── ARCHITECTURE.md          # Technical architecture 🏗️
│   ├── ASSET_CATALOG.md         # Complete asset inventory 🎨
│   ├── ROADMAP.md               # Development roadmap 🗺️
│   └── [other documentation]    # Additional guides
│
├── 🗺️ tilesheets/                 # Tiled Map Editor Configurations
│   ├── ground/                  # Terrain tilesets
│   ├── vegetation/              # Trees, bushes, plants
│   └── [categories]/            # Other tileset categories
│
├── 🗺️ tiled_maps/                 # Tiled Map Files
│   ├── templates/               # Template maps
│   └── levels/                  # Game levels
│
├── 🛠️ tools/                      # Development tools
├── 🛠️ utils/                      # Utility scripts
│
├── 📄 CMakeLists.txt             # CMake build configuration
├── 🚀 build-engine.sh            # Build C++ engine script
├── 🚀 launch-engine.sh           # Launch C++ engine script
├── 🚀 launch-editor.sh           # Launch web editor script
└── 📄 index.html                 # Web editor entry point
```

### 🎯 Key Structure Notes

- **📦 `assets/TBD/`**: Contains assets NOT YET integrated into the game
  - See [assets/TBD/README.md](assets/TBD/README.md) for complete inventory
  - Move assets here when adding but not immediately integrating
  
- **✅ Integrated Assets**: Assets currently used by the game engines
  - Referenced in `engine/assets/AssetLoader.js`
  - Configured in `tilesheets/` for Tiled
  
- **💻 Dual Code Structure**: C++ engine + Web editor share assets
  
- **📚 Visual Documentation**: `docs/visual/` folder for diagrams and visual aids

## 🔧 Development Workflow

### Engine Core

The engine is built with a modular architecture:

- **Engine**: Main game loop, manages update/render cycle
- **Time**: Delta time and time scaling
- **Input**: Keyboard and mouse input handling
- **Renderer**: Canvas drawing abstraction
- **Camera**: Viewport positioning and movement

### Isometric System

The isometric rendering system handles:

- World-to-screen coordinate conversion
- Screen-to-world coordinate conversion
- Diamond-shaped tile rendering
- 3D cube rendering for buildings

### Game Systems

- **World**: Manages the tile grid and terrain
- **Entities**: Dynamic game objects (boats, future: player, NPCs)
- **Buildings**: Placeable structures with collision
- **Building System**: Handles placement logic and validation

## 🎨 Adding Assets

The `assets/` directory is ready for your game assets:

1. **Sprites** (`assets/sprites/`): Character sprites, entity graphics
2. **Tiles** (`assets/tiles/`): Terrain tiles, water animations
3. **Audio** (`assets/audio/`): Sound effects, background music

Once you upload your assets, we can integrate them into the rendering system.

## 🔧 Extending the Engine

### Adding a New Building Type

```javascript
Building.TYPES.CUSTOM = {
    name: 'Custom Building',
    width: 2,
    height: 2,
    buildHeight: 50,
    topColor: '#ff0000',
    leftColor: '#cc0000',
    rightColor: '#dd0000'
};
```

### Adding a New Entity

```javascript
class MyEntity extends Entity {
    constructor(x, y) {
        super(x, y);
        // Custom properties
    }
    
    update(deltaTime, world) {
        // Custom update logic
    }
    
    render(renderer, camera, isometricRenderer) {
        // Custom rendering
    }
}
```

### Adding a New Tile Type

```javascript
Tile.TYPES.CUSTOM = {
    name: 'custom',
    color: '#ff00ff',
    walkable: true
};
```

## 🎯 Future Features

### Phase 1: Asset Integration (Current)
- [x] Asset loading system
- [x] Audio system with music and SFX
- [ ] Professional ground tiles
- [ ] Tree and bush decorations
- [ ] Character sprites

### Phase 2: Core Survival (Next)
- [ ] Player character with animations
- [ ] Survival attributes (hunger, thirst, energy, health, hygiene)
- [ ] Day/night cycle
- [ ] Time management system

### Phase 3: Inventory & Items
- [ ] Weight/volume-based inventory
- [ ] Item database
- [ ] Container management
- [ ] Crafting system

### Phase 4: Skills & Progression
- [ ] Practice-based skill system
- [ ] Multiple skill categories
- [ ] Profession system

### Phase 5: Dynamic World
- [ ] Weather and seasons
- [ ] World persistence (save/load)
- [ ] Infrastructure systems

### Phase 6: AI & NPCs
- [ ] Complex AI (Utility AI + GOAP)
- [ ] NPC daily routines
- [ ] NPC jobs and occupations
- [ ] NPC needs and personalities

### Phase 7: Social Simulation
- [ ] Relationship system
- [ ] Sims-like conversation system with portraits
- [ ] Trading and economy
- [ ] Factions

### Phase 8+: Advanced Features
- [ ] Health and medical system
- [ ] Farming and animal husbandry
- [ ] Vehicle system
- [ ] Advanced building (electricity, plumbing)
- [ ] Random events and challenges

See [ROADMAP.md](docs/ROADMAP.md) for detailed development plan.

## 🤝 Contributing

**Before contributing, please read:**
1. 📋 **[DIRECTORY_STRUCTURE.md](docs/DIRECTORY_STRUCTURE.md)** - **REQUIRED** - Directory structure and naming conventions
2. 🤝 **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines and process
3. 🗺️ **[ROADMAP.md](docs/ROADMAP.md)** - See what we're working on

### Key Contribution Rules

✅ **MUST** follow directory structure and naming conventions  
✅ **MUST** place unintegrated assets in `assets/TBD/`  
✅ **MUST** update documentation with changes  
✅ **MUST** include visual aids for visual learners (diagrams, screenshots)  
✅ **MUST** adhere to code style guidelines  

This project emphasizes **organization, consistency, and visual clarity**. Every pull request should maintain these standards.

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for the complete guide.

## 📚 Documentation

> **📋 Start with [DIRECTORY_STRUCTURE.md](docs/DIRECTORY_STRUCTURE.md) to understand the project organization**

### Core Documentation

| Document | Description | Visual Aids |
|----------|-------------|-------------|
| 📋 [DIRECTORY_STRUCTURE.md](docs/DIRECTORY_STRUCTURE.md) | **⚠️ REQUIRED** - Directory structure & naming conventions | ✅ |
| 🤝 [CONTRIBUTING.md](docs/CONTRIBUTING.md) | How to contribute to this project | ✅ |
| 🏗️ [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture documentation | ✅ |
| 🗺️ [ROADMAP.md](docs/ROADMAP.md) | Detailed development roadmap | ✅ |
| 📊 [PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) | Complete project overview | ✅ |

### Asset Documentation

| Document | Description |
|----------|-------------|
| 🎨 [ASSET_CATALOG.md](docs/ASSET_CATALOG.md) | Complete asset inventory and organization |
| 📖 [ASSET_USAGE.md](docs/ASSET_USAGE.md) | Guide to using game assets |
| 🎨 [ASSETS.md](docs/ASSETS.md) | Asset management overview |
| 📦 [assets/TBD/README.md](assets/TBD/README.md) | Unintegrated assets inventory |

### Technical Guides

| Document | Description |
|----------|-------------|
| 🔨 [CPP_BUILD.md](docs/CPP_BUILD.md) | C++ engine build instructions |
| 📦 [BUILD_DEPENDENCIES.md](docs/BUILD_DEPENDENCIES.md) | Required dependencies and installation |
| 🧪 [TESTING_GUIDE.md](docs/TESTING_GUIDE.md) | Testing procedures and guidelines |
| ⚡ [QUICK_TEST.md](QUICK_TEST.md) | 2-minute feature test |

### Editor Integration

| Document | Description |
|----------|-------------|
| 🗺️ [TILED_GUIDE.md](docs/TILED_GUIDE.md) | Tiled Map Editor usage guide |
| 🏗️ [TILEZED_INTEGRATION.md](docs/TILEZED_INTEGRATION.md) | TileZed/BuildingEd integration |
| 🌍 [WORLDEDIT_TILEZED_SETUP.md](docs/WORLDEDIT_TILEZED_SETUP.md) | WorldEd/TileZed setup instructions |

### Feature Documentation

| Document | Description |
|----------|-------------|
| 💬 [CONVERSATION_SYSTEM.md](docs/CONVERSATION_SYSTEM.md) | Dialogue and conversation system design |
| 🎨 [BRANDING.md](docs/BRANDING.md) | Branding guidelines and style |
| 🔍 [LINE_OF_SIGHT_SYSTEM.md](docs/LINE_OF_SIGHT_SYSTEM.md) | Vision and line-of-sight system |
| 🎨 [RENDERING_SYSTEM.md](docs/RENDERING_SYSTEM.md) | Rendering architecture |

### Visual Documentation

All visual diagrams and flowcharts are in [`docs/visual/`](docs/visual/) to help visual learners understand the project structure.

## 📝 License

This project is open source and available for modification and use.

## 🙏 Acknowledgments

Built with passion for game development and the challenge of creating everything from scratch!
