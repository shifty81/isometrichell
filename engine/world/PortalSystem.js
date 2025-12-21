/**
 * Portal System - Scene Transition Manager
 * 
 * Handles transitions between different scenes/maps (outdoor ↔ indoor)
 * Supports:
 * - Door interactions (enter, knock)
 * - Time-based responses (business hours, residential)
 * - NPC presence detection
 * - Tagged portals in editor
 * - Multiple building interiors
 */
class PortalSystem {
    constructor(game) {
        this.game = game;
        this.portals = [];
        this.currentScene = null;
        this.previousScene = null;
        this.nearbyPortal = null;
        this.interactionDistance = 50; // Pixels
    }

    /**
     * Register a portal/door for scene transitions
     * @param {Object} config - Portal configuration
     */
    registerPortal(config) {
        const portal = {
            id: config.id || `portal_${this.portals.length}`,
            type: config.type || 'door', // door, stairs, elevator, etc.
            x: config.x,
            y: config.y,
            z: config.z || 0,
            width: config.width || 32,
            height: config.height || 64,
            
            // Scene transition
            targetScene: config.targetScene,
            targetX: config.targetX || 0,
            targetY: config.targetY || 0,
            targetZ: config.targetZ || 0,
            
            // Return portal (for going back)
            returnPortalId: config.returnPortalId || null,
            
            // Interaction settings
            requiresKey: config.requiresKey || false,
            keyItemId: config.keyItemId || null,
            locked: config.locked || false,
            
            // Knock/answer system
            canKnock: config.canKnock !== false, // Default true
            buildingType: config.buildingType || 'residential', // residential, commercial, industrial
            occupants: config.occupants || [], // List of NPCs who might answer
            
            // Business hours (for commercial buildings)
            businessHours: config.businessHours || {
                open: 9,  // 9 AM
                close: 17 // 5 PM
            },
            
            // Visual/Audio
            label: config.label || 'Door',
            icon: config.icon || '🚪',
            sound: config.sound || 'door_open',
            
            // State
            isOpen: false,
            lastKnockTime: 0,
            
            // Metadata
            metadata: config.metadata || {}
        };
        
        this.portals.push(portal);
        return portal;
    }

    /**
     * Update portal system - check for nearby portals
     */
    update(deltaTime) {
        if (!this.game.player) return;
        
        const player = this.game.player;
        this.nearbyPortal = null;
        
        // Find nearest portal within interaction distance
        let nearestDistance = this.interactionDistance;
        
        for (const portal of this.portals) {
            // Only check portals on current floor
            if (portal.z !== player.z) continue;
            
            const distance = Math.sqrt(
                Math.pow(portal.x - player.x, 2) +
                Math.pow(portal.y - player.y, 2)
            );
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                this.nearbyPortal = portal;
            }
        }
    }

    /**
     * Attempt to use a portal (enter door)
     */
    usePortal(portal = this.nearbyPortal) {
        if (!portal) return false;
        
        // Check if locked
        if (portal.locked) {
            if (portal.requiresKey && !this.hasKey(portal.keyItemId)) {
                this.showMessage("This door is locked. You need a key.");
                return false;
            } else if (portal.requiresKey) {
                this.showMessage("You unlock the door with the key.");
                portal.locked = false;
            } else {
                this.showMessage("This door is locked.");
                return false;
            }
        }
        
        // Perform transition
        this.transitionToScene(portal);
        return true;
    }

    /**
     * Knock on door
     */
    async knockOnDoor(portal = this.nearbyPortal) {
        if (!portal || !portal.canKnock) return false;
        
        // Check if recently knocked
        const timeSinceLastKnock = Date.now() - portal.lastKnockTime;
        if (timeSinceLastKnock < 5000) { // 5 seconds cooldown
            this.showMessage("You just knocked. Wait a moment...");
            return false;
        }
        
        portal.lastKnockTime = Date.now();
        
        // Play knock sound
        this.playSound('door_knock');
        this.showMessage("*knock knock*");
        
        // Determine if someone answers
        const willAnswer = this.checkIfSomeoneAnswers(portal);
        
        // Wait for response
        await this.delay(2000); // 2 second wait
        
        if (willAnswer.answers) {
            this.handleDoorAnswer(portal, willAnswer);
        } else {
            this.showMessage(willAnswer.message);
        }
        
        return willAnswer.answers;
    }

    /**
     * Check if someone will answer the door
     */
    checkIfSomeoneAnswers(portal) {
        const currentTime = this.game.timeSystem ? this.game.timeSystem.getCurrentHour() : 12;
        const isNight = currentTime < 6 || currentTime > 22;
        
        // Commercial buildings
        if (portal.buildingType === 'commercial') {
            const isBusinessHours = currentTime >= portal.businessHours.open && 
                                   currentTime < portal.businessHours.close;
            
            if (isBusinessHours) {
                return {
                    answers: true,
                    message: "Someone calls out: 'Come in, we're open!'",
                    autoOpen: true
                };
            } else {
                return {
                    answers: false,
                    message: "No answer. The business appears to be closed."
                };
            }
        }
        
        // Residential buildings
        if (portal.buildingType === 'residential') {
            // Check if anyone is home
            const hasOccupants = portal.occupants && portal.occupants.length > 0;
            
            if (!hasOccupants) {
                return {
                    answers: false,
                    message: "No answer. Nobody seems to be home."
                };
            }
            
            // Check time of day
            if (isNight) {
                // Lower chance at night
                const chanceToAnswer = Math.random();
                if (chanceToAnswer < 0.3) { // 30% chance
                    return {
                        answers: true,
                        message: "You hear movement inside. Someone peeks through the window.",
                        occupantName: portal.occupants[0]
                    };
                } else {
                    return {
                        answers: false,
                        message: "No answer. They might be asleep or not answering the door at this hour."
                    };
                }
            } else {
                // During day, higher chance
                const chanceToAnswer = Math.random();
                if (chanceToAnswer < 0.7) { // 70% chance
                    return {
                        answers: true,
                        message: `${portal.occupants[0]} opens the door: "Hello, can I help you?"`,
                        occupantName: portal.occupants[0]
                    };
                } else {
                    return {
                        answers: false,
                        message: "No answer. They might be out or busy."
                    };
                }
            }
        }
        
        // Abandoned or other buildings
        return {
            answers: false,
            message: "No answer. The place seems abandoned."
        };
    }

    /**
     * Handle when someone answers the door
     */
    handleDoorAnswer(portal, answerData) {
        if (answerData.autoOpen) {
            // Business is open, automatically enter
            portal.locked = false;
            this.showMessage("The door is unlocked.");
        } else if (answerData.occupantName) {
            // NPC answered, show interaction options
            this.showDoorInteractionMenu(portal, answerData.occupantName);
        }
    }

    /**
     * Show interaction menu when someone answers
     */
    showDoorInteractionMenu(portal, npcName) {
        const options = [
            {
                text: "Ask to come in",
                action: () => this.askToEnter(portal, npcName)
            },
            {
                text: "Just wanted to say hello",
                action: () => this.greetNPC(npcName)
            },
            {
                text: "Never mind",
                action: () => this.showMessage("You politely excuse yourself.")
            }
        ];
        
        // This would integrate with your UI system
        if (this.game.ui) {
            this.game.ui.showChoiceMenu(npcName, options);
        }
    }

    /**
     * Ask NPC permission to enter
     */
    askToEnter(portal, npcName) {
        // Check relationship, time of day, etc.
        const relationship = this.getRelationship(npcName);
        
        if (relationship > 50) {
            this.showMessage(`${npcName}: "Of course! Come on in."`);
            portal.locked = false;
            this.transitionToScene(portal);
        } else if (relationship > 0) {
            this.showMessage(`${npcName}: "Sorry, now's not a good time."`);
        } else {
            this.showMessage(`${npcName}: "I don't know you. Please leave."`);
        }
    }

    /**
     * Greet NPC at door
     */
    greetNPC(npcName) {
        this.showMessage(`You exchange pleasantries with ${npcName}.`);
        // Could increase relationship slightly
    }

    /**
     * Transition to target scene
     */
    transitionToScene(portal) {
        if (!portal.targetScene) {
            console.error('Portal has no target scene:', portal);
            return;
        }
        
        // Save current scene
        this.previousScene = {
            name: this.currentScene,
            playerX: this.game.player.x,
            playerY: this.game.player.y,
            playerZ: this.game.player.z
        };
        
        // Play transition sound
        this.playSound(portal.sound);
        
        // Show transition animation
        this.showTransition(() => {
            // Load new scene
            this.loadScene(portal.targetScene, {
                spawnX: portal.targetX,
                spawnY: portal.targetY,
                spawnZ: portal.targetZ,
                returnPortal: portal.id
            });
        });
    }

    /**
     * Load a scene
     */
    async loadScene(sceneName, options = {}) {
        console.log(`Loading scene: ${sceneName}`);
        
        try {
            // Load scene data
            const sceneData = await this.loadSceneData(sceneName);
            
            // Update game world
            if (this.game.world) {
                this.game.world.loadFromSceneData(sceneData);
            }
            
            // Position player
            if (this.game.player) {
                this.game.player.x = options.spawnX || 0;
                this.game.player.y = options.spawnY || 0;
                this.game.player.z = options.spawnZ || 0;
            }
            
            // Update current scene
            this.currentScene = sceneName;
            
            // Setup return portal if specified
            if (options.returnPortal) {
                this.setupReturnPortal(options.returnPortal);
            }
            
            console.log(`Scene loaded: ${sceneName}`);
            
        } catch (error) {
            console.error('Failed to load scene:', error);
            this.showMessage('Error loading scene!');
        }
    }

    /**
     * Load scene data from file
     */
    async loadSceneData(sceneName) {
        // Try multiple formats
        const formats = ['.tmx', '.pzw', '.json'];
        
        for (const format of formats) {
            try {
                const response = await fetch(`tiled_maps/scenes/${sceneName}${format}`);
                if (response.ok) {
                    const content = await response.text();
                    return this.parseSceneData(content, format);
                }
            } catch (error) {
                continue;
            }
        }
        
        throw new Error(`Scene not found: ${sceneName}`);
    }

    /**
     * Parse scene data based on format
     */
    parseSceneData(content, format) {
        switch (format) {
            case '.tmx':
                // Parse TMX
                const parser = new DOMParser();
                const xml = parser.parseFromString(content, 'text/xml');
                return this.parseTMX(xml);
                
            case '.pzw':
                // Parse PZW
                const pzwLoader = new PZWLoader();
                return pzwLoader.parse(content);
                
            case '.json':
                return JSON.parse(content);
                
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    /**
     * Setup return portal to go back to previous scene
     */
    setupReturnPortal(originalPortalId) {
        // Find the exit door in the current scene
        const exitPortal = this.portals.find(p => p.id === 'exit' || p.returnPortalId === originalPortalId);
        
        if (exitPortal && this.previousScene) {
            exitPortal.targetScene = this.previousScene.name;
            exitPortal.targetX = this.previousScene.playerX;
            exitPortal.targetY = this.previousScene.playerY;
            exitPortal.targetZ = this.previousScene.playerZ;
        }
    }

    /**
     * Show transition animation
     */
    showTransition(callback) {
        // Fade out
        if (this.game.renderer && this.game.renderer.fadeOut) {
            this.game.renderer.fadeOut(500, () => {
                callback();
                // Fade in
                this.game.renderer.fadeIn(500);
            });
        } else {
            callback();
        }
    }

    /**
     * Helper: Check if player has key
     */
    hasKey(keyItemId) {
        if (!this.game.player || !this.game.player.inventory) return false;
        return this.game.player.inventory.hasItem(keyItemId);
    }

    /**
     * Helper: Get relationship with NPC
     */
    getRelationship(npcName) {
        // This would integrate with your relationship system
        if (this.game.relationshipSystem) {
            return this.game.relationshipSystem.getRelationship(npcName);
        }
        return 0; // Neutral
    }

    /**
     * Helper: Show message to player
     */
    showMessage(message) {
        if (this.game.ui) {
            this.game.ui.showMessage(message);
        } else {
            console.log('[Portal]', message);
        }
    }

    /**
     * Helper: Play sound
     */
    playSound(soundId) {
        if (this.game.audioManager) {
            this.game.audioManager.playSound(soundId);
        }
    }

    /**
     * Helper: Delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Render portal indicators
     */
    render(renderer, camera) {
        if (!this.game.player) return;
        
        for (const portal of this.portals) {
            // Only render portals on current floor
            if (portal.z !== this.game.player.z) continue;
            
            // Check if portal is in camera view
            if (!this.isInView(portal, camera)) continue;
            
            // Draw portal indicator
            const screenPos = camera.worldToScreen(portal.x, portal.y);
            
            // Draw door icon
            renderer.ctx.font = '24px Arial';
            renderer.ctx.textAlign = 'center';
            renderer.ctx.fillText(portal.icon, screenPos.x, screenPos.y);
            
            // If player is nearby, show interaction prompt
            if (portal === this.nearbyPortal) {
                this.renderInteractionPrompt(renderer, screenPos, portal);
            }
        }
    }

    /**
     * Render interaction prompt
     */
    renderInteractionPrompt(renderer, screenPos, portal) {
        const ctx = renderer.ctx;
        
        // Draw background
        const promptText = portal.locked ? '[E] Knock  [Space] Try Door' : '[E] Enter';
        ctx.font = '14px Arial';
        const textWidth = ctx.measureText(promptText).width;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(screenPos.x - textWidth/2 - 10, screenPos.y + 20, textWidth + 20, 30);
        
        // Draw text
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(promptText, screenPos.x, screenPos.y + 40);
        
        // Draw label
        ctx.font = '12px Arial';
        ctx.fillStyle = 'yellow';
        ctx.fillText(portal.label, screenPos.x, screenPos.y - 10);
    }

    /**
     * Check if portal is in camera view
     */
    isInView(portal, camera) {
        // Simple bounds check
        return true; // For now, always render
    }

    /**
     * Handle input
     */
    handleInput(key) {
        if (!this.nearbyPortal) return false;
        
        if (key === 'e' || key === 'E' || key === 'Enter') {
            if (this.nearbyPortal.locked) {
                this.knockOnDoor(this.nearbyPortal);
            } else {
                this.usePortal(this.nearbyPortal);
            }
            return true;
        }
        
        if (key === ' ' && this.nearbyPortal.locked) {
            // Try to open locked door
            this.usePortal(this.nearbyPortal);
            return true;
        }
        
        return false;
    }

    /**
     * Get all portals in current scene
     */
    getPortals() {
        return this.portals;
    }

    /**
     * Get portal by ID
     */
    getPortalById(id) {
        return this.portals.find(p => p.id === id);
    }

    /**
     * Clear all portals (when loading new scene)
     */
    clearPortals() {
        this.portals = [];
        this.nearbyPortal = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortalSystem;
}
