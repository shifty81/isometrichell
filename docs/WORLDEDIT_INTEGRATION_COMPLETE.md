# Complete Integration Guide: WorldEdit and TileZed

This document explains the complete integration of WorldEdit and TileZed map editors into The Daily Grind project, including how it works, what gets extracted at build time, and how everything is automatically configured.

## Overview

The integration allows you to:
1. Place .7z or .zip archives of TileZed and WorldEd in the project root
2. Run a setup script that automatically extracts and configures them
3. Use professional map editing tools with our game assets
4. Export maps that work with both C++ and Web engines

## Architecture

### File Organization

```
TheDailyGrind/
├── worlded.7z                      # Place here (downloaded separately)
├── tilezed.7z                      # Place here (downloaded separately)
├── launch-tilezed.sh               # Auto-created by setup
├── launch-worlded.sh               # Auto-created by setup
├── tools/
│   ├── setup-editors.sh            # Main setup script
│   ├── setup-tilesets.sh           # Tileset configuration
│   ├── zomboid_editors/            # Extracted tools (gitignored)
│   │   ├── TileZed/               # or wherever they extract to
│   │   ├── WorldEd/
│   │   └── Tilesets/              # Our custom tilesets
│   └── tilesets/                   # Source tileset configs
│       ├── DailyGrind_Ground.tiles
│       ├── DailyGrind_Trees.tiles
│       ├── DailyGrind_Buildings.tiles
│       ├── DailyGrind_Characters.tiles
│       └── DailyGrind_Vehicles.tiles
├── tiled_maps/                     # Your exported maps
│   ├── world/
│   │   └── main_town.tmx
│   └── interiors/
│       └── houses/
│           └── house_01.tmx
└── assets/                         # Game assets (referenced by tilesets)
```

## How It Works

### 1. Archive Detection

The `setup-editors.sh` script looks for archive files in this order:

**For TileZed:**
- `tilezed.7z` or `TileZed.7z` (root or tools/)
- `tilezed.zip` or `TileZed.zip` (root or tools/)

**For WorldEd:**
- `worlded.7z` or `WorldEd.7z` (root or tools/)
- `worlded.zip` or `WorldEd.zip` (root or tools/)

**For Combined:**
- `zomboid_editors.7z` or `.zip` (root or tools/)

### 2. Automatic Extraction

When you run `./tools/setup-editors.sh`, it:

1. **Detects archives**: Finds .7z or .zip files in root or tools/
2. **Extracts to tools/zomboid_editors/**: Uses 7z or unzip automatically
3. **Sets permissions**: Makes executables on Linux/Mac (chmod +x)
4. **Configures tilesets**: Creates .tiles files pointing to our assets
5. **Creates launch scripts**: Places launch-*.sh in root directory

### 3. Tileset Configuration

The tileset files (`*.tiles`) are XML configuration files that tell TileZed/WorldEd where our assets are:

**Example: DailyGrind_Ground.tiles**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <tileset name="DailyGrind_Ground_64x32">
    <image source="../../assets/ground_tiles_sheets/grass_green_64x32.png"/>
    <properties>
      <property name="walkable" value="true"/>
      <property name="type" value="ground"/>
    </properties>
  </tileset>
</tilesets>
```

These files:
- Point to our `assets/` directory
- Define tile properties (walkable, type, etc.)
- Are automatically copied to `tools/zomboid_editors/Tilesets/`

### 4. Launch Scripts

Two launch scripts are created in the root:

**launch-tilezed.sh:**
- Finds the TileZed executable
- Changes to its directory
- Launches TileZed
- TileZed provides access to BuildingEd

**launch-worlded.sh:**
- Finds the WorldEd executable
- Changes to its directory
- Launches WorldEd for outdoor map creation

## Build-Time Integration

### Option 1: Standalone Setup

```bash
# Just setup editors
./tools/setup-editors.sh
```

### Option 2: With npm

```bash
# Setup editors
npm run setup:editors

# Setup tilesets only  
npm run setup:tilesets

# Setup everything
npm run setup:all
```

### Option 3: During C++ Build

```bash
# Build with editor setup
./build-engine.sh --setup-editors

# Or with CMake
mkdir build && cd build
cmake .. -DSETUP_EDITORS=ON
cmake --build .
```

## What Gets Extracted

When you run the setup, the archives extract to `tools/zomboid_editors/`. The exact structure depends on how the official distribution is packaged, but typically includes:

```
tools/zomboid_editors/
├── TileZed                 # Main executable (Linux/Mac)
├── TileZed.exe            # Main executable (Windows)
├── WorldEd                # WorldEd executable (Linux/Mac)
├── WorldEd.exe            # WorldEd executable (Windows)
├── lib/                   # Java libraries
├── jre/                   # Java runtime (if bundled)
└── Tilesets/              # Default tilesets + our custom ones
```

## Automatic Configuration

### Tilesets

The setup script creates and configures 5 tileset files:

1. **DailyGrind_Ground.tiles** - Ground terrain (grass, dirt, stone)
2. **DailyGrind_Trees.tiles** - Trees and vegetation
3. **DailyGrind_Buildings.tiles** - Building structures and walls
4. **DailyGrind_Characters.tiles** - Character sprites
5. **DailyGrind_Vehicles.tiles** - Vehicle sprites

Each tileset:
- Points to the correct `assets/` subdirectory
- Includes appropriate properties (walkable, type, etc.)
- Is automatically available in the editors

### Asset Paths

All tileset configurations use relative paths from the editors directory:

```
tools/zomboid_editors/Tilesets/DailyGrind_Ground.tiles
                       └─> ../../assets/ground_tiles_sheets/
```

This ensures the editors can find our assets regardless of where they're launched from.

## Usage Workflow

### 1. One-Time Setup

```bash
# Download worlded.7z and tilezed.7z
# Place in project root
./tools/setup-editors.sh
```

### 2. Launch Editors

```bash
# For building interiors
./launch-tilezed.sh

# For outdoor maps
./launch-worlded.sh
```

### 3. Create Content

**In WorldEd:**
- Create outdoor maps (towns, neighborhoods)
- Place buildings
- Design roads and paths
- Export as TMX: File → Export → TMX
- Save to `tiled_maps/world/`

**In TileZed → BuildingEd:**
- Create building interiors
- Design multi-floor structures
- Place furniture and props
- Export as TMX: File → Export → TMX
- Save to `tiled_maps/interiors/`

### 4. Use in Game

The TMX files can be loaded by both engines:

**C++ Engine:**
```cpp
world->loadFromTMX("tiled_maps/world/main_town.tmx");
```

**Web Editor:**
```javascript
await world.loadFromTiled("tiled_maps/world/main_town.tmx");
```

## GitIgnore Configuration

The `.gitignore` is configured to:

- ✅ **Include** setup scripts (tools/*.sh)
- ✅ **Include** tileset configurations (tools/tilesets/*.tiles)
- ❌ **Exclude** extracted editors (tools/zomboid_editors/)
- ⚠️ **Optional** exclude archive files (commented out by default)

You can choose whether to commit the .7z files to your repository:

**To exclude archives from git:**
```bash
# Edit .gitignore and uncomment:
# *.7z
# worlded.7z
# tilezed.7z
```

**To include archives in git:**
- Leave them as-is
- They'll be committed and available to all team members
- Anyone cloning the repo can run `./tools/setup-editors.sh`

## Prerequisites

### For Extraction

**For .7z files:**
```bash
# Ubuntu/Debian
sudo apt-get install p7zip-full

# Fedora/RHEL
sudo dnf install p7zip

# macOS
brew install p7zip
```

**For .zip files:**
```bash
# Ubuntu/Debian
sudo apt-get install unzip

# macOS
brew install unzip
```

### For Running the Editors

**Java Runtime Environment:**
```bash
# Ubuntu/Debian
sudo apt-get install default-jre

# macOS
brew install openjdk
```

The editors are Java-based and require JRE to run.

## Troubleshooting

### Archives Not Found

**Symptom:** Script says "No editor archive files found!"

**Solution:**
1. Check file names: `tilezed.7z` and `worlded.7z` (lowercase)
2. Place in project root (not tools/ subdirectory)
3. Run `ls -la *.7z` to verify files exist

### Extraction Failed

**Symptom:** "Failed to extract .7z file"

**Solution:**
1. Install p7zip: `sudo apt-get install p7zip-full`
2. Verify archive isn't corrupted: `7z t tilezed.7z`
3. Check disk space: `df -h`

### Can't Launch Editors

**Symptom:** "Could not find TileZed executable"

**Solution:**
1. Check extraction worked: `ls -la tools/zomboid_editors/`
2. Set permissions: `chmod +x tools/zomboid_editors/*`
3. Check Java: `java -version`

### Assets Not Showing

**Symptom:** Can't see our assets in the editors

**Solution:**
1. Re-run tileset setup: `./tools/setup-tilesets.sh`
2. Check asset paths in .tiles files
3. Restart the editor after configuration

## Advanced: Manual Setup

If automatic setup fails, you can do it manually:

```bash
# 1. Extract archives
7z x tilezed.7z -otools/zomboid_editors/
7z x worlded.7z -otools/zomboid_editors/

# 2. Set permissions
chmod +x tools/zomboid_editors/TileZed
chmod +x tools/zomboid_editors/WorldEd

# 3. Configure tilesets
./tools/setup-tilesets.sh

# 4. Launch manually
cd tools/zomboid_editors
./TileZed
```

## Security Notes

### GPL-2.0 Compliance

TileZed and WorldEd are GPL-2.0 licensed. Our usage:

- ✅ **Legal**: Using tools for custom content creation
- ✅ **Legal**: Using our own assets from `assets/`
- ❌ **Illegal**: Using Project Zomboid's copyrighted tilesets
- ✅ **Legal**: Distributing the tools with our project (GPL allows this)

### Asset Copyright

We configure the tools to use ONLY our assets:
- All .tiles files point to our `assets/` directory
- We do NOT include PZ's tilesets
- Our exports use our assets, not PZ's

## Future Enhancements

Potential improvements to the integration:

1. **TMX Parser**: Add full TMX parser to C++ engine
2. **Scene System**: Implement door-based scene transitions
3. **Auto-Import**: Watch tiled_maps/ and auto-reload in dev mode
4. **CI Integration**: Extract editors in CI for automated testing
5. **Docker Support**: Add Docker container with editors pre-installed

## Summary

This integration provides:

✅ **Automatic extraction** of WorldEd and TileZed from archives  
✅ **Automatic configuration** of tilesets for our assets  
✅ **Simple launch scripts** for easy access  
✅ **Build integration** with CMake and npm  
✅ **Clean separation** (extracted tools not in git)  
✅ **Professional workflow** for content creation  
✅ **Cross-platform support** (Linux, Mac, Windows)  

The setup is designed to be:
- **One-time**: Run setup once, use forever
- **Automatic**: Minimal manual configuration
- **Flexible**: Multiple ways to trigger setup
- **Clean**: Doesn't pollute the repository
- **Team-friendly**: Easy for new developers to set up

---

For more information:
- [Quick Start Guide](WORLDEDIT_TILEZED_SETUP.md)
- [TileZed Integration Details](TILEZED_INTEGRATION.md)
- [Tiled Format Guide](TILED_GUIDE.md)
