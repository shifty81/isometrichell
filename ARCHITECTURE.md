# Game Engine Architecture

## Overview

The Isometric Hell game engine is a lightweight, custom-built 2D game engine designed specifically for isometric games. It's built entirely in vanilla JavaScript without any external dependencies.

## Core Components

### 1. Engine (`engine/core/Engine.js`)

The Engine is the heart of the system. It manages:

- **Game Loop**: Runs at 60 FPS using `requestAnimationFrame`
- **Update/Render Cycle**: Separates game logic from rendering
- **Scene Management**: Supports multiple game scenes
- **System Coordination**: Integrates Time, Input, Renderer, and Camera

```javascript
const engine = new Engine(canvas);
engine.addScene('main', gameScene);
engine.setScene('main');
engine.start();
```

### 2. Time System (`engine/core/Time.js`)

Manages time-based calculations:

- **Delta Time**: Time elapsed since last frame
- **Total Time**: Cumulative game time
- **Time Scale**: For slow motion/fast forward effects

### 3. Input System (`engine/core/Input.js`)

Handles all player input:

- **Keyboard**: Key down, pressed, and released states
- **Mouse**: Button states and position tracking
- **Frame-Based**: Distinguishes between held and just-pressed

### 4. Rendering System

#### Base Renderer (`engine/rendering/Renderer.js`)

Provides low-level drawing operations:
- Shapes (rectangles, circles, lines)
- Text rendering
- Image drawing
- Context state management

#### Isometric Renderer (`engine/rendering/IsometricRenderer.js`)

Specialized for isometric graphics:
- Diamond-shaped tile rendering
- 3D cube rendering (for buildings)
- Proper depth and layering

#### Camera (`engine/rendering/Camera.js`)

Viewport management:
- Position tracking
- Smooth movement
- WASD/Arrow key controls

## Isometric System

### Coordinate Conversion

The isometric system uses two coordinate spaces:

1. **World Coordinates**: Logical grid positions (x, y)
2. **Screen Coordinates**: Pixel positions on canvas

**World to Screen**:
```javascript
screenX = (worldX - worldY) * (tileWidth / 2)
screenY = (worldX + worldY) * (tileHeight / 2)
```

**Screen to World**:
```javascript
worldX = (screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2
worldY = (screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2
```

### Rendering Order

Tiles are rendered in a specific order to ensure proper depth:
1. Back to front (increasing Y)
2. Left to right (increasing X)
3. Buildings rendered after their base tile

## Game Systems

### World System (`src/world/`)

**Tile**: Basic world unit
- Type (grass, water, sand, stone, dirt)
- Walkability
- Building occupation
- Entity presence

**World**: Grid management
- Procedural generation
- Tile access and queries
- Entity management
- Render optimization (culling)

### Entity System (`src/entities/`)

**Entity**: Base class for all game objects
- Position (world coordinates)
- Movement
- Update/render lifecycle
- World interaction

**Boat**: Water-based entity
- AI navigation
- Water-only movement
- Direction and turning
- Auto-movement behavior

### Building System (`src/building/`)

**Building**: Placeable structures
- Types (house, tower, warehouse)
- Multi-tile occupation
- Health/durability
- 3D rendering

**BuildingSystem**: Placement management
- Build mode toggle
- Placement validation
- Preview rendering
- Tile occupation tracking

## Data Flow

```
Input → Engine → Game → Systems → Entities
  ↓       ↓       ↓       ↓         ↓
Mouse   Time   Camera  World    Buildings
Keys    FPS    Move    Tiles      Boats
```

## Rendering Pipeline

```
1. Clear canvas
2. Calculate visible area (camera culling)
3. Render tiles (back to front)
4. Render buildings (on their tiles)
5. Render entities (sorted by depth)
6. Render UI overlays (building preview)
```

## Performance Considerations

### Culling

Only tiles within the camera view are rendered:
```javascript
const startX = Math.max(0, Math.floor(-camera.x / tileWidth) - 5);
const endX = Math.min(worldWidth, startX + 40);
```

### Update Optimization

- Only update active entities
- Skip off-screen entity updates (future)
- Use delta time for frame-rate independent movement

### Rendering Optimization

- Batch similar draw calls
- Reuse canvas state with save/restore
- Minimize context switches

## Extension Points

### Adding New Systems

1. Create system class in appropriate directory
2. Initialize in `Game.js`
3. Call update/render in game loop
4. Hook up input handlers if needed

### Adding New Entity Types

1. Extend `Entity` base class
2. Implement `update()` and `render()`
3. Add spawn logic in game or world
4. Register with world entity list

### Adding New Tile Types

1. Add to `Tile.TYPES`
2. Update world generation
3. Add rendering logic if special
4. Update collision/walkability rules

## Best Practices

1. **Use Delta Time**: Always multiply movement by `deltaTime`
2. **Coordinate Conversion**: Use `IsometricUtils` for all conversions
3. **Camera Offset**: Always apply camera offset when rendering
4. **State Management**: Keep game state in Game or World, not in systems
5. **Single Responsibility**: Each class should have one clear purpose

## Future Architecture Plans

- **Asset Manager**: Centralized asset loading and caching
- **Audio System**: Sound effects and music management
- **Particle System**: Visual effects framework
- **AI System**: Behavior trees for NPCs
- **Save System**: Serialize/deserialize game state
- **Network Layer**: Multiplayer synchronization
