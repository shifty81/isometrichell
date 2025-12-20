# Line of Sight & Collision System Integration Guide

## Overview

This document describes the Project Zomboid-style line of sight and collision detection systems implemented for The Daily Grind's building assets, specifically for the ISO-64x64 building tileset.

## Systems Implemented

### 1. Line of Sight System (`src/world/LineOfSight.js`)

Implements a wide-arc vision system similar to Project Zomboid:

**Key Features:**
- **180-degree field of view** based on player facing direction
- **Ray casting** with high resolution (360 rays) for smooth vision
- **Occlusion handling** - walls block vision, windows allow vision through
- **Distance falloff** - vision clarity decreases with distance
- **Performance caching** - visibility results are cached until player moves or turns

**Vision Properties:**
```javascript
const lineOfSight = new LineOfSight();

// Calculate visible tiles
const visible = lineOfSight.calculateVisibleTiles(
    playerPosition,    // {x, y}
    playerDirection,   // {x, y} facing direction
    world,            // World instance
    viewDistance      // Max tiles (default: 20)
);

// Check if specific tile is visible
const isVisible = lineOfSight.isVisible(
    playerPosition,
    targetPosition,
    playerDirection,
    world
);

// Get visibility factor (0.0 to 1.0) for fog of war
const visibility = lineOfSight.getVisibilityFactor(
    playerPosition,
    targetPosition,
    playerDirection,
    world
);
```

### 2. Collision System (`src/world/CollisionSystem.js`)

Handles collision detection for all building types:

**Building Type Properties:**

| Type | Walkable | Blocks Vision | Transparent | Interactable | Notes |
|------|----------|---------------|-------------|--------------|-------|
| `wall` | ❌ No | ✅ Yes | ❌ No | ❌ No | Solid barrier |
| `door` | ❌ No (closed)<br>✅ Yes (open) | ✅ Yes (closed)<br>❌ No (open) | ❌ No | ✅ Yes | Can open/close |
| `window` | ❌ No | ❌ No | ✅ Yes | ❌ No | See through |
| `fence` | ❌ No | ❌ No | ✅ Yes | ❌ No | See through |
| `furniture` | ❌ No | ❌ No | ❌ No | ✅ Yes | Can use/search |

**Usage:**
```javascript
const collision = new CollisionSystem();

// Check if position is walkable
const canWalk = collision.canWalk(x, y, world, entity);

// Check if building blocks vision
const blocksVision = collision.blocksVision(building);

// Check if building is transparent (windows)
const isTransparent = collision.isTransparent(building);

// Interact with building (e.g., open door)
const success = collision.interact(building, entity);

// Find nearest interactable building
const nearest = collision.findNearestInteractable(
    playerX, 
    playerY, 
    interactionRange, 
    world
);

// Raycast for collision detection
const result = collision.raycast(
    startX, startY,
    endX, endY,
    world,
    checkVision  // true for vision check, false for physical
);
```

## ISO-64x64 Building Asset Properties

### Windows (Rows 3-4)

**Grid Positions:** (3,3), (4,3), (5,3), (4,4), (5,4)

**Properties:**
```json
{
  "type": "window",
  "walkable": false,
  "blocks_vision": false,
  "transparent": true,
  "interactable": false
}
```

**Behavior:**
- ✅ **Allow line of sight through** - players can see through windows
- ❌ **Block movement** - cannot walk through windows
- 🎨 **Visual rendering** - render with transparency/glass effect
- 📍 **Vision penalty** - slight distance penalty when looking through

### Doors (Row 4)

**Grid Positions:** (2,4), (3,4)

**Properties (Closed):**
```json
{
  "type": "door",
  "walkable": false,
  "blocks_vision": true,
  "transparent": false,
  "interactable": true,
  "is_open": false,
  "can_open": true
}
```

**Properties (Open):**
```json
{
  "type": "door",
  "walkable": true,
  "blocks_vision": false,
  "transparent": false,
  "interactable": true,
  "is_open": true,
  "can_open": true
}
```

**Behavior:**
- 🚪 **Interactable** - player can press 'E' or click to open/close
- 🔒 **Blocks when closed** - blocks both movement and vision
- 🚶 **Allows when open** - allows both movement and vision
- 🔊 **Sound effects** - play door_open/door_close sounds
- 💾 **State persistence** - door state saved in building object

### Walls (Rows 2-5, 7)

**Properties:**
```json
{
  "type": "wall",
  "walkable": false,
  "blocks_vision": true,
  "transparent": false,
  "interactable": false
}
```

**Behavior:**
- ❌ **Block everything** - movement and vision completely blocked
- 🧱 **Solid barrier** - rays stop at walls
- 🏗️ **Building foundation** - structural component

## Integration with Game Engine

### 1. Update Tile.js

Add building properties to tiles:

```javascript
class Tile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.building = null;
        this.entity = null;
        this.decoration = null;
    }
    
    setBuilding(building) {
        // Building object should have:
        // - type: 'wall', 'door', 'window', 'furniture'
        // - isOpen: boolean (for doors)
        // - blocksVision: boolean
        // - walkable: boolean
        this.building = building;
    }
    
    isWalkable() {
        if (!this.type.walkable) return false;
        
        if (this.building) {
            // Use collision system
            return collisionSystem.canWalkThroughBuilding(this.building);
        }
        
        return !this.hasBlockingDecoration();
    }
}
```

### 2. Update World.js

Add systems to world:

```javascript
class World {
    constructor(width, height, tileWidth, tileHeight) {
        // ... existing code ...
        
        // Add new systems
        this.lineOfSight = new LineOfSight();
        this.collisionSystem = new CollisionSystem();
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    
    getTile(x, y) {
        if (!this.isValidPosition(x, y)) return null;
        return this.tiles[y][x];
    }
    
    canWalk(x, y, entity = null) {
        return this.collisionSystem.canWalk(x, y, this, entity);
    }
}
```

### 3. Update Player.js

Add vision system to player:

```javascript
class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.direction = { x: 0, y: 1 }; // Facing direction
        this.visibleTiles = new Set();
    }
    
    update(deltaTime, world, input) {
        // Update direction based on movement
        if (this.isMoving && input) {
            const dx = input.isKeyDown('KeyD') - input.isKeyDown('KeyA');
            const dy = input.isKeyDown('KeyS') - input.isKeyDown('KeyW');
            
            if (dx !== 0 || dy !== 0) {
                this.direction = { x: dx, y: dy };
            }
        }
        
        // Update visible tiles
        this.visibleTiles = world.lineOfSight.calculateVisibleTiles(
            { x: this.x, y: this.y },
            this.direction,
            world
        );
        
        // Handle door interaction
        if (input && input.isKeyPressed('KeyE')) {
            this.interactWithNearestDoor(world);
        }
    }
    
    interactWithNearestDoor(world) {
        const nearest = world.collisionSystem.findNearestInteractable(
            this.x,
            this.y,
            this.interactionRange,
            world
        );
        
        if (nearest && nearest.building.type === 'door') {
            world.collisionSystem.interact(nearest.building);
            
            // Clear line of sight cache since world changed
            world.lineOfSight.clearCache();
        }
    }
}
```

### 4. Update Renderer

Add fog of war and visibility rendering:

```javascript
class Renderer {
    renderWorld(world, player, camera) {
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                const tile = world.getTile(x, y);
                
                // Check visibility
                const visibility = world.lineOfSight.getVisibilityFactor(
                    { x: player.x, y: player.y },
                    { x: x, y: y },
                    player.direction,
                    world
                );
                
                if (visibility > 0) {
                    // Render tile
                    this.renderTile(tile, x, y, camera);
                    
                    // Apply fog of war shading
                    if (visibility < 1.0) {
                        const alpha = 1.0 - visibility;
                        this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
                        this.fillIsoTile(x, y, camera);
                    }
                    
                    // Render building with proper transparency
                    if (tile.building) {
                        this.renderBuilding(tile.building, x, y, camera, visibility);
                    }
                }
            }
        }
    }
    
    renderBuilding(building, x, y, camera, visibility) {
        // Get sprite for building
        const sprite = this.getSprite(building);
        
        // Apply transparency for windows
        if (world.collisionSystem.isTransparent(building)) {
            this.ctx.globalAlpha = 0.7; // Semi-transparent
        }
        
        // Render sprite
        this.drawIsometricSprite(sprite, x, y, camera);
        
        // Reset alpha
        this.ctx.globalAlpha = 1.0;
        
        // Draw open/closed indicator for doors
        if (building.type === 'door') {
            this.drawDoorState(building, x, y, camera);
        }
    }
}
```

## Building Object Structure

When placing buildings from the ISO-64x64 tileset:

```javascript
// Wall
const wall = {
    type: 'wall',
    spriteId: 'iso_building_wall_wood_000',
    blocksVision: true,
    walkable: false,
    interactable: false
};

// Window
const window = {
    type: 'window',
    spriteId: 'iso_building_window_single_000',
    blocksVision: false,
    walkable: false,
    transparent: true,
    interactable: false
};

// Door (closed by default)
const door = {
    type: 'door',
    spriteId: 'iso_building_door_closed_000',
    spriteIdOpen: 'iso_building_door_open_000',
    blocksVision: true,
    walkable: false,
    transparent: false,
    interactable: true,
    isOpen: false,
    canOpen: true
};
```

## Performance Considerations

1. **Visibility Caching** - Results cached until player moves/turns
2. **Ray Casting Optimization** - Only cast rays in view arc, not full 360°
3. **Spatial Partitioning** - Use grid for building lookups
4. **Dirty Flags** - Only recalculate when needed

## Testing

Test cases to validate:

```javascript
// Test 1: Window allows vision
const tile = world.getTile(3, 3);
tile.setBuilding({ type: 'window', blocksVision: false });
assert(collision.isTransparent(tile.building) === true);
assert(collision.blocksVision(tile.building) === false);

// Test 2: Closed door blocks vision
const doorTile = world.getTile(2, 4);
doorTile.setBuilding({ type: 'door', isOpen: false });
assert(collision.blocksVision(doorTile.building) === true);
assert(collision.canWalk(2, 4, world) === false);

// Test 3: Open door allows vision
doorTile.building.isOpen = true;
assert(collision.blocksVision(doorTile.building) === false);
assert(collision.canWalk(2, 4, world) === true);

// Test 4: Wall blocks everything
const wallTile = world.getTile(0, 3);
wallTile.setBuilding({ type: 'wall' });
assert(collision.blocksVision(wallTile.building) === true);
assert(collision.canWalk(0, 3, world) === false);
```

## Future Enhancements

- **Partial Occlusion** - Objects partially visible around corners
- **Light Sources** - Dynamic lighting through windows
- **Weather Effects** - Reduced vision in rain/fog
- **Binoculars/Scopes** - Extended vision range items
- **Sneaking** - Reduced detection radius for NPCs
- **Sound Propagation** - Similar system for sound through walls/doors

## References

- Project Zomboid vision system documentation
- Ray casting algorithms for 2D games
- Fog of war implementation techniques
- Isometric collision detection

---

**Status:** ✅ Fully Implemented  
**Last Updated:** 2025-12-20  
**Version:** 1.0
