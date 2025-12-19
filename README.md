# The Daily Grind - 2D Life Simulation Game

An isometric 2D life simulation game inspired by Project Zomboid and The Sims, featuring deep survival mechanics, complex AI, and social interactions. Experience the daily grind of life - work, relationships, survival, and personal growth - all built from scratch with a custom game engine.

## 🎮 Vision

A rich life simulation game without zombies, focusing on:
- **Deep Survival**: Manage hunger, thirst, energy, hygiene, and health
- **Complex AI**: NPCs with daily routines, jobs, relationships, and personalities
- **Social Simulation**: Build relationships, trade, and interact with a living community
- **Skill Progression**: Practice-based skill system spanning multiple disciplines
- **Dynamic World**: Seasons, weather, day/night cycles, and persistent infrastructure
- **Sims-like Conversations**: Interactive dialogue system with emotional portraits and choices

## 🎨 Current Features (v0.2 - Asset Integration Phase)

- **Custom Game Engine**: Built from ground up using HTML5 Canvas and vanilla JavaScript
- **Isometric Rendering**: Beautiful isometric view with proper coordinate conversion
- **Asset System**: Professional asset loader with progress tracking
- **Audio System**: Background music and sound effects
- **Building System**: Place various buildings (houses, towers, warehouses)
- **Camera System**: Smooth camera movement with WASD/Arrow keys
- **Entity System**: Extensible entity framework for game objects
- **Tile-Based World**: Procedurally generated world with varied terrain
- **Rich Asset Library**: Ground tiles, trees, bushes, characters, vehicles, buildings, and audio

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for npm scripts) or Python 3 (for simple HTTP server)

### Quick Start

#### Option 1: Using npm (Recommended)

```bash
# Install dependencies (only needed once)
npm install

# Start the development server and open in browser
npm start

# Or just start the server without opening browser
npm run dev
```

#### Option 2: Using Python

```bash
# Python 3
npm run serve
# Or directly:
python3 -m http.server 8000
```

Then open your browser to `http://localhost:8000`

#### Option 3: Using npx (No installation needed)

```bash
npx http-server -p 8000 -o
```

#### Option 4: Direct File Open

You can also open `index.html` directly in your browser, though some features may be limited due to CORS restrictions.

## 🎯 Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move camera |
| B | Toggle building mode |
| 1 | Select house (in building mode) |
| 2 | Select tower (in building mode) |
| 3 | Select warehouse (in building mode) |
| Left Click | Place building |
| Space | Spawn boat on water tile |
| Mouse | Hover to preview placement |

## 📁 Project Structure

```
thedailygrind/
├── index.html              # Main HTML entry point
├── engine/                 # Core game engine
│   ├── core/              # Core systems
│   │   ├── Engine.js      # Main game loop
│   │   ├── Time.js        # Time management
│   │   └── Input.js       # Input handling
│   ├── assets/            # Asset management
│   │   └── AssetLoader.js # Asset loading system
│   ├── audio/             # Audio management
│   │   └── AudioManager.js # Audio system
│   └── rendering/         # Rendering systems
│       ├── Renderer.js    # Base renderer
│       ├── IsometricRenderer.js  # Isometric rendering
│       └── Camera.js      # Camera system
├── utils/                 # Utility functions
│   ├── IsometricUtils.js  # Isometric coordinate conversion
│   └── MathUtils.js       # Math helpers
├── src/                   # Game-specific code
│   ├── world/            # World management
│   │   ├── Tile.js       # Tile class
│   │   └── World.js      # World manager
│   ├── entities/         # Game entities
│   │   ├── Entity.js     # Base entity class
│   │   └── Boat.js       # Boat entity
│   ├── building/         # Building system
│   │   ├── Building.js   # Building class
│   │   └── BuildingSystem.js  # Building manager
│   ├── Game.js           # Main game logic
│   └── main.js           # Entry point
└── assets/               # Game assets
    ├── ground_tiles_sheets/ # Terrain tiles
    ├── isometric_trees_pack/ # Trees and vegetation
    ├── Charachters/       # Character sprites
    ├── MusicAndSFX/       # Audio files
    └── [other asset folders]
```
    ├── sprites/          # Sprite images
    ├── tiles/            # Tile images
    └── audio/            # Sound effects and music
```

## 🏗️ Architecture

### Engine Core

The engine is built with a modular architecture:

- **Engine**: Main game loop, manages update/render cycle
- **Time**: Delta time and time scaling
- **Input**: Keyboard and mouse input handling
- **Renderer**: Canvas drawing abstraction
- **Camera**: Viewport positioning and movement

### Isometric System

The isometric rendering system handles:

- World-to-screen coordinate conversion
- Screen-to-world coordinate conversion
- Diamond-shaped tile rendering
- 3D cube rendering for buildings

### Game Systems

- **World**: Manages the tile grid and terrain
- **Entities**: Dynamic game objects (boats, future: player, NPCs)
- **Buildings**: Placeable structures with collision
- **Building System**: Handles placement logic and validation

## 🎨 Adding Assets

The `assets/` directory is ready for your game assets:

1. **Sprites** (`assets/sprites/`): Character sprites, entity graphics
2. **Tiles** (`assets/tiles/`): Terrain tiles, water animations
3. **Audio** (`assets/audio/`): Sound effects, background music

Once you upload your assets, we can integrate them into the rendering system.

## 🔧 Extending the Engine

### Adding a New Building Type

```javascript
Building.TYPES.CUSTOM = {
    name: 'Custom Building',
    width: 2,
    height: 2,
    buildHeight: 50,
    topColor: '#ff0000',
    leftColor: '#cc0000',
    rightColor: '#dd0000'
};
```

### Adding a New Entity

```javascript
class MyEntity extends Entity {
    constructor(x, y) {
        super(x, y);
        // Custom properties
    }
    
    update(deltaTime, world) {
        // Custom update logic
    }
    
    render(renderer, camera, isometricRenderer) {
        // Custom rendering
    }
}
```

### Adding a New Tile Type

```javascript
Tile.TYPES.CUSTOM = {
    name: 'custom',
    color: '#ff00ff',
    walkable: true
};
```

## 🎯 Future Features

### Phase 1: Asset Integration (Current)
- [x] Asset loading system
- [x] Audio system with music and SFX
- [ ] Professional ground tiles
- [ ] Tree and bush decorations
- [ ] Character sprites

### Phase 2: Core Survival (Next)
- [ ] Player character with animations
- [ ] Survival attributes (hunger, thirst, energy, health, hygiene)
- [ ] Day/night cycle
- [ ] Time management system

### Phase 3: Inventory & Items
- [ ] Weight/volume-based inventory
- [ ] Item database
- [ ] Container management
- [ ] Crafting system

### Phase 4: Skills & Progression
- [ ] Practice-based skill system
- [ ] Multiple skill categories
- [ ] Profession system

### Phase 5: Dynamic World
- [ ] Weather and seasons
- [ ] World persistence (save/load)
- [ ] Infrastructure systems

### Phase 6: AI & NPCs
- [ ] Complex AI (Utility AI + GOAP)
- [ ] NPC daily routines
- [ ] NPC jobs and occupations
- [ ] NPC needs and personalities

### Phase 7: Social Simulation
- [ ] Relationship system
- [ ] Sims-like conversation system with portraits
- [ ] Trading and economy
- [ ] Factions

### Phase 8+: Advanced Features
- [ ] Health and medical system
- [ ] Farming and animal husbandry
- [ ] Vehicle system
- [ ] Advanced building (electricity, plumbing)
- [ ] Random events and challenges

See [ROADMAP.md](docs/ROADMAP.md) for detailed development plan.

## 🤝 Contributing

This is a custom game engine built from scratch. Contributions are welcome! The architecture is designed to be extensible and easy to understand.

## 📚 Documentation

Additional documentation is available in the [docs/](docs/) folder:

- [ROADMAP.md](docs/ROADMAP.md) - Detailed development roadmap
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical architecture documentation
- [ASSETS.md](docs/ASSETS.md) - Asset management and organization
- [ASSET_USAGE.md](docs/ASSET_USAGE.md) - Guide to using game assets
- [BRANDING.md](docs/BRANDING.md) - Branding guidelines and style
- [CONVERSATION_SYSTEM.md](docs/CONVERSATION_SYSTEM.md) - Dialogue and conversation system design

## 📝 License

This project is open source and available for modification and use.

## 🙏 Acknowledgments

Built with passion for game development and the challenge of creating everything from scratch!
