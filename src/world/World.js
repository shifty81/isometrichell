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
     * Generate biome map using simple noise-like algorithm
     */
    generateBiomeMap() {
        const biomeMap = [];
        const biomeTypes = [
            Biome.TYPES.FOREST,
            Biome.TYPES.PLAINS,
            Biome.TYPES.DESERT,
            Biome.TYPES.MOUNTAINS,
            Biome.TYPES.WETLANDS
        ];
        
        for (let y = 0; y < this.height; y++) {
            biomeMap[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Use simple region-based biome assignment
                const regionX = Math.floor(x / 10);
                const regionY = Math.floor(y / 10);
                const biomeIndex = (regionX + regionY * 3) % biomeTypes.length;
                biomeMap[y][x] = new Biome(biomeTypes[biomeIndex]);
            }
        }
        
        return biomeMap;
    }
    
    /**
     * Generate tile type based on position and biome
     */
    generateTileType(x, y, biome) {
        // Check for water first
        if (biome.shouldSpawnWater()) {
            return Tile.TYPES.WATER;
        }
        
        // Use biome's primary or secondary tile
        const random = Math.random();
        if (random < 0.8) {
            return biome.getPrimaryTile();
        } else {
            return biome.getSecondaryTile();
        }
    }
    
    /**
     * Generate decorations for tiles
     */
    generateDecorations() {
        // Decoration type counts - now using more variations from individual assets
        const TREE_TYPES = 20; // Using 20 tree variations
        const BUSH_TYPES = 3;
        const ROCK_TYPES = 2;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                const biome = this.biomeMap[y][x];
                
                // Skip water tiles
                if (tile.type === Tile.TYPES.WATER) {
                    // Add pond decorations to some water tiles
                    if (Math.random() < 0.3) {
                        tile.setDecoration('pond');
                    }
                    continue;
                }
                
                // Add trees based on biome
                if (biome.shouldSpawnTree() && tile.type.walkable) {
                    const treeType = Math.floor(Math.random() * TREE_TYPES);
                    tile.setDecoration(`tree_${treeType}`);
                    tile.isResource = true; // Mark as gatherable resource
                }
                // Add bushes based on biome
                else if (biome.shouldSpawnBush() && tile.type.walkable) {
                    const bushType = Math.floor(Math.random() * BUSH_TYPES) + 1;
                    tile.setDecoration(`bush_${bushType}`);
                }
                // Add rocks based on biome
                else if (biome.shouldSpawnRock() && tile.type.walkable) {
                    const rockType = Math.floor(Math.random() * ROCK_TYPES) + 1;
                    tile.setDecoration(`rocks_${rockType}`);
                    tile.isResource = true; // Mark as gatherable resource
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
