/**
 * World Class
 * Manages the game world grid and tiles
 */
class World {
    constructor(width, height, tileWidth = 64, tileHeight = 32, assetLoader = null) {
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.assetLoader = assetLoader;
        this.tiles = [];
        this.entities = [];
        this.noiseGen = new NoiseGenerator();
        
        this.generate();
    }
    
    /**
     * Generate the world
     */
    generate() {
        // Generate biome map
        this.biomeMap = this.generateBiomeMap();
        
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Create varied terrain based on biome
                const biome = this.biomeMap[y][x];
                const type = this.generateTileType(x, y, biome);
                this.tiles[y][x] = new Tile(x, y, type);
            }
        }
        
        // Add decorations after all tiles are created
        this.generateDecorations();
    }
    
    /**
     * Generate biome map using noise-based temperature and moisture
     */
    generateBiomeMap() {
        const biomeMap = [];
        const scale = 0.05; // Scale for noise (larger = bigger biomes)
        
        for (let y = 0; y < this.height; y++) {
            biomeMap[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Generate temperature and moisture using different noise octaves
                const temperature = this.noiseGen.fractalNoise2D(x * scale, y * scale, 4, 0.5);
                const moisture = this.noiseGen.fractalNoise2D(x * scale + 1000, y * scale + 1000, 4, 0.5);
                
                // Determine biome based on temperature and moisture
                const biomeType = this.getBiomeFromNoise(temperature, moisture);
                biomeMap[y][x] = new Biome(biomeType);
            }
        }
        
        return biomeMap;
    }
    
    /**
     * Get biome type from noise values
     */
    getBiomeFromNoise(temperature, moisture) {
        // Map temperature and moisture to biomes
        // Temperature: 0.0 (cold) -> 1.0 (hot)
        // Moisture: 0.0 (dry) -> 1.0 (wet)
        
        if (temperature < 0.3) {
            // Cold regions
            if (moisture > 0.5) {
                return Biome.TYPES.WETLANDS; // Cold and wet
            } else {
                return Biome.TYPES.MOUNTAINS; // Cold and dry
            }
        } else if (temperature < 0.6) {
            // Temperate regions
            if (moisture > 0.6) {
                return Biome.TYPES.FOREST; // Temperate and wet
            } else if (moisture > 0.3) {
                return Biome.TYPES.PLAINS; // Temperate and moderate
            } else {
                return Biome.TYPES.DESERT; // Temperate and dry
            }
        } else {
            // Hot regions
            if (moisture > 0.5) {
                return Biome.TYPES.FOREST; // Hot and wet (tropical)
            } else {
                return Biome.TYPES.DESERT; // Hot and dry
            }
        }
    }
    
    /**
     * Generate tile type based on position and biome with noise
     */
    generateTileType(x, y, biome) {
        const detailScale = 0.15; // Finer detail for terrain variation
        const detailNoise = this.noiseGen.noise2D(x * detailScale, y * detailScale);
        
        // Check for water using noise (creates lakes and rivers)
        if (biome.shouldSpawnWater()) {
            // Use noise to create connected water bodies
            const waterNoise = this.noiseGen.fractalNoise2D(x * 0.08, y * 0.08, 3, 0.6);
            if (waterNoise < 0.35) {
                return Tile.TYPES.WATER;
            } else {
                // Use biome's primary or secondary tile based on detail noise
                return detailNoise < 0.7 ? biome.getPrimaryTile() : biome.getSecondaryTile();
            }
        } else {
            // Use biome's primary or secondary tile based on detail noise
            return detailNoise < 0.8 ? biome.getPrimaryTile() : biome.getSecondaryTile();
        }
    }
    
    /**
     * Generate decorations for tiles using noise for natural clustering
     */
    generateDecorations() {
        const TREE_TYPES = 20; // Using 20 tree variations
        const BUSH_TYPES = 3;
        const ROCK_TYPES = 2;
        
        // Use different noise frequencies for different decoration types
        const treeScale = 0.2;
        const bushScale = 0.25;
        const rockScale = 0.18;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                const biome = this.biomeMap[y][x];
                
                // Skip water tiles
                if (tile.type === Tile.TYPES.WATER) {
                    // Add pond decorations using noise
                    const pondNoise = this.noiseGen.noise2D(x * 0.3, y * 0.3);
                    if (pondNoise > 0.7) {
                        tile.setDecoration('pond');
                    }
                    continue;
                }
                
                // Skip non-walkable tiles
                if (!tile.type.walkable) {
                    continue;
                }
                
                // Use noise to create clustered decorations (more realistic)
                const treeNoise = this.noiseGen.fractalNoise2D(x * treeScale + 500, y * treeScale + 500, 2, 0.4);
                const bushNoise = this.noiseGen.fractalNoise2D(x * bushScale + 1500, y * bushScale + 1500, 2, 0.4);
                const rockNoise = this.noiseGen.fractalNoise2D(x * rockScale + 2500, y * rockScale + 2500, 2, 0.4);
                
                // Combine biome probability with noise for natural clustering
                const shouldPlaceTree = biome.shouldSpawnTree() && (treeNoise > 0.55);
                const shouldPlaceBush = biome.shouldSpawnBush() && (bushNoise > 0.6);
                const shouldPlaceRock = biome.shouldSpawnRock() && (rockNoise > 0.58);
                
                // Place decorations (priority: trees > rocks > bushes)
                if (shouldPlaceTree) {
                    const treeType = Math.floor(treeNoise * TREE_TYPES) % TREE_TYPES;
                    tile.setDecoration(`tree_${treeType}`);
                    tile.isResource = true; // Mark as gatherable resource
                } else if (shouldPlaceRock) {
                    const rockType = (Math.floor(rockNoise * ROCK_TYPES) % ROCK_TYPES) + 1;
                    tile.setDecoration(`rocks_${rockType}`);
                    tile.isResource = true; // Mark as gatherable resource
                } else if (shouldPlaceBush) {
                    const bushType = (Math.floor(bushNoise * BUSH_TYPES) % BUSH_TYPES) + 1;
                    tile.setDecoration(`bush_${bushType}`);
                }
            }
        }
    }
    
    /**
     * Get tile at position
     */
    getTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.tiles[y][x];
        }
        return null;
    }
    
    /**
     * Get tile at screen position
     */
    getTileAtScreen(screenX, screenY, camera) {
        const adjustedX = screenX + camera.x;
        const adjustedY = screenY + camera.y;
        const tileCoords = IsometricUtils.screenToTile(
            adjustedX,
            adjustedY,
            this.tileWidth,
            this.tileHeight
        );
        return this.getTile(tileCoords.x, tileCoords.y);
    }
    
    /**
     * Add entity to world
     */
    addEntity(entity) {
        this.entities.push(entity);
    }
    
    /**
     * Remove entity from world
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }
    
    /**
     * Update world
     */
    update(deltaTime) {
        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime, this);
            }
        }
    }
    
    /**
     * Render world
     */
    render(renderer, camera, isometricRenderer) {
        // Calculate visible tile range
        const startX = Math.max(0, Math.floor(-camera.x / this.tileWidth) - 5);
        const startY = Math.max(0, Math.floor(-camera.y / this.tileHeight) - 5);
        const endX = Math.min(this.width, startX + 40);
        const endY = Math.min(this.height, startY + 40);
        
        // Render tiles
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.tiles[y][x];
                const screenPos = IsometricUtils.tileToScreen(
                    tile.x,
                    tile.y,
                    this.tileWidth,
                    this.tileHeight
                );
                
                // Try to use tile images if available
                let tileImage = null;
                if (this.assetLoader) {
                    // Map tile types to asset names with variations
                    let baseName = null;
                    if (tile.type === Tile.TYPES.GRASS) {
                        baseName = 'grass_green';
                    } else if (tile.type === Tile.TYPES.SAND) {
                        baseName = 'sand';
                    } else if (tile.type === Tile.TYPES.DIRT) {
                        baseName = 'dirt';
                    } else if (tile.type === Tile.TYPES.STONE) {
                        baseName = 'stone_path';
                    }
                    
                    // Use the tile's variation index for visual diversity
                    if (baseName) {
                        tileImage = this.assetLoader.getImage(`${baseName}_${tile.tileVariation}`);
                    }
                }
                
                // Draw tile with image or fallback to solid color
                if (tileImage) {
                    renderer.drawImage(
                        tileImage,
                        screenPos.x - this.tileWidth / 2 - camera.x,
                        screenPos.y - this.tileHeight / 2 - camera.y,
                        this.tileWidth,
                        this.tileHeight
                    );
                } else {
                    // Fallback to solid color tiles
                    isometricRenderer.drawIsometricTile(
                        screenPos.x,
                        screenPos.y,
                        this.tileWidth,
                        this.tileHeight,
                        tile.getColor(),
                        camera
                    );
                }
                
                // Draw decoration if present
                if (tile.decoration && this.assetLoader) {
                    const decorationImage = this.assetLoader.getImage(tile.decoration);
                    if (decorationImage) {
                        // Draw decoration centered on tile
                        const decorX = screenPos.x - decorationImage.width / 2 - camera.x;
                        const decorY = screenPos.y - decorationImage.height + this.tileHeight / 2 - camera.y;
                        renderer.drawImage(
                            decorationImage,
                            decorX,
                            decorY,
                            decorationImage.width,
                            decorationImage.height
                        );
                    }
                }
                
                // Draw building if present
                if (tile.building) {
                    tile.building.render(renderer, camera, isometricRenderer, screenPos);
                }
            }
        }
        
        // Render entities
        for (const entity of this.entities) {
            if (entity.render) {
                entity.render(renderer, camera, isometricRenderer);
            }
        }
    }
}
