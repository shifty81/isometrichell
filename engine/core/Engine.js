/**
 * Core Game Engine
 * Manages the game loop, update/render cycle, and core systems
 */
class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = false;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsUpdateTime = 0;
        
        // Core systems
        this.time = new Time();
        this.input = new Input(canvas);
        this.renderer = new Renderer(this.ctx, canvas.width, canvas.height);
        this.camera = new Camera(0, 0);
        
        // Game state
        this.scenes = new Map();
        this.currentScene = null;
    }
    
    /**
     * Start the game engine
     */
    start() {
        if (this.running) return;
        
        this.running = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }
    
    /**
     * Stop the game engine
     */
    stop() {
        this.running = false;
    }
    
    /**
     * Main game loop
     */
    gameLoop() {
        if (!this.running) return;
        
        try {
            const currentTime = performance.now();
            const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
            this.lastFrameTime = currentTime;
            
            // Update time
            this.time.update(deltaTime);
            
            // Update FPS counter
            this.frameCount++;
            if (currentTime - this.fpsUpdateTime >= 1000) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.fpsUpdateTime = currentTime;
            }
            
            // Update phase
            this.update(deltaTime);
            
            // Render phase
            this.render();
            
            // Reset input state for next frame
            this.input.update();
            
            // Continue loop
            requestAnimationFrame(() => this.gameLoop());
        } catch (error) {
            console.error('Critical error in game loop:', error);
            console.error('Stack:', error.stack);
            this.stop();
            
            // Display error to user
            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '50%';
            errorDiv.style.left = '50%';
            errorDiv.style.transform = 'translate(-50%, -50%)';
            errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
            errorDiv.style.color = 'white';
            errorDiv.style.padding = '20px';
            errorDiv.style.borderRadius = '10px';
            errorDiv.style.zIndex = '10000';
            errorDiv.style.fontFamily = 'monospace';
            errorDiv.innerHTML = `
                <h3>Game Crashed</h3>
                <p>Error: ${error.message}</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 10px; cursor: pointer;">
                    Reload Game
                </button>
                <button onclick="window.GameLogger && window.GameLogger.downloadLogs()" 
                        style="margin-top: 10px; margin-left: 10px; padding: 10px; cursor: pointer;">
                    Download Error Log
                </button>
            `;
            document.body.appendChild(errorDiv);
        }
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(deltaTime);
        }
    }
    
    /**
     * Render game graphics
     */
    render() {
        // Clear screen
        this.renderer.clear();
        
        if (this.currentScene && this.currentScene.render) {
            this.currentScene.render(this.renderer, this.camera);
        }
    }
    
    /**
     * Add a scene to the engine
     */
    addScene(name, scene) {
        this.scenes.set(name, scene);
    }
    
    /**
     * Switch to a different scene
     */
    setScene(name) {
        const scene = this.scenes.get(name);
        if (scene) {
            if (this.currentScene && this.currentScene.onExit) {
                this.currentScene.onExit();
            }
            
            this.currentScene = scene;
            
            if (this.currentScene.onEnter) {
                this.currentScene.onEnter();
            }
        }
    }
    
    /**
     * Get current FPS
     */
    getFPS() {
        return this.fps;
    }
}
