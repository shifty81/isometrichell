/**
 * AssetLoader Class
 * Handles loading and caching of game assets (images, audio)
 */
class AssetLoader {
    constructor() {
        this.images = new Map();
        this.audio = new Map();
        this.loaded = false;
        this.loadProgress = 0;
        this.totalAssets = 0;
    }
    
    /**
     * Load an image asset
     */
    loadImage(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(name, img);
                this.loadProgress++;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${path}`);
                reject(new Error(`Failed to load ${path}`));
            };
            img.src = path;
        });
    }
    
    /**
     * Load an audio asset
     */
    loadAudio(name, path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.oncanplaythrough = () => {
                this.audio.set(name, audio);
                this.loadProgress++;
                resolve(audio);
            };
            audio.onerror = () => {
                console.warn(`Failed to load audio: ${path}`);
                reject(new Error(`Failed to load ${path}`));
            };
        });
    }
    
    /**
     * Load all tile assets from individual directory
     */
    async loadTiles() {
        const tileAssets = [];
        const tileTypes = ['grass_green', 'grass_dry', 'grass_medium', 'dirt', 'dirt_dark', 'sand', 'stone_path', 'forest_ground'];
        const tilesPerType = 10; // Load first 10 variations of each tile type for variety
        
        // Load multiple variations of each tile type
        for (const tileType of tileTypes) {
            for (let i = 0; i < tilesPerType; i++) {
                const idx = String(i).padStart(3, '0');
                tileAssets.push({
                    name: `${tileType}_${i}`,
                    path: `assets/individual/ground_tiles/${tileType}_64x32/${tileType}_64x32-${idx}.png`
                });
            }
        }
        
        this.totalAssets += tileAssets.length;
        
        const promises = tileAssets.map(asset => 
            this.loadImage(asset.name, asset.path).catch(err => {
                console.warn(`Skipping ${asset.name}: ${err.message}`);
                return null;
            })
        );
        
        await Promise.all(promises);
    }
    
    /**
     * Load decoration assets (trees, bushes, rocks) from individual directory
     */
    async loadDecorations() {
        const decorations = [];
        
        // Load tree variations from individual directory
        const treeCount = 20; // Load 20 different tree variations
        for (let i = 0; i < treeCount; i++) {
            const idx = String(i).padStart(3, '0');
            decorations.push({
                name: `tree_${i}`,
                path: `assets/individual/trees/trees_64x32_shaded/trees_64x32_shaded-${idx}.png`
            });
        }
        
        // Bushes (from main assets directory)
        decorations.push(
            { name: 'bush_1', path: 'assets/hjm-bushes_01-alpha.png' },
            { name: 'bush_2', path: 'assets/hjm-bushes_02-alpha.png' },
            { name: 'bush_3', path: 'assets/hjm-bushes_03-alpha.png' }
        );
        
        // Rocks (from main assets directory)
        decorations.push(
            { name: 'rocks_1', path: 'assets/hjm-assorted_rocks_1.png' },
            { name: 'rocks_2', path: 'assets/hjm-assorted_rocks_2.png' }
        );
        
        // Water decoration
        decorations.push({ name: 'pond', path: 'assets/hjm-pond_1.png' });
        
        this.totalAssets += decorations.length;
        
        const promises = decorations.map(asset => 
            this.loadImage(asset.name, asset.path).catch(err => {
                console.warn(`Skipping ${asset.name}: ${err.message}`);
                return null;
            })
        );
        
        await Promise.all(promises);
    }
    
    /**
     * Load character sprites
     */
    async loadCharacters() {
        const characters = [
            { name: 'knight', path: 'assets/knight.png' },
            { name: 'knight5', path: 'assets/knight5.png' }
        ];
        
        this.totalAssets += characters.length;
        
        const promises = characters.map(asset => 
            this.loadImage(asset.name, asset.path).catch(err => {
                console.warn(`Skipping ${asset.name}: ${err.message}`);
                return null;
            })
        );
        
        await Promise.all(promises);
    }
    
    /**
     * Load player animation frames
     */
    async loadPlayerAnimations() {
        const animations = ['Idle', 'Walk', 'Run'];
        const framesPerAnimation = 10; // Load first 10 frames of each animation for performance
        const playerFrames = [];
        
        for (const animation of animations) {
            for (let i = 0; i < framesPerAnimation; i++) {
                const idx = String(i).padStart(3, '0');
                playerFrames.push({
                    name: `player_${animation.toLowerCase()}_${i}`,
                    path: `assets/individual/charachter/player/${animation}/${animation}-${idx}.png`
                });
            }
        }
        
        this.totalAssets += playerFrames.length;
        
        const promises = playerFrames.map(asset => 
            this.loadImage(asset.name, asset.path).catch(err => {
                console.warn(`Skipping ${asset.name}: ${err.message}`);
                return null;
            })
        );
        
        await Promise.all(promises);
    }
    
    /**
     * Load building assets
     */
    async loadBuildings() {
        const buildings = [
            { name: 'building_iso', path: 'assets/iso-64x64-building (1).png' },
            { name: 'house', path: 'assets/Sprites/house.png' },
            { name: 'treehouse', path: 'assets/Sprites/treehouse.png' }
        ];
        
        this.totalAssets += buildings.length;
        
        const promises = buildings.map(asset => 
            this.loadImage(asset.name, asset.path).catch(err => {
                console.warn(`Skipping ${asset.name}: ${err.message}`);
                return null;
            })
        );
        
        await Promise.all(promises);
    }
    
    /**
     * Load audio assets
     */
    async loadAudioAssets() {
        const audioAssets = [
            { name: 'music', path: 'assets/MusicAndSFX/Music.ogg' },
            { name: 'sfx_badadadink', path: 'assets/MusicAndSFX/badadadink.ogg' },
            { name: 'sfx_whamp', path: 'assets/MusicAndSFX/whamp.ogg' },
            { name: 'sfx_womp', path: 'assets/MusicAndSFX/womp.ogg' }
        ];
        
        this.totalAssets += audioAssets.length;
        
        const promises = audioAssets.map(asset => 
            this.loadAudio(asset.name, asset.path).catch(err => {
                console.warn(`Skipping ${asset.name}: ${err.message}`);
                return null;
            })
        );
        
        await Promise.all(promises);
    }
    
    /**
     * Load all assets
     */
    async loadAll() {
        console.log('Loading assets...');
        
        try {
            await this.loadTiles();
            await this.loadDecorations();
            await this.loadCharacters();
            await this.loadPlayerAnimations();
            await this.loadBuildings();
            await this.loadAudioAssets();
            
            this.loaded = true;
            console.log(`Assets loaded: ${this.loadProgress}/${this.totalAssets}`);
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    }
    
    /**
     * Get an image by name
     */
    getImage(name) {
        return this.images.get(name);
    }
    
    /**
     * Get audio by name
     */
    getAudio(name) {
        return this.audio.get(name);
    }
    
    /**
     * Check if assets are loaded
     */
    isLoaded() {
        return this.loaded;
    }
    
    /**
     * Get loading progress (0 to 1)
     */
    getProgress() {
        return this.totalAssets > 0 ? this.loadProgress / this.totalAssets : 0;
    }
}
