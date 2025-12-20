/**
 * AudioManager Class
 * Manages game audio (music and sound effects)
 */
class AudioManager {
    constructor(assetLoader) {
        this.assetLoader = assetLoader;
        this.currentMusic = null;
        this.ambientSounds = new Map(); // Track ambient sounds by name
        this.musicVolume = 0.5;
        this.sfxVolume = 1.0;
        this.ambientVolume = 0.3;
        this.masterVolume = 1.0;
        this.isMusicMuted = false;
        this.isSfxMuted = false;
        this.isAmbientMuted = false;
    }
    
    /**
     * Play background music
     */
    playMusic(name, loop = true) {
        if (this.isMusicMuted) return;
        
        this.stopMusic();
        
        const music = this.assetLoader.getAudio(name);
        if (music) {
            const musicClone = music.cloneNode();
            musicClone.loop = loop;
            musicClone.volume = this.musicVolume * this.masterVolume;
            musicClone.play().catch(err => {
                console.warn('Failed to play music:', err);
            });
            this.currentMusic = musicClone;
        } else {
            console.warn(`Music '${name}' not found`);
        }
    }
    
    /**
     * Stop current music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    /**
     * Play sound effect
     */
    playSfx(name, volume = 1.0) {
        if (this.isSfxMuted) return;
        
        const sound = this.assetLoader.getAudio(name);
        if (sound) {
            const soundClone = sound.cloneNode();
            soundClone.volume = volume * this.sfxVolume * this.masterVolume;
            soundClone.play().catch(err => {
                console.warn('Failed to play sound:', err);
            });
        } else {
            console.warn(`Sound effect '${name}' not found`);
        }
    }
    
    /**
     * Set music volume (0 to 1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    /**
     * Set SFX volume (0 to 1)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Set ambient volume (0 to 1)
     */
    setAmbientVolume(volume) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        // Update all playing ambient sounds
        this.ambientSounds.forEach(sound => {
            sound.volume = this.ambientVolume * this.masterVolume;
        });
    }
    
    /**
     * Set master volume (0 to 1)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    /**
     * Toggle music mute
     */
    toggleMusicMute() {
        this.isMusicMuted = !this.isMusicMuted;
        if (this.isMusicMuted) {
            this.stopMusic();
        }
    }
    
    /**
     * Toggle SFX mute
     */
    toggleSfxMute() {
        this.isSfxMuted = !this.isSfxMuted;
    }
    
    /**
     * Pause music
     */
    pauseMusic() {
        if (this.currentMusic && !this.currentMusic.paused) {
            this.currentMusic.pause();
        }
    }
    
    /**
     * Resume music
     */
    resumeMusic() {
        if (this.currentMusic && this.currentMusic.paused && !this.isMusicMuted) {
            this.currentMusic.play().catch(err => {
                console.warn('Failed to resume music:', err);
            });
        }
    }
    
    /**
     * Play ambient sound (looping background sound)
     */
    playAmbient(name, volume = 1.0) {
        if (this.isAmbientMuted) return;
        
        // Don't play if already playing
        if (this.ambientSounds.has(name)) {
            return;
        }
        
        const sound = this.assetLoader.getAudio(name);
        if (sound) {
            const soundClone = sound.cloneNode();
            soundClone.loop = true;
            soundClone.volume = volume * this.ambientVolume * this.masterVolume;
            soundClone.play().catch(err => {
                console.warn('Failed to play ambient sound:', err);
            });
            this.ambientSounds.set(name, soundClone);
        } else {
            console.warn(`Ambient sound '${name}' not found`);
        }
    }
    
    /**
     * Stop a specific ambient sound
     */
    stopAmbient(name) {
        const sound = this.ambientSounds.get(name);
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
            this.ambientSounds.delete(name);
        }
    }
    
    /**
     * Stop all ambient sounds
     */
    stopAllAmbient() {
        this.ambientSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.ambientSounds.clear();
    }
    
    /**
     * Toggle ambient sounds mute
     */
    toggleAmbientMute() {
        this.isAmbientMuted = !this.isAmbientMuted;
        if (this.isAmbientMuted) {
            this.ambientSounds.forEach(sound => sound.pause());
        } else {
            this.ambientSounds.forEach(sound => {
                sound.play().catch(err => {
                    console.warn('Failed to resume ambient sound:', err);
                });
            });
        }
    }
}
