/**
 * Biome Class
 * Defines different biome types with their characteristics
 */
class Biome {
    static TYPES = {
        FOREST: {
            name: 'forest',
            primaryTile: 'GRASS',
            secondaryTile: 'DIRT',
            treeChance: 0.25,
            bushChance: 0.15,
            rockChance: 0.05,
            waterChance: 0.05,
            color: '#2d5016'
        },
        PLAINS: {
            name: 'plains',
            primaryTile: 'GRASS',
            secondaryTile: 'DIRT',
            treeChance: 0.08,
            bushChance: 0.10,
            rockChance: 0.03,
            waterChance: 0.02,
            color: '#4a7c3a'
        },
        DESERT: {
            name: 'desert',
            primaryTile: 'SAND',
            secondaryTile: 'STONE',
            treeChance: 0.02,
            bushChance: 0.05,
            rockChance: 0.15,
            waterChance: 0.01,
            color: '#c2b280'
        },
        MOUNTAINS: {
            name: 'mountains',
            primaryTile: 'STONE',
            secondaryTile: 'DIRT',
            treeChance: 0.05,
            bushChance: 0.05,
            rockChance: 0.30,
            waterChance: 0.02,
            color: '#707070'
        },
        WETLANDS: {
            name: 'wetlands',
            primaryTile: 'GRASS',
            secondaryTile: 'WATER',
            treeChance: 0.12,
            bushChance: 0.20,
            rockChance: 0.05,
            waterChance: 0.25,
            color: '#3d6b4f'
        }
    };
    
    constructor(type) {
        this.type = type;
    }
    
    /**
     * Get the primary tile type for this biome
     */
    getPrimaryTile() {
        return Tile.TYPES[this.type.primaryTile];
    }
    
    /**
     * Get the secondary tile type for this biome
     */
    getSecondaryTile() {
        return Tile.TYPES[this.type.secondaryTile];
    }
    
    /**
     * Determine if a tree should spawn at this location
     */
    shouldSpawnTree() {
        return Math.random() < this.type.treeChance;
    }
    
    /**
     * Determine if a bush should spawn at this location
     */
    shouldSpawnBush() {
        return Math.random() < this.type.bushChance;
    }
    
    /**
     * Determine if a rock should spawn at this location
     */
    shouldSpawnRock() {
        return Math.random() < this.type.rockChance;
    }
    
    /**
     * Determine if water should be at this location
     */
    shouldSpawnWater() {
        return Math.random() < this.type.waterChance;
    }
}
