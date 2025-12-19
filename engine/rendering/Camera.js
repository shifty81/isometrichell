/**
 * Camera System
 * Handles view positioning and movement
 */
class Camera {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.speed = 300; // pixels per second
    }
    
    /**
     * Move camera by offset
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    
    /**
     * Set camera position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Get camera position
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    /**
     * Update camera (for smooth movement, etc.)
     */
    update(deltaTime, input) {
        const moveSpeed = this.speed * deltaTime;
        
        // WASD and Arrow key movement
        if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) {
            this.y -= moveSpeed;
        }
        if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) {
            this.y += moveSpeed;
        }
        if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) {
            this.x -= moveSpeed;
        }
        if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) {
            this.x += moveSpeed;
        }
    }
}
