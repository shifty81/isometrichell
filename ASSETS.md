# Asset Integration Guide

This guide explains how to integrate your game assets once you upload them to the repository.

## Asset Directory Structure

```
assets/
├── sprites/          # Character and entity sprites
├── tiles/            # Terrain tile images
└── audio/            # Sound effects and music
```

## Image Assets

### Tile Assets

**Expected Format**:
- PNG format with transparency
- Recommended size: 64x32 pixels per tile (isometric diamond)
- Naming convention: `tile_<type>.png` (e.g., `tile_grass.png`)

**Integration Steps**:

1. Place tile images in `assets/tiles/`
2. Create an asset loader:

```javascript
// assets/AssetLoader.js
class AssetLoader {
    constructor() {
        this.images = new Map();
        this.loaded = false;
    }
    
    async loadImage(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(name, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = path;
        });
    }
    
    async loadTiles() {
        await this.loadImage('grass', 'assets/tiles/tile_grass.png');
        await this.loadImage('water', 'assets/tiles/tile_water.png');
        await this.loadImage('sand', 'assets/tiles/tile_sand.png');
        // Add more tiles...
    }
    
    getImage(name) {
        return this.images.get(name);
    }
}
```

3. Update `World.js` to use images:

```javascript
render(renderer, camera, isometricRenderer) {
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            const tile = this.tiles[y][x];
            const screenPos = IsometricUtils.tileToScreen(...);
            
            // Use image instead of solid color
            const tileImage = assetLoader.getImage(tile.type.name);
            if (tileImage) {
                renderer.drawImage(
                    tileImage,
                    screenPos.x - 32 - camera.x,
                    screenPos.y - 16 - camera.y
                );
            }
        }
    }
}
```

### Sprite Assets

**Expected Format**:
- PNG format with transparency
- Sprite sheets for animations
- Individual frames: 32x32 or 64x64 pixels

**Animation System**:

```javascript
// Create animation system
class Animation {
    constructor(spriteSheet, frameWidth, frameHeight, frameCount) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.frameDelay = 0.1; // seconds per frame
    }
    
    update(deltaTime) {
        this.frameTime += deltaTime;
        if (this.frameTime >= this.frameDelay) {
            this.frameTime = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }
    
    getCurrentFrame() {
        return this.currentFrame;
    }
}
```

### Building Assets

**Expected Format**:
- Isometric building sprites
- Multiple layers: base, walls, roof
- Shadow/outline layers

**Integration**:

```javascript
// In Building.js
render(renderer, camera, isometricRenderer, tileScreenPos) {
    const buildingImage = assetLoader.getImage(this.type.name.toLowerCase());
    
    if (buildingImage) {
        renderer.drawImage(
            buildingImage,
            tileScreenPos.x - buildingImage.width / 2 - camera.x,
            tileScreenPos.y - buildingImage.height - camera.y
        );
    } else {
        // Fallback to current cube rendering
        isometricRenderer.drawIsometricCube(...);
    }
}
```

## Audio Assets

### Sound Effects

**Expected Format**:
- MP3 or OGG format
- Short duration (< 3 seconds)
- Normalized volume

**Audio System**:

```javascript
// Create audio system
class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.masterVolume = 1.0;
    }
    
    loadSound(name, path) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.sounds.set(name, audio);
    }
    
    playSound(name, volume = 1.0) {
        const sound = this.sounds.get(name);
        if (sound) {
            const clone = sound.cloneNode();
            clone.volume = volume * this.masterVolume;
            clone.play();
        }
    }
    
    playMusic(name, loop = true) {
        this.stopMusic();
        const music = this.sounds.get(name);
        if (music) {
            music.loop = loop;
            music.volume = 0.5 * this.masterVolume;
            music.play();
            this.music = music;
        }
    }
    
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }
}
```

**Usage**:

```javascript
// In Game.js initialization
const audioManager = new AudioManager();
audioManager.loadSound('place', 'assets/audio/place_building.mp3');
audioManager.loadSound('water', 'assets/audio/water_splash.mp3');
audioManager.loadSound('music', 'assets/audio/background_music.mp3');

// Play sounds
audioManager.playSound('place'); // When building is placed
audioManager.playMusic('music'); // Background music
```

## Asset Loading Strategy

### Preload All Assets

```javascript
// In main.js
async function loadAllAssets() {
    const loader = new AssetLoader();
    
    // Show loading screen
    showLoadingScreen();
    
    // Load assets
    await loader.loadTiles();
    await loader.loadSprites();
    await loader.loadSounds();
    
    // Hide loading screen
    hideLoadingScreen();
    
    return loader;
}

window.addEventListener('DOMContentLoaded', async () => {
    const assetLoader = await loadAllAssets();
    
    const engine = new Engine(canvas);
    const game = new Game(engine, assetLoader);
    
    engine.start();
});
```

### Progressive Loading

For large asset collections, load assets as needed:

```javascript
class LazyAssetLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
    }
    
    async getAsset(name, path) {
        // Return if already loaded
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }
        
        // Wait if currently loading
        if (this.loading.has(name)) {
            return await this.loading.get(name);
        }
        
        // Start loading
        const promise = this.loadAsset(name, path);
        this.loading.set(name, promise);
        
        const asset = await promise;
        this.cache.set(name, asset);
        this.loading.delete(name);
        
        return asset;
    }
    
    async loadAsset(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = path;
        });
    }
}
```

## Asset Optimization

### Image Optimization

1. **Reduce File Size**: Use PNG optimization tools
2. **Use Sprite Sheets**: Combine multiple images into one
3. **Atlas Packing**: Pack all tiles into a single atlas
4. **Resolution**: Provide @2x versions for high-DPI displays

### Audio Optimization

1. **Compression**: Use compressed formats (MP3, OGG)
2. **Bitrate**: 128kbps for music, 64kbps for effects
3. **Mono**: Use mono for effects (stereo for music)
4. **Trim Silence**: Remove leading/trailing silence

## Testing Assets

### Visual Testing Checklist

- [ ] Tiles align properly in isometric grid
- [ ] Sprites have transparent backgrounds
- [ ] Buildings sit correctly on tiles
- [ ] Animations play smoothly
- [ ] Colors match the game's aesthetic

### Audio Testing Checklist

- [ ] Sounds play at appropriate volume
- [ ] No clipping or distortion
- [ ] Music loops seamlessly
- [ ] Multiple sounds don't overwhelm
- [ ] Sounds match visual events

## Example Asset Manifest

Create a manifest file to track all assets:

```json
{
  "version": "1.0.0",
  "tiles": [
    { "name": "grass", "path": "assets/tiles/tile_grass.png" },
    { "name": "water", "path": "assets/tiles/tile_water.png" },
    { "name": "sand", "path": "assets/tiles/tile_sand.png" }
  ],
  "sprites": [
    { "name": "player", "path": "assets/sprites/player.png" },
    { "name": "boat", "path": "assets/sprites/boat.png" }
  ],
  "buildings": [
    { "name": "house", "path": "assets/sprites/building_house.png" },
    { "name": "tower", "path": "assets/sprites/building_tower.png" }
  ],
  "audio": {
    "sfx": [
      { "name": "place", "path": "assets/audio/place.mp3" },
      { "name": "water", "path": "assets/audio/water.mp3" }
    ],
    "music": [
      { "name": "theme", "path": "assets/audio/theme.mp3" }
    ]
  }
}
```

## Next Steps

Once you upload your assets:

1. Place them in the appropriate directories
2. Create or update the asset loader
3. Integrate loading into the game initialization
4. Update rendering code to use assets
5. Test thoroughly across different browsers
6. Optimize as needed for performance

The engine is ready to accept and display your assets!
