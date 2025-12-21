# Asset Management Workflow

This document describes two approaches for managing game assets in The Daily Grind project: **Sprite Sheet Usage** (recommended) and **Individual Tile Extraction** (legacy).

## 📋 Overview

### ✅ Recommended: Sprite Sheet Approach (NEW)

Use sprite sheets directly in the game engine with metadata for optimal performance:

```
1. Source Sprite Sheets (TBD or main assets/)
   ↓
2. Generate Metadata (assets/sprite_metadata/)
   ↓
3. Load Sheets Directly in Game Engine
   ↓
4. Extract Sprites at Runtime as Needed
```

**Benefits**:
- ✅ Source images kept intact
- ✅ Fewer files, better performance
- ✅ Supports animations and directional movement
- ✅ Easier to update and maintain

### ⚠️ Legacy: Individual Tile Extraction

Extract individual tiles for use (old approach):

```
1. Tilesets/Source Files (TBD or main assets/)
   ↓
2. Extract to Individual Tiles (assets/individual/)
   ↓
3. Archive Original Tilesets (assets/archives/)
   ↓
4. Use Individual Tiles in Game
```

## 🗂️ Directory Structure

```
assets/
├── TBD/                        # Unprocessed assets
│   ├── dungeon_pack/          # 747 dungeon tiles
│   ├── snow_tilesets/         # 529 winter assets
│   ├── vehicles/              # Vehicle sprite sheets (8 sheets × 64 sprites)
│   └── ...                    # Other categories
│
├── sprite_metadata/            # NEW: Metadata for direct sprite sheet usage
│   ├── vehicles.json          # Vehicle sprite sheet metadata
│   ├── ground_tiles.json      # Ground tile sheet metadata
│   ├── trees.json             # Tree sprite sheet metadata
│   ├── dungeon.json           # Dungeon pack metadata
│   └── README.md              # Usage documentation
│
├── ground_tiles_sheets/        # Ground tile sprite sheets (source)
├── isometric_trees_pack/       # Tree sprite sheets (source)
│
├── individual/                 # Legacy: Extracted individual tiles
│   ├── ground_tiles/          # Previously extracted terrain tiles
│   ├── trees/                 # Previously extracted tree sprites
│   └── ...                    # Other extracted categories
│
└── archives/                   # Archived originals (git-ignored)
    └── README.md              # Archive documentation
```

## 🚀 Recommended Workflow: Sprite Sheets

### Step 1: Generate Sprite Sheet Metadata

Create metadata files that describe how to use sprite sheets directly:

```bash
# Generate all sprite sheet metadata
python3 utils/create_sprite_metadata.py --all

# Or generate specific categories
python3 utils/create_sprite_metadata.py --vehicles
python3 utils/create_sprite_metadata.py --ground-tiles
python3 utils/create_sprite_metadata.py --trees
python3 utils/create_sprite_metadata.py --dungeon
```

This creates JSON metadata files in `assets/sprite_metadata/` that tell the game engine:
- Where sprite sheets are located
- Sprite dimensions (e.g., 32x32)
- Grid layout (e.g., 8x8 = 64 sprites)
- Usage information

### Step 2: Load Sprite Sheets in Game Engine

Use the metadata to load and use sprite sheets directly:

```javascript
// Example: Load vehicle sprite sheet
const metadata = await fetch('assets/sprite_metadata/vehicles.json').then(r => r.json());
const sheet = new Image();
sheet.src = metadata.sheets[0].file; // Load red_vehicles.png

// Extract specific sprite at runtime
const spriteIndex = 5;
const { sprite_width, sprite_height, cols } = metadata.sheets[0];
const col = spriteIndex % cols;
const row = Math.floor(spriteIndex / cols);

ctx.drawImage(
    sheet,
    col * sprite_width, row * sprite_height,
    sprite_width, sprite_height,
    x, y, sprite_width, sprite_height
);
```

See `assets/sprite_metadata/README.md` for complete usage examples.

### Step 3: Implement Animations and Movement

Use sprite indices for directional movement:

```javascript
// Vehicle moving north: sprites 0-3
// Vehicle moving east: sprites 4-7
// Vehicle moving south: sprites 8-11
// Vehicle moving west: sprites 12-15

const directionFrames = {
    north: [0, 1, 2, 3],
    east: [4, 5, 6, 7],
    south: [8, 9, 10, 11],
    west: [12, 13, 14, 15]
};

// Animate vehicle
let frame = 0;
setInterval(() => {
    const spriteIndex = directionFrames[currentDirection][frame];
    drawSprite(vehicleSheet, spriteIndex);
    frame = (frame + 1) % 4;
}, 100);
```

## 📦 Legacy Workflow: Individual Tile Extraction

This approach extracts individual tiles from sprite sheets. **Not recommended** for new assets but documented for existing extracted tiles.

### Step 1: List Available Assets

```bash
python3 utils/extract_tbd_assets.py --list
```

### Step 2: Extract to Individual Files (Legacy)

If processing assets from the TBD folder:

```bash
# Verify what will be extracted (dry run)
python3 utils/extract_tbd_assets.py --verify-only --vehicles

# Actually extract vehicles
python3 utils/extract_tbd_assets.py --vehicles

# Extract dungeon pack
python3 utils/extract_tbd_assets.py --dungeon

# Extract snow tilesets
python3 utils/extract_tbd_assets.py --snow

# Extract everything
python3 utils/extract_tbd_assets.py --all
```

### Step 3: Extract Individual Tiles from Tilesets

For tileset sheets that need to be split into individual tiles:

```bash
# Extract all configured tilesets (ground tiles, trees)
python3 utils/split_tilesheets.py
```

This will:
- Extract ground tiles (64x32 and 128x64 versions)
- Extract tree sprites (64x64 and 128x128 versions)
- Create organized subdirectories in `assets/individual/`

### Step 4: Verify Extraction

Check that the extraction worked correctly:

```bash
# Count extracted tiles
find assets/individual -name "*.png" | wc -l

# View a specific category
ls -la assets/individual/ground_tiles/grass_green_64x32/

# Test tiles (if test script exists)
python3 utils/test_individual_tiles.py
```

### Step 5: Test in Game

1. Launch the web editor: `./launch-editor.sh`
2. Load and test the individual tiles
3. Verify they render correctly
4. Test in various combinations

### Step 6: Archive Original Tilesets

Once extraction is verified and tested:

```bash
# Verify what will be archived (dry run)
python3 utils/archive_processed_assets.py --verify-only --all

# Archive ground tile sheets
python3 utils/archive_processed_assets.py --ground-tiles

# Archive tree sheets
python3 utils/archive_processed_assets.py --tree-sheets

# Archive source files (.blend)
python3 utils/archive_processed_assets.py --source-files

# Archive everything
python3 utils/archive_processed_assets.py --all
```

### Step 7: Update Documentation

After archiving, update relevant documentation:

1. **assets/individual/README.md** - Document new tile categories
2. **assets/TBD/README.md** - Mark assets as processed
3. **docs/ASSET_CATALOG.md** - Update asset inventory
4. **assets/archives/README.md** - Automatically updated by archive script

## 🎯 Common Scenarios

### Scenario 1: Processing New Assets from TBD

```bash
# 1. List what's available
python3 utils/extract_tbd_assets.py --list

# 2. Extract specific category
python3 utils/extract_tbd_assets.py --vehicles

# 3. Test in editor
./launch-editor.sh

# 4. Once confirmed working, the originals stay in TBD
# (TBD assets don't need archiving as they're already separate)
```

### Scenario 2: Processing Existing Tilesets

```bash
# 1. Extract individual tiles
python3 utils/split_tilesheets.py

# 2. Verify extraction
ls -la assets/individual/ground_tiles/

# 3. Test in game
./launch-editor.sh

# 4. Archive originals
python3 utils/archive_processed_assets.py --all
```

### Scenario 3: Adding New Tileset to Extract

Edit `utils/split_tilesheets.py` to add your new tileset:

```python
# Add to the appropriate section (ground tiles, trees, etc.)
new_sheets = [
    ('my_tileset_64x32.png', 'my_tileset_64x32'),
]

for filename, prefix in new_sheets:
    input_path = assets_dir / 'my_category' / filename
    if input_path.exists():
        output_dir = individual_dir / 'my_category' / prefix
        tiles = split_tilesheet(
            str(input_path),
            str(output_dir),
            tile_width=64,
            tile_height=32,
            cols=8,
            rows=7,
            prefix=prefix
        )
```

Then run the extraction and archival workflow.

## 📊 Space Management

### Current Sizes (Example)

- **TBD folder**: ~180 MB (unprocessed assets)
- **Individual tiles**: ~28 MB (actively used)
- **Archives**: ~0 MB initially (grows as originals are archived)

### Benefits of Archiving

1. **Reduced active project size**: Only keep what's actively used
2. **Faster git operations**: Fewer large binary files to track
3. **Cleaner workspace**: Clear separation of active vs archived
4. **Preserved originals**: Can always restore if needed

### What to Archive

✅ **Archive these**:
- Tileset sheets after splitting into individual tiles
- Source files (.blend, .psd) after generating final assets
- Large sprite sheets after extraction
- Any processed assets no longer actively edited

❌ **Don't archive these**:
- Individual tiles in `assets/individual/` (actively used)
- Assets still in `assets/TBD/` (not yet processed)
- Configuration files
- README files

## 🛠️ Tools Reference

### extract_tbd_assets.py

Extracts assets from the TBD folder to individual tiles.

```bash
python3 utils/extract_tbd_assets.py --help
```

**Options**:
- `--list` - List available asset categories
- `--verify-only` - Dry run, show what would be extracted
- `--vehicles` - Extract vehicle sprites
- `--dungeon` - Extract dungeon pack
- `--snow` - Extract snow tilesets
- `--all` - Extract all available assets

### split_tilesheets.py

Splits tileset sheets into individual tiles using ImageMagick.

```bash
python3 utils/split_tilesheets.py
```

**Requirements**:
- ImageMagick must be installed: `sudo apt-get install imagemagick`

**Configures**:
- Edit the script to add new tilesets to extract
- Specify tile dimensions and grid size

### archive_processed_assets.py

Archives original tilesets after extraction to conserve space.

```bash
python3 utils/archive_processed_assets.py --help
```

**Options**:
- `--verify-only` - Dry run, show what would be archived
- `--ground-tiles` - Archive ground tile sheets
- `--tree-sheets` - Archive tree sprite sheets
- `--source-files` - Archive source files (.blend)
- `--all` - Archive all eligible assets

**Safety**:
- Checks that individual tiles exist before archiving
- Verifies file counts before moving
- Updates archive log automatically

## 🔒 Safety Measures

### Before Archiving

1. **Always verify extraction first**: Use `--verify-only`
2. **Test in game**: Confirm tiles work correctly
3. **Check file counts**: Ensure all tiles extracted
4. **Backup if unsure**: Copy to a safe location first

### Preventing Data Loss

The tools include multiple safety checks:

- ✅ Verifies individual tiles exist before archiving originals
- ✅ Counts extracted tiles match expected counts
- ✅ Dry run mode available for all operations
- ✅ Archive log tracks what was moved and when
- ✅ Originals moved to archives, not deleted

### Recovery

If you need to restore archived files:

```bash
# Restore specific file
cp assets/archives/ground_tiles_sheets/grass_green_64x32.png assets/ground_tiles_sheets/

# Restore entire category
cp -r assets/archives/ground_tiles_sheets/* assets/ground_tiles_sheets/

# Re-extract if needed
python3 utils/split_tilesheets.py
```

## 📚 Related Documentation

- **[assets/TBD/README.md](../assets/TBD/README.md)** - Unprocessed assets inventory
- **[assets/individual/README.md](../assets/individual/README.md)** - Individual tiles documentation
- **[assets/archives/README.md](../assets/archives/README.md)** - Archive documentation
- **[docs/ASSET_CATALOG.md](ASSET_CATALOG.md)** - Complete asset inventory
- **[docs/ASSET_USAGE.md](ASSET_USAGE.md)** - How to use assets in the game

## 🤝 Contributing

When adding new assets:

1. **Place in TBD first**: New unprocessed assets go to `assets/TBD/`
2. **Extract to individual**: Use extraction tools to create individual tiles
3. **Test thoroughly**: Verify tiles work in the game
4. **Archive originals**: Move processed tilesets to archives
5. **Update docs**: Document new assets and workflow

## ❓ FAQ

**Q: What's the difference between TBD and archives?**  
A: TBD contains unprocessed assets that haven't been integrated yet. Archives contain processed tilesets after they've been split into individual tiles.

**Q: Can I delete archived files?**  
A: Yes, once archived and verified, they can be deleted to save space. Keep source files (.blend) though.

**Q: What if extraction fails?**  
A: Check that ImageMagick is installed. Verify tileset dimensions and grid size are correct.

**Q: How do I add a new tileset type?**  
A: Edit `split_tilesheets.py` to add configuration for your new tileset. See "Scenario 3" above.

**Q: Should TBD assets be archived?**  
A: No, TBD assets stay in TBD until they're processed. Only the extracted results from active assets get archived.

---

**Last Updated**: 2025-12-21  
**Maintainer**: The Daily Grind Development Team
