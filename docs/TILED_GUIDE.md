# Tiled Map Editor Integration Guide

## Overview

This project uses [Tiled Map Editor](https://www.mapeditor.org/) for creating and organizing game levels. All assets have been organized into categorized tilesheets for efficient map creation.

## Directory Structure

```
isometrichell/
├── tilesheets/              # Tiled tileset configurations (.tsx files)
│   ├── ground/             # Ground terrain tilesets
│   ├── vegetation/         # Trees, bushes, plants
│   ├── buildings/          # Building structures
│   ├── characters/         # Character sprites
│   ├── props/              # Decorative objects
│   └── vehicles/           # Vehicle sprites
│
├── tiled_maps/             # Tiled map files (.tmx files)
│   └── template_map.tmx    # Template isometric map
│
└── assets/                 # Original asset images
    ├── ground_tiles_sheets/
    ├── isometric_trees_pack/
    ├── isometric_vehicles/
    ├── Charachters/
    └── [other asset folders]
```

## Asset Organization

### Ground Tiles (64x32 isometric)
Located in `tilesheets/ground/`:
- **grass_green.tsx** - Green grass terrain (12x12 tile variants)
- **dirt.tsx** - Dirt terrain (12x12 tile variants)
- **sand.tsx** - Sand terrain (12x12 tile variants)
- **stone_path.tsx** - Stone paths (12x12 tile variants)
- **forest_ground.tsx** - Forest floor terrain (12x12 tile variants)

Each ground tileset contains 144 tiles (12x12 grid) with variations for:
- Flat tiles
- Edge transitions
- Corner transitions
- Blending between terrain types

### Vegetation
Located in `tilesheets/vegetation/`:
- **trees_shaded.tsx** - Trees with shadows (64x64 sprite size, 70 variants)
- **trees_no_shadow.tsx** - Trees without shadows (64x64 sprite size, 70 variants)

### Vehicles
Located in `tilesheets/vehicles/`:
- **vehicles_collection.tsx** - Collection of various vehicle types

## Getting Started with Tiled

### 1. Install Tiled

Download and install Tiled Map Editor from: https://www.mapeditor.org/

- **Windows**: Download installer from website
- **macOS**: `brew install --cask tiled`
- **Linux**: `sudo apt-get install tiled` or `sudo snap install tiled`

### 2. Open the Template Map

1. Launch Tiled
2. Open `tiled_maps/template_map.tmx`
3. The template includes all tilesets pre-loaded

### 3. Understanding Layers

The template map has three layers (order matters for rendering):

1. **Ground** - Base terrain tiles
2. **Vegetation** - Trees, bushes, decorations
3. **Buildings** - Structures and buildings

### 4. Creating a New Map

1. File → New → New Map
2. Choose "Isometric" orientation
3. Set tile dimensions: 64x32
4. Set map size: 30x30 (or desired size)
5. Add tilesets: Map → Add External Tileset
   - Navigate to `tilesheets/` and select desired `.tsx` files

### 5. Painting Tiles

1. Select a layer in the Layers panel
2. Select the Stamp Brush tool (B key)
3. Choose a tileset in the Tilesets panel
4. Click on tiles to select them
5. Paint on the map

## Tileset Properties

Each tile can have properties for game logic:

### Ground Tiles
- `type`: Terrain type (grass, dirt, sand, stone, forest)
- `walkable`: Boolean - Can characters walk on this tile?

### Vegetation
- `type`: Object type (tree, bush, etc.)
- `walkable`: Boolean - Usually false
- `blocking`: Boolean - Blocks line of sight

### Buildings
- `type`: Building type
- `walkable`: Boolean - Usually false
- `blocking`: Boolean - Blocks movement and sight

## Exporting for Game Use

### Export to JSON (for C++ Engine)

1. File → Export As...
2. Choose "JSON map files (*.json)"
3. Save to `tiled_maps/`
4. The C++ engine can load this JSON file

### Export to TMX (for Web Editor)

The `.tmx` format can be loaded by both Tiled and custom web-based editors.

## Advanced: Creating Custom Tilesets

### Ground Tileset Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" name="Custom Terrain" tilewidth="64" tileheight="32" tilecount="144" columns="12">
 <image source="../assets/path/to/your/tileset.png" width="768" height="384"/>
 <tile id="0">
  <properties>
   <property name="type" value="custom"/>
   <property name="walkable" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>
```

### Calculations for Tileset Size

For isometric 64x32 tiles:
- **Width** = `columns × tile_width` (e.g., 12 × 64 = 768px)
- **Height** = `rows × tile_height` (e.g., 12 × 32 = 384px)
- **Total tiles** = `columns × rows` (e.g., 12 × 12 = 144 tiles)

## Best Practices

### Layer Organization
1. **Ground** - Always the bottom layer, contains base terrain
2. **Ground Details** - Paths, patches, variations
3. **Vegetation** - Trees, bushes, flowers
4. **Props** - Rocks, debris, decorations
5. **Buildings** - Structures
6. **Roofs** - Separate layer for building roofs
7. **Entities** - Player spawn points, NPC positions (use object layer)

### Naming Conventions
- Layer names: PascalCase (e.g., `GroundLayer`, `VegetationLayer`)
- Tileset names: snake_case (e.g., `grass_green`, `trees_shaded`)
- Map files: descriptive names (e.g., `village_center.tmx`, `forest_path.tmx`)

### Performance Tips
- Keep maps to reasonable sizes (30x30 to 50x50 for most scenes)
- Use fewer layers when possible
- Combine similar object types into single layers
- Export frequently to test in-game

## Workflow

### Recommended Scene Creation Workflow

1. **Plan the Scene**
   - Sketch on paper or mentally plan the layout
   - Decide on terrain types and features

2. **Create Base Terrain**
   - Fill the Ground layer with primary terrain
   - Use grass, dirt, or forest ground as base

3. **Add Terrain Variations**
   - Add paths using stone_path tiles
   - Create terrain transitions
   - Add dirt patches or sand areas

4. **Place Vegetation**
   - Add trees in clusters or lines
   - Place bushes for detail
   - Consider natural-looking placement

5. **Add Buildings**
   - Place structures on the Buildings layer
   - Ensure buildings don't overlap
   - Leave space for doors and access

6. **Add Details**
   - Place props and decorations
   - Add vehicles or other objects
   - Fine-tune placement

7. **Test and Export**
   - Export to JSON
   - Test in C++ engine or web editor
   - Iterate and refine

## Integration with Game Engine

### Loading in C++ Engine

The C++ engine can load Tiled JSON exports:

```cpp
world->loadFromFile("tiled_maps/village_center.json");
```

### Loading in Web Editor

The web editor can import TMX or JSON:

```javascript
world.loadFromTiled("tiled_maps/village_center.json");
```

## Troubleshooting

### Tileset Not Loading
- Check that paths in .tsx files are relative to the map file
- Ensure image files exist at the specified paths
- Verify image dimensions match tileset settings

### Tiles Rendering Wrong
- Check layer order (ground should be bottom)
- Verify tile dimensions (64x32 for our isometric tiles)
- Ensure map orientation is set to "isometric"

### Performance Issues in Tiled
- Reduce map size
- Use fewer layers
- Close unused tilesets
- Update to latest Tiled version

## Resources

- **Tiled Documentation**: https://doc.mapeditor.org/
- **Isometric Guide**: https://doc.mapeditor.org/en/stable/manual/using-isometric-tiles/
- **Tiled Forum**: https://discourse.mapeditor.org/

## Future Enhancements

- [ ] Character spritesheet tilesets
- [ ] Building interior tilesets
- [ ] Props and decoration collection
- [ ] Animated tile support
- [ ] Auto-tiling rules for seamless terrain blending
- [ ] Custom object templates (spawn points, triggers)
