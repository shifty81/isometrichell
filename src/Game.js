/**
 * Main Game Class
 * Manages game state and coordinates all systems
 */
class Game {
    constructor(engine, assetLoader, audioManager) {
        this.engine = engine;
        this.assetLoader = assetLoader;
        this.audioManager = audioManager;
        this.world = null;
        this.buildingSystem = null;
        this.isometricRenderer = null;
        this.hoveredTile = null;
        
        this.initialize();
    }
    
    /**
     * Initialize game
     */
    initialize() {
        // Create isometric renderer
        this.isometricRenderer = new IsometricRenderer(this.engine.renderer);
        
        // Create world (30x30 tiles) with asset loader
        this.world = new World(30, 30, 64, 32, this.assetLoader);
        
        // Create building system
        this.buildingSystem = new BuildingSystem(this.world, this.audioManager, this.assetLoader);
        
        // Add some boats to the world
        this.spawnBoats();
        
        // Center camera on world
        const centerScreen = IsometricUtils.tileToScreen(15, 15, 64, 32);
        this.engine.camera.setPosition(
            centerScreen.x - this.engine.canvas.width / 2,
            centerScreen.y - this.engine.canvas.height / 2
        );
    }
    
    /**
     * Spawn boats on water tiles
     */
    spawnBoats() {
        let boatsSpawned = 0;
        const maxBoats = 3;
        
        for (let y = 0; y < this.world.height && boatsSpawned < maxBoats; y++) {
            for (let x = 0; x < this.world.width && boatsSpawned < maxBoats; x++) {
                const tile = this.world.getTile(x, y);
                if (tile && tile.isWater()) {
                    const boat = new Boat(x + 0.5, y + 0.5);
                    boat.direction = Math.random() * Math.PI * 2;
                    this.world.addEntity(boat);
                    boatsSpawned++;
                }
            }
        }
    }
    
    /**
     * Update game
     */
    update(deltaTime) {
        // Update camera
        this.engine.camera.update(deltaTime, this.engine.input);
        
        // Update world
        this.world.update(deltaTime);
        
        // Handle building mode toggle
        if (this.engine.input.isKeyPressed('KeyB')) {
            const buildMode = this.buildingSystem.toggleBuildMode();
            this.updateUI();
        }
        
        // Handle building type switching
        if (this.buildingSystem.buildMode) {
            if (this.engine.input.isKeyPressed('Digit1')) {
                this.buildingSystem.setBuildingType(Building.TYPES.HOUSE);
            } else if (this.engine.input.isKeyPressed('Digit2')) {
                this.buildingSystem.setBuildingType(Building.TYPES.TOWER);
            } else if (this.engine.input.isKeyPressed('Digit3')) {
                this.buildingSystem.setBuildingType(Building.TYPES.WAREHOUSE);
            }
        }
        
        // Update building preview
        const mousePos = this.engine.input.getMousePosition();
        this.buildingSystem.updatePreview(mousePos.x, mousePos.y, this.engine.camera);
        
        // Handle building placement
        if (this.engine.input.isMouseButtonPressed(0)) {
            this.buildingSystem.tryPlaceBuilding(mousePos.x, mousePos.y, this.engine.camera);
        }
        
        // Handle boat spawning with Space
        if (this.engine.input.isKeyPressed('Space')) {
            const tile = this.world.getTileAtScreen(mousePos.x, mousePos.y, this.engine.camera);
            if (tile && tile.isWater()) {
                const boat = new Boat(tile.x + 0.5, tile.y + 0.5);
                boat.direction = Math.random() * Math.PI * 2;
                this.world.addEntity(boat);
            }
        }
        
        // Update hovered tile for display
        this.hoveredTile = this.world.getTileAtScreen(mousePos.x, mousePos.y, this.engine.camera);
        
        // Update UI
        this.updateUI();
    }
    
    /**
     * Render game
     */
    render(renderer, camera) {
        // Render world
        this.world.render(renderer, camera, this.isometricRenderer);
        
        // Render building preview
        this.buildingSystem.renderPreview(renderer, camera, this.isometricRenderer);
        
        // Highlight hovered tile
        if (this.hoveredTile) {
            const screenPos = IsometricUtils.tileToScreen(
                this.hoveredTile.x,
                this.hoveredTile.y,
                64,
                32
            );
            
            this.isometricRenderer.drawIsometricTileOutline(
                screenPos.x,
                screenPos.y,
                64,
                32,
                '#ffffff',
                camera,
                1
            );
        }
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        // Update FPS
        document.getElementById('fps').textContent = this.engine.getFPS();
        
        // Update camera position
        const camPos = this.engine.camera.getPosition();
        document.getElementById('camera').textContent = 
            `${Math.round(camPos.x)}, ${Math.round(camPos.y)}`;
        
        // Update mouse tile position
        if (this.hoveredTile) {
            document.getElementById('mouse').textContent = 
                `Tile: ${this.hoveredTile.x}, ${this.hoveredTile.y} (${this.hoveredTile.type.name})`;
        } else {
            document.getElementById('mouse').textContent = 'N/A';
        }
        
        // Update mode
        const mode = this.buildingSystem.buildMode 
            ? `Building: ${this.buildingSystem.selectedBuildingType.name}` 
            : 'Normal';
        document.getElementById('mode').textContent = mode;
    }
}
