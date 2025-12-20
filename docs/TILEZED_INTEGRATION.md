# TileZed, WorldEd, and BuildingEd Integration Guide

## Overview

This document outlines how to integrate Project Zomboid's mapping tools (TileZed, WorldEd, BuildingEd) into The Daily Grind project for professional map and building editing.

## ✅ Legal Status

**License**: GPL-2.0 (Open Source)
- ✅ Can be used for custom game projects
- ✅ Can be used commercially
- ✅ Can be modified for our needs
- ⚠️ Cannot use Project Zomboid's assets (but we can use our own!)

**Sources**:
- Official Download: [Indie Stone Forums - Latest TileZed, WorldEd and Tilesets](https://theindiestone.com/forums/index.php?/topic/59675-latest-tilezed-worlded-and-tilesets-september-8-2022/)
- GitHub: [TileZed](https://github.com/Unjammer/TileZed) | [WorldEd](https://github.com/Unjammer/WorldEd)
- License: GPL-2.0 License

## 🎯 Why These Tools Are Perfect for Us

### 1. BuildingEd for Interior Scenes
- **Purpose**: Create detailed building interiors
- **Use Case**: Design houses, shops, warehouses that players enter through doors
- **Perfect For**: Scene transitions (outdoor → indoor)
- **Features**:
  - Multi-floor building design
  - Room layout tools
  - Furniture and prop placement
  - Door and window placement
  - Lighting configuration

### 2. WorldEd for Outdoor Maps
- **Purpose**: Create large outdoor world maps
- **Use Case**: Design neighborhoods, towns, wilderness areas
- **Perfect For**: Main game world
- **Features**:
  - Large map creation (configurable size)
  - Terrain painting with tiles
  - Building placement on map
  - Zone definition (residential, commercial, etc.)
  - Road and path tools

### 3. TileZed for Asset Management
- **Purpose**: Configure tilesets and manage assets
- **Use Case**: Import our custom assets for use in editors
- **Perfect For**: Integrating our `assets/` folder
- **Features**:
  - Tileset configuration
  - Asset organization
  - Tile property definition
  - Access to WorldEd and BuildingEd

## 📥 Installation

### Step 1: Download Tools

1. Visit [Official Download Thread](https://theindiestone.com/forums/index.php?/topic/59675-latest-tilezed-worlded-and-tilesets-september-8-2022/)
2. Download the appropriate version:
   - **Windows 64-bit** (recommended)
   - **Windows 32-bit** (if needed)
   - **Linux 64-bit**
3. Extract to project tools directory

```bash
# Recommended structure
TheDailyGrind/
├── tools/
│   └── zomboid_editors/
│       ├── TileZed/
│       ├── WorldEd/
│       └── Tilesets/
```

### Step 2: Initial Configuration

```bash
# Create tools directory
mkdir -p tools/zomboid_editors

# Extract downloaded files
unzip TileZed_*.zip -d tools/zomboid_editors/

# Make executable (Linux/Mac)
chmod +x tools/zomboid_editors/TileZed
chmod +x tools/zomboid_editors/WorldEd
```

## 🔧 Configuring for Our Assets

### Creating Custom Tileset Configuration

TileZed uses `.tiles` and `.tsx` (Tiled) files to define tilesets. We need to create configurations for our assets.

#### 1. Ground Tiles Configuration

Create `tools/zomboid_editors/Tilesets/DailyGrind_Ground.tiles`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <tileset name="DailyGrind_Ground_64x32">
    <image source="../../../assets/ground_tiles_sheets/grass_green_64x32.png" 
           width="512" height="224"/>
    <tile width="64" height="32"/>
    <grid width="8" height="7"/>
    <properties>
      <property name="walkable" value="true"/>
      <property name="type" value="ground"/>
    </properties>
  </tileset>
</tilesets>
```

#### 2. Vegetation/Trees Configuration

Create `tools/zomboid_editors/Tilesets/DailyGrind_Trees.tiles`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <tileset name="DailyGrind_Trees_64x64">
    <image source="../../../assets/isometric_trees_pack/sheets/trees_64x32_shaded.png" 
           width="640" height="448"/>
    <tile width="64" height="64"/>
    <grid width="10" height="7"/>
    <properties>
      <property name="walkable" value="false"/>
      <property name="type" value="decoration"/>
    </properties>
  </tileset>
</tilesets>
```

#### 3. Individual Tiles Configuration

For our newly created individual tiles:

Create `tools/zomboid_editors/Tilesets/DailyGrind_Individual.tiles`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <tileset name="DailyGrind_Individual_Ground">
    <directory source="../../../assets/individual/ground_tiles/"/>
  </tileset>
  <tileset name="DailyGrind_Individual_Trees">
    <directory source="../../../assets/individual/trees/"/>
  </tileset>
</tilesets>
```

## 🏗️ Workflow: Creating a Building Scene

### Use Case: Player Enters a House

**Goal**: Create a detailed house interior that loads when player walks through the front door.

### Step 1: Design Exterior in WorldEd
1. Open TileZed → WorldEd
2. Create your outdoor map with houses placed
3. Mark each building's entrance with a door trigger
4. Export map as `.tmx` or `.lotheader` file

### Step 2: Design Interior in BuildingEd
1. Open TileZed → BuildingEd
2. Create new building (e.g., "suburban_house_01")
3. Define building dimensions
4. Add floors, walls, doors, windows
5. Place furniture and props
6. Export building definition

### Step 3: Link Building to Scene
Create a scene configuration file:

```json
{
  "scenes": {
    "suburban_house_01": {
      "type": "interior",
      "map_file": "maps/interiors/suburban_house_01.tmx",
      "spawn_point": { "x": 10, "y": 15 },
      "exit_doors": [
        {
          "position": { "x": 10, "y": 2 },
          "leads_to": "main_world",
          "spawn_at": { "x": 50, "y": 60 }
        }
      ]
    }
  }
}
```

### Step 4: Integrate in Game Engine

#### Web Editor Integration

```javascript
// In engine/assets/SceneLoader.js
class SceneLoader {
    async loadScene(sceneName) {
        // Load the .tmx file created in BuildingEd
        const sceneData = await fetch(`maps/scenes/${sceneName}.tmx`);
        const tmxData = await sceneData.text();
        
        // Parse TMX format
        const scene = this.parseTMX(tmxData);
        
        return scene;
    }
    
    parseTMX(tmxData) {
        // Parse Tiled TMX format
        // Extract layers, tiles, objects
        // Return scene structure
    }
}
```

#### C++ Engine Integration

```cpp
// In cpp/src/world/Scene.cpp
class Scene {
public:
    static Scene* loadFromTMX(const std::string& path) {
        // Parse TMX file from TileZed/BuildingEd
        TinyXML2::XMLDocument doc;
        doc.LoadFile(path.c_str());
        
        // Extract map dimensions, layers, tiles
        Scene* scene = new Scene();
        scene->parseMapLayer(doc);
        scene->parseObjectLayer(doc);
        
        return scene;
    }
};
```

## 🗺️ Map Organization Structure

```
tiled_maps/
├── world/
│   ├── main_world.tmx          # Main outdoor map (WorldEd)
│   ├── neighborhood_01.tmx     # Residential area
│   └── downtown.tmx            # City center
├── interiors/
│   ├── houses/
│   │   ├── suburban_house_01.tmx
│   │   ├── suburban_house_02.tmx
│   │   └── apartment_unit_01.tmx
│   ├── shops/
│   │   ├── grocery_store.tmx
│   │   ├── coffee_shop.tmx
│   │   └── hardware_store.tmx
│   └── public/
│       ├── city_hall.tmx
│       ├── library.tmx
│       └── hospital.tmx
└── scenes.json                  # Scene configuration
```

## 🔄 Export/Import Pipeline

### From TileZed → Game

1. **Design** in TileZed/WorldEd/BuildingEd
2. **Export** as `.tmx` (Tiled Map XML format)
3. **Place** in `tiled_maps/` directory
4. **Parse** in game engine
5. **Render** using our isometric renderer

### Supported Formats

- ✅ **TMX** (Tiled Map XML) - Primary format
- ✅ **TSX** (Tiled Tileset XML) - For tileset definitions
- ✅ **JSON** - Alternative export format
- ⚠️ **Project Zomboid .lotheader** - Requires conversion

## 🎨 Advantages Over Web Editor

### Current Web Editor
- ✅ Quick prototyping
- ✅ Integrated with game
- ❌ Limited features
- ❌ Manual tile placement
- ❌ No multi-floor support

### TileZed/WorldEd/BuildingEd
- ✅ Professional tools
- ✅ Multi-floor buildings
- ✅ Advanced tile painting
- ✅ Object placement tools
- ✅ Zone management
- ✅ Large map support
- ❌ Requires integration work

## 🔀 Hybrid Approach (Recommended)

**Use both systems for their strengths:**

1. **TileZed Suite** for:
   - Detailed building interiors
   - Large outdoor maps
   - Complex multi-floor structures
   - Professional level design

2. **Web Editor** for:
   - Quick testing
   - Runtime scene editing
   - In-game map creation
   - Simple modifications

## 📝 Implementation Steps

### Phase 1: Setup (Week 1)
- [ ] Download and install TileZed tools
- [ ] Create tileset configurations for our assets
- [ ] Test basic map creation
- [ ] Verify asset loading

### Phase 2: Integration (Week 2-3)
- [ ] Implement TMX parser in web engine
- [ ] Implement TMX parser in C++ engine
- [ ] Create scene loading system
- [ ] Add door transition mechanics

### Phase 3: Content Creation (Week 4+)
- [ ] Design 5 house interiors
- [ ] Design 3 shop interiors
- [ ] Create main neighborhood map
- [ ] Link all scenes together

### Phase 4: Polish (Ongoing)
- [ ] Add scene transition effects
- [ ] Optimize scene loading
- [ ] Add level streaming
- [ ] Create scene preview system

## 🛠️ Required Code Changes

### 1. Add TMX Parser Library

**JavaScript (Web Editor):**
```bash
npm install tmx-parser
```

**C++ Engine:**
```cpp
// Use tinyxml2 or similar
// Already available in most projects
#include <tinyxml2.h>
```

### 2. Create Scene Manager

```javascript
// engine/world/SceneManager.js
class SceneManager {
    constructor() {
        this.currentScene = null;
        this.scenes = new Map();
        this.doorTriggers = [];
    }
    
    async loadScene(sceneName) {
        const scene = await SceneLoader.loadScene(sceneName);
        this.currentScene = scene;
        this.setupDoorTriggers(scene);
        return scene;
    }
    
    setupDoorTriggers(scene) {
        // Find all doors in scene
        // Add collision triggers
        // Setup scene transitions
    }
    
    checkDoorCollisions(playerPos) {
        for (const trigger of this.doorTriggers) {
            if (this.isColliding(playerPos, trigger.bounds)) {
                this.transitionToScene(trigger.targetScene);
            }
        }
    }
}
```

### 3. Add Scene Transition System

```javascript
// engine/world/SceneTransition.js
class SceneTransition {
    static async transition(fromScene, toScene, fadeTime = 1000) {
        // Fade out current scene
        await this.fadeOut(fadeTime / 2);
        
        // Unload old scene
        fromScene.unload();
        
        // Load new scene
        const newScene = await SceneManager.loadScene(toScene);
        
        // Fade in new scene
        await this.fadeIn(fadeTime / 2);
        
        return newScene;
    }
}
```

## 🎮 Example: Complete House Scene Flow

### 1. Player Walks to House Door (Outdoor)
```javascript
// Check collision with door trigger
if (player.isCollidingWith(houseDoor)) {
    // Transition to house interior scene
    SceneManager.transitionToScene("suburban_house_01");
}
```

### 2. Load House Interior
```javascript
// SceneManager loads the TMX file created in BuildingEd
const interior = await SceneLoader.loadScene("suburban_house_01");

// Parse layers: floor, walls, furniture, props
interior.layers.forEach(layer => {
    renderer.renderLayer(layer);
});

// Spawn player at entrance
player.position = interior.getSpawnPoint("entrance");
```

### 3. Player Explores Interior
```javascript
// Player can interact with objects
// Furniture, containers, NPCs inside
// Full collision detection
```

### 4. Player Exits House
```javascript
// Check collision with exit door
if (player.isCollidingWith(exitDoor)) {
    // Transition back to outdoor world
    SceneManager.transitionToScene("main_world");
    
    // Spawn player outside the house
    player.position = houseDoor.exitPosition;
}
```

## 📚 Resources

### Official Documentation
- [TileZed Wiki](https://pzwiki.net/wiki/TileZed)
- [WorldEd Wiki](https://pzwiki.net/wiki/WorldEd)
- [BuildingEd Wiki](https://pzwiki.net/wiki/BuildingEd)

### Community Guides
- [The One Stop TileZed Mapping Shop](https://steamcommunity.com/sharedfiles/filedetails/?id=853478035)
- [Project Zomboid Mapping Forum](https://theindiestone.com/forums/index.php?/forum/76-mapping/)

### Technical References
- [Tiled TMX Format Specification](https://doc.mapeditor.org/en/stable/reference/tmx-map-format/)
- [TMX Parser Libraries](https://github.com/bjorn/tiled/wiki/Projects-using-Tiled)

## ⚠️ Important Notes

### Asset Copyright
- ❌ **DO NOT** use Project Zomboid's bundled tilesets
- ✅ **DO** use your own assets from `assets/`
- ✅ **DO** configure TileZed to point to your tilesets

### Performance Considerations
- Large interior scenes may impact performance
- Use level streaming for big buildings
- Consider scene complexity vs. frame rate
- Optimize tile count in dense interiors

### Compatibility
- TMX format is well-supported across engines
- Test exports in both Web and C++ engines
- Maintain consistent coordinate systems
- Document custom property formats

## 🚀 Next Steps

1. **Download and test TileZed**: See if it works with our assets
2. **Create sample building**: Design one house interior as proof of concept
3. **Implement TMX parser**: Add support for loading .tmx files
4. **Build scene transition system**: Create door-based scene switching
5. **Create multiple scenes**: Build a collection of interior spaces
6. **Document workflow**: Create guides for future level designers

## 📊 Expected Benefits

### Development Speed
- 🚀 **10x faster** building creation vs. code
- 🎨 **Visual design** instead of coordinate math
- 🔄 **Rapid iteration** with immediate preview
- 👥 **Non-programmer friendly** tools

### Quality Improvements
- 🏗️ **Professional layouts** from dedicated tools
- 🎯 **Precise placement** with grid snapping
- 📏 **Multi-floor support** for complex buildings
- 🗺️ **Large maps** without performance concerns during editing

### Content Volume
- 📦 **More scenes** created faster
- 🏘️ **Larger worlds** are feasible
- 🏢 **Complex buildings** are manageable
- 🎮 **More gameplay** content overall

---

**Conclusion**: TileZed, WorldEd, and BuildingEd are **excellent** tools for The Daily Grind project. They are legally usable, technically compatible, and will significantly speed up content creation for both outdoor maps and interior building scenes.
