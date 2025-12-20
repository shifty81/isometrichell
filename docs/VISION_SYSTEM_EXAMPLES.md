# Vision System Visual Examples

## Line of Sight Demonstration

### Example 1: Player Facing Down (Looking at Building)

```
Legend: P = Player, W = Wall, D = Door (closed), O = Window, . = Ground, * = Visible

Building Layout:
┌─────────────────────┐
│ W   W   W   W   W   │  Row 5
│ W   .   .   .   W   │  Row 4
│ W   O   .   O   W   │  Row 3  (Windows - can see through)
│ W   .   .   .   W   │  Row 2
│ W   W   D   W   W   │  Row 1  (Door - blocks vision when closed)
│ .   .   P   .   .   │  Row 0  (Player facing up/north)
└─────────────────────┘
     0   1   2   3   4

Player Position: (2, 0)
Player Direction: (0, 1) - Facing North/Up
View Arc: 180 degrees
```

**Vision Result:**
```
┌─────────────────────┐
│ *   *   *   *   *   │  Row 5  ← Can't see, blocked by walls
│ *   *   *   *   *   │  Row 4  ← Can see inside through windows
│ *   *   *   *   *   │  Row 3  ← Windows allow vision through
│ *   *   *   *   *   │  Row 2  ← Can see up to door
│ *   *   *   *   *   │  Row 1  ← Door blocks vision here
│ *   *   P   *   *   │  Row 0  ← Player visible area
└─────────────────────┘
```

**What Player Can See:**
- ✅ Ground tiles in front (Row 0-1)
- ✅ Front wall with door (Row 1)
- ✅ **THROUGH windows** into interior (Row 2-4, columns 1 & 3)
- ❌ **BEHIND closed door** (Row 2, column 2)
- ❌ Behind walls (outside building)

### Example 2: Same Building, Door Open

```
Building Layout:
┌─────────────────────┐
│ W   W   W   W   W   │  Row 5
│ W   .   .   .   W   │  Row 4
│ W   O   .   O   W   │  Row 3
│ W   .   .   .   W   │  Row 2
│ W   W   ◊   W   W   │  Row 1  (Door OPEN - ◊)
│ .   .   P   .   .   │  Row 0
└─────────────────────┘
```

**Vision Result:**
```
┌─────────────────────┐
│                     │  Row 5  ← Behind walls, can't see
│ *   *   *   *   *   │  Row 4  ← Full interior visible
│ *   *   *   *   *   │  Row 3  ← Windows and open door
│ *   *   *   *   *   │  Row 2  ← Can see through door!
│ *   *   *   *   *   │  Row 1  ← Open door allows vision
│ *   *   P   *   *   │  Row 0
└─────────────────────┘
```

**Change When Door Opens:**
- ✅ Can now see through doorway (column 2)
- ✅ Full interior visible from front
- ✅ Can see furniture and items inside

### Example 3: Player Inside Room Looking Out Window

```
Building Layout:
┌─────────────────────┐
│ .   .   .   .   .   │  Row 5  (Outside, north)
│ W   W   W   W   W   │  Row 4  (North wall)
│ W   .   P   .   W   │  Row 3  (Player inside, facing north)
│ W   O   ↑   O   W   │  Row 2  (Windows on south wall)
│ W   W   W   W   W   │  Row 1  (South wall)
│ .   .   .   .   .   │  Row 0  (Outside, south)
└─────────────────────┘

Player Position: (2, 3)
Player Direction: (0, 1) - Facing North
```

**Vision Result:**
```
┌─────────────────────┐
│ *   *   *   *   *   │  Row 5  ← Can see outside through wall windows!
│ *   *   *   *   *   │  Row 4  ← North wall visible
│ *   *   P   *   *   │  Row 3  ← Inside room
│ *   *   *   *   *   │  Row 2  ← Can't see behind (not facing)
│ *   *   *   *   *   │  Row 1  ← Limited rear vision
│                     │  Row 0  ← Outside view arc
└─────────────────────┘
```

**Vision Through Windows:**
- ✅ Can see outside through north wall (Row 5)
- ✅ Window at (1, 4) allows vision to (1, 5)
- ✅ Window at (3, 4) allows vision to (3, 5)
- ⚠️ Slight distance penalty when looking through windows

### Example 4: Wide Arc Vision Comparison

```
Traditional 90° Cone:        Project Zomboid 180° Arc:
        ···                         ·········
       ··P··                       ···P↑···
        ↑                         ···········
    
   Can see: ~9 tiles           Can see: ~20 tiles
   Limited field               Wide peripheral vision
```

**180° Arc Benefits:**
- See threats approaching from sides
- More natural peripheral vision
- Better spatial awareness
- Similar to Project Zomboid gameplay

### Example 5: Vision Around Corners

```
Building with Corner:
┌─────────────────────┐
│ W   W   W           │  Row 4
│ W   .   W           │  Row 3
│ W   O   W   W   W   │  Row 2  (Window at corner)
│ W   .   .   .   W   │  Row 1
│     .   P   .   W   │  Row 0  (Player facing right/east)
│         →           │
└─────────────────────┘

Player Direction: (1, 0) - Facing East
```

**Vision Result:**
```
┌─────────────────────┐
│ *                   │  Row 4  ← Limited vision around corner
│ *   *               │  Row 3  ← Can't see behind solid wall
│ *   *   *   *   *   │  Row 2  ← Window allows limited view
│ *   *   *   *   *   │  Row 1  ← Main field of view
│ *   *   P   *   *   │  Row 0  ← Player position
└─────────────────────┘
```

**Corner Vision Rules:**
- Walls block line of sight completely
- Windows at corners allow partial vision through
- Ray stops at first solid wall hit
- No "x-ray vision" around corners

## Collision Examples

### Example 1: Movement Blocked by Walls

```
Before Move Attempt:
┌─────────────┐
│ W   W   W   │
│ .   P   .   │  ← Player tries to move up
│ .   ↑   .   │
└─────────────┘

Result: ❌ Movement blocked
Reason: collision.canWalk(2, 2) returns false (wall present)
```

### Example 2: Door Interaction

```
State 1: Door Closed
┌─────────────┐
│ W   D   W   │  ← Door closed (D)
│ .   P   .   │  ← Player at door
└─────────────┘

Player Action: Press 'E' key
Result: collision.interact(door)
Effect: door.isOpen = true

State 2: Door Open
┌─────────────┐
│ W   ◊   W   │  ← Door open (◊)
│ .   P   .   │  ← Player can now walk through
│     ↑       │
└─────────────┘

Player Action: Move up
Result: ✅ collision.canWalk(2, 2) returns true
Effect: Player walks through open door
```

### Example 3: Window Collision

```
┌─────────────┐
│ W   O   W   │  ← Window (O)
│ .   P   .   │  ← Player tries to walk through
│     ↑       │
└─────────────┘

Result: ❌ Movement blocked
Reason: collision.canWalk(2, 2) returns false
Note: ✅ But collision.isTransparent(window) returns true
       (Can see through, just can't walk through)
```

### Example 4: Furniture Interaction

```
┌─────────────┐
│ .   .   .   │
│ .   T   .   │  ← Table (T) - furniture
│ .   P   .   │  ← Player adjacent
└─────────────┘

Player Action: Press 'E' near table
Result: ✅ collision.interact(table)
Effect: Open inventory/crafting menu
Note: Table blocks walking but not vision
```

## Performance Optimization

### Visibility Caching

```javascript
Frame 1: Player at (10, 10), facing north
  → Calculate visibility (expensive)
  → Cache results for position (10, 10)
  
Frame 2-30: Player hasn't moved
  → Use cached results (fast!)
  → No recalculation needed

Frame 31: Player moves to (10, 11)
  → Cache invalidated
  → Recalculate visibility
  → Cache new results
```

**Cache Keys:**
- Player grid position (x, y)
- Player facing direction (x, y)
- Invalidated on: movement, turning, world changes

### Ray Casting Resolution

```
Low Resolution (90 rays):
  ·····
  ·↑P·
  ·····
Jagged visibility edges
Gaps in vision

High Resolution (360 rays):
  ·········
  ···↑P···
  ·········
Smooth visibility edges
No gaps, more realistic
```

## Integration Example

### Complete Rendering Loop

```javascript
function render() {
    // Update player visibility
    player.visibleTiles = world.lineOfSight.calculateVisibleTiles(
        { x: player.x, y: player.y },
        player.direction,
        world
    );
    
    // Render world
    for (let y = 0; y < world.height; y++) {
        for (let x = 0; x < world.width; x++) {
            const tile = world.getTile(x, y);
            const tileKey = `${x},${y}`;
            
            if (player.visibleTiles.has(tileKey)) {
                // Get visibility factor for fog of war
                const visibility = world.lineOfSight.getVisibilityFactor(
                    { x: player.x, y: player.y },
                    { x: x, y: y },
                    player.direction,
                    world
                );
                
                // Render tile
                renderTile(tile, x, y);
                
                // Apply fog based on distance/angle
                const fogAlpha = 1.0 - visibility;
                ctx.fillStyle = `rgba(0, 0, 0, ${fogAlpha * 0.7})`;
                fillIsoTile(x, y);
                
                // Render building with transparency
                if (tile.building) {
                    if (world.collisionSystem.isTransparent(tile.building)) {
                        ctx.globalAlpha = 0.7; // Windows semi-transparent
                    }
                    renderBuilding(tile.building, x, y);
                    ctx.globalAlpha = 1.0;
                }
            } else {
                // Not visible - render as black/fog
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                fillIsoTile(x, y);
            }
        }
    }
}
```

## Summary

### Key Features Implemented

1. **180° Arc Vision** - Wide field of view like Project Zomboid
2. **Window Transparency** - See through windows, not through walls
3. **Door States** - Closed = blocks, Open = allows vision
4. **Collision Detection** - Proper blocking for all building types
5. **Interaction System** - Open/close doors, use furniture
6. **Performance Caching** - Efficient visibility calculations
7. **Fog of War** - Distance-based visibility falloff

### Visual Properties by Type

| Building | Walk | See Through | Interact | Visual Effect |
|----------|------|-------------|----------|---------------|
| Wall | ❌ | ❌ | ❌ | Solid, opaque |
| Window | ❌ | ✅ | ❌ | Semi-transparent |
| Door (closed) | ❌ | ❌ | ✅ | Opaque |
| Door (open) | ✅ | ✅ | ✅ | Open frame |
| Furniture | ❌ | ✅ | ✅ | Solid, no vision block |

---

**Status:** Fully Documented  
**Last Updated:** 2025-12-20  
**For:** ISO-64x64 Building Assets Integration
