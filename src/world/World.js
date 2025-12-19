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
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Create varied terrain
                const type = this.generateTileType(x, y);
                this.tiles[y][x] = new Tile(x, y, type);
            }
        }
        
        // Add decorations after all tiles are created
        this.generateDecorations();
    }
    
    /**
     * Generate tile type based on position
     */
    generateTileType(x, y) {
        // Create water areas
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const distFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        
        // Create a lake in the center area
        if (distFromCenter < 5) {
            return Tile.TYPES.WATER;
        }
        
        // Create beach around water
        if (distFromCenter < 7) {
            return Tile.TYPES.SAND;
        }
        
        // Add some variation
        const random = Math.random();
        if (random < 0.05) {
            return Tile.TYPES.STONE;
        } else if (random < 0.1) {
            return Tile.TYPES.DIRT;
        }
        
        return Tile.TYPES.GRASS;
    }
    
    /**
     * Generate decorations for tiles
     */
    generateDecorations() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                const random = Math.random();
                
                // Add decorations based on tile type
                if (tile.type === Tile.TYPES.WATER) {
                    // Add pond decorations to some water tiles
                    if (random < 0.3) {
                        tile.setDecoration('pond');
                    }
                } else if (tile.type === Tile.TYPES.GRASS) {
                    // Add trees to grass tiles
                    if (random < 0.15) {
                        const treeType = Math.floor(Math.random() * 3) + 1;
                        tile.setDecoration(`tree_${treeType}`);
                    }
                    // Add bushes
                    else if (random < 0.25) {
                        const bushType = Math.floor(Math.random() * 3) + 1;
                        tile.setDecoration(`bush_${bushType}`);
                    }
                } else if (tile.type === Tile.TYPES.DIRT || tile.type === Tile.TYPES.STONE) {
                    // Add rocks to dirt/stone tiles
                    if (random < 0.2) {
                        const rockType = Math.floor(Math.random() * 2) + 1;
                        tile.setDecoration(`rocks_${rockType}`);
                    }
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
                    // Map tile types to asset names
                    if (tile.type === Tile.TYPES.GRASS) {
                        tileImage = this.assetLoader.getImage('grass_green');
                    } else if (tile.type === Tile.TYPES.SAND) {
                        tileImage = this.assetLoader.getImage('sand');
                    } else if (tile.type === Tile.TYPES.DIRT) {
                        tileImage = this.assetLoader.getImage('dirt');
                    } else if (tile.type === Tile.TYPES.STONE) {
                        tileImage = this.assetLoader.getImage('stone_path');
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
