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
        this.timeSystem = null;
        
        this.initialize();
    }
    
    /**
     * Initialize game
     */
    initialize() {
        // Create isometric renderer
        this.isometricRenderer = new IsometricRenderer(this.engine.renderer);
        
        // Create time system
        this.timeSystem = new TimeSystem();
        console.log('⏰ Time system initialized');
        
        // Create world (50x50 tiles) with asset loader
        this.world = new World(50, 50, 64, 32, this.assetLoader);
        
        // Create player at center of world
        this.player = new Player(25, 25);
        this.world.addEntity(this.player);
        
        // Create building system
        this.buildingSystem = new BuildingSystem(this.world, this.audioManager, this.assetLoader);
        
        // Create editor UI
        this.editorUI = new EditorUI(this.assetLoader, this.world, this.engine.camera);
        
        // Add some boats to the world
        this.spawnBoats();
        
        // Center camera on player
        const centerScreen = IsometricUtils.tileToScreen(this.player.x, this.player.y, 64, 32);
        this.engine.camera.setPosition(
            centerScreen.x - this.engine.canvas.width / 2,
            centerScreen.y - this.engine.canvas.height / 2
        );
    }
    
    /**
     * Start ambient nature sounds
     * Note: Currently awaiting nature sound assets (birds, wind, rustling leaves, water)
     * When nature sounds are added to assets/MusicAndSFX/, uncomment the playAmbient calls
     */
    startAmbientSounds() {
        if (!this.audioManager) return;
        
        // TODO: Add these ambient sound files to assets/MusicAndSFX/:
        // - birds.ogg (chirping birds)
        // - wind.ogg (gentle breeze)
        // - leaves.ogg (rustling leaves)
        // - water.ogg (flowing water/stream)
        
        // Uncomment when sound files are available:
        // this.audioManager.playAmbient('ambient_birds', 0.4);
        // this.audioManager.playAmbient('ambient_wind', 0.3);
        
        console.log('🌿 Ambient sound system ready (awaiting nature sound assets)');
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
        // Update time system
        if (this.timeSystem) {
            this.timeSystem.update(deltaTime);
        }
        
        // Handle time controls
        if (this.engine.input.isKeyPressed('KeyP')) {
            if (this.timeSystem) {
                this.timeSystem.togglePause();
            }
        }
        
        // Handle time speed controls (1-5 keys for different speeds)
        if (this.engine.input.isKeyPressed('Digit1') && !this.buildingSystem.buildMode) {
            this.timeSystem.setTimeScale(60); // Normal speed
        } else if (this.engine.input.isKeyPressed('Digit2') && !this.buildingSystem.buildMode) {
            this.timeSystem.setTimeScale(120); // 2x speed
        } else if (this.engine.input.isKeyPressed('Digit3') && !this.buildingSystem.buildMode) {
            this.timeSystem.setTimeScale(240); // 4x speed
        }
        
        // Update player first
        if (this.player) {
            this.player.update(deltaTime, this.world, this.engine.input, this.timeSystem);
            
            // Camera follows player
            const playerScreen = IsometricUtils.tileToScreen(this.player.x, this.player.y, 64, 32);
            const targetCameraX = playerScreen.x - this.engine.canvas.width / 2;
            const targetCameraY = playerScreen.y - this.engine.canvas.height / 2;
            
            // Smooth camera follow
            const lerpSpeed = 5 * deltaTime;
            this.engine.camera.x += (targetCameraX - this.engine.camera.x) * lerpSpeed;
            this.engine.camera.y += (targetCameraY - this.engine.camera.y) * lerpSpeed;
        }
        
        // Handle editor toggle (E key)
        if (this.engine.input.isKeyPressed('KeyE')) {
            this.editorUI.toggle();
        }
        
        // Update world
        this.world.update(deltaTime);
        
        // Handle mouse interaction with world objects
        const mousePos = this.engine.input.getMousePosition();
        this.hoveredTile = this.world.getTileAtScreen(mousePos.x, mousePos.y, this.engine.camera);
        
        // Handle left click for interaction
        if (this.engine.input.isMouseButtonPressed(0)) {
            if (this.hoveredTile && this.player) {
                // Try to interact with the tile
                const success = this.player.interact(
                    this.hoveredTile.x + 0.5,
                    this.hoveredTile.y + 0.5,
                    this.world
                );
                
                if (success && this.audioManager) {
                    // Play interaction sound
                    this.audioManager.playSfx('sfx_womp');
                }
            }
        }
        
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
        
        // Update building preview (only when not in normal player mode)
        if (this.buildingSystem.buildMode) {
            this.buildingSystem.updatePreview(mousePos.x, mousePos.y, this.engine.camera);
            
            // Handle building placement
            if (this.engine.input.isMouseButtonPressed(0)) {
                this.buildingSystem.tryPlaceBuilding(mousePos.x, mousePos.y, this.engine.camera);
            }
        }
        
        // Handle boat spawning with Space (debug feature)
        if (this.engine.input.isKeyPressed('Space')) {
            const tile = this.world.getTileAtScreen(mousePos.x, mousePos.y, this.engine.camera);
            if (tile && tile.isWater()) {
                const boat = new Boat(tile.x + 0.5, tile.y + 0.5);
                boat.direction = Math.random() * Math.PI * 2;
                this.world.addEntity(boat);
            }
        }
        
        // Update UI
        this.updateUI();
    }
    
    /**
     * Render game
     */
    render(renderer, camera) {
        // Render world
        this.world.render(renderer, camera, this.isometricRenderer);
        
        // Highlight interactable tiles near player
        if (this.player) {
            const interactableTiles = this.player.getInteractableTiles(this.world);
            for (const tile of interactableTiles) {
                const screenPos = IsometricUtils.tileToScreen(
                    tile.x,
                    tile.y,
                    64,
                    32
                );
                
                this.isometricRenderer.drawIsometricTileOutline(
                    screenPos.x,
                    screenPos.y,
                    64,
                    32,
                    '#ffff00',
                    camera,
                    2
                );
            }
        }
        
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
            
            // Different color for resource tiles
            const outlineColor = this.hoveredTile.isResource ? '#00ff00' : '#ffffff';
            
            this.isometricRenderer.drawIsometricTileOutline(
                screenPos.x,
                screenPos.y,
                64,
                32,
                outlineColor,
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
        
        // Update time display
        if (this.timeSystem) {
            document.getElementById('day').textContent = this.timeSystem.currentDay;
            document.getElementById('time').textContent = this.timeSystem.getTimeString12Hour();
            const period = this.timeSystem.getPeriod();
            document.getElementById('period').textContent = 
                period.charAt(0).toUpperCase() + period.slice(1);
        }
        
        // Update survival stats
        if (this.player && this.player.survival) {
            this.updateSurvivalUI(this.player.survival);
        }
        
        // Update mouse tile position
        if (this.hoveredTile) {
            const resourceText = this.hoveredTile.isResource ? ' [Resource]' : '';
            document.getElementById('mouse').textContent = 
                `Tile: ${this.hoveredTile.x}, ${this.hoveredTile.y} (${this.hoveredTile.type.name})${resourceText}`;
        } else {
            document.getElementById('mouse').textContent = 'N/A';
        }
        
        // Update mode
        let mode = 'Normal';
        if (this.timeSystem && this.timeSystem.isPaused) {
            mode = '⏸️  PAUSED';
        } else if (this.editorUI && this.editorUI.isVisible()) {
            mode = '🎨 Editor Mode';
        } else if (this.buildingSystem.buildMode) {
            mode = `Building: ${this.buildingSystem.selectedBuildingType.name}`;
        } else if (this.player) {
            mode = `Player - Wood: ${this.player.inventory.wood} Stone: ${this.player.inventory.stone}`;
        }
        document.getElementById('mode').textContent = mode;
    }
    
    /**
     * Update survival stats UI
     */
    updateSurvivalUI(survival) {
        const stats = ['hunger', 'thirst', 'energy', 'health', 'hygiene'];
        
        for (const stat of stats) {
            const value = Math.round(survival[stat]);
            const statusLevel = survival.getStatusLevel(stat);
            
            // Update value text
            const valueElement = document.getElementById(`${stat}Value`);
            if (valueElement) {
                valueElement.textContent = value;
            }
            
            // Update bar
            const barElement = document.getElementById(`${stat}Bar`);
            if (barElement) {
                barElement.style.width = `${value}%`;
                barElement.className = `stat-bar ${statusLevel}`;
            }
        }
        
        // Update status effects
        const statusEffects = survival.getStatusEffects();
        const statusEffectsContainer = document.getElementById('statusEffects');
        
        if (statusEffects.length > 0) {
            statusEffectsContainer.style.display = 'block';
            statusEffectsContainer.innerHTML = statusEffects.map(effect => {
                const displayName = effect.replace(/_/g, ' ').toUpperCase();
                return `<span class="status-effect-badge">${displayName}</span>`;
            }).join('');
        } else {
            statusEffectsContainer.style.display = 'none';
        }
    }
}
