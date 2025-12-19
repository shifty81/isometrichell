/**
 * Entity Base Class
 * Base class for all game entities
 */
class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 0.8; // In world units
        this.height = 0.8;
        this.speed = 2; // tiles per second
        this.active = true;
    }
    
    /**
     * Update entity
     */
    update(deltaTime, world) {
        // Override in subclasses
    }
    
    /**
     * Render entity
     */
    render(renderer, camera, isometricRenderer) {
        // Override in subclasses
    }
    
    /**
     * Move entity
     */
    move(dx, dy, world) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Check if new position is valid
        const tile = world.getTile(Math.floor(newX), Math.floor(newY));
        if (tile && (tile.isWalkable() || tile.isWater())) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        
        return false;
    }
    
    /**
     * Get screen position
     */
    getScreenPosition(tileWidth, tileHeight) {
        return IsometricUtils.worldToScreen(this.x, this.y, tileWidth, tileHeight);
    }
}
