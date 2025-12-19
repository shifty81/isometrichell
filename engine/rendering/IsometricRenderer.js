/**
 * Isometric Renderer
 * Specialized renderer for isometric graphics
 */
class IsometricRenderer {
    constructor(renderer) {
        this.renderer = renderer;
    }
    
    /**
     * Draw an isometric tile (diamond shape)
     */
    drawIsometricTile(screenX, screenY, tileWidth, tileHeight, color, camera = null) {
        if (camera) {
            screenX -= camera.x;
            screenY -= camera.y;
        }
        
        const ctx = this.renderer.ctx;
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.moveTo(screenX, screenY); // Top
        ctx.lineTo(screenX + tileWidth / 2, screenY + tileHeight / 2); // Right
        ctx.lineTo(screenX, screenY + tileHeight); // Bottom
        ctx.lineTo(screenX - tileWidth / 2, screenY + tileHeight / 2); // Left
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Draw an isometric tile outline
     */
    drawIsometricTileOutline(screenX, screenY, tileWidth, tileHeight, color, camera = null, lineWidth = 1) {
        if (camera) {
            screenX -= camera.x;
            screenY -= camera.y;
        }
        
        const ctx = this.renderer.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(screenX, screenY); // Top
        ctx.lineTo(screenX + tileWidth / 2, screenY + tileHeight / 2); // Right
        ctx.lineTo(screenX, screenY + tileHeight); // Bottom
        ctx.lineTo(screenX - tileWidth / 2, screenY + tileHeight / 2); // Left
        ctx.closePath();
        ctx.stroke();
    }
    
    /**
     * Draw an isometric cube (for buildings)
     */
    drawIsometricCube(screenX, screenY, tileWidth, tileHeight, height, topColor, leftColor, rightColor, camera = null) {
        if (camera) {
            screenX -= camera.x;
            screenY -= camera.y;
        }
        
        const ctx = this.renderer.ctx;
        const halfWidth = tileWidth / 2;
        const halfHeight = tileHeight / 2;
        
        // Top face
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - height);
        ctx.lineTo(screenX + halfWidth, screenY - height + halfHeight);
        ctx.lineTo(screenX, screenY - height + tileHeight);
        ctx.lineTo(screenX - halfWidth, screenY - height + halfHeight);
        ctx.closePath();
        ctx.fill();
        
        // Left face
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(screenX - halfWidth, screenY + halfHeight);
        ctx.lineTo(screenX, screenY + tileHeight);
        ctx.lineTo(screenX, screenY - height + tileHeight);
        ctx.lineTo(screenX - halfWidth, screenY - height + halfHeight);
        ctx.closePath();
        ctx.fill();
        
        // Right face
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(screenX + halfWidth, screenY + halfHeight);
        ctx.lineTo(screenX, screenY + tileHeight);
        ctx.lineTo(screenX, screenY - height + tileHeight);
        ctx.lineTo(screenX + halfWidth, screenY - height + halfHeight);
        ctx.closePath();
        ctx.fill();
    }
}
