# Asset Catalog and Organization

## Overview

This document catalogs all game assets and their organization. Assets are divided into **integrated** (currently used in-game) and **unintegrated** (stored in `assets/TBD/` for future use).

> **Note**: For unintegrated assets, see [assets/TBD/README.md](../assets/TBD/README.md)

---

## 📦 Asset Organization

### ✅ Integrated Assets

Assets currently used by the game engines (C++ and/or Web Editor).

### 📦 Unintegrated Assets (TBD)

Assets stored in `assets/TBD/` for future integration:
- **747** Dungeon Pack PNG files
- **528** Snow tileset PNG files
- Cave extras, vehicles, HDRI textures, and more

See [assets/TBD/README.md](../assets/TBD/README.md) for complete inventory.

---

## Asset Categories

### 1. Ground Tiles (Terrain)

#### Location
- **Source**: `assets/ground_tiles_sheets/`
- **Tiled Config**: `tilesheets/ground/`

#### Available Tilesets

| Tileset Name | File | Tile Size | Grid | Total Tiles | Use Case |
|--------------|------|-----------|------|-------------|----------|
| Grass Green | grass_green_64x32.png | 64x32 | 12x12 | 144 | Primary grass terrain |
| Grass Dry | grass_dry_64x32.png | 64x32 | 12x12 | 144 | Arid/summer grass |
| Grass Medium | grass_medium_64x32.png | 64x32 | 12x12 | 144 | Transitional grass |
| Dirt | dirt_64x32.png | 64x32 | 12x12 | 144 | Dirt paths and ground |
| Dirt Dark | dirt_dark_64x32.png | 64x32 | 12x12 | 144 | Rich soil, farmland |
| Sand | sand_64x32.png | 64x32 | 12x12 | 144 | Beach, desert areas |
| Stone Path | stone_path_64x32.png | 64x32 | 12x12 | 144 | Roads, walkways |
| Forest Ground | forest_ground_64x32.png | 64x32 | 12x12 | 144 | Forest floor, undergrowth |

**Note**: 128x64 versions available for higher resolution rendering.

### 2. Vegetation

#### Location
- **Source**: `assets/isometric_trees_pack/`
- **Tiled Config**: `tilesheets/vegetation/`

#### Tree Spritesheets

| Tileset Name | File | Sprite Size | Grid | Total | Variants |
|--------------|------|-------------|------|-------|----------|
| Trees Shaded 64 | trees_64x32_shaded.png | 64x64 | 10x7 | 70 | Pines, oaks, palms with shadows |
| Trees No Shadow 64 | trees_64x32_no_shadow.png | 64x64 | 10x7 | 70 | Same trees, no shadows |
| Trees Cloudy 64 | trees_64x32_cloudy.png | 64x64 | 10x7 | 70 | Overcast lighting |
| Trees Shaded 128 | trees_128x64_shaded.png | 128x128 | 10x7 | 70 | High-res variants |
| Trees No Shadow 128 | trees_128x64_no_shadow.png | 128x128 | 10x7 | 70 | High-res, no shadows |
| Trees Cloudy 128 | trees_128x64_cloudy.png | 128x128 | 10x7 | 70 | High-res, overcast |

#### Bush/Shrub Assets (Individual Sprites)

| Asset | File | Size | Alpha | Use |
|-------|------|------|-------|-----|
| Bush 01-12 | hjm-bushes_01-12-alpha.png | Varies | Yes | Various bush types |
| Rocks 1 | hjm-assorted_rocks_1.png | Varies | Yes | Rock decorations |
| Rocks 2 | hjm-assorted_rocks_2.png | Varies | Yes | More rock variants |
| Pond | hjm-pond_1.png | Varies | Yes | Small pond decoration |

### 3. Buildings and Structures

#### Location
- **Source**: `assets/` (various)
- **Tiled Config**: `tilesheets/buildings/` (to be created)

#### Available Assets

| Asset | File | Description |
|-------|------|-------------|
| Building 64x64 | iso-64x64-building (1).png | Generic isometric building |
| Cave Extras | isometric-cave-extras/ | Cave and dungeon pieces |
| Dungeon Pack | Dungeon Pack (2.3)/ | Dungeon tilesets |
| Rubble Walls | TileObjectsRubbleWalls.png | Destroyed walls, debris |
| Snow Structures | snow_tilesets/snowplains_structures.png | Winter buildings |
| Snow Tower | snow_tilesets/snowplains_rottentower.png | Ruined tower |

### 4. Characters

#### Location
- **Source**: `assets/Charachters/`
- **Tiled Config**: `tilesheets/characters/` (to be created)

#### Character Spritesheets

| Character | Location | Frames | Description |
|-----------|----------|--------|-------------|
| Player | Charachters/Player/ | Multiple | Main player character sprites |
| Thug | Charachters/Thug/ | Multiple | Enemy/NPC character |
| Knight | knight.png, knight5.png, Knight01.png | Various | Knight character variants |

### 5. Vehicles

#### Location
- **Source**: `assets/TBD/vehicles/` (Not yet integrated)
- **Tiled Config**: To be created in `tilesheets/vehicles/`

#### Vehicle Collections

| Collection | File | Vehicles Included | Status |
|------------|------|-------------------|---------|
| All Vehicles | collection_vehicles.png | Multiple vehicle types | 📦 In TBD |
| Red | red_vehicles.png | Red cars, trucks | 📦 In TBD |
| Blue | blue_vehicles.png | Blue vehicles | 📦 In TBD |
| Green | green_vehicles.png | Green vehicles | 📦 In TBD |
| Yellow | yellow_vehicles.png | Yellow vehicles | 📦 In TBD |
| Orange | orange_vehicles.png | Orange vehicles | 📦 In TBD |
| Black | black_vehicles.png | Black vehicles | 📦 In TBD |
| White | white_vehicles.png | White vehicles | 📦 In TBD |
| Grey | grey_vehicles.png | Grey vehicles | 📦 In TBD |

**Status**: Not yet integrated, stored in `assets/TBD/vehicles/`

### 6. Special Tilesets

#### Snow/Winter Theme

| Tileset | File | Description |
|---------|------|-------------|
| Snow Plains | snowplains_tileset.png | Complete snow terrain set |
| Snow Ground | tiled_snowplains_2x2.png | Snow ground tiles |
| Snow Water | snowplains_water.png | Frozen water, ice |
| Snow Ice | snowplains_ice.png | Ice tiles |
| Snow Trees | snowplains_trees.png | Winter trees |
| Snow Other | snowplains_other.png | Misc snow objects |

#### Greenlands/Environment

| Asset | File | Description |
|-------|------|-------------|
| Greenlands Day | spr_Greenlands_iso_day_0.png | Daytime environment set |
| Greenlands Night | spr_Greenlands_iso_night_0.png | Nighttime version |

#### Naval/Water

| Asset | File | Description |
|-------|------|-------------|
| Pirate Ship | Pirate Ship Tile Set Sheet.png | Ship tiles and parts |

### 7. Props and Decorations

#### Location
- **Source**: `assets/`
- **Tiled Config**: `tilesheets/props/` (to be created)

#### Available Props

- Bricks: `bricks/` directory
- Sprites: `Sprites/` directory  
- IRR: `IRR/` directory (various props)
- Grass textures: `grass5.png`, `grass6.png`

### 8. Audio Assets

#### Location
- **Source**: `assets/MusicAndSFX/`

#### Available Audio

- Background music tracks
- Sound effects for actions
- Ambient sounds
- UI sounds

## Tiled Integration Status

### ✅ Completed Tilesets (Integrated)

- [x] Ground tiles (grass, dirt, sand, stone, forest)
- [x] Trees (shaded and no-shadow variants)

### 📦 Available in TBD (Not Yet Integrated)

- [ ] Vehicles collection - `assets/TBD/vehicles/`
- [ ] Buildings and structures - Various locations in TBD
- [ ] Characters and NPCs - Need organization
- [ ] Props and decorations - `assets/TBD/misc_sprites/`
- [ ] Special themed tilesets:
  - [ ] Snow/winter - `assets/TBD/snow_tilesets/` (528 files)
  - [ ] Dungeon - `assets/TBD/dungeon_pack/` (747 files)
  - [ ] Cave extras - `assets/TBD/cave_extras/`
  - [ ] Greenlands - `assets/TBD/loose_files/`

### 📋 Integration Priorities

See [assets/TBD/README.md](../assets/TBD/README.md) for integration workflow and priorities.

## Tileset Creation Guidelines

### Standard Tile Sizes

- **Ground Tiles**: 64x32 (isometric)
- **Objects/Buildings**: 64x64, 128x64, or larger
- **Characters**: 32x32, 64x64 depending on scale
- **Props**: Varies by object size

### Grid Organization

- **12x12 grids**: Standard for terrain variations (144 tiles)
- **10x7 grids**: Common for object collections (70 items)
- **8x8 grids**: Compact collections (64 items)
- **Custom**: Based on asset requirements

### File Naming Convention

```
<category>_<name>_<size>.tsx
```

Examples:
- `ground_grass_green.tsx`
- `vegetation_trees_shaded.tsx`
- `buildings_houses_small.tsx`

## Usage in Engines

### C++ Engine

```cpp
// Load a Tiled map
world->loadFromFile("tiled_maps/my_map.json");

// Access tile properties
Tile* tile = world->getTile(x, y);
bool walkable = tile->getProperty("walkable");
```

### Web Editor

```javascript
// Load a Tiled map
const map = await assetLoader.loadTiledMap("tiled_maps/my_map.json");

// Render map layers
map.layers.forEach(layer => {
    renderLayer(layer);
});
```

## Future Organization Plans

1. **Character Animation Sheets**
   - Organize all character sprites into animation-ready sheets
   - Separate by: idle, walk, run, attack, etc.
   - Create Tiled templates for animated tiles

2. **Building Interior Sets**
   - Extract and organize furniture
   - Create room templates
   - Interior wall and floor sets

3. **Seasonal Variations**
   - Organize by season (spring, summer, fall, winter)
   - Easy theme switching
   - Seasonal props and decorations

4. **UI Element Tileset**
   - Buttons, panels, frames
   - Icons and symbols
   - Dialog boxes and menus

## Contributing New Assets

When adding new assets:

1. Place source images in appropriate `assets/` subdirectory
2. Create corresponding `.tsx` tileset in `tilesheets/`
3. Update this catalog
4. Test in Tiled editor
5. Export test map to verify game integration

## Asset Credits

See `assets/isometric_trees_pack/license.txt` and individual asset folders for license information.
