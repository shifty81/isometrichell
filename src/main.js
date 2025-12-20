/**
 * Main Entry Point
 * Initialize and start the game
 */

// Setup audio controls
function setupAudioControls(audioManager) {
    // Master volume slider
    const masterVolume = document.getElementById('masterVolume');
    const masterVolumeValue = document.getElementById('masterVolumeValue');
    
    masterVolume.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audioManager.setMasterVolume(value);
        masterVolumeValue.textContent = `${e.target.value}%`;
    });
    
    // Music volume slider
    const musicVolume = document.getElementById('musicVolume');
    const musicVolumeValue = document.getElementById('musicVolumeValue');
    
    musicVolume.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audioManager.setMusicVolume(value);
        musicVolumeValue.textContent = `${e.target.value}%`;
    });
    
    // SFX volume slider
    const sfxVolume = document.getElementById('sfxVolume');
    const sfxVolumeValue = document.getElementById('sfxVolumeValue');
    
    sfxVolume.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audioManager.setSfxVolume(value);
        sfxVolumeValue.textContent = `${e.target.value}%`;
    });
    
    // Mute music button
    const muteMusicBtn = document.getElementById('muteMusic');
    muteMusicBtn.addEventListener('click', () => {
        audioManager.toggleMusicMute();
        if (audioManager.isMusicMuted) {
            muteMusicBtn.classList.add('muted');
            muteMusicBtn.textContent = '🔇 Unmute Music';
        } else {
            muteMusicBtn.classList.remove('muted');
            muteMusicBtn.textContent = '🎵 Mute Music';
            // Restart music if it was playing
            if (!audioManager.currentMusic) {
                audioManager.playMusic('music');
            }
        }
    });
    
    // Mute SFX button
    const muteSfxBtn = document.getElementById('muteSfx');
    muteSfxBtn.addEventListener('click', () => {
        audioManager.toggleSfxMute();
        if (audioManager.isSfxMuted) {
            muteSfxBtn.classList.add('muted');
            muteSfxBtn.textContent = '🔇 Unmute SFX';
        } else {
            muteSfxBtn.classList.remove('muted');
            muteSfxBtn.textContent = '🔔 Mute SFX';
        }
    });
    
    console.log('🎛️  Audio controls initialized');
}

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
    console.log('🎮 The Daily Grind - Life Simulation Game - Starting...');
    
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
        
        console.log('📦 Assets loaded successfully');
        
        // Create engine
        const engine = new Engine(canvas);
        console.log('⚙️  Engine initialized');
        
        // Create audio manager
        const audioManager = new AudioManager(assetLoader);
        console.log('🔊 Audio manager initialized');
        
        // Create game with asset loader and audio manager
        const game = new Game(engine, assetLoader, audioManager);
        console.log('🎯 Game initialized');
        
        // Add game as a scene
        engine.addScene('main', game);
        engine.setScene('main');
        
        // Start engine
        engine.start();
        console.log('▶️  Engine started');
        
        // Start background music (with user interaction requirement)
        document.addEventListener('click', () => {
            if (!audioManager.currentMusic) {
                audioManager.playMusic('music');
                console.log('🎵 Background music started');
            }
        }, { once: true });
        
        // Setup audio controls
        setupAudioControls(audioManager);
        
        // Log startup summary
        console.log('');
        console.log('✅ Game startup complete!');
        console.log('📦 Assets Loaded:', assetLoader.loadProgress, '/', assetLoader.totalAssets);
        console.log('🗺️  World Size: 50x50 tiles');
        console.log('🏗️  Building system ready');
        console.log('🎨 Asset Editor ready');
        console.log('');
        console.log('Controls:');
        console.log('  WASD/Arrows - Move camera');
        console.log('  E - Toggle Asset Editor');
        console.log('  B - Toggle building mode');
        console.log('  1/2/3 - Select building type (in build mode)');
        console.log('  Left Click - Place building');
        console.log('  Space - Spawn boat on water');
        console.log('');
        console.log('💾 Logs are being captured. Press Ctrl+Shift+L to download logs.');
        
        // Add keyboard shortcut to download logs (Ctrl+Shift+L)
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                if (window.GameLogger) {
                    window.GameLogger.downloadLogs();
                    console.log('📥 Log file downloaded');
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        console.error('Stack trace:', error.stack);
        
        const ui = document.getElementById('ui');
        ui.innerHTML = `
            <div style="color: #ff4444; padding: 20px;">
                <div style="font-size: 16px; margin-bottom: 10px;">❌ Failed to load game</div>
                <div style="font-size: 12px; margin-bottom: 10px;">${error.message}</div>
                <div style="font-size: 10px;">Check browser console for details (F12)</div>
                <div style="font-size: 10px; margin-top: 10px;">
                    <button onclick="window.GameLogger && window.GameLogger.downloadLogs()" 
                            style="padding: 5px 10px; cursor: pointer;">
                        Download Error Log
                    </button>
                </div>
            </div>
        `;
    }
});
