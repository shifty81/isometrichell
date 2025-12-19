/**
 * Main Entry Point
 * Initialize and start the game
 */

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
    // Get canvas
    const canvas = document.getElementById('gameCanvas');
    
    // Create engine
    const engine = new Engine(canvas);
    
    // Create game
    const game = new Game(engine);
    
    // Add game as a scene
    engine.addScene('main', game);
    engine.setScene('main');
    
    // Start engine
    engine.start();
    
    // Log startup
    console.log('🎮 Isometric Hell - Game Engine Started');
    console.log('📦 World Size: 30x30 tiles');
    console.log('🚢 Boats spawned on water');
    console.log('🏗️  Building system ready');
    console.log('');
    console.log('Controls:');
    console.log('  WASD/Arrows - Move camera');
    console.log('  B - Toggle building mode');
    console.log('  1/2/3 - Select building type (in build mode)');
    console.log('  Left Click - Place building');
    console.log('  Space - Spawn boat on water');
});
