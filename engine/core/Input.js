/**
 * Input Management System
 * Handles keyboard and mouse input
 */
class Input {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = new Map();
        this.keysPressed = new Set();
        this.keysReleased = new Set();
        
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = new Map();
        this.mouseButtonsPressed = new Set();
        this.mouseButtonsReleased = new Set();
        
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners for input
     */
    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            if (!this.keys.get(e.code)) {
                this.keysPressed.add(e.code);
            }
            this.keys.set(e.code, true);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
            this.keysReleased.add(e.code);
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (!this.mouseButtons.get(e.button)) {
                this.mouseButtonsPressed.add(e.button);
            }
            this.mouseButtons.set(e.button, true);
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouseButtons.set(e.button, false);
            this.mouseButtonsReleased.add(e.button);
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    /**
     * Update input state (called at end of frame)
     */
    update() {
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouseButtonsPressed.clear();
        this.mouseButtonsReleased.clear();
    }
    
    /**
     * Check if a key is currently held down
     */
    isKeyDown(keyCode) {
        return this.keys.get(keyCode) || false;
    }
    
    /**
     * Check if a key was just pressed this frame
     */
    isKeyPressed(keyCode) {
        return this.keysPressed.has(keyCode);
    }
    
    /**
     * Check if a key was just released this frame
     */
    isKeyReleased(keyCode) {
        return this.keysReleased.has(keyCode);
    }
    
    /**
     * Check if a mouse button is currently held down
     */
    isMouseButtonDown(button) {
        return this.mouseButtons.get(button) || false;
    }
    
    /**
     * Check if a mouse button was just pressed this frame
     */
    isMouseButtonPressed(button) {
        return this.mouseButtonsPressed.has(button);
    }
    
    /**
     * Check if a mouse button was just released this frame
     */
    isMouseButtonReleased(button) {
        return this.mouseButtonsReleased.has(button);
    }
    
    /**
     * Get current mouse position
     */
    getMousePosition() {
        return { ...this.mousePosition };
    }
}
