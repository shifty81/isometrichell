/**
 * Time Management System
 * Tracks delta time, total time, and time scaling
 */
class Time {
    constructor() {
        this.deltaTime = 0;
        this.totalTime = 0;
        this.timeScale = 1.0;
    }
    
    /**
     * Update time values
     */
    update(deltaTime) {
        this.deltaTime = deltaTime * this.timeScale;
        this.totalTime += this.deltaTime;
    }
    
    /**
     * Get delta time (time since last frame)
     */
    getDeltaTime() {
        return this.deltaTime;
    }
    
    /**
     * Get total elapsed time
     */
    getTotalTime() {
        return this.totalTime;
    }
    
    /**
     * Set time scale (for slow motion, fast forward, etc.)
     */
    setTimeScale(scale) {
        this.timeScale = Math.max(0, scale);
    }
    
    /**
     * Get current time scale
     */
    getTimeScale() {
        return this.timeScale;
    }
}
