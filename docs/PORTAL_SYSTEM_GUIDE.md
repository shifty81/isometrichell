# Portal System - Scene Transitions and Door Interactions

## Overview

The Portal System enables scene transitions (outdoor ↔ indoor) with rich door interaction mechanics including knocking, time-based responses, and NPC presence detection.

## Features

### ✅ Core Features
- **Scene Transitions** - Move between outdoor and indoor maps
- **Door Interactions** - Enter, knock, try door
- **Smart Knocking** - Time-aware, occupant-aware responses
- **Business Hours** - Commercial buildings respond based on time
- **Locked Doors** - Key requirements, lock picking (future)
- **In-Editor Tagging** - Visual portal placement and configuration

### ✅ Interaction Types

**Residential Doors:**
- Knock → Someone may answer (70% day, 30% night)
- If answered → Ask to enter, chat, or leave
- Relationship affects whether they let you in

**Commercial Doors:**
- Check business hours
- If open → Auto-unlock
- If closed → No response

**Locked Doors:**
- Requires key item
- Can knock to see if someone opens
- Future: lockpicking minigame

## Quick Start

### 1. Initialize Systems

```javascript
// In your game initialization
import PortalSystem from './engine/world/PortalSystem.js';
import PortalEditorTool from './engine/world/PortalEditorTool.js';

// Create portal system
game.portalSystem = new PortalSystem(game);

// Create editor tool (for map editing)
game.portalEditor = new PortalEditorTool(game, game.portalSystem);
```

### 2. Register a Portal

```javascript
// Method 1: Code
const portal = game.portalSystem.registerPortal({
    id: 'house_01_front_door',
    type: 'door',
    x: 500,
    y: 300,
    z: 0,
    
    // Target scene
    targetScene: 'interior_house_01',
    targetX: 100,
    targetY: 200,
    targetZ: 0,
    
    // Door settings
    locked: false,
    canKnock: true,
    buildingType: 'residential',
    occupants: ['John Smith', 'Jane Smith'],
    
    // Visual
    label: 'Smith Family Home',
    icon: '🏠'
});

// Method 2: In-Editor (see Editor Usage section)
```

### 3. Update and Render

```javascript
// In game loop
game.portalSystem.update(deltaTime);
game.portalSystem.render(renderer, camera);

// In editor mode
game.portalEditor.render(renderer, camera);
```

### 4. Handle Input

```javascript
// In input handler
if (game.portalSystem.handleInput(key)) {
    // Portal system handled the input
    return;
}
```

## Editor Usage

### Opening the Portal Editor

```javascript
// Enable editor mode
game.portalEditor.setMode('place'); // or 'select', 'edit'
```

### Placing Portals

1. **Set to place mode:**
   ```javascript
   game.portalEditor.setMode('place');
   ```

2. **Click on map** - Portal appears at cursor

3. **Editor panel opens** - Configure properties:
   - Label and icon
   - Target scene and spawn position
   - Locked/unlocked state
   - Key requirements
   - Knock settings
   - Building type and occupants
   - Business hours (for commercial)

### Editing Existing Portals

1. **Set to select mode:**
   ```javascript
   game.portalEditor.setMode('select');
   ```

2. **Click on portal** - Editor panel opens

3. **Modify properties** - Changes save automatically

### Editor Keyboard Shortcuts

- **E** - Toggle editor mode
- **Click** - Place (place mode) or Select (select mode)
- **Delete** - Delete selected portal
- **Ctrl+D** - Duplicate selected portal
- **Ctrl+S** - Save all portals to file

### Exporting Portals

```javascript
// Export all portals to JSON file
game.portalEditor.exportPortals();

// Downloads: portals.json
```

### Importing Portals

```javascript
// Load portals from JSON
fetch('tiled_maps/scenes/town_portals.json')
    .then(r => r.json())
    .then(data => {
        game.portalEditor.importPortals(JSON.stringify(data));
    });
```

## Portal Configuration

### Basic Portal

```javascript
{
    id: 'door_01',
    type: 'door',
    x: 500,
    y: 300,
    z: 0,
    targetScene: 'interior_01',
    targetX: 100,
    targetY: 100,
    targetZ: 0
}
```

### Residential Door with Occupants

```javascript
{
    id: 'house_front_door',
    type: 'door',
    buildingType: 'residential',
    locked: true,
    canKnock: true,
    occupants: ['John Doe', 'Jane Doe'],
    label: 'Doe Residence',
    icon: '🏠',
    // ... position and target
}
```

### Commercial Building

```javascript
{
    id: 'shop_entrance',
    type: 'door',
    buildingType: 'commercial',
    businessHours: {
        open: 9,   // 9 AM
        close: 17  // 5 PM
    },
    canKnock: true,
    label: 'General Store',
    icon: '🏪',
    // ... position and target
}
```

### Locked Door with Key

```javascript
{
    id: 'locked_door',
    type: 'door',
    locked: true,
    requiresKey: true,
    keyItemId: 'key_police_station',
    canKnock: false,
    label: 'Police Station',
    icon: '🔒',
    // ... position and target
}
```

### Stairs (Multi-floor)

```javascript
{
    id: 'stairs_up',
    type: 'stairs',
    targetScene: 'current_scene', // Same scene
    targetZ: 1, // Go up one floor
    label: 'Stairs',
    icon: '⬆️',
    // ... position
}
```

## Interaction Flow

### Player Approaches Door

```
1. Portal system detects player nearby (< 50px)
2. Shows interaction prompt: "[E] Enter" or "[E] Knock"
3. Player presses E
```

### Unlocked Door

```
Player presses E
→ Play door sound
→ Show transition animation
→ Load target scene
→ Position player at spawn point
```

### Locked Residential Door

```
Player presses E
→ Shows: "[E] Knock  [Space] Try Door"

If player knocks:
→ Play knock sound
→ Wait 2 seconds
→ Check time of day
→ Check if occupants home
→ Random chance based on time
→ If someone answers:
    → Show dialogue options
    → "Ask to come in"
    → "Just saying hello"
    → "Never mind"
→ If no answer:
    → Show message: "No answer..."
```

### Commercial Door During Hours

```
Player knocks
→ "Come in, we're open!"
→ Door unlocks
→ Player can enter
```

### Commercial Door After Hours

```
Player knocks
→ "No answer. The business is closed."
→ Door stays locked
```

## Scene Structure

### Outdoor Scene (Main World)

```
tiled_maps/scenes/
└── town_outdoor.tmx          # Main outdoor map
    └── portals.json           # All door portals
```

### Indoor Scenes

```
tiled_maps/scenes/interiors/
├── house_01.tmx              # House interior
├── house_02.tmx
├── shop_general.tmx          # Store interior
├── shop_hardware.tmx
└── building_police.tmx       # Police station
```

### Portal Links

```javascript
// Outdoor → Indoor
{
    id: 'house_01_entrance',
    x: 500, y: 300,           // Position in outdoor scene
    targetScene: 'house_01',   // Indoor scene name
    targetX: 100, targetY: 200 // Spawn inside
}

// Indoor → Outdoor (return portal)
{
    id: 'house_01_exit',
    x: 100, y: 200,            // Position inside
    targetScene: 'town_outdoor', // Back to outdoor
    targetX: 520, targetY: 300   // Spawn outside door
}
```

## Integration with Game Systems

### With Time System

```javascript
// Portal system checks current time
const hour = game.timeSystem.getCurrentHour();

// Business hours check
if (hour >= 9 && hour < 17) {
    // Store is open
}
```

### With Relationship System

```javascript
// When NPC answers door
const relationship = game.relationshipSystem.getRelationship(npcName);

if (relationship > 50) {
    // Let player in
} else {
    // Deny entry
}
```

### With Inventory System

```javascript
// Check for key
if (portal.requiresKey) {
    const hasKey = game.player.inventory.hasItem(portal.keyItemId);
    if (hasKey) {
        // Unlock door
    }
}
```

## Scene File Format

### Saving Portals with Scene

```json
{
    "scene": "town_outdoor",
    "width": 100,
    "height": 100,
    "portals": [
        {
            "id": "house_01_door",
            "x": 500,
            "y": 300,
            "targetScene": "interior_house_01",
            "locked": false,
            "occupants": ["John Smith"]
        }
    ]
}
```

## API Reference

### PortalSystem

```javascript
// Register portal
portalSystem.registerPortal(config)

// Update (check nearby portals)
portalSystem.update(deltaTime)

// Render indicators
portalSystem.render(renderer, camera)

// Handle input
portalSystem.handleInput(key)

// Use portal
portalSystem.usePortal(portal)

// Knock on door
portalSystem.knockOnDoor(portal)

// Load scene
portalSystem.loadScene(sceneName, options)

// Get portals
portalSystem.getPortals()
portalSystem.getPortalById(id)
```

### PortalEditorTool

```javascript
// Set mode
portalEditor.setMode('select' | 'place' | 'edit')

// Handle click
portalEditor.handleClick(mouseX, mouseY, camera)

// Export/import
portalEditor.exportPortals()
portalEditor.importPortals(jsonData)

// Render editor
portalEditor.render(renderer, camera)
```

## Examples

### Example 1: Simple House

```javascript
// Front door
game.portalSystem.registerPortal({
    id: 'house_front',
    x: 500, y: 300,
    targetScene: 'house_interior',
    targetX: 100, targetY: 200,
    buildingType: 'residential',
    occupants: ['Bob'],
    label: 'Bob\'s House'
});

// Exit door (inside)
game.portalSystem.registerPortal({
    id: 'house_exit',
    x: 100, y: 200,
    targetScene: 'town_outdoor',
    targetX: 520, targetY: 300,
    label: 'Exit'
});
```

### Example 2: Shop with Hours

```javascript
game.portalSystem.registerPortal({
    id: 'shop_entrance',
    x: 800, y: 400,
    targetScene: 'shop_interior',
    targetX: 150, targetY: 300,
    buildingType: 'commercial',
    businessHours: { open: 8, close: 18 },
    label: 'General Store',
    icon: '🏪'
});
```

### Example 3: Multi-floor Building

```javascript
// Ground floor stairs
game.portalSystem.registerPortal({
    id: 'stairs_1_to_2',
    x: 200, y: 300, z: 0,
    targetScene: 'current',
    targetX: 200, targetY: 300, targetZ: 1,
    type: 'stairs',
    icon: '⬆️'
});

// Second floor stairs
game.portalSystem.registerPortal({
    id: 'stairs_2_to_1',
    x: 200, y: 300, z: 1,
    targetScene: 'current',
    targetX: 200, targetY: 300, targetZ: 0,
    type: 'stairs',
    icon: '⬇️'
});
```

## Troubleshooting

**Portal doesn't show up:**
- Check portal.z matches player.z
- Verify coordinates are within camera view
- Enable portal markers: `portalSystem.showPortalMarkers = true`

**Can't interact with portal:**
- Check player is within interaction distance (default 50px)
- Verify portal is on same floor (z-level)
- Check input handler is connected

**Scene won't load:**
- Verify target scene file exists
- Check scene file format (.tmx, .pzw, .json)
- Look at browser console for errors

**Knock doesn't work:**
- Set `canKnock: true` on portal
- Check time system is initialized
- Verify occupants are set

## Next Steps

1. Create your interior scenes in TileZed/Tiled
2. Place portals using the editor
3. Configure door properties
4. Test transitions in-game
5. Add NPC interactions
6. Create multiple buildings

## See Also

- `PZWLoader.js` - Load WorldEd maps
- `SceneManager.js` - Manage multiple scenes (future)
- `TimeSystem.js` - Time-of-day system
- `RelationshipSystem.js` - NPC relationships (future)
