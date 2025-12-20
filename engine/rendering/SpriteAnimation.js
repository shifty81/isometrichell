/**
 * SpriteAnimation Class
 * Manages sprite-based character animations
 */
class SpriteAnimation {
    constructor(assetLoader) {
        this.assetLoader = assetLoader;
        this.animations = new Map(); // name -> { frames: [], fps: number }
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.isPlaying = false;
        this.loop = true;
    }
    
    /**
     * Register an animation
     * @param {string} name - Animation name
     * @param {string[]} frameNames - Array of asset names for each frame
     * @param {number} fps - Frames per second
     */
    registerAnimation(name, frameNames, fps = 10) {
        this.animations.set(name, {
            frames: frameNames,
            fps: fps,
            frameDuration: 1 / fps
        });
    }
    
    /**
     * Play an animation
     * @param {string} name - Animation name
     * @param {boolean} restart - Force restart if already playing
     */
    play(name, restart = false) {
        if (!this.animations.has(name)) {
            console.warn(`Animation '${name}' not found`);
            return;
        }
        
        // Don't restart if already playing this animation
        if (this.currentAnimation === name && !restart) {
            return;
        }
        
        this.currentAnimation = name;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.isPlaying = true;
    }
    
    /**
     * Update animation
     * @param {number} deltaTime - Time elapsed since last update
     */
    update(deltaTime) {
        if (!this.isPlaying || !this.currentAnimation) {
            return;
        }
        
        const animation = this.animations.get(this.currentAnimation);
        if (!animation) return;
        
        this.frameTime += deltaTime;
        
        // Cap frame advances to prevent performance issues with large deltaTime
        const maxFrameAdvances = 5;
        let frameAdvances = 0;
        
        // Check if we need to advance to next frame
        while (this.frameTime >= animation.frameDuration && frameAdvances < maxFrameAdvances) {
            this.frameTime -= animation.frameDuration;
            this.currentFrame++;
            frameAdvances++;
            
            // Handle animation end
            if (this.currentFrame >= animation.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = animation.frames.length - 1;
                    this.isPlaying = false;
                    break;
                }
            }
        }
        
        // If we hit the limit, jump to appropriate frame instead
        if (frameAdvances >= maxFrameAdvances && this.frameTime >= animation.frameDuration) {
            const skippedFrames = Math.floor(this.frameTime / animation.frameDuration);
            this.currentFrame = (this.currentFrame + skippedFrames) % animation.frames.length;
            this.frameTime = 0;
        }
    }
    
    /**
     * Get current frame image
     * @returns {Image|null}
     */
    getCurrentFrame() {
        if (!this.currentAnimation) {
            return null;
        }
        
        const animation = this.animations.get(this.currentAnimation);
        if (!animation || this.currentFrame >= animation.frames.length) {
            return null;
        }
        
        const frameName = animation.frames[this.currentFrame];
        return this.assetLoader.getImage(frameName);
    }
    
    /**
     * Stop current animation
     */
    stop() {
        this.isPlaying = false;
    }
    
    /**
     * Reset current animation to first frame
     */
    reset() {
        this.currentFrame = 0;
        this.frameTime = 0;
    }
    
    /**
     * Set whether animation should loop
     */
    setLoop(loop) {
        this.loop = loop;
    }
}
