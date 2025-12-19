/**
 * Tile Class
 * Represents a single tile in the game world
 */
class Tile {
    static TYPES = {
        GRASS: { name: 'grass', color: '#4a7c3a', walkable: true },
        WATER: { name: 'water', color: '#2e5a8a', walkable: false },
        SAND: { name: 'sand', color: '#c2b280', walkable: true },
        STONE: { name: 'stone', color: '#707070', walkable: true },
        DIRT: { name: 'dirt', color: '#8b6f47', walkable: true }
    };
    
    constructor(x, y, type = Tile.TYPES.GRASS) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.building = null;
        this.entity = null;
        this.decoration = null; // Can be 'tree_1', 'bush_1', 'rocks_1', 'pond', etc.
    }
    
    /**
     * Check if tile is walkable
     */
    isWalkable() {
        return this.type.walkable && !this.building;
    }
    
    /**
     * Check if tile is water
     */
    isWater() {
        return this.type.name === 'water';
    }
    
    /**
     * Set building on this tile
     */
    setBuilding(building) {
        if (this.isWalkable()) {
            this.building = building;
            return true;
        }
        return false;
    }
    
    /**
     * Remove building from this tile
     */
    removeBuilding() {
        this.building = null;
    }
    
    /**
     * Get tile color
     */
    getColor() {
        return this.type.color;
    }
    
    /**
     * Set decoration on this tile
     */
    setDecoration(decoration) {
        this.decoration = decoration;
    }
    
    /**
     * Check if tile has decoration
     */
    hasDecoration() {
        return this.decoration !== null;
    }
}
