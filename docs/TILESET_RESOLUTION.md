# Tileset Dimensions and High-Resolution Asset Strategy

## Current Tileset Dimensions

### Ground Tiles (Terrain)

We have TWO resolutions available for most ground tiles:

#### Standard Resolution (Currently Used)
- **Individual Tile Size**: 64×32 pixels (isometric diamond)
- **Tileset Sheet Size**: 512×224 pixels (8 columns × 7 rows = 56 tiles)
- **File Example**: `grass_green_64x32.png`
- **Use Case**: Standard gameplay, good performance

#### High Resolution (Available)
- **Individual Tile Size**: 128×64 pixels (isometric diamond)
- **Tileset Sheet Size**: 1024×448 pixels (8 columns × 7 rows = 56 tiles)
- **File Example**: `grass_green_128x64.png`
- **Use Case**: High detail, close-up views, promotional screenshots

### Vegetation (Trees)

#### Standard Resolution
- **Individual Sprite Size**: 64×64 pixels per tree
- **Tileset Sheet Size**: 640×448 pixels (10 columns × 7 rows = 70 trees)
- **File Example**: `trees_64x32_shaded.png`

#### High Resolution
- **Individual Sprite Size**: 128×128 pixels per tree
- **Tileset Sheet Size**: 1280×896 pixels (10 columns × 7 rows = 70 trees)
- **File Example**: `trees_128x64_shaded.png`

## Resolution Scaling Strategy

### Option 1: Use High-Res with Runtime Downscaling (RECOMMENDED)

**Advantages:**
- Best visual quality when zoomed in
- Can scale down smoothly for performance
- Future-proof for 4K displays
- Same assets work at multiple zoom levels

**Implementation:**

```cpp
// C++ Engine - Load high-res and scale down
class Texture {
    // Load at native resolution
    bool loadFromFile(const char* path);
    
    // Scale for runtime use
    void setRenderScale(float scale); // 0.5 = half size, 1.0 = full size
};

// Usage
Texture groundTile;
groundTile.loadFromFile("assets/ground_tiles_sheets/grass_green_128x64.png");
groundTile.setRenderScale(0.5f); // Renders at 64x32 effective size
```

```javascript
// Web Editor - Use high-res with canvas scaling
const image = new Image();
image.src = 'assets/ground_tiles_sheets/grass_green_128x64.png';

// When drawing, scale down
ctx.drawImage(
    image,
    sourceX, sourceY, 128, 64,  // Source rect (high-res)
    destX, destY, 64, 32         // Dest rect (scaled down)
);
```

### Option 2: Pre-scaled Versions for Different Zoom Levels

Create multiple versions:
- **Ultra**: 256×128 (4× detail) - For extreme close-ups
- **High**: 128×64 (2× detail) - For normal close-up gameplay
- **Medium**: 64×32 (1× standard) - For normal gameplay
- **Low**: 32×16 (0.5× detail) - For zoomed-out view

### Option 3: Mipmapping (GPU-Accelerated)

OpenGL/GPU automatically creates scaled versions:

```cpp
// Enable mipmapping in texture loading
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
glGenerateMipmap(GL_TEXTURE_2D);

// GPU automatically selects appropriate resolution based on rendering size
```

## Recommended Configuration

### For C++ Engine

**Default Setup:**
```cpp
// In rendering configuration
const int BASE_TILE_WIDTH = 64;
const int BASE_TILE_HEIGHT = 32;
const float ASSET_RESOLUTION_SCALE = 2.0f; // Use 2x high-res assets

// Load high-res assets
Texture::setGlobalScale(ASSET_RESOLUTION_SCALE);

// Allows dynamic zoom
void Camera::setZoom(float zoom) {
    // zoom = 1.0: normal view (128x64 → 64x32)
    // zoom = 2.0: close-up (128x64 → 128x64)
    // zoom = 0.5: far view (128x64 → 32x16)
}
```

**Benefits:**
- Smooth zooming capability
- High quality at all zoom levels
- No asset duplication needed
- GPU mipmap generation handles scaling

### For Web Editor

**Default Setup:**
```javascript
// Configuration
const CONFIG = {
    baseTileWidth: 64,
    baseTileHeight: 32,
    useHighResAssets: true,
    assetScale: 2.0,  // 2x assets (128x64)
    currentZoom: 1.0   // User adjustable
};

// Dynamic loading based on zoom level
function getAssetPath(baseName, category) {
    const scale = CONFIG.useHighResAssets ? 128 : 64;
    return `assets/${category}/${baseName}_${scale}x${scale/2}.png`;
}
```

## Creating Even Higher Resolution Assets

### Method 1: AI Upscaling

Use AI upscaling tools to increase resolution:

**Tools:**
- **waifu2x**: Anime-style upscaling
- **Real-ESRGAN**: Photo-realistic upscaling  
- **Topaz Gigapixel AI**: Professional upscaling

**Example Workflow:**
```bash
# Upscale 128x64 tiles to 256x128
waifu2x-converter-cpp \
    --input grass_green_128x64.png \
    --output grass_green_256x128.png \
    --scale-ratio 2.0 \
    --noise-level 1
```

### Method 2: Manual High-Res Creation

Create assets at 4× resolution (256×128 tiles):

1. Open tile in image editor (Photoshop, GIMP, Krita)
2. Create new canvas at 4× size
3. Redraw with more detail
4. Export at multiple resolutions:
   - 256×128 (ultra-high)
   - 128×64 (high)
   - 64×32 (standard)

### Method 3: Vector-Based Assets

For UI and some props, use vector graphics:

1. Create in Inkscape or Adobe Illustrator
2. Export at any resolution needed
3. No quality loss at any scale

## Performance Considerations

### Memory Usage

| Resolution | Single Tile | Full Sheet (56 tiles) | RAM Usage |
|-----------|-------------|----------------------|-----------|
| 64×32     | 8 KB       | ~450 KB              | Low       |
| 128×64    | 32 KB      | ~1.8 MB              | Medium    |
| 256×128   | 128 KB     | ~7 MB                | High      |

### Rendering Performance

| Resolution | GPU Load | CPU Load | FPS Impact |
|-----------|----------|----------|------------|
| 64×32     | Low      | Low      | None       |
| 128×64    | Medium   | Low      | Minimal    |
| 256×128   | High     | Low      | Moderate   |

**Note**: Modern GPUs handle high-res textures well. CPU is rarely bottleneck.

### Recommendations by Platform

**Desktop (Windows/Linux/Mac):**
- Use 128×64 base resolution
- Enable mipmapping
- Allow zoom from 0.5× to 4.0×

**Web Browser:**
- Use 128×64 for desktop browsers
- Optionally fall back to 64×32 on mobile
- Implement lazy loading for large maps

**Mobile:**
- Use 64×32 base resolution
- Limit zoom to 0.5× to 2.0×
- Reduce texture quality on low-end devices

## Implementation Plan

### Phase 1: Update Engine to Support High-Res ✅

Already implemented! The engine supports texture scaling.

### Phase 2: Create Tiled Configurations for Both Resolutions

Create dual tileset configs:

```
tilesheets/
├── ground/
│   ├── grass_green_64.tsx    # Standard res
│   ├── grass_green_128.tsx   # High res
│   ├── grass_green_256.tsx   # Ultra res (future)
```

### Phase 3: Add Resolution Selector

In both engines, add config option:

```cpp
// C++ Engine
enum TextureQuality {
    LOW,     // 32×16
    MEDIUM,  // 64×32  
    HIGH,    // 128×64
    ULTRA    // 256×128
};

Settings::setTextureQuality(TextureQuality::HIGH);
```

```javascript
// Web Editor
const qualitySettings = {
    LOW: { scale: 0.5, suffix: '32x16' },
    MEDIUM: { scale: 1.0, suffix: '64x32' },
    HIGH: { scale: 2.0, suffix: '128x64' },
    ULTRA: { scale: 4.0, suffix: '256x128' }
};
```

### Phase 4: Progressive Loading

Load based on view distance:

```cpp
// Tiles near camera: HIGH resolution
// Tiles far from camera: MEDIUM resolution
// Tiles very far: LOW resolution

if (distanceFromCamera < 500) {
    texture = highResTileset;
} else if (distanceFromCamera < 1000) {
    texture = mediumResTileset;
} else {
    texture = lowResTileset;
}
```

## Summary

**Current State:**
- ✅ We have 64×32 and 128×64 versions available
- ✅ C++ engine supports texture loading
- ✅ Can enable mipmapping for automatic scaling

**Recommended Configuration:**
- Use 128×64 as base resolution
- Enable GPU mipmapping for smooth scaling
- Allow zoom levels from 0.5× to 2.0×
- Add 256×128 assets in future for ultra detail

**Next Steps:**
1. Update texture loading to prefer high-res assets
2. Enable mipmap generation in OpenGL
3. Add zoom controls to both engines
4. Test performance on target platforms
5. Create 256×128 versions for hero assets (characters, important buildings)

## Code Changes Needed

I'll update the Texture class to support this in the next commit!
