# Utility Scripts Reference

This directory contains utility scripts for asset management, extraction, and game development.

## 📋 Asset Management Tools

### 🔍 inspect_assets.py (REQUIRED FIRST STEP)

**Purpose**: Examine assets to determine if viable as sprite sheet or need extraction. **Always run this first** before processing any assets for consistency.

**Usage**:
```bash
# Inspect specific categories
python3 utils/inspect_assets.py --vehicles
python3 utils/inspect_assets.py --ground-tiles
python3 utils/inspect_assets.py --trees

# Inspect specific file or directory
python3 utils/inspect_assets.py assets/TBD/vehicles/red_vehicles.png
python3 utils/inspect_assets.py assets/TBD/dungeon_pack/
```

**What it does**:
- Analyzes image dimensions and format
- Detects possible grid layouts
- Recommends: sprite sheet, extraction, or individual tile usage
- Suggests resize if dimensions don't match project standards
- Provides summary and next steps

**Requirements**:
- Pillow library: `pip install Pillow`

**Output**: 
- ✅ Viable as sprite sheet → Use `create_sprite_metadata.py`
- ⚠️ Need extraction → Use `split_tilesheets.py` or extraction tools
- 📝 Individual tile → Copy directly to `assets/individual/`
- 🔍 Manual review needed → Inspect image manually

---

### ✅ create_sprite_metadata.py (RECOMMENDED)

**Purpose**: Generate metadata files for using sprite sheets directly in the game without extraction. Keeps source images intact and supports animations.

**Usage**:
```bash
# Generate all sprite sheet metadata
python3 utils/create_sprite_metadata.py --all

# Generate specific categories
python3 utils/create_sprite_metadata.py --vehicles
python3 utils/create_sprite_metadata.py --ground-tiles
python3 utils/create_sprite_metadata.py --trees
python3 utils/create_sprite_metadata.py --dungeon
```

**What it does**:
- Creates JSON metadata files in `assets/sprite_metadata/`
- Describes sprite sheet layout (grid size, sprite dimensions)
- Allows game engine to load sheets directly and extract sprites at runtime
- Supports animations and directional movement

**Benefits**:
- ✅ Source images kept intact
- ✅ Fewer files (1 sheet vs 64 individual tiles)
- ✅ Better performance (fewer HTTP requests)
- ✅ Supports animations easily

**Output**: Metadata JSON files in `assets/sprite_metadata/`

See `assets/sprite_metadata/README.md` for usage examples in game code.

---

### extract_tbd_assets.py (LEGACY)

**Purpose**: Extract and organize assets from the `assets/TBD/` folder into individual tiles.

**⚠️ Note**: This approach extracts individual files. For sprite sheets (vehicles, tilesets), use `create_sprite_metadata.py` instead for better performance.

**Usage**:
```bash
# List available assets in TBD folder
python3 utils/extract_tbd_assets.py --list

# Verify what would be extracted (dry run)
python3 utils/extract_tbd_assets.py --verify-only --vehicles

# Extract specific categories
python3 utils/extract_tbd_assets.py --vehicles
python3 utils/extract_tbd_assets.py --dungeon
python3 utils/extract_tbd_assets.py --snow

# Extract all available assets
python3 utils/extract_tbd_assets.py --all
```

**Options**:
- `--list` - List available asset categories and file counts
- `--verify-only` - Show what would be extracted without copying files
- `--vehicles` - Extract vehicle sprites
- `--dungeon` - Extract dungeon pack (747 files)
- `--snow` - Extract snow tilesets (529 files)
- `--all` - Extract all available assets

**Output**: Extracted files go to `assets/individual/{category}/`

---

### split_tilesheets.py (LEGACY)

**Purpose**: Split large tileset sheets into individual tile images.

**Usage**:
```bash
# Extract all configured tilesets
python3 utils/split_tilesheets.py
```

**What it extracts**:
- Ground tiles (64x32 and 128x64) - 16 tilesets × 56 tiles each
- Tree sprites (64x64 and 128x128) - 6 tilesets × 70 trees each

**Requirements**:
- ImageMagick must be installed: `sudo apt-get install imagemagick`

**Output**: Individual tiles in `assets/individual/ground_tiles/` and `assets/individual/trees/`

**Customization**:
Edit the script to add new tilesets with their dimensions and grid specifications.

---

### archive_processed_assets.py

**Purpose**: Archive original tileset files after extraction to conserve space.

**Usage**:
```bash
# Verify what would be archived (dry run)
python3 utils/archive_processed_assets.py --verify-only --all

# Archive specific categories
python3 utils/archive_processed_assets.py --ground-tiles
python3 utils/archive_processed_assets.py --tree-sheets
python3 utils/archive_processed_assets.py --source-files

# Archive everything that's been extracted
python3 utils/archive_processed_assets.py --all
```

**Options**:
- `--verify-only` - Show what would be archived without moving files
- `--ground-tiles` - Archive ground tile sheets (16 files)
- `--tree-sheets` - Archive tree sprite sheets (6 files)
- `--source-files` - Archive source .blend files
- `--all` - Archive all eligible assets

**Safety Features**:
- Verifies individual tiles exist before archiving originals
- Checks file counts match expected values
- Updates archive log automatically
- Dry run mode available

**Output**: Archived files go to `assets/archives/{category}/`

---

### test_individual_tiles.py

**Purpose**: Test that extracted individual tiles are valid and complete.

**Usage**:
```bash
python3 utils/test_individual_tiles.py
```

**What it checks**:
- File existence and validity
- Correct image dimensions
- Expected file counts per tileset
- Image format and integrity

---

## 🎮 Game Development Tools

### export_scenes_to_game.py

**Purpose**: Export web editor scenes to format usable by the C++ game engine.

**Usage**:
```bash
python3 utils/export_scenes_to_game.py
```

---

### generate_ploppable_scenes.py

**Purpose**: Generate ploppable scene templates for the map editor.

**Usage**:
```bash
python3 utils/generate_ploppable_scenes.py
```

---

### export_world_to_worlded.py

**Purpose**: Export game world to WorldEd format for external editing.

**Usage**:
```bash
python3 utils/export_world_to_worlded.py
```

---

### extract_character_tiles.py

**Purpose**: Extract individual character sprite frames from sprite sheets.

**Usage**:
```bash
python3 utils/extract_character_tiles.py
```

---

## 🔍 Analysis Tools

### analyze_iso_building.py

**Purpose**: Analyze isometric building sprite dimensions and properties.

**Usage**:
```bash
python3 utils/analyze_iso_building.py path/to/building.png
```

---

## 📚 Complete Workflow Example

Here's a complete workflow for processing assets:

```bash
# Step 1: See what's available in TBD
python3 utils/extract_tbd_assets.py --list

# Step 2: Extract specific assets (e.g., vehicles)
python3 utils/extract_tbd_assets.py --verify-only --vehicles
python3 utils/extract_tbd_assets.py --vehicles

# Step 3: Split tilesets into individual tiles
python3 utils/split_tilesheets.py

# Step 4: Test in the editor
./launch-editor.sh
# Verify tiles work correctly in the game

# Step 5: Archive original tilesets
python3 utils/archive_processed_assets.py --verify-only --all
python3 utils/archive_processed_assets.py --all

# Step 6: Check results
ls -lh assets/individual/
ls -lh assets/archives/
```

---

## 🛠️ JavaScript Utilities

### IsometricUtils.js

Isometric coordinate conversion and rendering utilities.

### MathUtils.js

Common mathematical operations for game development.

### NoiseGenerator.js

Procedural noise generation for terrain and effects.

---

## 📖 Documentation

For complete details on the asset workflow, see:
- **[docs/ASSET_WORKFLOW.md](../docs/ASSET_WORKFLOW.md)** - Complete asset management guide
- **[assets/TBD/README.md](../assets/TBD/README.md)** - Unprocessed assets inventory
- **[assets/individual/README.md](../assets/individual/README.md)** - Individual tiles documentation
- **[assets/archives/README.md](../assets/archives/README.md)** - Archive documentation

---

## ⚡ Quick Commands

```bash
# Asset extraction
python3 utils/extract_tbd_assets.py --list              # List TBD assets
python3 utils/extract_tbd_assets.py --all               # Extract all TBD
python3 utils/split_tilesheets.py                       # Split tilesets

# Asset archival
python3 utils/archive_processed_assets.py --verify-only --all  # Dry run
python3 utils/archive_processed_assets.py --all                 # Archive all

# Game development
python3 utils/export_scenes_to_game.py                  # Export scenes
python3 utils/generate_ploppable_scenes.py              # Generate scenes

# Testing
python3 utils/test_individual_tiles.py                  # Test tiles
./launch-editor.sh                                      # Launch editor
```

---

**Last Updated**: 2025-12-21  
**Maintainer**: The Daily Grind Development Team
