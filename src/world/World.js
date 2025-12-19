/**
 * World Class
 * Manages the game world grid and tiles
 */
class World {
    constructor(width, height, tileWidth = 64, tileHeight = 32) {
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
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
                
                // Draw tile
                isometricRenderer.drawIsometricTile(
                    screenPos.x,
                    screenPos.y,
                    this.tileWidth,
                    this.tileHeight,
                    tile.getColor(),
                    camera
                );
                
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
