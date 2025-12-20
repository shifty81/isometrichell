/**
 * Player Class
 * Represents the player character
 */
class Player extends Entity {
    constructor(x, y, assetLoader = null) {
        super(x, y);
        this.speed = 4; // tiles per second
        this.inventory = {
            wood: 0,
            stone: 0
        };
        this.interactionRange = 1.5; // tiles
        this.isMoving = false;
        this.direction = { x: 0, y: 0 }; // Current movement direction
        
        // Initialize survival attributes
        this.survival = new SurvivalAttributes();
        
        // Initialize sprite animation system
        this.animation = null;
        if (assetLoader && typeof SpriteAnimation !== 'undefined') {
            this.animation = new SpriteAnimation(assetLoader);
            this._setupAnimations();
        }
    }
    
    /**
     * Setup player animations
     */
    _setupAnimations() {
        if (!this.animation) return;
        
        // Register Idle animation (10 frames)
        const idleFrames = [];
        for (let i = 0; i < 10; i++) {
            idleFrames.push(`player_idle_${i}`);
        }
        this.animation.registerAnimation('idle', idleFrames, 8); // 8 fps for idle
        
        // Register Walk animation (10 frames)
        const walkFrames = [];
        for (let i = 0; i < 10; i++) {
            walkFrames.push(`player_walk_${i}`);
        }
        this.animation.registerAnimation('walk', walkFrames, 10); // 10 fps for walk
        
        // Register Run animation (10 frames)
        const runFrames = [];
        for (let i = 0; i < 10; i++) {
            runFrames.push(`player_run_${i}`);
        }
        this.animation.registerAnimation('run', runFrames, 12); // 12 fps for run
        
        // Start with idle animation
        this.animation.play('idle');
    }
    
    /**
     * Update player
     */
    update(deltaTime, world, input = null, timeSystem = null) {
        // Update survival attributes if time system is available
        if (this.survival && timeSystem) {
            this.survival.update(deltaTime, timeSystem);
        }
        
        // Update animation
        if (this.animation) {
            this.animation.update(deltaTime);
        }
        
        // If no input provided, skip movement (entity is being updated by world)
        if (!input) {
            return;
        }
        
        this.isMoving = false;
        let dx = 0;
        let dy = 0;
        
        // WASD movement
        if (input.isKeyDown('KeyW')) {
            dy -= 1;
            this.isMoving = true;
        }
        if (input.isKeyDown('KeyS')) {
            dy += 1;
            this.isMoving = true;
        }
        if (input.isKeyDown('KeyA')) {
            dx -= 1;
            this.isMoving = true;
        }
        if (input.isKeyDown('KeyD')) {
            dx += 1;
            this.isMoving = true;
        }
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707; // 1/sqrt(2)
            dy *= 0.707;
        }
        
        // Store direction for rendering
        if (dx !== 0 || dy !== 0) {
            this.direction = { x: dx, y: dy };
        }
        
        // Set activity multiplier based on movement
        if (this.survival) {
            this.survival.setActivity(this.isMoving ? 1.3 : 1.0);
        }
        
        // Update animation based on movement
        if (this.animation) {
            if (this.isMoving) {
                this.animation.play('walk');
            } else {
                this.animation.play('idle');
            }
        }
        
        // Apply movement
        if (this.isMoving) {
            const moveAmount = this.speed * deltaTime;
            this.move(dx * moveAmount, dy * moveAmount, world);
        }
    }
    
    /**
     * Interact with object at target position
     */
    interact(targetX, targetY, world) {
        // Check distance to target
        const distance = Math.sqrt(
            Math.pow(targetX - this.x, 2) + 
            Math.pow(targetY - this.y, 2)
        );
        
        if (distance > this.interactionRange) {
            return false; // Too far away
        }
        
        // Get the tile at target position
        const tile = world.getTile(Math.floor(targetX), Math.floor(targetY));
        if (!tile) {
            return false;
        }
        
        // Check if tile has a resource decoration
        if (tile.decoration) {
            if (tile.decoration.startsWith('tree_') && tile.isResource) {
                // Gather wood
                this.inventory.wood += 1;
                tile.setDecoration(null); // Remove the tree
                tile.isResource = false;
                return true;
            } else if (tile.decoration.startsWith('rocks_') && tile.isResource) {
                // Gather stone
                this.inventory.stone += 1;
                tile.setDecoration(null); // Remove the rocks
                tile.isResource = false;
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get tiles within interaction range
     */
    getInteractableTiles(world) {
        const tiles = [];
        const range = Math.ceil(this.interactionRange);
        
        for (let dy = -range; dy <= range; dy++) {
            for (let dx = -range; dx <= range; dx++) {
                const tx = Math.floor(this.x) + dx;
                const ty = Math.floor(this.y) + dy;
                const tile = world.getTile(tx, ty);
                
                if (tile && tile.decoration) {
                    const distance = Math.sqrt(
                        Math.pow(tile.x + 0.5 - this.x, 2) + 
                        Math.pow(tile.y + 0.5 - this.y, 2)
                    );
                    
                    if (distance <= this.interactionRange) {
                        tiles.push(tile);
                    }
                }
            }
        }
        
        return tiles;
    }
    
    /**
     * Render player
     */
    render(renderer, camera, isometricRenderer) {
        const screenPos = this.getScreenPosition(64, 32);
        const x = screenPos.x - camera.x;
        const y = screenPos.y - camera.y;
        
        // Try to render sprite animation first
        if (this.animation) {
            const frame = this.animation.getCurrentFrame();
            if (frame) {
                // Draw character shadow
                renderer.setFillStyle('rgba(0, 0, 0, 0.3)');
                renderer.fillEllipse(x - 16, y + 5, 32, 10);
                
                // Draw sprite frame (256x256 frames, scale down to ~64px width)
                const scale = 0.25; // Scale down 256px to 64px
                const frameWidth = frame.width * scale;
                const frameHeight = frame.height * scale;
                
                // Center the sprite
                renderer.ctx.drawImage(
                    frame,
                    x - frameWidth / 2,
                    y - frameHeight + 10, // Offset to align with ground
                    frameWidth,
                    frameHeight
                );
                return;
            }
        }
        
        // Fallback: Draw simple player representation if sprite not available
        // Draw character shadow
        renderer.setFillStyle('rgba(0, 0, 0, 0.3)');
        renderer.fillEllipse(x - 12, y + 5, 24, 8);
        
        // Draw character body (simple colored shape for now)
        renderer.setFillStyle('#3498db'); // Blue color
        renderer.fillRect(x - 10, y - 30, 20, 30);
        
        // Draw character head
        renderer.setFillStyle('#f0c090'); // Skin tone
        renderer.fillCircle(x, y - 35, 8);
        
        // Draw direction indicator (for debugging)
        if (this.isMoving) {
            renderer.setStrokeStyle('#ffffff');
            renderer.strokeLine(
                x, y - 20,
                x + this.direction.x * 15,
                y - 20 + this.direction.y * 15,
                2
            );
        }
    }
}
