# Individual Asset Tiles

This directory contains individual tiles extracted from the game's tilesheets. These individual assets are intended for use in the map editor to piece together custom maps, buildings, and scenes.

## 📂 Directory Structure

The individual tiles are organized by asset type to make them easy to find and use:

```
individual/
├── ground_tiles/     # Terrain tiles (grass, dirt, sand, stone, etc.)
├── trees/            # Tree and vegetation sprites
├── vehicles/         # Vehicle sprites (cars, trucks, etc.)
├── buildings/        # Building components and structures
├── characters/       # Character sprites and animations
└── props/            # Decorative objects and props
```

## 🌱 Ground Tiles

Ground tiles are isometric diamond-shaped terrain tiles in both standard and high-resolution formats.

### Available Tilesets (56 tiles each)

#### Standard Resolution (64×32 pixels)
- `grass_green_64x32/` - Vibrant green grass
- `grass_dry_64x32/` - Dry, summer grass
- `grass_medium_64x32/` - Medium green grass
- `dirt_64x32/` - Standard dirt ground
- `dirt_dark_64x32/` - Rich, dark soil
- `sand_64x32/` - Beach and desert sand
- `stone_path_64x32/` - Stone pathways and roads
- `forest_ground_64x32/` - Forest floor with undergrowth

#### High Resolution (128×64 pixels)
- `grass_green_128x64/` - High-res green grass
- `grass_dry_128x64/` - High-res dry grass
- `grass_medium_128x64/` - High-res medium grass
- `dirt_128x64/` - High-res dirt
- `dirt_dark_128x64/` - High-res dark dirt
- `sand_128x64/` - High-res sand
- `stone_path_128x64/` - High-res stone paths
- `forest_ground_128x64/` - High-res forest ground

### File Naming Convention

Ground tiles are named: `{tileset}-{number}.png`

Example: `grass_green_64x32-000.png` through `grass_green_64x32-055.png`

### Usage in Editor

Ground tiles can be used to:
- Create varied terrain with natural-looking transitions
- Mix different tile variations for organic appearance
- Build paths, beaches, forests, and grasslands
- Layer different ground types for depth

## 🌲 Trees

Tree sprites for vegetation and decoration in both standard and high-resolution formats.

### Available Tilesets (70 trees each)

#### Standard Resolution (64×64 pixels)
- `trees_64x32_shaded/` - Trees with shaded lighting
- `trees_64x32_no_shadow/` - Trees without shadows (for custom lighting)
- `trees_64x32_cloudy/` - Trees with overcast/cloudy lighting

**Note**: The "64x32" in the name refers to the isometric tile base size these trees are designed for, but the actual sprite dimensions are 64×64 pixels to accommodate tree height.

#### High Resolution (128×128 pixels)
- `trees_128x64_shaded/` - High-res trees with shadows
- `trees_128x64_no_shadow/` - High-res trees without shadows
- `trees_128x64_cloudy/` - High-res trees with cloudy lighting

**Note**: Similarly, "128x64" refers to the tile base, but sprites are 128×128 pixels.

### Tree Varieties Included

- Pine trees (various sizes)
- Oak trees
- Palm trees
- Bushes and shrubs
- Small vegetation
- And many more!

### File Naming Convention

Tree tiles are named: `{tileset}-{number}.png`

Example: `trees_64x32_shaded-000.png` through `trees_64x32_shaded-069.png`

### Usage in Editor

Trees can be used to:
- Create forests and wooded areas
- Add individual decorative trees
- Build parks and gardens
- Create natural barriers and boundaries
- Add depth and visual interest to scenes

## 🚗 Vehicles

*(To be populated with vehicle sprites)*

Vehicle sprites for roads, parking lots, and urban scenes.

## 🏢 Buildings

*(To be populated with building components)*

Building parts and structures for constructing custom buildings.

## 👤 Characters

*(To be populated with character sprites)*

Character sprites and animation frames.

## 🎨 Props

*(To be populated with decorative props)*

Decorative objects, rocks, bushes, and other props.

## 🔧 How to Use in the Editor

### Loading Individual Tiles

```javascript
// Example: Load a specific ground tile
const tile = new Image();
tile.src = 'assets/individual/ground_tiles/grass_green_64x32/grass_green_64x32-015.png';

// Example: Load a specific tree
const tree = new Image();
tree.src = 'assets/individual/trees/trees_64x32_shaded/trees_64x32_shaded-023.png';
```

### Building Custom Maps

1. **Choose your base terrain**: Select ground tiles from the appropriate tileset
2. **Add variations**: Mix different numbered tiles for organic look
3. **Layer decorations**: Add trees, bushes, and props on top
4. **Place structures**: Add buildings and vehicles
5. **Add characters**: Place character sprites for life

### Mixing Resolutions

- Use 64×32 ground tiles with 64×64 trees for standard resolution
- Use 128×64 ground tiles with 128×128 trees for high resolution
- Don't mix different resolutions in the same scene for consistency

### Tile Palette Organization

When building a tile palette in the editor:

1. **Group by type**: Keep ground tiles separate from decorations
2. **Show variations**: Display several tiles from each set for variety
3. **Preview mode**: Show thumbnails of each tile for easy selection
4. **Search functionality**: Allow filtering by tileset name

## 📊 Statistics

- **Total Individual Tiles**: 1,316
- **Ground Tile Variants**: 896 tiles (16 tilesets × 56 tiles)
- **Tree Variants**: 420 tiles (6 tilesets × 70 tiles)
- **Resolutions Available**: 64×32, 128×64, 64×64, 128×128

## 🔄 Regenerating Tiles

If you need to regenerate the individual tiles from the source tilesheets:

```bash
python3 utils/split_tilesheets.py
```

This will re-extract all tiles from the source tilesheet files.

## 🗺️ Professional Map Editor Integration

These individual tiles can be used with professional map editing tools like **TileZed, WorldEd, and BuildingEd** (from Project Zomboid).

**Benefits:**
- Visual map editing instead of coding
- Multi-floor building design
- Scene creation (interiors that you enter through doors)
- Large world map creation
- Advanced tile placement tools

**See**: [docs/TILEZED_INTEGRATION.md](../../docs/TILEZED_INTEGRATION.md) for complete integration guide.

## 📝 Original Source Files

The individual tiles are extracted from:

- **Ground tiles**: `assets/ground_tiles_sheets/`
- **Trees**: `assets/isometric_trees_pack/sheets/`

**Important**: The original tilesheet files remain intact in their original locations. The individual tiles are copies created for editor convenience.

## 🎮 Integration with Game Engines

### Web-based Editor

The web editor can load individual tiles on-demand for a palette interface, allowing users to drag and drop tiles onto the canvas.

### C++ OpenGL Engine

The C++ engine can either:
1. Load individual tiles as needed
2. Continue using the original tilesheets for optimized rendering
3. Use a hybrid approach based on zoom level and performance needs

## 💡 Best Practices

1. **Use consistent resolution**: Stick to one resolution per map (all 64× or all 128×)
2. **Vary your tiles**: Don't use the same tile repeatedly; mix variations
3. **Layer thoughtfully**: Ground first, then decorations, then structures
4. **Consider performance**: Individual tiles = more draw calls; use atlasing for production
5. **Maintain organization**: Keep tiles grouped by type for easy access

## 🚀 Future Additions

Planned additions to individual tiles:

- [ ] Vehicle sprites (cars, trucks, boats)
- [ ] Building components (walls, roofs, doors, windows)
- [ ] Character sprite sheets (walking, idle, actions)
- [ ] Props (rocks, bushes, furniture, objects)
- [ ] UI elements (buttons, panels, icons)
- [ ] Special effects (particles, animations)

## 📄 License

See the parent `assets/` directory and individual asset pack folders for licensing information.
