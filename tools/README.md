# External Tools Directory

This directory contains external map/level editing tools used for The Daily Grind project.

## WorldEd and TileZed Integration

### What are these tools?

- **TileZed**: Main tileset and asset management tool
- **WorldEd**: Large outdoor map creation tool  
- **BuildingEd**: Interior building design tool (accessible through TileZed)

These are open-source (GPL-2.0) tools from Project Zomboid that we use for professional map editing.

## Installation

### Option 1: Automatic Installation (Recommended)

1. Download the TileZed/WorldEd package from:
   - [Official Download Thread](https://theindiestone.com/forums/index.php?/topic/59675-latest-tilezed-worlded-and-tilesets-september-8-2022/)
   - Or GitHub: [TileZed](https://github.com/Unjammer/TileZed) | [WorldEd](https://github.com/Unjammer/WorldEd)

2. Place the downloaded .zip file(s) in this `tools/` directory with one of these names:
   - `TileZed.zip`
   - `WorldEd.zip`
   - `zomboid_editors.zip`

3. Run the setup script:
   ```bash
   ./tools/setup-editors.sh
   ```
   
   This will:
   - Extract the tools to `tools/zomboid_editors/`
   - Set up executable permissions
   - Configure tilesets for our assets
   - Create launch scripts

### Option 2: Manual Installation

```bash
# Extract your downloaded zip file
unzip TileZed_*.zip -d tools/zomboid_editors/

# Make executable (Linux/Mac)
chmod +x tools/zomboid_editors/TileZed
chmod +x tools/zomboid_editors/WorldEd

# Set up tilesets
./tools/setup-tilesets.sh
```

## Usage

After installation, launch the tools:

```bash
# Launch TileZed (main tool launcher)
./launch-tilezed.sh

# Launch WorldEd directly
./launch-worlded.sh
```

Or manually from the tools directory:

```bash
cd tools/zomboid_editors
./TileZed      # Linux/Mac
TileZed.exe    # Windows
```

## Directory Structure

```
tools/
├── README.md                          # This file
├── zomboid_editors/                   # Extracted tools (auto-created)
│   ├── TileZed/
│   ├── WorldEd/
│   └── Tilesets/                     # Tool-specific tilesets
├── tilesets/                          # Our custom tileset configs
│   ├── DailyGrind_Ground.tiles
│   ├── DailyGrind_Trees.tiles
│   └── DailyGrind_Buildings.tiles
├── setup-editors.sh                   # Automated setup script
├── setup-tilesets.sh                  # Tileset configuration
└── launch-*.sh                        # Launch scripts
```

## Updating Tools

To update to a newer version:

1. Delete the old installation:
   ```bash
   rm -rf tools/zomboid_editors
   ```

2. Place the new .zip file in `tools/`

3. Run setup again:
   ```bash
   ./tools/setup-editors.sh
   ```

## Troubleshooting

### Tools don't extract
- Ensure your .zip file is named correctly (see Installation section)
- Check that unzip is installed: `sudo apt-get install unzip`

### Tools won't launch
- Check executable permissions: `chmod +x tools/zomboid_editors/*`
- Verify Java is installed (required for TileZed/WorldEd)
- Check the logs in `logs/` directory

### Can't see our assets in the tools
- Run the tileset setup: `./tools/setup-tilesets.sh`
- Check that asset paths in tileset configs point to our `assets/` directory
- Restart the tool after configuration changes

## License

The TileZed, WorldEd, and BuildingEd tools are licensed under GPL-2.0.
See: https://github.com/Unjammer/TileZed

Our usage complies with GPL-2.0 terms:
- ✅ We use the tools for custom asset creation
- ✅ We do NOT use Project Zomboid's copyrighted assets
- ✅ We use only our own assets from the `assets/` directory

## Resources

- [TileZed Wiki](https://pzwiki.net/wiki/TileZed)
- [WorldEd Wiki](https://pzwiki.net/wiki/WorldEd)
- [BuildingEd Wiki](https://pzwiki.net/wiki/BuildingEd)
- [Complete Integration Guide](../docs/TILEZED_INTEGRATION.md)
- [Tiled Guide](../docs/TILED_GUIDE.md)
