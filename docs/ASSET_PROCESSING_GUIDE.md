# Asset Processing Workflow - Quick Reference

## 🎯 Consistent Asset Processing

**For all assets moving forward, follow this standardized workflow to ensure consistency:**

## Step-by-Step Process

### 1. 🔍 INSPECT (Required First Step)

**Always examine assets before processing:**

```bash
python3 utils/inspect_assets.py --vehicles
python3 utils/inspect_assets.py assets/TBD/your_asset.png
```

The inspector will recommend one of four actions:

#### ✅ Viable as Sprite Sheet
**Recommendation**: Use sprite sheet directly with metadata
**Next Step**: Go to Step 2

#### ⚠️ Need Extraction  
**Recommendation**: Extract individual tiles (dimensions don't match standards)
**Next Step**: Go to Step 3

#### 📝 Individual Tile
**Recommendation**: Already an individual tile, use as-is
**Next Step**: Copy to `assets/individual/`

#### 🔍 Manual Review
**Recommendation**: Human inspection needed
**Next Step**: Manually examine and decide

---

### 2. ✅ USE AS SPRITE SHEET (Recommended)

**If inspection says "VIABLE AS SPRITE SHEET":**

```bash
# Generate metadata
python3 utils/create_sprite_metadata.py --vehicles

# Metadata created in assets/sprite_metadata/
```

**Result**:
- Source image kept intact
- JSON metadata describes layout
- Game engine loads sheet directly
- Sprites extracted at runtime
- Supports animations/movement

**Example Usage in Game**:
```javascript
// Load metadata and sprite sheet
const metadata = await fetch('assets/sprite_metadata/vehicles.json').then(r => r.json());
const sheet = new Image();
sheet.src = metadata.sheets[0].file;

// Extract sprite at runtime
const spriteIndex = 5;
const { sprite_width, sprite_height, cols } = metadata.sheets[0];
const col = spriteIndex % cols;
const row = Math.floor(spriteIndex / cols);

ctx.drawImage(sheet, 
    col * sprite_width, row * sprite_height,  // source
    sprite_width, sprite_height,               // source size
    x, y, sprite_width, sprite_height);        // destination
```

---

### 3. ⚠️ EXTRACT TO INDIVIDUAL TILES

**If inspection says "NEED EXTRACTION":**

The asset dimensions don't match project standards or grid isn't suitable.

**Options:**

#### Option A: Modify/Resize First (if close to standard)
```bash
# Use image editor to resize to standard dimensions:
# 32x32, 64x32, 64x64, 128x64, 128x128

# Then re-inspect:
python3 utils/inspect_assets.py resized_asset.png
```

#### Option B: Extract As-Is
```bash
# For configured tilesets (ground tiles, trees):
python3 utils/split_tilesheets.py

# For TBD assets:
python3 utils/extract_tbd_assets.py --vehicles
python3 utils/extract_tbd_assets.py --dungeon
```

**Result**:
- Individual tile files created
- Stored in `assets/individual/{category}/`
- Can archive originals to save space

---

### 4. 📝 ARCHIVE ORIGINALS (Optional)

**After extraction, optionally archive originals:**

```bash
# Verify what would be archived
python3 utils/archive_processed_assets.py --verify-only --all

# Archive to save space
python3 utils/archive_processed_assets.py --all
```

**Result**:
- Originals moved to `assets/archives/`
- Individual tiles remain in `assets/individual/`
- Space saved in active project

---

## 📊 Decision Tree

```
START: New Asset
    |
    v
[1] INSPECT ASSET
    |
    ├─ ✅ Viable as sheet ─────> [2] Create metadata ─────> USE IN GAME
    |
    ├─ ⚠️ Need extraction ─────> Size wrong? ─┬─ Yes ─> Resize ─> Re-inspect
    |                                          |
    |                                          └─ No ──> [3] Extract tiles ─> [4] Archive originals
    |
    ├─ 📝 Individual tile ─────> Copy to individual/ ───> USE IN GAME
    |
    └─ 🔍 Manual review ───────> Human inspection ──────> Choose path above
```

---

## 🎯 Consistency Guidelines

### Always Do:
1. ✅ **Inspect first** - Run `inspect_assets.py` before any processing
2. ✅ **Follow recommendation** - Trust the inspector's analysis
3. ✅ **Keep sources** - Don't delete original files until archived
4. ✅ **Document** - Update READMEs for new asset categories
5. ✅ **Test** - Verify assets work in game before archiving

### Never Do:
1. ❌ Skip inspection - Leads to inconsistent asset handling
2. ❌ Mix approaches - Use either sprite sheets OR extraction, not both
3. ❌ Delete originals - Archive them instead
4. ❌ Use odd dimensions - Resize to standard sizes
5. ❌ Forget metadata - Always create metadata for sprite sheets

---

## 📁 Directory Organization

```
assets/
├── TBD/                      # Source: Unprocessed assets
├── sprite_metadata/          # Metadata for direct sprite sheet usage
├── individual/               # Extracted individual tiles (if needed)
├── archives/                 # Archived originals (space saving)
├── ground_tiles_sheets/      # Source sprite sheets (active)
└── isometric_trees_pack/     # Source sprite sheets (active)
```

---

## 🔧 Tool Quick Reference

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `inspect_assets.py` | Examine & recommend | **Always first step** |
| `create_sprite_metadata.py` | Generate metadata | When viable as sheet |
| `extract_tbd_assets.py` | Copy/extract from TBD | When extraction needed |
| `split_tilesheets.py` | Split configured sheets | When extraction needed |
| `archive_processed_assets.py` | Archive originals | After extraction complete |

---

## 💡 Best Practices

### For Sprite Sheets (Preferred)
- Use power-of-2 dimensions (256x256, 512x512)
- Regular grid layout (4x4, 8x8, 10x7)
- Include alpha channel for transparency
- Document sprite indices for animations

### For Extracted Tiles
- Match project standard sizes
- Use even dimensions
- Organize by category
- Archive originals after extraction

### For All Assets
- Always inspect first
- Keep naming consistent
- Document in README files
- Test before finalizing

---

## 🚀 Quick Start Examples

### Example 1: New Vehicle Sprites
```bash
# 1. Inspect
python3 utils/inspect_assets.py assets/TBD/vehicles/new_car.png
# Output: ✅ Viable as sprite sheet (8x8 grid, 32x32 sprites)

# 2. Create metadata
python3 utils/create_sprite_metadata.py --vehicles
# Done! Ready to use in game
```

### Example 2: Odd-Sized Tileset
```bash
# 1. Inspect
python3 utils/inspect_assets.py assets/TBD/tiles/weird_tiles.png
# Output: ⚠️ Need extraction (dimensions: 317x241)

# 2. Resize in image editor to 320x240 or 256x256

# 3. Re-inspect
python3 utils/inspect_assets.py assets/TBD/tiles/resized_tiles.png
# Output: ✅ Viable as sprite sheet (8x6 grid, 40x40 sprites)

# 4. Create metadata
python3 utils/create_sprite_metadata.py
```

### Example 3: Individual Tile
```bash
# 1. Inspect
python3 utils/inspect_assets.py assets/TBD/misc/single_rock.png
# Output: 📝 Individual tile (32x32)

# 2. Copy directly
cp assets/TBD/misc/single_rock.png assets/individual/props/
# Done!
```

---

**Remember**: Consistency is key. Always follow this workflow for all assets!

---

**Last Updated**: 2025-12-21  
**Maintained by**: The Daily Grind Development Team
