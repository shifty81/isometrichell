# The Daily Grind - 2D Life Simulation Game

An isometric 2D life simulation game inspired by Project Zomboid and The Sims, featuring deep survival mechanics, complex AI, and social interactions. Experience the daily grind of life - work, relationships, survival, and personal growth - all built with custom technology.

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

### Map Editor (Web-based)
- **Visual Scene Builder**: Create levels visually in your browser
- **Asset System**: Professional asset loader with progress tracking
- **Audio System**: Background music and sound effects
- **Rich Asset Library**: Ground tiles, trees, bushes, characters, vehicles, buildings
- **Export Functionality**: Save scenes as JSON for C++ engine

## 🚀 Getting Started

### Quick Launch (Recommended)

#### Run the C++ Game Engine:
```bash
./launch-engine.sh
```

#### Run the Web Map Editor:
```bash
./launch-editor.sh
```

### Prerequisites

#### For C++ Engine:
- CMake 3.10+
- C++17 compatible compiler
- OpenGL 3.3+
- Development libraries: GLFW, GLM
  - Ubuntu/Debian: `sudo apt-get install cmake libglfw3-dev libglm-dev`
  - macOS: `brew install cmake glfw glm`
  - Windows: Visual Studio 2017+ (libraries auto-fetched)

#### For Web Editor:
- Node.js (recommended) or Python 3
- Modern web browser

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

```
isometrichell/
├── cpp/                        # C++ Engine Source
│   ├── include/               # Header files
│   │   ├── engine/           # Core engine systems
│   │   ├── rendering/        # OpenGL rendering
│   │   ├── world/            # Game world
│   │   ├── entities/         # Game entities
│   │   ├── building/         # Building system
│   │   └── utils/            # Utilities
│   ├── src/                  # Implementation files
│   ├── external/             # Third-party libraries
│   │   ├── glad/            # OpenGL loader
│   │   └── stb/             # Image loading
│   └── shaders/              # GLSL shaders
│
├── engine/                    # Web Editor - Engine
│   ├── core/                 # Core systems
│   │   ├── Engine.js        # Main game loop
│   │   ├── Time.js          # Time management
│   │   └── Input.js         # Input handling
│   ├── assets/               # Asset management
│   │   └── AssetLoader.js   # Asset loading system
│   ├── audio/                # Audio management
│   │   └── AudioManager.js  # Audio system
│   └── rendering/            # Rendering systems
│       ├── Renderer.js      # Base renderer
│       ├── IsometricRenderer.js # Isometric rendering
│       └── Camera.js        # Camera system
│
├── src/                      # Web Editor - Game Code
│   ├── world/               # World management
│   ├── entities/            # Game entities
│   ├── building/            # Building system
│   └── Game.js              # Main game logic
│
├── assets/                   # Shared Game Assets
│   ├── ground_tiles_sheets/ # Terrain tiles
│   ├── isometric_trees_pack/# Trees and vegetation
│   ├── Charachters/         # Character sprites
│   ├── MusicAndSFX/         # Audio files
│   └── [other asset folders]
│
├── docs/                     # Documentation
│   ├── CPP_BUILD.md         # C++ build instructions
│   ├── ROADMAP.md           # Development roadmap
│   └── [other docs]
│
├── CMakeLists.txt            # CMake configuration
├── build-engine.sh           # Build script for C++ engine
├── launch-engine.sh          # Launch C++ engine
├── launch-editor.sh          # Launch web editor
├── index.html                # Web editor entry point

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

This is a custom game engine built from scratch. Contributions are welcome! The architecture is designed to be extensible and easy to understand.

## 📚 Documentation

Additional documentation is available in the [docs/](docs/) folder:

- [ROADMAP.md](docs/ROADMAP.md) - Detailed development roadmap
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical architecture documentation
- [ASSETS.md](docs/ASSETS.md) - Asset management and organization
- [ASSET_USAGE.md](docs/ASSET_USAGE.md) - Guide to using game assets
- [ASSET_CATALOG.md](docs/ASSET_CATALOG.md) - Complete asset inventory and organization
- [TILEZED_INTEGRATION.md](docs/TILEZED_INTEGRATION.md) - Professional map/building editor integration guide
- [BRANDING.md](docs/BRANDING.md) - Branding guidelines and style
- [CONVERSATION_SYSTEM.md](docs/CONVERSATION_SYSTEM.md) - Dialogue and conversation system design

## 📝 License

This project is open source and available for modification and use.

## 🙏 Acknowledgments

Built with passion for game development and the challenge of creating everything from scratch!
