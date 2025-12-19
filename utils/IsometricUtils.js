/**
 * Isometric Utilities
 * Helper functions for isometric coordinate conversion and calculations
 */
class IsometricUtils {
    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @param {number} tileWidth - Tile width in pixels
     * @param {number} tileHeight - Tile height in pixels
     * @returns {{x: number, y: number}} Screen coordinates
     */
    static worldToScreen(worldX, worldY, tileWidth, tileHeight) {
        const screenX = (worldX - worldY) * (tileWidth / 2);
        const screenY = (worldX + worldY) * (tileHeight / 2);
        return { x: screenX, y: screenY };
    }
    
    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @param {number} tileWidth - Tile width in pixels
     * @param {number} tileHeight - Tile height in pixels
     * @returns {{x: number, y: number}} World coordinates
     */
    static screenToWorld(screenX, screenY, tileWidth, tileHeight) {
        const worldX = (screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2;
        const worldY = (screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2;
        return { x: worldX, y: worldY };
    }
    
    /**
     * Get the tile coordinates at a screen position
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @param {number} tileWidth - Tile width in pixels
     * @param {number} tileHeight - Tile height in pixels
     * @returns {{x: number, y: number}} Tile coordinates (integers)
     */
    static screenToTile(screenX, screenY, tileWidth, tileHeight) {
        const world = this.screenToWorld(screenX, screenY, tileWidth, tileHeight);
        return {
            x: Math.floor(world.x),
            y: Math.floor(world.y)
        };
    }
    
    /**
     * Get the screen position of a tile's center
     * @param {number} tileX - Tile X coordinate
     * @param {number} tileY - Tile Y coordinate
     * @param {number} tileWidth - Tile width in pixels
     * @param {number} tileHeight - Tile height in pixels
     * @returns {{x: number, y: number}} Screen coordinates
     */
    static tileToScreen(tileX, tileY, tileWidth, tileHeight) {
        return this.worldToScreen(tileX, tileY, tileWidth, tileHeight);
    }
    
    /**
     * Calculate distance between two world points
     * @param {number} x1 - First point X
     * @param {number} y1 - First point Y
     * @param {number} x2 - Second point X
     * @param {number} y2 - Second point Y
     * @returns {number} Distance
     */
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
