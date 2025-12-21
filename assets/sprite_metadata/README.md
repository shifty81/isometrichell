# Sprite Sheet Metadata

This directory contains JSON metadata files that describe how to use sprite sheets directly in the game without extracting individual tiles. This approach keeps source images intact and is more efficient.

## 📋 Purpose

Instead of extracting thousands of individual tile images, the game engine can:
- Load sprite sheets directly
- Use metadata to locate specific sprites within sheets
- Support animations and directional movement
- Reduce file count and improve loading performance

## 🗂️ Metadata Files

### vehicles.json
- **8 vehicle sprite sheets** (256x256 each)
- **8x8 grid** = 64 sprites per sheet
- **Sprite size**: 32x32 pixels
- **Total**: 512 vehicle sprites across all colors
- **Usage**: Directional movement, vehicle types, animations

### ground_tiles.json
- **16 ground tile sheets** (8 standard res, 8 high res)
- **8x7 grid** = 56 tiles per sheet  
- **Sprite sizes**: 64x32 (standard) or 128x64 (high res)
- **Total**: 896 ground tiles
- **Usage**: Terrain rendering, transitions

### trees.json
- **6 tree sprite sheets** (3 lighting variants × 2 resolutions)
- **10x7 grid** = 70 sprites per sheet
- **Sprite sizes**: 64x64 (standard) or 128x128 (high res)
- **Total**: 420 tree sprites
- **Usage**: Vegetation, decoration, depth layers

### dungeon.json
- **459 sprite sheets** (large dungeon tiles and objects)
- **288 individual tiles** (small decorative elements)
- **Total**: 747 PNG files
- **Usage**: Interior spaces, underground areas

## 📊 Benefits

### Performance
- ✅ **Fewer HTTP requests**: Load 1 sheet vs 64 individual images
- ✅ **Better caching**: Sheets cached once, sprites extracted at runtime
- ✅ **Reduced file system overhead**: Fewer files to manage

### Development
- ✅ **Source images intact**: Original sheets preserved for re-editing
- ✅ **Easier updates**: Update 1 sheet instead of 64 individual files
- ✅ **Flexible extraction**: Extract sprites on-demand as needed

### Space
- ✅ **No duplication**: Don't need both sheets AND individual tiles
- ✅ **Smaller repository**: Fewer files tracked in git
- ✅ **Efficient storage**: PNG compression works better on sheets

## 🎮 Usage in Game Engine

### JavaScript/Web Engine Example

```javascript
// Load sprite sheet metadata
const vehicleMetadata = await fetch('assets/sprite_metadata/vehicles.json').then(r => r.json());

// Load a specific sprite sheet
const sheet = new Image();
sheet.src = vehicleMetadata.sheets[0].file; // red_vehicles.png

// Extract a specific sprite (e.g., sprite #5)
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const spriteIndex = 5;
const { sprite_width, sprite_height, cols } = vehicleMetadata.sheets[0];

const col = spriteIndex % cols;
const row = Math.floor(spriteIndex / cols);

canvas.width = sprite_width;
canvas.height = sprite_height;

ctx.drawImage(
    sheet,
    col * sprite_width, row * sprite_height,  // source
    sprite_width, sprite_height,               // source size
    0, 0,                                      // dest
    sprite_width, sprite_height                // dest size
);

// Now canvas contains the extracted sprite
```

### C++ Engine Example

```cpp
// Load sprite sheet metadata (using JSON library)
json vehicleMetadata = loadJSON("assets/sprite_metadata/vehicles.json");

// Load sprite sheet texture
Texture2D sheet = LoadTexture(vehicleMetadata["sheets"][0]["file"]);

// Extract sprite by index
int spriteIndex = 5;
int spriteWidth = vehicleMetadata["sheets"][0]["sprite_width"];
int spriteHeight = vehicleMetadata["sheets"][0]["sprite_height"];
int cols = vehicleMetadata["sheets"][0]["cols"];

int col = spriteIndex % cols;
int row = spriteIndex / cols;

Rectangle sourceRect = {
    col * spriteWidth,
    row * spriteHeight,
    spriteWidth,
    spriteHeight
};

// Draw sprite at runtime
DrawTextureRec(sheet, sourceRect, position, WHITE);
```

## 🔄 Animation Support

For animated sprites (like moving vehicles):

```javascript
class AnimatedSprite {
    constructor(spriteSheet, metadata, startFrame, endFrame, fps) {
        this.sheet = spriteSheet;
        this.metadata = metadata;
        this.frames = [];
        
        // Build frame list
        for (let i = startFrame; i <= endFrame; i++) {
            this.frames.push(this.getSpriteRect(i));
        }
        
        this.currentFrame = 0;
        this.frameTime = 1000 / fps;
        this.lastUpdate = Date.now();
    }
    
    getSpriteRect(index) {
        const { sprite_width, sprite_height, cols } = this.metadata;
        return {
            x: (index % cols) * sprite_width,
            y: Math.floor(index / cols) * sprite_height,
            width: sprite_width,
            height: sprite_height
        };
    }
    
    update() {
        const now = Date.now();
        if (now - this.lastUpdate >= this.frameTime) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.lastUpdate = now;
        }
    }
    
    draw(ctx, x, y) {
        const frame = this.frames[this.currentFrame];
        ctx.drawImage(
            this.sheet,
            frame.x, frame.y, frame.width, frame.height,
            x, y, frame.width, frame.height
        );
    }
}

// Usage: vehicle moving with 4-frame animation
const vehicleAnim = new AnimatedSprite(
    vehicleSheet,
    vehicleMetadata.sheets[0],
    0, 3,  // frames 0-3
    10     // 10 FPS
);
```

## 📝 Metadata Format

Each metadata JSON file contains:

```json
{
  "description": "Human-readable description",
  "sheets": [
    {
      "name": "sheet_name",
      "file": "relative/path/to/sheet.png",
      "sprite_width": 32,
      "sprite_height": 32,
      "cols": 8,
      "rows": 8,
      "total_sprites": 64,
      "usage": "Description of intended use"
    }
  ]
}
```

## 🛠️ Regenerating Metadata

If sprite sheets change or new ones are added:

```bash
# Regenerate all metadata
python3 utils/create_sprite_metadata.py --all

# Or regenerate specific categories
python3 utils/create_sprite_metadata.py --vehicles
python3 utils/create_sprite_metadata.py --ground-tiles
python3 utils/create_sprite_metadata.py --trees
python3 utils/create_sprite_metadata.py --dungeon
```

## 💡 Best Practices

1. **Keep sheets organized**: Group related sprites in same sheet
2. **Consistent grid sizes**: Makes code simpler and faster
3. **Power-of-2 dimensions**: Better GPU performance (256x256, 512x512, etc.)
4. **Sprite padding**: Add 1px padding between sprites to avoid bleeding
5. **Cache sheets**: Load once, use many times
6. **Atlas larger sheets**: For production, combine multiple sheets into atlases

## 🔗 Related Documentation

- **[docs/ASSET_WORKFLOW.md](../../docs/ASSET_WORKFLOW.md)** - Asset workflow overview
- **[utils/README.md](../../utils/README.md)** - Utility tools reference
- **[assets/TBD/README.md](../TBD/README.md)** - Unprocessed assets

---

**Last Updated**: 2025-12-21  
**Maintainer**: The Daily Grind Development Team
