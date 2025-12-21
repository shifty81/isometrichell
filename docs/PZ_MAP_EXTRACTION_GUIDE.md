# Extracting Project Zomboid World Data - Complete Guide

This guide explains how to extract Project Zomboid's vanilla map data (Muldraugh, West Point, Riverside, etc.) using WorldEd and TileZed to use as templates for our game.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Understanding PZ Map Structure](#understanding-pz-map-structure)
3. [Method 1: Using WorldEd to Extract Maps](#method-1-using-worlded-to-extract-maps)
4. [Method 2: Using TileZed to Extract Buildings](#method-2-using-tilezed-to-extract-buildings)
5. [Method 3: Direct File Access](#method-3-direct-file-access)
6. [Converting to Our Format](#converting-to-our-format)
7. [Using Extracted Data as Templates](#using-extracted-data-as-templates)

---

## Prerequisites

### Required Software
1. **Project Zomboid** (installed and working)
2. **WorldEd** (map editor)
3. **TileZed** (tileset and building editor)
4. **Text editor** (for viewing .lua files)

### Installation Locations

**Windows:**
```
Game Install: C:\Program Files (x86)\Steam\steamapps\common\ProjectZomboid\
Save Data: C:\Users\YOUR_USERNAME\Zomboid\
WorldEd/TileZed: Download from forums or use setup script
```

**Linux:**
```
Game Install: ~/.steam/steam/steamapps/common/ProjectZomboid/
Save Data: ~/.zomboid/
WorldEd/TileZed: Download and extract to tools/zomboid_editors/
```

**Mac:**
```
Game Install: ~/Library/Application Support/Steam/steamapps/common/ProjectZomboid/
Save Data: ~/Zomboid/
WorldEd/TileZed: Download .zip versions
```

---

## Understanding PZ Map Structure

### Where PZ Stores Map Data

**Vanilla Map Location:**
```
ProjectZomboid/media/maps/
├── Muldraugh, KY/
│   ├── map.info              # Map metadata
│   ├── spawnpoints.lua       # Player spawn locations
│   ├── objects.lua           # Object definitions (optional)
│   └── celldata/             # Actual map data
│       ├── 30_30.lotheader   # Cell header
│       ├── chunkdata_30_30.bin  # Chunk data
│       └── world_30_30.lotpack  # World/object data
├── West Point, KY/
├── Riverside, KY/
└── Rosewood, KY/
```

### File Types Explained

| File | Purpose | Format | Readable |
|------|---------|--------|----------|
| `map.info` | Map metadata (name, size, coordinates) | Plain text | ✅ Yes |
| `spawnpoints.lua` | Player spawn coordinates | Lua script | ✅ Yes |
| `objects.lua` | Object placements (furniture, etc.) | Lua script | ✅ Yes |
| `.lotheader` | Cell metadata | Binary | ❌ No |
| `.bin` | Chunk terrain data | Binary | ❌ No |
| `.lotpack` | World/object data | Binary/Compressed | ❌ No |
| `.pzw` | WorldEd project file | Plain text | ✅ Yes |
| `.tbx` | Building definition | Binary | ❌ No |
| `.tmx` | Tiled Map XML export | XML | ✅ Yes |

---

## Method 1: Using WorldEd to Extract Maps

### Step 1: Launch WorldEd

```bash
# From project root
./launch-worlded.sh

# Or manually
cd tools/zomboid_editors
./WorldEd  # Linux/Mac
WorldEd.exe  # Windows
```

### Step 2: Load Vanilla Map

1. **Open WorldEd**
2. **Click:** `File → Open World`
3. **Navigate to:** 
   ```
   C:\Program Files (x86)\Steam\steamapps\common\ProjectZomboid\media\maps\
   ```
4. **Select a map folder:**
   - `Muldraugh, KY` (starting town, medium size)
   - `West Point, KY` (larger city)
   - `Riverside, KY` (riverside town)
   - `Rosewood, KY` (small town)

5. **Load the map** - WorldEd will load all cells

### Step 3: View and Navigate the Map

**Controls:**
- **Mouse Wheel:** Zoom in/out
- **Middle Mouse:** Pan/drag view
- **Arrow Keys:** Move view
- **Click tiles:** Select for editing

**View Layers:**
- Toggle different layers (ground, buildings, vegetation)
- Change between floors (0, 1, 2, etc.)

### Step 4: Export Specific Regions

**Export Single Cell:**
1. **Select cell** using cell view mode
2. **Right-click** → `Export Cell`
3. **Choose format:**
   - `.pzw` (WorldEd project)
   - `.tmx` (Tiled Map XML)
   - `.png` (image preview)

**Export Multiple Cells:**
1. **Tools** → `Select Region`
2. **Click and drag** to select cells
3. **File** → `Export Selected Region`
4. **Choose export location** (e.g., `tiled_maps/extracted/muldraugh/`)

**Export Entire Map:**
1. **File** → `Export World`
2. **Format:** TMX or PZW
3. **Destination:** `tiled_maps/extracted/vanilla_maps/`

### Step 5: What Gets Exported

When you export to `.pzw`:
```
exported_map/
├── map.info              # You can read this!
├── spawnpoints.lua       # You can read this!
├── exported_map.pzw      # WorldEd project file
└── celldata/
    ├── cells.txt         # List of cells
    └── [cell files...]   # Binary cell data
```

When you export to `.tmx`:
```
exported_map/
├── map.tmx               # Main map file (XML)
├── tilesets/             # Tileset references
│   ├── ground.tsx
│   ├── buildings.tsx
│   └── vegetation.tsx
└── layers/               # Layer data
```

### Step 6: Export for Our Game

**Recommended Export Settings:**
- **Format:** TMX (Tiled Map XML)
- **Include:** All layers
- **Tile size:** 64x32 (isometric)
- **Export unused tiles:** No
- **Relative paths:** Yes

---

## Method 2: Using TileZed to Extract Buildings

TileZed is the hub for BuildingEd, which lets you extract individual buildings.

### Step 1: Launch TileZed

```bash
./launch-tilezed.sh

# Or manually
cd tools/zomboid_editors
./TileZed
```

### Step 2: Access BuildingEd

1. **From TileZed menu:** `Tools → BuildingEd`
2. **BuildingEd opens** in a new window

### Step 3: Load Vanilla Buildings

**Option A: Browse Vanilla Buildings**
1. **File** → `Open Building`
2. **Navigate to:**
   ```
   ProjectZomboid/media/maps/[MapName]/buildings/
   ```
3. **Select a .tbx file** (if available)

**Option B: Extract from Map**
1. **In BuildingEd:** `File → Open from World`
2. **Navigate to** map location
3. **Click on building** in the map view
4. **Building loads** for editing

### Step 4: View Building Structure

**What You See:**
- Multiple floors (if multi-story)
- Tile layout for each floor
- Room definitions
- Furniture/object placements
- Door/window locations

**Navigate:**
- **Floor tabs:** Switch between floors
- **Layers:** Toggle floor, walls, objects
- **Zoom:** Mouse wheel
- **Pan:** Middle mouse drag

### Step 5: Export Buildings

**Export Individual Building:**
1. **File** → `Export`
2. **Choose format:**
   - `.tbx` (BuildingEd native - for reuse)
   - `.tmx` (Tiled Map XML)
   - `.json` (custom export)

3. **Save to:**
   ```
   tiled_maps/extracted/buildings/
   ├── house_small_01.tbx
   ├── house_small_01.tmx
   ├── shop_grocery.tbx
   └── shop_grocery.tmx
   ```

**Export Building Catalog:**
1. Extract multiple buildings
2. Organize by type:
   ```
   buildings/
   ├── residential/
   │   ├── house_1story/
   │   ├── house_2story/
   │   └── apartment/
   ├── commercial/
   │   ├── shops/
   │   ├── restaurants/
   │   └── offices/
   └── special/
       ├── hospital/
       ├── police/
       └── fire_station/
   ```

---

## Method 3: Direct File Access

### Step 1: Locate Save Files

**Game Install Directory:**
```
# Windows
C:\Program Files (x86)\Steam\steamapps\common\ProjectZomboid\media\maps\

# Linux
~/.steam/steam/steamapps/common/ProjectZomboid/media/maps/

# Mac
~/Library/Application Support/Steam/steamapps/common/ProjectZomboid/media/maps/
```

### Step 2: Copy Map Files

**Copy entire map:**
```bash
# Example: Copy Muldraugh
cp -r "ProjectZomboid/media/maps/Muldraugh, KY" \
      "TheDailyGrind/tiled_maps/extracted/muldraugh/"
```

**Result:**
```
tiled_maps/extracted/muldraugh/
├── map.info
├── spawnpoints.lua
└── celldata/
    ├── 30_30.lotheader
    ├── chunkdata_30_30.bin
    └── world_30_30.lotpack
```

### Step 3: Read Readable Files

**View map.info:**
```bash
cat tiled_maps/extracted/muldraugh/map.info
```

**Example output:**
```
title=Muldraugh, KY
WorldX=33
WorldY=32
width=30
height=30
```

**View spawnpoints.lua:**
```bash
cat tiled_maps/extracted/muldraugh/spawnpoints.lua
```

**Example output:**
```lua
function SpawnPoints()
    return {
        unemployed = {
            { worldX = 33, worldY = 32, posX = 242, posY = 56, posZ = 0 },
            { worldX = 33, worldY = 32, posX = 145, posY = 198, posZ = 0 },
        },
        fireofficer = {
            { worldX = 33, worldY = 32, posX = 89, posY = 177, posZ = 0 },
        }
    }
end
```

### Step 4: Parse with Our Tools

**Use our parser:**
```javascript
// In browser console or Node.js
const parser = new PZMapDataParser();

// Load map.info
fetch('tiled_maps/extracted/muldraugh/map.info')
    .then(r => r.text())
    .then(content => parser.parseMapInfo(content));

// Load spawnpoints.lua
fetch('tiled_maps/extracted/muldraugh/spawnpoints.lua')
    .then(r => r.text())
    .then(content => parser.parseSpawnPoints(content));

// Convert to our format
const gameWorld = parser.convertToGameFormat();
console.log(gameWorld);
```

---

## Converting to Our Format

### Option 1: Use TMX Export

If you exported to `.tmx` from WorldEd:

```javascript
// Load TMX file
const loader = new TMXLoader();
const worldData = await loader.loadFromURL('tiled_maps/extracted/muldraugh.tmx');

// Convert to our world format
const world = new World(worldData.width, worldData.height);
world.loadFromTMX(worldData);
```

### Option 2: Use PZW Export

If you exported to `.pzw`:

```javascript
// Load PZW file
const pzwLoader = new PZWLoader();
const worldData = await pzwLoader.loadFromURL('tiled_maps/extracted/muldraugh.pzw');

// Convert to our world format
const world = createWorldFromPZW(worldData);
```

### Option 3: Parse Lua Files Directly

```javascript
// Parse the readable files
const parser = new PZMapDataParser();

// Load map.info
const mapInfo = parser.parseMapInfo(mapInfoContent);

// Load spawns
const spawns = parser.parseSpawnPoints(spawnpointsContent);

// Generate template
const template = parser.generateTemplate();

// Save as JSON
fs.writeFileSync('tiled_maps/templates/muldraugh_template.json', template);
```

---

## Using Extracted Data as Templates

### Template Structure

Once extracted and converted, you'll have:

```json
{
  "world": {
    "name": "Muldraugh Template",
    "format": "dailygrind_world",
    "source": "project_zomboid",
    "dimensions": {
      "width": 9000,
      "height": 9000,
      "cellSize": 300,
      "chunkSize": 10
    },
    "spawnPoints": [
      { "x": 242, "y": 56, "z": 0 },
      { "x": 145, "y": 198, "z": 0 }
    ],
    "zones": [
      {
        "type": "residential",
        "name": "North Side",
        "centerX": 4500,
        "centerY": 2000,
        "radius": 800
      },
      {
        "type": "commercial",
        "name": "Main Street",
        "centerX": 4500,
        "centerY": 4500,
        "radius": 400
      }
    ]
  }
}
```

### Using Templates in Our Game

**Load template in game:**
```javascript
// Load template
const template = await fetch('tiled_maps/templates/muldraugh_template.json')
    .then(r => r.json());

// Create world from template
const world = new World(
    Math.ceil(template.world.dimensions.width / 64),
    Math.ceil(template.world.dimensions.height / 32)
);

// Apply template data
world.applyTemplate(template);

// Add to game
game.setWorld(world);
```

### Customize Templates

**Edit the JSON:**
```json
{
  "_customizations": {
    "change_spawn_density": "Increase from 10 to 20 spawns",
    "add_new_zone": "Add industrial zone on east side",
    "modify_buildings": "Replace some residential with commercial"
  },
  "world": {
    "spawnPoints": [
      // Add more spawn points here
    ]
  }
}
```

---

## Extraction Workflow Summary

### Quick Start Process

1. **Install WorldEd/TileZed**
   ```bash
   ./tools/setup-editors.sh
   ```

2. **Launch WorldEd**
   ```bash
   ./launch-worlded.sh
   ```

3. **Load Vanilla Map**
   - File → Open World
   - Select: `Muldraugh, KY`

4. **Export Region**
   - Tools → Select Region
   - Drag to select area
   - File → Export → TMX format

5. **Save to our project**
   - Destination: `tiled_maps/extracted/muldraugh/`

6. **Parse with our tools**
   ```javascript
   const parser = new PZMapDataParser();
   // ... parse files ...
   const template = parser.generateTemplate();
   ```

7. **Use in game**
   ```javascript
   const world = World.fromTemplate(template);
   game.setWorld(world);
   ```

---

## Recommended Maps to Extract

### Small (Good for learning)
- **Rosewood, KY** - Small town, simple layout
- **March Ridge** - Very small, isolated

### Medium (Balanced)
- **Muldraugh, KY** - Starting town, good variety
- **Riverside, KY** - River town with bridge

### Large (Complex)
- **West Point, KY** - Large city with downtown
- **Louisville, KY** - Massive city (large file size)

---

## Troubleshooting

### "Can't open map in WorldEd"
- Ensure PZ is installed correctly
- Check map path is correct
- Try running WorldEd as administrator (Windows)

### "Missing tilesets"
- Run: `./tools/setup-tilesets.sh`
- Ensure PZ tilesets are accessible
- Check Tilesets.txt configuration

### "Export fails"
- Check disk space
- Ensure write permissions
- Try smaller region first

### "TMX file has errors"
- May need to edit tileset paths
- Convert absolute to relative paths
- Re-export with correct settings

---

## Next Steps

After extraction:
1. **Analyze the data** - Look at spawn patterns, zone layout
2. **Create variations** - Modify templates for different scenarios
3. **Build new maps** - Use as reference for original designs
4. **Train AI** - Use data for procedural generation

---

## Additional Resources

- **PZ Mapping Wiki:** https://pzwiki.net/wiki/Mapping
- **The Indie Stone Forums:** Mapping section
- **Community Discord:** PZ Mapping channels
- **Our docs:** 
  - `PZW_FORMAT.md` - .pzw file format
  - `FILE_FORMATS.md` - All file formats
  - `WORLDEDIT_TILEZED_SETUP.md` - Setup guide
