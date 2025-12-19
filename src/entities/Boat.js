/**
 * Boat Entity
 * Boat that can move on water
 */
class Boat extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = 3; // Boats are faster on water
        this.direction = 0; // In radians
        this.autoMove = true;
        this.targetDirection = 0;
        this.turnSpeed = 2; // radians per second
    }
    
    /**
     * Update boat
     */
    update(deltaTime, world) {
        if (!this.active) return;
        
        const tile = world.getTile(Math.floor(this.x), Math.floor(this.y));
        
        // Boats only work on water
        if (!tile || !tile.isWater()) {
            // Drift towards water if not on it
            return;
        }
        
        if (this.autoMove) {
            // Simple AI: move in current direction
            const moveDistance = this.speed * deltaTime;
            const dx = Math.cos(this.direction) * moveDistance;
            const dy = Math.sin(this.direction) * moveDistance;
            
            // Try to move
            if (!this.move(dx, dy, world)) {
                // If blocked, change direction
                this.targetDirection = Math.random() * Math.PI * 2;
            }
            
            // Randomly change direction sometimes
            if (Math.random() < 0.01) {
                this.targetDirection = Math.random() * Math.PI * 2;
            }
            
            // Smoothly turn towards target direction
            let dirDiff = this.targetDirection - this.direction;
            // Normalize angle difference
            while (dirDiff > Math.PI) dirDiff -= Math.PI * 2;
            while (dirDiff < -Math.PI) dirDiff += Math.PI * 2;
            
            const turnAmount = this.turnSpeed * deltaTime;
            if (Math.abs(dirDiff) < turnAmount) {
                this.direction = this.targetDirection;
            } else {
                this.direction += Math.sign(dirDiff) * turnAmount;
            }
        }
    }
    
    /**
     * Render boat
     */
    render(renderer, camera, isometricRenderer) {
        if (!this.active) return;
        
        const tileWidth = 64;
        const tileHeight = 32;
        const screenPos = this.getScreenPosition(tileWidth, tileHeight);
        
        const screenX = screenPos.x - camera.x;
        const screenY = screenPos.y - camera.y;
        
        // Draw boat as a simple shape
        renderer.save();
        
        // Draw boat body (dark brown)
        const boatLength = 30;
        const boatWidth = 15;
        
        renderer.ctx.translate(screenX, screenY);
        renderer.ctx.rotate(this.direction);
        
        // Boat hull
        renderer.ctx.fillStyle = '#5d4037';
        renderer.ctx.beginPath();
        renderer.ctx.moveTo(boatLength / 2, 0);
        renderer.ctx.lineTo(-boatLength / 2, -boatWidth / 2);
        renderer.ctx.lineTo(-boatLength / 2, boatWidth / 2);
        renderer.ctx.closePath();
        renderer.ctx.fill();
        
        // Boat outline
        renderer.ctx.strokeStyle = '#3e2723';
        renderer.ctx.lineWidth = 2;
        renderer.ctx.stroke();
        
        // Mast
        renderer.ctx.strokeStyle = '#8d6e63';
        renderer.ctx.lineWidth = 3;
        renderer.ctx.beginPath();
        renderer.ctx.moveTo(0, 0);
        renderer.ctx.lineTo(0, -20);
        renderer.ctx.stroke();
        
        // Sail
        renderer.ctx.fillStyle = '#f5f5f5';
        renderer.ctx.beginPath();
        renderer.ctx.moveTo(0, -20);
        renderer.ctx.lineTo(15, -10);
        renderer.ctx.lineTo(0, 0);
        renderer.ctx.closePath();
        renderer.ctx.fill();
        
        renderer.restore();
    }
    
    /**
     * Override move to only allow water tiles
     */
    move(dx, dy, world) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Check if new position is water
        const tile = world.getTile(Math.floor(newX), Math.floor(newY));
        if (tile && tile.isWater()) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        
        return false;
    }
}
