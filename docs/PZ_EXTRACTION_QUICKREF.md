# Quick Reference: Extracting PZ Maps

## One-Line Commands

```bash
# Run extraction helper (interactive)
./tools/extract-pz-map.sh

# Launch WorldEd to extract maps visually
./launch-worlded.sh

# Launch TileZed to extract buildings
./launch-tilezed.sh
```

## What to Extract

### Recommended Starting Maps
1. **Muldraugh, KY** - Medium town, good variety, default spawn
2. **Rosewood, KY** - Small town, simple layout, good for learning
3. **West Point, KY** - Large city, complex layout, many buildings

### File Types You'll Get

| File | Contains | Use For |
|------|----------|---------|
| `map.info` | Map name, size, coordinates | World dimensions, metadata |
| `spawnpoints.lua` | Player spawn locations | Starting positions, zone identification |
| `objects.lua` | Furniture, items, decorations | Object placement patterns |
| `.lotheader` | Cell metadata (binary) | Cell structure info |
| `.bin` | Terrain/chunk data (binary) | Tile types, terrain |
| `.lotpack` | World/object data (binary) | Full world state |
| `.tmx` | Tiled Map XML (from export) | **Best for our use!** |
| `.pzw` | WorldEd project (from export) | Editable map project |
| `.tbx` | Building definition (binary) | Building templates |

## Quick Extraction Workflows

### Workflow 1: Get Spawn Locations (Easiest)
```bash
# 1. Run extraction script
./tools/extract-pz-map.sh

# 2. Choose option [1] - Copy raw files
# 3. Select "Muldraugh, KY"

# Result: spawn locations in readable .lua files
cat tiled_maps/extracted/Muldraugh_KY/spawnpoints.lua
```

### Workflow 2: Get Full Map (Visual)
```bash
# 1. Launch WorldEd
./launch-worlded.sh

# 2. In WorldEd:
#    File → Open World → [Select Muldraugh, KY]
#    File → Export → TMX format
#    Save to: tiled_maps/extracted/muldraugh.tmx

# Result: Full map in TMX format (best for our game!)
```

### Workflow 3: Extract Single Building
```bash
# 1. Launch TileZed
./launch-tilezed.sh

# 2. In TileZed:
#    Tools → BuildingEd
#    File → Open from World
#    Click on a building
#    File → Export → TMX
#    Save to: tiled_maps/extracted/buildings/house_01.tmx

# Result: Building template for reuse
```

## Using Extracted Data

### Load TMX in Our Game
```javascript
// In your game code
const loader = new TMXLoader();
const mapData = await loader.loadFromURL('tiled_maps/extracted/muldraugh.tmx');
world.loadFromTMX(mapData);
```

### Parse Spawn Points
```javascript
const parser = new PZMapDataParser();
const spawns = parser.parseSpawnPoints(luaContent);
// spawns = [{ worldX: 9942, worldY: 9656, z: 0 }, ...]
```

### Convert to Template
```javascript
const parser = new PZMapDataParser();
parser.parseMapInfo(mapInfoContent);
parser.parseSpawnPoints(spawnContent);
const template = parser.generateTemplate();
// Save as JSON for easy reuse
```

## File Locations

### PZ Installation (Windows)
```
C:\Program Files (x86)\Steam\steamapps\common\ProjectZomboid\media\maps\
```

### PZ Installation (Linux)
```
~/.steam/steam/steamapps/common/ProjectZomboid/media/maps/
```

### Our Extracted Data
```
TheDailyGrind/tiled_maps/extracted/
├── muldraugh/
│   ├── map.info
│   ├── spawnpoints.lua
│   └── celldata/
├── rosewood/
└── buildings/
    ├── house_01.tmx
    └── shop_01.tmx
```

## Common Issues

**"Can't find PZ installation"**
→ Run extraction script, it will prompt for path

**"WorldEd won't open map"**
→ Make sure PZ is properly installed
→ Check map directory has map.info file

**"Missing tilesets in export"**
→ Run: `./tools/setup-tilesets.sh`
→ Check Tilesets.txt in WorldEd directory

**"TMX file has errors"**
→ Edit tileset paths to be relative
→ Re-export with correct settings

## Next Steps

1. **Extract a map** using one of the workflows above
2. **Examine the data** - Look at spawn patterns, layouts
3. **Use as template** - Load in game or modify for custom maps
4. **Build your own** - Use PZ maps as inspiration

## Full Documentation

For detailed instructions, see:
- `docs/PZ_MAP_EXTRACTION_GUIDE.md` - Complete extraction guide
- `docs/WORLDEDIT_TILEZED_SETUP.md` - Tool setup
- `docs/FILE_FORMATS.md` - File format specifications

## Support

- Check documentation in `docs/` folder
- Run `./tools/extract-pz-map.sh` for interactive help
- See `README.md` for project overview
