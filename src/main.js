/**
 * Main Entry Point
 * Initialize and start the game
 */

// Show loading screen
function showLoadingScreen() {
    const ui = document.getElementById('ui');
    ui.innerHTML = '<div style="font-size: 18px; padding: 20px;">Loading assets...</div><div id="loadingProgress">0%</div>';
}

// Hide loading screen and restore UI
function hideLoadingScreen() {
    const ui = document.getElementById('ui');
    ui.innerHTML = `
        <div>FPS: <span id="fps">0</span></div>
        <div>Camera: <span id="camera">0, 0</span></div>
        <div>Mouse: <span id="mouse">0, 0</span></div>
        <div>Mode: <span id="mode">Normal</span></div>
    `;
}

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', async () => {
    // Get canvas
    const canvas = document.getElementById('gameCanvas');
    
    // Show loading screen
    showLoadingScreen();
    
    try {
        // Create and load assets
        const assetLoader = new AssetLoader();
        
        // Update progress periodically
        const progressInterval = setInterval(() => {
            const progress = Math.floor(assetLoader.getProgress() * 100);
            const progressElement = document.getElementById('loadingProgress');
            if (progressElement) {
                progressElement.textContent = `${progress}%`;
            }
        }, 100);
        
        await assetLoader.loadAll();
        clearInterval(progressInterval);
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Create engine
        const engine = new Engine(canvas);
        
        // Create audio manager
        const audioManager = new AudioManager(assetLoader);
        
        // Create game with asset loader and audio manager
        const game = new Game(engine, assetLoader, audioManager);
        
        // Add game as a scene
        engine.addScene('main', game);
        engine.setScene('main');
        
        // Start engine
        engine.start();
        
        // Start background music (with user interaction requirement)
        document.addEventListener('click', () => {
            if (!audioManager.currentMusic) {
                audioManager.playMusic('music');
            }
        }, { once: true });
        
        // Log startup
        console.log('🎮 The Daily Grind - Life Simulation Game');
        console.log('📦 Assets Loaded:', assetLoader.loadProgress, '/', assetLoader.totalAssets);
        console.log('🗺️  World Size: 30x30 tiles');
        console.log('🏗️  Building system ready');
        console.log('');
        console.log('Controls:');
        console.log('  WASD/Arrows - Move camera');
        console.log('  B - Toggle building mode');
        console.log('  1/2/3 - Select building type (in build mode)');
        console.log('  Left Click - Place building');
        console.log('  Space - Spawn boat on water');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('ui').innerHTML = '<div style="color: red;">Failed to load game. Check console for details.</div>';
    }
});
