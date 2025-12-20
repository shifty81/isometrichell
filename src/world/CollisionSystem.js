/**
 * Collision System
 * Handles collision detection for buildings, walls, doors, windows, and entities
 * Manages interaction with doors and building components
 */
class CollisionSystem {
    constructor() {
        // Collision layer types
        this.LAYER_GROUND = 1 << 0;    // Ground tiles
        this.LAYER_BUILDING = 1 << 1;  // Walls, closed doors
        this.LAYER_ENTITY = 1 << 2;    // NPCs, animals
        this.LAYER_DECORATION = 1 << 3; // Trees, rocks
        this.LAYER_ALL = 0xFFFFFFFF;
        
        // Building type properties
        this.buildingProperties = {
            'wall': {
                walkable: false,
                blocksVision: true,
                interactable: false,
                layer: this.LAYER_BUILDING
            },
            'door': {
                walkable: false, // When closed
                blocksVision: true, // When closed
                interactable: true,
                layer: this.LAYER_BUILDING,
                canOpen: true
            },
            'window': {
                walkable: false,
                blocksVision: false, // See through
                interactable: false,
                layer: this.LAYER_BUILDING,
                transparent: true
            },
            'fence': {
                walkable: false,
                blocksVision: false, // See through fence
                interactable: false,
                layer: this.LAYER_BUILDING
            },
            'furniture': {
                walkable: false,
                blocksVision: false,
                interactable: true,
                layer: this.LAYER_BUILDING
            }
        };
    }
    
    /**
     * Check if a position is walkable
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @param {World} world - World instance
     * @param {Entity} entity - Entity checking collision (optional)
     * @returns {boolean} True if position is walkable
     */
    canWalk(x, y, world, entity = null) {
        // Out of bounds
        if (!world.isValidPosition(x, y)) {
            return false;
        }
        
        const tile = world.getTile(Math.floor(x), Math.floor(y));
        if (!tile) return false;
        
        // Check base tile walkability
        if (!tile.type.walkable) {
            return false;
        }
        
        // Check decorations (trees, rocks block movement)
        if (tile.decoration) {
            if (tile.decoration.startsWith('tree_') || 
                tile.decoration.startsWith('rocks_')) {
                return false;
            }
        }
        
        // Check building collision
        if (tile.building) {
            return this.canWalkThroughBuilding(tile.building, entity);
        }
        
        // Check for entities blocking the tile
        if (entity && tile.entity && tile.entity !== entity) {
            return false; // Another entity is here
        }
        
        return true;
    }
    
    /**
     * Check if entity can walk through a building
     * @private
     */
    canWalkThroughBuilding(building, entity) {
        const props = this.getBuildingProperties(building);
        
        if (!props) {
            // Unknown building type, assume walkable
            return true;
        }
        
        // Special case: open doors are walkable
        if (building.type === 'door' && building.isOpen) {
            return true;
        }
        
        return props.walkable;
    }
    
    /**
     * Get properties for a building type
     */
    getBuildingProperties(building) {
        if (!building || !building.type) {
            return null;
        }
        
        return this.buildingProperties[building.type] || null;
    }
    
    /**
     * Check if building blocks vision
     */
    blocksVision(building) {
        if (!building) return false;
        
        // Open doors don't block vision
        if (building.type === 'door' && building.isOpen) {
            return false;
        }
        
        const props = this.getBuildingProperties(building);
        return props ? props.blocksVision : false;
    }
    
    /**
     * Check if building is transparent (allows vision through like windows)
     */
    isTransparent(building) {
        if (!building) return false;
        
        const props = this.getBuildingProperties(building);
        return props ? props.transparent === true : false;
    }
    
    /**
     * Check if building is interactable
     */
    canInteract(building) {
        if (!building) return false;
        
        const props = this.getBuildingProperties(building);
        return props ? props.interactable : false;
    }
    
    /**
     * Interact with a building (e.g., open/close door)
     * @returns {boolean} True if interaction was successful
     */
    interact(building, entity = null) {
        if (!this.canInteract(building)) {
            return false;
        }
        
        // Handle door interaction
        if (building.type === 'door') {
            building.isOpen = !building.isOpen;
            
            // Play sound effect if available
            if (typeof SoundManager !== 'undefined' && SoundManager.instance) {
                const sound = building.isOpen ? 'door_open' : 'door_close';
                SoundManager.instance.playSFX(sound);
            }
            
            return true;
        }
        
        // Handle furniture interaction
        if (building.type === 'furniture') {
            // Could trigger inventory, crafting, etc.
            console.log('Interacting with furniture:', building);
            return true;
        }
        
        return false;
    }
    
    /**
     * Check collision between two entities
     */
    checkEntityCollision(entity1, entity2, radius = 0.5) {
        const dx = entity1.x - entity2.x;
        const dy = entity1.y - entity2.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = radius * radius;
        
        return distSq < radiusSq;
    }
    
    /**
     * Get all collidable buildings in a radius
     */
    getBuildingsInRadius(x, y, radius, world) {
        const buildings = [];
        const startX = Math.max(0, Math.floor(x - radius));
        const endX = Math.min(world.width - 1, Math.floor(x + radius));
        const startY = Math.max(0, Math.floor(y - radius));
        const endY = Math.min(world.height - 1, Math.floor(y + radius));
        
        for (let ty = startY; ty <= endY; ty++) {
            for (let tx = startX; tx <= endX; tx++) {
                const tile = world.getTile(tx, ty);
                if (tile && tile.building) {
                    const dx = tx - x;
                    const dy = ty - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist <= radius) {
                        buildings.push({
                            building: tile.building,
                            x: tx,
                            y: ty,
                            distance: dist
                        });
                    }
                }
            }
        }
        
        return buildings.sort((a, b) => a.distance - b.distance);
    }
    
    /**
     * Find nearest interactable building
     */
    findNearestInteractable(x, y, maxRange, world) {
        const buildings = this.getBuildingsInRadius(x, y, maxRange, world);
        
        for (const item of buildings) {
            if (this.canInteract(item.building)) {
                return item;
            }
        }
        
        return null;
    }
    
    /**
     * Raycast from start to end position, checking for collisions
     * @returns {Object} {hit: boolean, point: {x, y}, building: Building|null}
     */
    raycast(startX, startY, endX, endY, world, checkVision = false) {
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) {
            return { hit: false, point: { x: startX, y: startY }, building: null };
        }
        
        const dirX = dx / distance;
        const dirY = dy / distance;
        const step = 0.5; // Step size for raycast
        
        for (let d = 0; d < distance; d += step) {
            const x = Math.floor(startX + dirX * d);
            const y = Math.floor(startY + dirY * d);
            
            if (!world.isValidPosition(x, y)) {
                return { 
                    hit: true, 
                    point: { x: startX + dirX * d, y: startY + dirY * d },
                    building: null 
                };
            }
            
            const tile = world.getTile(x, y);
            
            if (tile && tile.building) {
                const building = tile.building;
                
                if (checkVision) {
                    // Vision check - blocked by opaque objects
                    if (this.blocksVision(building) && !this.isTransparent(building)) {
                        return {
                            hit: true,
                            point: { x: x, y: y },
                            building: building
                        };
                    }
                } else {
                    // Physical collision check
                    if (!this.canWalkThroughBuilding(building, null)) {
                        return {
                            hit: true,
                            point: { x: x, y: y },
                            building: building
                        };
                    }
                }
            }
        }
        
        return { hit: false, point: { x: endX, y: endY }, building: null };
    }
}
