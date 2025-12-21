# Directory Structure and Naming Conventions

## 📂 Project Overview

**The Daily Grind** follows a structured, organized approach to project management. This document defines the directory structure and naming conventions that **MUST** be followed in all pull requests.

---

## 🎯 Core Principle

> **"A place for everything, and everything in its place"**

Every file, asset, and piece of code has a designated location. Unintegrated materials go to `assets/TBD/` until they're ready for integration.

---

## 📁 Top-Level Directory Structure

```
TheDailyGrind/
├── assets/                 # Game assets (textures, sprites, audio)
│   ├── TBD/               # Unintegrated assets (TO BE DETERMINED)
│   ├── [integrated]/      # Integrated assets organized by type
│   └── README.md          # Asset organization guide
│
├── cpp/                   # C++ OpenGL Game Engine
│   ├── include/          # Header files (.h, .hpp)
│   ├── src/              # Implementation files (.cpp)
│   ├── external/         # Third-party libraries
│   └── shaders/          # GLSL shader files
│
├── engine/                # Web Editor - Core Engine Systems
│   ├── core/             # Game loop, time, input
│   ├── assets/           # Asset loading and management
│   ├── audio/            # Audio system
│   └── rendering/        # Rendering systems
│
├── src/                   # Web Editor - Game Logic
│   ├── world/            # World management
│   ├── entities/         # Game entities
│   ├── building/         # Building system
│   └── Game.js           # Main game coordinator
│
├── docs/                  # Documentation
│   ├── visual/           # Visual diagrams and flowcharts
│   ├── *.md              # Markdown documentation files
│   └── README.md         # Documentation index
│
├── tilesheets/            # Tiled Map Editor configurations
│   ├── ground/           # Terrain tilesets
│   ├── vegetation/       # Trees, bushes, plants
│   ├── buildings/        # Building and structure tilesets
│   └── [category]/       # Other categorized tilesets
│
├── tiled_maps/            # Tiled map files
│   ├── templates/        # Template maps
│   └── levels/           # Game levels
│
├── tools/                 # Development tools and scripts
├── utils/                 # Utility scripts
├── logs/                  # Application logs
│
└── [root config files]    # CMakeLists.txt, package.json, etc.
```

---

## 🎨 Assets Directory Structure

### Integrated Assets (`assets/`)

Assets that **ARE** currently used in the game:

```
assets/
├── ground_tiles_sheets/        # Terrain tile sheets
├── ground_tiles_source_blend_packed/  # Source files
├── individual/                 # Individual sprite files
│   ├── ground_tiles/          # Individual ground tiles
│   ├── trees/                 # Individual tree sprites
│   └── charachter/            # Individual character sprites
│
├── isometric_trees_pack/       # Tree sprite collections
│   ├── sheets/                # Sprite sheets
│   └── single/                # Individual trees
│
├── Charachters/                # Character sprite sheets
│   ├── Player/                # Player animations
│   └── Thug/                  # NPC/enemy sprites
│
├── Sprites/                    # Misc sprite collections
├── MusicAndSFX/                # Audio files
│
└── [integrated files]          # Individual integrated assets
    ├── knight.png
    ├── knight5.png
    ├── hjm-bushes_*.png
    ├── hjm-assorted_rocks_*.png
    └── iso-64x64-building (1).png
```

### Unintegrated Assets (`assets/TBD/`)

Assets that are **NOT YET** used in the game:

```
assets/TBD/
├── README.md                   # TBD folder documentation
│
├── dungeon_pack/               # Dungeon tileset (747 files)
├── snow_tilesets/              # Winter/snow assets (528 files)
├── cave_extras/                # Cave decorations
├── hdri_textures/              # HDRI and texture files
├── bricks/                     # Brick textures
├── vehicles/                   # Vehicle sprites
├── misc_sprites/               # Miscellaneous sprites
├── loose_files/                # Uncategorized files
└── tools_archives/             # External tool archives
```

---

## 💻 Code Directory Structure

### C++ Engine (`cpp/`)

```
cpp/
├── include/                    # All header files
│   ├── engine/                # Core engine headers
│   │   ├── Engine.h
│   │   ├── Time.h
│   │   └── Input.h
│   │
│   ├── rendering/             # Rendering system headers
│   │   ├── Renderer.h
│   │   ├── Shader.h
│   │   ├── Texture.h
│   │   └── Camera.h
│   │
│   ├── world/                 # World management headers
│   │   ├── World.h
│   │   ├── Tile.h
│   │   └── TileMap.h
│   │
│   ├── entities/              # Entity system headers
│   │   ├── Entity.h
│   │   └── Player.h
│   │
│   ├── building/              # Building system headers
│   │   ├── Building.h
│   │   └── BuildingSystem.h
│   │
│   └── utils/                 # Utility headers
│       └── Math.h
│
├── src/                       # Implementation files (mirrors include/)
│   ├── engine/
│   ├── rendering/
│   ├── world/
│   ├── entities/
│   ├── building/
│   ├── utils/
│   └── main.cpp              # Entry point
│
├── external/                  # Third-party libraries
│   ├── glad/                 # OpenGL loader
│   └── stb/                  # STB libraries
│
└── shaders/                   # GLSL shader files
    ├── vertex.glsl
    └── fragment.glsl
```

### Web Editor (`engine/` and `src/`)

```
engine/                         # Core engine systems
├── core/
│   ├── Engine.js              # Main game loop
│   ├── Time.js                # Time management
│   └── Input.js               # Input handling
│
├── assets/
│   └── AssetLoader.js         # Asset loading system
│
├── audio/
│   └── AudioManager.js        # Audio management
│
└── rendering/
    ├── Renderer.js            # Base renderer
    ├── IsometricRenderer.js   # Isometric rendering
    └── Camera.js              # Camera system

src/                           # Game-specific logic
├── world/
│   ├── World.js               # World management
│   ├── Tile.js                # Tile definitions
│   └── TileMap.js             # Tilemap handling
│
├── entities/
│   ├── Entity.js              # Base entity
│   └── Boat.js                # Boat entity
│
├── building/
│   ├── Building.js            # Building class
│   └── BuildingSystem.js      # Building placement
│
└── Game.js                    # Main game coordinator
```

---

## 📚 Documentation Directory (`docs/`)

```
docs/
├── visual/                     # Visual diagrams (NEW!)
│   ├── directory_structure.png
│   ├── asset_flow.png
│   └── game_architecture.png
│
├── README.md                   # Documentation index
│
├── DIRECTORY_STRUCTURE.md      # This file
├── ARCHITECTURE.md             # Technical architecture
├── PROJECT_SUMMARY.md          # Project overview
│
├── ROADMAP.md                  # Development roadmap
├── CONTRIBUTING.md             # Contribution guidelines (NEW!)
│
├── ASSETS.md                   # Asset management
├── ASSET_CATALOG.md            # Asset inventory
├── ASSET_USAGE.md              # How to use assets
│
├── CPP_BUILD.md                # C++ build guide
├── TESTING_GUIDE.md            # Testing procedures
│
├── TILED_GUIDE.md              # Tiled editor usage
├── TILESET_RESOLUTION.md       # Asset resolution guide
├── WORLDEDIT_TILEZED_SETUP.md  # WorldEd/TileZed setup
│
└── [other documentation]
```

---

## 📝 Naming Conventions

### File Naming

#### Code Files (C++)
- **Headers**: `PascalCase.h` or `PascalCase.hpp`
  - Example: `Engine.h`, `IsometricRenderer.hpp`
- **Implementation**: `PascalCase.cpp`
  - Example: `Engine.cpp`, `IsometricRenderer.cpp`
- **Match exactly**: Implementation files must match their header names

#### Code Files (JavaScript)
- **Classes/Modules**: `PascalCase.js`
  - Example: `Engine.js`, `IsometricRenderer.js`
- **Utilities**: `camelCase.js` or `PascalCase.js`
  - Example: `utils.js`, `MathUtils.js`

#### Asset Files
- **Sprite sheets**: `lowercase_with_underscores_<size>.png`
  - Example: `grass_green_64x32.png`, `trees_128x64_shaded.png`
- **Individual sprites**: `lowercase_with_underscores.png`
  - Example: `knight_idle_01.png`, `house_small.png`
- **Audio files**: `lowercase_or_PascalCase.ogg/.mp3`
  - Example: `Music.ogg`, `footstep_grass.ogg`

#### Documentation Files
- **Markdown files**: `SCREAMING_SNAKE_CASE.md`
  - Example: `README.md`, `ASSET_CATALOG.md`, `QUICK_TEST.md`
- **Exception**: Lowercase for special files
  - Example: `package.json`, `index.html`

#### Configuration Files
- **Tiled tilesets**: `category_name_variant.tsx`
  - Example: `ground_grass_green.tsx`, `vegetation_trees_shaded.tsx`
- **Maps**: `descriptive_name.tmx` or `descriptive_name.json`
  - Example: `level_01_town.tmx`, `template_map_highres.json`

### Directory Naming

- **Code directories**: `lowercase` or `snake_case`
  - Example: `engine`, `rendering`, `assets`
- **Asset category directories**: `snake_case`
  - Example: `ground_tiles_sheets`, `isometric_trees_pack`
- **Documentation directory**: `docs` (lowercase)

### Variable/Function Naming

#### C++
```cpp
// Classes: PascalCase
class IsometricRenderer { };

// Functions/Methods: camelCase
void updateGame(float deltaTime);

// Variables: camelCase
float currentZoom;
int tileWidth;

// Constants: SCREAMING_SNAKE_CASE or kPascalCase
const int MAX_ENTITIES = 1000;
constexpr float kDefaultZoom = 1.0f;

// Private members: m_ prefix
class Player {
private:
    float m_health;
    int m_level;
};
```

#### JavaScript
```javascript
// Classes: PascalCase
class IsometricRenderer { }

// Functions/Methods: camelCase
function updateGame(deltaTime) { }

// Variables: camelCase
let currentZoom;
const tileWidth = 64;

// Constants: SCREAMING_SNAKE_CASE
const MAX_ENTITIES = 1000;
const DEFAULT_ZOOM = 1.0;

// Private properties: # prefix (ES2022)
class Player {
    #health;
    #level;
}
```

---

## 🎯 Asset Integration Workflow

### Adding New Assets

1. **Receive/Create Asset**
   - Obtain asset file(s)

2. **Initial Placement**
   - If **NOT immediately integrating**: Place in `assets/TBD/<category>/`
   - If **immediately integrating**: Place in appropriate `assets/<category>/`

3. **Organization**
   - Create subfolder if needed
   - Name files following conventions
   - Add README if new category

4. **Integration** (when ready)
   - Create Tiled tileset (`.tsx`) in `tilesheets/<category>/`
   - Add to asset loader: `engine/assets/AssetLoader.js`
   - Add to C++ loader (if applicable)
   - Update documentation

5. **Documentation**
   - Update `docs/ASSET_CATALOG.md`
   - Update `assets/TBD/README.md` (remove from TBD)
   - Document usage in `docs/ASSET_USAGE.md`

6. **Testing**
   - Test in web editor
   - Test in C++ engine
   - Verify in Tiled

---

## 🚀 Pull Request Requirements

**Every PR MUST:**

1. ✅ Follow the directory structure defined here
2. ✅ Follow naming conventions for all files
3. ✅ Place unintegrated assets in `assets/TBD/`
4. ✅ Update relevant documentation
5. ✅ Update this file if adding new categories/directories
6. ✅ Include clear commit messages
7. ✅ Not break existing structure or conventions

**PR Checklist:**
- [ ] Files are in correct directories
- [ ] File names follow conventions
- [ ] New directories follow naming standards
- [ ] Unintegrated assets moved to `assets/TBD/`
- [ ] Documentation updated
- [ ] `DIRECTORY_STRUCTURE.md` updated (if new categories added)
- [ ] Asset README updated (if assets moved)

---

## 📊 Visual Reference

### Asset Flow Diagram

```
[New Asset]
    ↓
[Immediately using?]
    ↓ No            ↓ Yes
    ↓               ↓
[assets/TBD/]   [assets/<category>/]
    ↓               ↓
[Organize &     [Create Tileset]
 Document]          ↓
    ↓           [Add to Loader]
    ↓               ↓
    ↓           [Test in Engines]
    ↓               ↓
[Ready?] ←─────[Documentation]
    ↓ Yes
    └──→ [Integration Process]
```

### Directory Hierarchy (High-Level)

```
TheDailyGrind/
│
├── 🎨 assets/          ← All game assets
│   ├── 📦 TBD/        ← Unintegrated only
│   └── ✅ [other]/    ← Integrated only
│
├── 💻 cpp/            ← C++ game engine
├── 💻 engine/         ← Web engine core
├── 💻 src/            ← Web game logic
│
├── 📚 docs/           ← All documentation
│   └── 🖼️ visual/    ← Visual diagrams
│
├── 🗺️ tilesheets/     ← Tiled configs
├── 🗺️ tiled_maps/     ← Map files
│
└── 🛠️ tools/          ← Dev tools
```

---

## 🎓 Examples

### ✅ Good Examples

```
✓ assets/TBD/dungeon_pack/
✓ assets/ground_tiles_sheets/grass_green_64x32.png
✓ cpp/include/rendering/IsometricRenderer.h
✓ engine/assets/AssetLoader.js
✓ docs/DIRECTORY_STRUCTURE.md
✓ tilesheets/ground/grass_green.tsx
```

### ❌ Bad Examples

```
✗ assets/random_file.png              (use assets/TBD/loose_files/)
✗ assets/MyNewAsset.PNG                (use lowercase with underscores)
✗ cpp/include/myrenderer.h             (use PascalCase)
✗ src/My-Game-File.js                  (use PascalCase, no hyphens)
✗ docs/my document.md                  (no spaces, use underscores or CAPS)
```

---

## 🤝 Maintaining Structure

### Regular Maintenance

- **Weekly**: Review `assets/TBD/` for integration opportunities
- **Per PR**: Ensure all changes follow conventions
- **Monthly**: Update documentation to reflect changes
- **Quarterly**: Review and optimize directory structure

### Adding New Categories

When adding a new asset category:

1. Create folder in appropriate location
2. Add README explaining category
3. Update this document
4. Update `docs/ASSET_CATALOG.md`
5. Document naming conventions for that category

---

## 📞 Questions?

If you're unsure about:
- **Where to place a file**: Check this document or ask in discussions
- **How to name something**: Follow the conventions above
- **Whether to integrate now**: Place in `assets/TBD/` until ready

---

**Version**: 1.0  
**Last Updated**: 2025-12-21  
**Maintained By**: The Daily Grind Development Team  
**Applies To**: All pull requests and contributions
