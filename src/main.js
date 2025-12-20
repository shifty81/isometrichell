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

// Loading tips to display
const loadingTips = [
    "Tip: Press E to toggle the asset editor while playing",
    "Tip: Use WASD to move your character around the world",
    "Tip: Press B to enter building mode and create structures",
    "Tip: Click on trees and rocks to gather resources",
    "Tip: You can adjust music and SFX volumes in the audio panel",
    "Tip: The world is procedurally generated with varied biomes",
    "Tip: Buildings require clear, walkable tiles to be placed",
    "Tip: Watch your survival stats - hunger, thirst, and energy matter!"
];

// Update loading screen with progress
function updateLoadingScreen(progress, text = 'Loading assets...') {
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingText = document.getElementById('loadingText');
    const loadingTip = document.getElementById('loadingTip');
    
    if (loadingBar) {
        loadingBar.style.width = `${progress * 100}%`;
    }
    
    if (loadingPercentage) {
        loadingPercentage.textContent = `${Math.floor(progress * 100)}%`;
    }
    
    if (loadingText) {
        loadingText.textContent = text;
    }
    
    // Rotate tips based on progress
    if (loadingTip && progress > 0) {
        const tipIndex = Math.floor((progress * loadingTips.length)) % loadingTips.length;
        loadingTip.textContent = loadingTips[tipIndex];
    }
}

// Hide loading screen with fade out effect
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 The Daily Grind - Life Simulation Game - Starting...');
    
    // Get canvas
    const canvas = document.getElementById('gameCanvas');
    
    // Show initial loading state
    updateLoadingScreen(0, 'Initializing...');
    
    try {
        // Create and load assets
        const assetLoader = new AssetLoader();
        
        // Update progress periodically with smooth animation
        const progressInterval = setInterval(() => {
            const progress = assetLoader.getProgress();
            let loadingText = 'Loading assets...';
            
            // Provide more specific feedback based on progress
            if (progress < 0.3) {
                loadingText = 'Loading ground tiles...';
            } else if (progress < 0.5) {
                loadingText = 'Loading decorations...';
            } else if (progress < 0.7) {
                loadingText = 'Loading characters...';
            } else if (progress < 0.9) {
                loadingText = 'Loading buildings...';
            } else if (progress < 1.0) {
                loadingText = 'Loading audio...';
            } else {
                loadingText = 'Starting game...';
            }
            
            updateLoadingScreen(progress, loadingText);
        }, 50);
        
        await assetLoader.loadAll();
        clearInterval(progressInterval);
        
        // Final update
        updateLoadingScreen(1.0, 'Ready!');
        
        // Short delay to show 100%
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Hide loading screen with fade
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
