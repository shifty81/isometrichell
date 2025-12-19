/**
 * Base Renderer
 * Handles basic rendering operations
 */
class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    
    /**
     * Clear the canvas
     */
    clear(color = '#2a2a2a') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    /**
     * Draw a rectangle
     */
    drawRect(x, y, width, height, color = '#fff') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
    
    /**
     * Draw a rectangle outline
     */
    drawRectOutline(x, y, width, height, color = '#fff', lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x, y, width, height);
    }
    
    /**
     * Draw a circle
     */
    drawCircle(x, y, radius, color = '#fff') {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Draw a line
     */
    drawLine(x1, y1, x2, y2, color = '#fff', lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    /**
     * Draw text
     */
    drawText(text, x, y, color = '#fff', font = '16px Arial') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }
    
    /**
     * Draw an image
     */
    drawImage(image, x, y, width = null, height = null) {
        if (width !== null && height !== null) {
            this.ctx.drawImage(image, x, y, width, height);
        } else {
            this.ctx.drawImage(image, x, y);
        }
    }
    
    /**
     * Save current rendering context
     */
    save() {
        this.ctx.save();
    }
    
    /**
     * Restore previous rendering context
     */
    restore() {
        this.ctx.restore();
    }
    
    /**
     * Set global alpha
     */
    setAlpha(alpha) {
        this.ctx.globalAlpha = alpha;
    }
}
