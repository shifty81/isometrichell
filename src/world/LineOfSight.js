/**
 * Line of Sight System
 * Implements Project Zomboid-style vision system with wide arcing field of view
 * Handles occlusion, transparency through windows, and vision blocking by walls/doors
 */
class LineOfSight {
    constructor() {
        // Vision constants
        this.DEFAULT_VIEW_DISTANCE = 20; // tiles
        this.VIEW_ARC_ANGLE = 180; // degrees (wide arc like Project Zomboid)
        this.VISION_CONE_SMOOTHNESS = 0.8; // How smoothly vision fades at edges
        
        // Cache for performance
        this.visibilityCache = new Map();
        this.lastPlayerPos = { x: -1, y: -1 };
        this.lastPlayerDirection = { x: 0, y: 1 }; // Default facing down
    }
    
    /**
     * Calculate visible tiles from a position with direction-based arc vision
     * @param {Object} origin - {x, y} position
     * @param {Object} direction - {x, y} facing direction
     * @param {World} world - World instance
     * @param {number} maxDistance - Maximum view distance
     * @returns {Set} Set of visible tile coordinates as "x,y" strings
     */
    calculateVisibleTiles(origin, direction, world, maxDistance = this.DEFAULT_VIEW_DISTANCE) {
        const visible = new Set();
        
        // Normalize direction
        const dirLength = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const dirNorm = dirLength > 0 ? {
            x: direction.x / dirLength,
            y: direction.y / dirLength
        } : { x: 0, y: 1 }; // Default to facing down
        
        // Always see the tile you're standing on
        visible.add(`${Math.floor(origin.x)},${Math.floor(origin.y)}`);
        
        // Cast rays in an arc
        const numRays = 360; // High resolution for smooth vision
        const arcStart = -this.VIEW_ARC_ANGLE / 2;
        const arcEnd = this.VIEW_ARC_ANGLE / 2;
        
        for (let i = 0; i < numRays; i++) {
            const angleOffset = arcStart + (arcEnd - arcStart) * (i / numRays);
            const angleRad = Math.atan2(dirNorm.y, dirNorm.x) + (angleOffset * Math.PI / 180);
            
            const rayDir = {
                x: Math.cos(angleRad),
                y: Math.sin(angleRad)
            };
            
            // Cast ray
            this._castRay(origin, rayDir, maxDistance, world, visible);
        }
        
        return visible;
    }
    
    /**
     * Cast a single ray and mark visible tiles
     * @private
     */
    _castRay(origin, direction, maxDistance, world, visible) {
        const step = 0.25; // Granularity of ray stepping
        let distance = 0;
        
        while (distance < maxDistance) {
            distance += step;
            
            const x = Math.floor(origin.x + direction.x * distance);
            const y = Math.floor(origin.y + direction.y * distance);
            
            // Out of bounds
            if (!world.isValidPosition(x, y)) {
                break;
            }
            
            const tileKey = `${x},${y}`;
            visible.add(tileKey);
            
            const tile = world.getTile(x, y);
            
            // Check if this tile blocks vision
            if (this._tileBlocksVision(tile)) {
                // Solid wall or closed door - stop ray
                break;
            }
            
            // Windows allow vision but with slight penalty to distance
            if (this._tileIsWindow(tile)) {
                distance += 0.5; // Small penalty for looking through windows
            }
            
            // Trees and decorations partially block vision
            if (tile && tile.decoration && tile.decoration.startsWith('tree_')) {
                distance += 1.0; // Larger penalty for trees
            }
        }
    }
    
    /**
     * Check if a tile blocks vision completely
     * @private
     */
    _tileBlocksVision(tile) {
        if (!tile) return false;
        
        // Check building properties
        if (tile.building) {
            const building = tile.building;
            
            // Walls block vision
            if (building.type === 'wall') {
                return true;
            }
            
            // Closed doors block vision
            if (building.type === 'door' && !building.isOpen) {
                return true;
            }
            
            // Other buildings might block vision based on properties
            if (building.blocksVision !== undefined) {
                return building.blocksVision;
            }
        }
        
        return false;
    }
    
    /**
     * Check if a tile is a window (allows vision through)
     * @private
     */
    _tileIsWindow(tile) {
        if (!tile || !tile.building) return false;
        return tile.building.type === 'window';
    }
    
    /**
     * Check if position is visible from origin with direction
     * Uses cached visibility for performance
     */
    isVisible(origin, target, direction, world) {
        // Check if we need to recalculate
        const cacheKey = `${Math.floor(origin.x)},${Math.floor(origin.y)}`;
        
        if (this.lastPlayerPos.x !== Math.floor(origin.x) || 
            this.lastPlayerPos.y !== Math.floor(origin.y) ||
            this.lastPlayerDirection.x !== direction.x ||
            this.lastPlayerDirection.y !== direction.y) {
            
            // Recalculate visibility
            this.visibilityCache.clear();
            const visible = this.calculateVisibleTiles(origin, direction, world);
            this.visibilityCache.set(cacheKey, visible);
            
            this.lastPlayerPos = { x: Math.floor(origin.x), y: Math.floor(origin.y) };
            this.lastPlayerDirection = { x: direction.x, y: direction.y };
        }
        
        const visible = this.visibilityCache.get(cacheKey);
        if (!visible) return false;
        
        const targetKey = `${Math.floor(target.x)},${Math.floor(target.y)}`;
        return visible.has(targetKey);
    }
    
    /**
     * Get visibility factor for a tile (0.0 = not visible, 1.0 = fully visible)
     * Used for rendering fog of war or shading
     */
    getVisibilityFactor(origin, target, direction, world) {
        if (!this.isVisible(origin, target, direction, world)) {
            return 0.0;
        }
        
        // Calculate distance-based falloff
        const dx = target.x - origin.x;
        const dy = target.y - origin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate angle from facing direction
        const targetDir = { x: dx, y: dy };
        const targetLen = Math.sqrt(targetDir.x * targetDir.x + targetDir.y * targetDir.y);
        
        if (targetLen === 0) return 1.0; // Same position
        
        const targetNorm = { x: targetDir.x / targetLen, y: targetDir.y / targetLen };
        
        // Normalize direction
        const dirLen = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const dirNorm = dirLen > 0 ? 
            { x: direction.x / dirLen, y: direction.y / dirLen } : 
            { x: 0, y: 1 };
        
        // Dot product for angle
        const dot = targetNorm.x * dirNorm.x + targetNorm.y * dirNorm.y;
        const angle = Math.acos(Math.max(-1, Math.min(1, dot))) * 180 / Math.PI;
        
        // Falloff based on distance and angle
        const distanceFactor = Math.max(0, 1.0 - distance / this.DEFAULT_VIEW_DISTANCE);
        const angleFactor = Math.max(0, 1.0 - angle / (this.VIEW_ARC_ANGLE / 2));
        
        return distanceFactor * (0.5 + 0.5 * Math.pow(angleFactor, this.VISION_CONE_SMOOTHNESS));
    }
    
    /**
     * Clear the visibility cache (call when world changes significantly)
     */
    clearCache() {
        this.visibilityCache.clear();
        this.lastPlayerPos = { x: -1, y: -1 };
    }
}
