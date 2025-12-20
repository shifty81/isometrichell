# Tileset Configurations

This directory contains tileset configuration files for use with TileZed and WorldEd.

## Files

- `DailyGrind_Ground.tiles` - Ground terrain tiles
- `DailyGrind_Trees.tiles` - Trees and vegetation
- `DailyGrind_Buildings.tiles` - Building structures
- `DailyGrind_Characters.tiles` - Character sprites
- `DailyGrind_Vehicles.tiles` - Vehicle sprites

## Using with TileZed

1. Launch TileZed
2. Go to Tools → Tileset Manager
3. Click "Add Tileset"
4. Browse to this directory and select a .tiles file
5. The tileset will now be available for use in WorldEd and BuildingEd

## Format

These files use the Tiled Tileset XML format (.tsx), which is compatible with:
- TileZed
- WorldEd
- BuildingEd
- Tiled Map Editor
- Custom parsers

## Customization

You can edit these files to:
- Add more asset paths
- Change tile properties (walkable, type, etc.)
- Add custom metadata
- Organize tiles into categories

## Auto-Configuration

When you run `./tools/setup-editors.sh`, these files are automatically:
1. Created in this directory
2. Copied to `tools/zomboid_editors/Tilesets/` if editors are installed
3. Configured to point to our `assets/` directory

This ensures the editors can immediately access all our game assets.
