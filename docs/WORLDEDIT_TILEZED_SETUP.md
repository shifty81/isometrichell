# WorldEdit and TileZed Integration - Quick Start Guide

This guide walks you through setting up and using the WorldEdit and TileZed map editors with The Daily Grind project.

## What You Need

You need to obtain the TileZed and WorldEd editor tools. These are separate .7z or .zip archive files.

### Where to Get Them

Download from the official source:
- [The Indie Stone Forums - Latest TileZed, WorldEd and Tilesets](https://theindiestone.com/forums/index.php?/topic/59675-latest-tilezed-worlded-and-tilesets-september-8-2022/)
- Or GitHub: [TileZed](https://github.com/Unjammer/TileZed) | [WorldEd](https://github.com/Unjammer/WorldEd)

## Installation Steps

### Step 1: Place Archive Files

Place the downloaded archive files in the **root directory** of the project:

```
TheDailyGrind/
├── tilezed.7z          ← Place here
├── worlded.7z          ← Place here
├── tools/
├── assets/
└── ...
```

**Supported file names:**
- `tilezed.7z` or `TileZed.7z` or `TileZed.zip`
- `worlded.7z` or `WorldEd.7z` or `WorldEd.zip`
- `zomboid_editors.7z` (if both tools are in one archive)

### Step 2: Install p7zip (for .7z files)

If you have .7z files, you need p7zip installed:

```bash
# Ubuntu/Debian
sudo apt-get install p7zip-full

# Fedora/RHEL
sudo dnf install p7zip

# macOS
brew install p7zip

# Arch Linux
sudo pacman -S p7zip
```

For .zip files, you need unzip:

```bash
# Ubuntu/Debian
sudo apt-get install unzip
```

### Step 3: Run Setup Script

Run the automated setup:

```bash
./tools/setup-editors.sh
```

This will:
1. ✅ Detect your archive files (tilezed.7z and worlded.7z)
2. ✅ Extract them to `tools/zomboid_editors/`
3. ✅ Set executable permissions (Linux/Mac)
4. ✅ Configure tilesets for our assets
5. ✅ Create launch scripts in the root directory

### Alternative: Use npm Scripts

If you prefer using npm:

```bash
# Setup editors
npm run setup:editors

# Setup tilesets only
npm run setup:tilesets

# Setup everything
npm run setup:all
```

### Alternative: Setup During Build

You can also setup during the C++ engine build:

```bash
# Build and setup editors
./build-engine.sh --setup-editors

# Or with CMake directly
mkdir build && cd build
cmake .. -DSETUP_EDITORS=ON
cmake --build .
```

## Using the Editors

After installation, launch the tools:

### Launch TileZed

TileZed is the main hub that provides access to BuildingEd:

```bash
./launch-tilezed.sh
```

Or manually:
```bash
cd tools/zomboid_editors
./TileZed        # Linux/Mac
TileZed.exe      # Windows
```

### Launch WorldEd

WorldEd is for creating large outdoor maps:

```bash
./launch-worlded.sh
```

Or manually:
```bash
cd tools/zomboid_editors
./WorldEd        # Linux/Mac
WorldEd.exe      # Windows
```

## What Each Tool Does

### TileZed
- **Purpose**: Main tileset and asset management tool
- **Access to**: BuildingEd (for interior building design)
- **Use for**: 
  - Managing tilesets
  - Accessing BuildingEd
  - Configuring tile properties

### WorldEd
- **Purpose**: Large outdoor world map creation
- **Use for**:
  - Designing neighborhoods, towns, cities
  - Placing buildings on the map
  - Creating roads and paths
  - Defining zones (residential, commercial, etc.)

### BuildingEd (via TileZed)
- **Purpose**: Interior building design
- **Use for**:
  - Creating house interiors
  - Designing shops, offices, etc.
  - Multi-floor buildings
  - Furniture and prop placement

## Using Our Assets

The setup script automatically configures tilesets that point to our `assets/` directory:

- `DailyGrind_Ground.tiles` - Ground terrain
- `DailyGrind_Trees.tiles` - Trees and vegetation
- `DailyGrind_Buildings.tiles` - Building structures
- `DailyGrind_Characters.tiles` - Character sprites
- `DailyGrind_Vehicles.tiles` - Vehicles

These will be available in the editors after setup.

## Exporting Maps

Both WorldEd and BuildingEd can export to TMX (Tiled Map XML) format:

1. Create your map in WorldEd or BuildingEd
2. Go to File → Export → TMX
3. Save to `tiled_maps/` directory
4. The game engines (both C++ and Web) can load these TMX files

Example directory structure:
```
tiled_maps/
├── world/
│   ├── main_town.tmx
│   └── neighborhood_01.tmx
├── interiors/
│   ├── houses/
│   │   ├── house_01.tmx
│   │   └── house_02.tmx
│   └── shops/
│       └── grocery_store.tmx
```

## Troubleshooting

### "No editor archive files found"
- Ensure files are named correctly (tilezed.7z, worlded.7z)
- Place files in the root directory of the project
- Check file names are lowercase or capitalized correctly

### "7z command not found"
```bash
sudo apt-get install p7zip-full
```

### Tools won't launch
```bash
# Make sure they're executable
chmod +x tools/zomboid_editors/TileZed
chmod +x tools/zomboid_editors/WorldEd
```

### Can't see our assets in editors
```bash
# Re-run tileset setup
./tools/setup-tilesets.sh
```

### Need to update tools
```bash
# Remove old installation
rm -rf tools/zomboid_editors

# Place new archive files in root
# Run setup again
./tools/setup-editors.sh
```

## File Structure After Setup

```
TheDailyGrind/
├── tilezed.7z                      # Your archive (can keep or delete)
├── worlded.7z                      # Your archive (can keep or delete)
├── launch-tilezed.sh               # Created by setup
├── launch-worlded.sh               # Created by setup
├── tools/
│   ├── setup-editors.sh            # Setup script
│   ├── setup-tilesets.sh           # Tileset config script
│   ├── zomboid_editors/            # Extracted tools (not in git)
│   │   ├── TileZed/
│   │   ├── WorldEd/
│   │   └── Tilesets/
│   └── tilesets/                   # Our tileset configs
│       ├── DailyGrind_Ground.tiles
│       ├── DailyGrind_Trees.tiles
│       └── ...
├── tiled_maps/                     # Your exported maps
└── assets/                         # Game assets
```

## Next Steps

1. **Learn the Tools**:
   - See [TILEZED_INTEGRATION.md](../docs/TILEZED_INTEGRATION.md) for detailed usage
   - See [TILED_GUIDE.md](../docs/TILED_GUIDE.md) for TMX format info

2. **Create Your First Map**:
   - Launch WorldEd
   - Create a small test map
   - Export to TMX
   - Load in the game

3. **Create Your First Building**:
   - Launch TileZed → BuildingEd
   - Design a simple house interior
   - Export to TMX
   - Implement scene transitions in game

## License Note

TileZed, WorldEd, and BuildingEd are GPL-2.0 licensed tools. Our usage:
- ✅ We use the tools for custom content creation
- ✅ We use only our own assets from `assets/`
- ❌ We do NOT use Project Zomboid's copyrighted tilesets

## Resources

- [TileZed Wiki](https://pzwiki.net/wiki/TileZed)
- [WorldEd Wiki](https://pzwiki.net/wiki/WorldEd)
- [BuildingEd Wiki](https://pzwiki.net/wiki/BuildingEd)
- [Complete Integration Guide](../docs/TILEZED_INTEGRATION.md)
- [Community Mapping Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=853478035)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs in `logs/` directory
3. See the detailed documentation in `docs/TILEZED_INTEGRATION.md`
4. Check that you have all prerequisites installed
