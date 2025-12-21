# C++ Game Implementation Guide

## Overview
This document outlines the comprehensive implementation plan for converting The Daily Grind to a full C++ application with main menu, integrated editor, mod system, and save/load functionality.

## Current Status

### ✅ Completed (Foundation)
- Game state management system (`GameState.h/cpp`)
- UI renderer base classes (`UIRenderer.h/cpp`)
- Main menu implementation (`MainMenu.h/cpp`)
- Basic UI elements (UIButton, UIPanel, UILabel)

### 🚧 In Progress
- Integrating menu system with game engine
- Asset extraction from TBD folder

### 📋 Remaining Work

---

## Phase 1: Core Architecture (FOUNDATION)

### 1.1 Game State Integration
**Files to Modify:**
- `cpp/include/game/Game.h` - Add GameStateManager
- `cpp/src/game/Game.cpp` - Integrate state management
- `cpp/include/engine/Engine.h` - Add UI renderer
- `cpp/src/engine/Engine.cpp` - Initialize UI system

**Tasks:**
- [ ] Add `#include "game/GameState.h"` to Game.h
- [ ] Add `GameStateManager* stateManager` member to Game class
- [ ] Add `MainMenu* mainMenu` member to Game class
- [ ] Add `UIRenderer* uiRenderer` member to Engine class
- [ ] Initialize GameStateManager in Game::initialize()
- [ ] Initialize UIRenderer in Engine::initialize()
- [ ] Update Game::update() to handle different states
- [ ] Update Game::render() to render UI based on state

### 1.2 Input Handling for UI
**Files to Modify:**
- `cpp/include/engine/Input.h` - Add mouse callbacks
- `cpp/src/engine/Input.cpp` - Implement mouse handling
- `cpp/src/engine/Engine.cpp` - Register mouse callbacks

**Tasks:**
- [ ] Add mouse position tracking to Input class
- [ ] Add mouse button state tracking
- [ ] Implement GLFW mouse callbacks
- [ ] Forward mouse events to UI system
- [ ] Handle mouse hover and click events

### 1.3 CMakeLists.txt Updates
**File:** `CMakeLists.txt`

**Tasks:**
- [ ] Add new source files to ENGINE_SOURCES:
  - `cpp/src/game/GameState.cpp`
  - `cpp/src/ui/UIRenderer.cpp`
  - `cpp/src/ui/MainMenu.cpp`
- [ ] Add new header files to ENGINE_HEADERS:
  - `cpp/include/game/GameState.h`
  - `cpp/include/ui/UIRenderer.h`
  - `cpp/include/ui/MainMenu.h`

---

## Phase 2: Save/Load System

### 2.1 Save Manager
**New Files to Create:**
- `cpp/include/save/SaveManager.h`
- `cpp/src/save/SaveManager.cpp`
- `cpp/include/save/SaveData.h`
- `cpp/src/save/SaveData.cpp`

**Features:**
```cpp
class SaveManager {
public:
    // Save current game state
    bool saveGame(const std::string& saveName, const World* world, 
                  const Player* player, const BuildingSystem* buildings);
    
    // Load game state
    bool loadGame(const std::string& saveName, World* world,
                  Player* player, BuildingSystem* buildings);
    
    // List all saves
    std::vector<SaveInfo> listSaves();
    
    // Delete save
    bool deleteSave(const std::string& saveName);
    
    // Auto-save
    void autoSave();
};
```

### 2.2 Serialization
**Use JSON library (nlohmann/json recommended):**
- Add to CMakeLists.txt via FetchContent
- Serialize World, Player, Buildings to JSON
- Deserialize from JSON

### 2.3 Load Game Screen
**New Files:**
- `cpp/include/ui/LoadGameScreen.h`
- `cpp/src/ui/LoadGameScreen.cpp`

**Features:**
- List all save files
- Display save metadata (date, playtime, screenshot)
- Load selected save
- Delete save option

---

## Phase 3: Asset Integration

### 3.1 Asset Manager
**New Files:**
- `cpp/include/assets/AssetManager.h`
- `cpp/src/assets/AssetManager.cpp`
- `cpp/include/assets/TextureAtlas.h`
- `cpp/src/assets/TextureAtlas.cpp`

**Features:**
```cpp
class AssetManager {
public:
    // Load all assets
    bool loadAssets();
    
    // Get texture by name
    Texture* getTexture(const std::string& name);
    
    // Get sprite from atlas
    SpriteData getSprite(const std::string& atlasName, int index);
    
    // Hot reload (for development)
    void reloadAssets();
};
```

### 3.2 Asset Extraction from TBD
**Directory Operations:**
```bash
# Move vehicles
mv assets/TBD/vehicles/isometric_vehicles/* assets/vehicles/

# Move environment
mv assets/TBD/loose_files/spr_Greenlands_iso_*.png assets/environment/

# Move naval
mv assets/TBD/loose_files/"Pirate Ship Tile Set Sheet.png" assets/naval/

# Move props
mv assets/TBD/loose_files/TileObjectsRubbleWalls.png assets/props/
mv assets/TBD/loose_files/grass*.png assets/ground_tiles/
```

### 3.3 Tileset Configurations
**Create .tsx files in `tilesheets/` for:**
- Vehicles (all colors)
- Environment (day/night)
- Naval
- Props
- Additional ground variations

---

## Phase 4: In-Game Editor

### 4.1 Editor Architecture
**New Files:**
- `cpp/include/editor/EditorMode.h`
- `cpp/src/editor/EditorMode.cpp`
- `cpp/include/editor/EditorUI.h`
- `cpp/src/editor/EditorUI.cpp`
- `cpp/include/editor/EditorTools.h`
- `cpp/src/editor/EditorTools.cpp`

### 4.2 Editor Features
**Tools to Implement:**
```cpp
enum class EditorTool {
    SELECT,     // Select and move objects
    PAINT,      // Paint tiles
    FILL,       // Flood fill
    ERASE,      // Erase tiles/objects
    EYEDROPPER  // Sample tile/object
};

class EditorMode {
    void selectTile(int x, int y);
    void paintTile(int x, int y, int tileId);
    void placeObject(int x, int y, ObjectType type);
    void deleteObject(int x, int y);
    void undo();
    void redo();
    void saveMap(const std::string& filename);
    void loadMap(const std::string& filename);
};
```

### 4.3 Editor UI
**UI Components:**
- Tool palette (left sidebar)
- Tile/object browser (right sidebar)
- Layer panel
- Properties panel
- Top menu bar (File, Edit, View, Tools)
- Minimap (bottom right)

---

## Phase 5: Mod System

### 5.1 Mod Manager
**New Files:**
- `cpp/include/mods/ModManager.h`
- `cpp/src/mods/ModManager.cpp`
- `cpp/include/mods/Mod.h`
- `cpp/src/mods/Mod.cpp`

**Structure:**
```cpp
struct ModManifest {
    std::string name;
    std::string version;
    std::string author;
    std::string description;
    std::vector<std::string> dependencies;
    std::vector<std::string> assetOverrides;
};

class ModManager {
    std::vector<Mod*> loadedMods;
    
    void scanMods();
    void loadMod(const std::string& modPath);
    void enableMod(const std::string& modName);
    void disableMod(const std::string& modName);
    void applyModAssets();
};
```

### 5.2 Mod Directory Structure
```
mods/
├── example_mod/
│   ├── mod.json          # Manifest
│   ├── assets/           # Asset overrides
│   │   ├── textures/
│   │   └── sounds/
│   ├── scripts/          # (Future: Lua scripts)
│   └── README.md
```

### 5.3 Mod Browser UI
**New Files:**
- `cpp/include/ui/ModBrowserScreen.h`
- `cpp/src/ui/ModBrowserScreen.cpp`

**Features:**
- List all mods with metadata
- Enable/disable checkboxes
- Load order management (drag and drop)
- Refresh button
- Apply changes (restart prompt)

### 5.4 Example Mod
**Create `mods/example_mod/`:**
```json
{
  "name": "Example Texture Pack",
  "version": "1.0.0",
  "author": "The Daily Grind Team",
  "description": "Example mod showing texture replacement",
  "dependencies": [],
  "assetOverrides": [
    "assets/ground_tiles/grass_green_64x32.png"
  ]
}
```

---

## Phase 6: WorldEd/TileZed Integration

### Option A: External Process (RECOMMENDED)
**Implementation:**
- Add "Launch WorldEd" button in editor
- Launch as external process using system()
- Watch for TMX file changes
- Auto-reload maps when modified

**New Files:**
- `cpp/include/editor/ExternalEditorLauncher.h`
- `cpp/src/editor/ExternalEditorLauncher.cpp`

### Option B: Custom Implementation
**Build our own editor with similar features:**
- Multi-tile selection and painting
- Zone definition tools
- Road/path tools
- Building placement
- TMX export/import

**Note:** This is substantial work but gives full control

---

## Phase 7: Rendering Enhancements

### 7.1 Sprite Animation System
**New Files:**
- `cpp/include/rendering/AnimatedSprite.h`
- `cpp/src/rendering/AnimatedSprite.cpp`

**Features:**
```cpp
class AnimatedSprite {
    std::vector<Texture*> frames;
    float frameDuration;
    int currentFrame;
    
    void update(float deltaTime);
    Texture* getCurrentFrame();
};
```

### 7.2 Batch Rendering
**Enhance existing BatchRenderer:**
- Support for texture atlases
- Instanced rendering for repeated sprites
- Z-ordering for proper depth sorting

### 7.3 Entity Rendering
**Update entity classes to use new assets:**
- Vehicle rotation and rendering
- Character animation playback
- Building variants

---

## Phase 8: Text Rendering

### 8.1 Font System
**Add FreeType library:**
```cmake
# In CMakeLists.txt
find_package(Freetype REQUIRED)
target_link_libraries(${PROJECT_NAME} Freetype::Freetype)
```

**New Files:**
- `cpp/include/rendering/Font.h`
- `cpp/src/rendering/Font.cpp`
- `cpp/include/rendering/TextRenderer.h`
- `cpp/src/rendering/TextRenderer.cpp`

**Features:**
- Load TrueType fonts
- Render text to texture
- Text alignment (left, center, right)
- Text wrapping

---

## Phase 9: Testing & Polish

### 9.1 Testing Checklist
- [ ] Main menu navigation works
- [ ] All buttons respond correctly
- [ ] Save game creates file
- [ ] Load game restores state
- [ ] Editor tools work
- [ ] Maps can be saved and loaded
- [ ] Mods can be enabled/disabled
- [ ] Mod assets override correctly
- [ ] All new assets render properly
- [ ] Performance is acceptable (60+ FPS)

### 9.2 Performance Optimization
- Profile rendering code
- Optimize draw calls
- Implement culling for off-screen objects
- Asset streaming for large maps

### 9.3 Error Handling
- Graceful handling of missing assets
- Corrupted save file recovery
- Invalid mod detection
- User-friendly error messages

---

## Phase 10: Documentation

### 10.1 Update Existing Docs
- [ ] README.md - Remove web editor, add new features
- [ ] ARCHITECTURE.md - Document new systems
- [ ] ASSET_CATALOG.md - Update with new assets
- [ ] BUILD.md - Build instructions

### 10.2 New Documentation
- [ ] USER_GUIDE.md - How to use the game
- [ ] EDITOR_GUIDE.md - Editor tutorial
- [ ] MOD_CREATION_GUIDE.md - How to create mods
- [ ] SAVE_FORMAT.md - Save file format specification

### 10.3 Code Documentation
- Add Doxygen comments to all new classes
- Generate API documentation
- Create UML diagrams

---

## Build Instructions

### After Implementation:
```bash
# Build the game
mkdir build && cd build
cmake ..
cmake --build .

# Run
./TheDailyGrind
```

### Expected Behavior:
1. Game starts with main menu
2. Can navigate to New Game, Continue, Editor, Mods, Settings
3. Editor accessible from main menu and in-game (press E)
4. Mods can be managed from mod browser
5. Save/load works from Continue option

---

## Estimated Effort

### Time Estimates (for experienced C++ developer):
- **Phase 1 (Menu System)**: 2-3 days
- **Phase 2 (Save/Load)**: 3-4 days
- **Phase 3 (Assets)**: 2-3 days
- **Phase 4 (Editor)**: 5-7 days
- **Phase 5 (Mods)**: 3-4 days
- **Phase 6 (External Tools)**: 1-2 days
- **Phase 7 (Rendering)**: 3-4 days
- **Phase 8 (Text)**: 2-3 days
- **Phase 9 (Testing)**: 3-5 days
- **Phase 10 (Docs)**: 2-3 days

**Total: Approximately 26-38 days** (5-8 weeks)

---

## Priority Recommendations

### Critical Path:
1. **Menu System** (enables navigation)
2. **Save/Load** (enables persistence)
3. **Asset Integration** (provides content)
4. **Editor** (enables content creation)
5. **Mods** (enables extensibility)

### Can Defer:
- WorldEd/TileZed integration (use external launch)
- Advanced rendering features (add incrementally)
- Text rendering (use simple bitmap fonts initially)

---

## Next Steps

1. **Test Foundation**: Build and test GameState + MainMenu
2. **Integrate with Engine**: Wire up menu to engine
3. **Add Mouse Input**: Enable button clicks
4. **Implement Save/Load**: Critical for game progress
5. **Extract Assets**: Move TBD assets to proper locations
6. **Build Editor**: Core content creation tool
7. **Add Mod System**: Enable community content
8. **Polish & Test**: Ensure everything works smoothly

---

## Notes

- This is a **major architectural change** requiring significant development time
- Consider building **incrementally** - each phase should be tested before moving on
- **Web editor can remain** as a separate tool during transition
- **Focus on C++ quality** - proper memory management, error handling
- **Use modern C++17 features** as project already requires C++17
- **Profile performance** after each major feature addition

---

## Support

For questions or issues during implementation, refer to:
- Existing C++ codebase patterns
- docs/ARCHITECTURE.md
- cpp/include/ header files for existing systems
