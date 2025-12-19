/**
 * Math Utilities
 * General purpose math helper functions
 */
class MathUtils {
    /**
     * Clamp a value between min and max
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    /**
     * Linear interpolation
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    /**
     * Check if a point is inside a rectangle
     */
    static pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }
    
    /**
     * Generate a random integer between min and max (inclusive)
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Generate a random float between min and max
     */
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * Convert degrees to radians
     */
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    /**
     * Convert radians to degrees
     */
    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }
}
