/**
 * Portal Editor Tool
 * 
 * In-editor tool for tagging and configuring portals/doors
 * Allows designers to:
 * - Place portal markers on the map
 * - Configure portal properties (target scene, position, etc.)
 * - Set interaction behaviors (knock, key required, etc.)
 * - Define business hours and occupants
 * - Test portal transitions
 */
class PortalEditorTool {
    constructor(game, portalSystem) {
        this.game = game;
        this.portalSystem = portalSystem;
        this.mode = 'select'; // select, place, edit
        this.selectedPortal = null;
        this.placementTemplate = this.getDefaultPortalTemplate();
        this.showPortalMarkers = true;
        this.snapToGrid = true;
    }

    /**
     * Get default portal template
     */
    getDefaultPortalTemplate() {
        return {
            type: 'door',
            width: 32,
            height: 64,
            targetScene: 'interior_house_01',
            targetX: 100,
            targetY: 100,
            targetZ: 0,
            requiresKey: false,
            locked: false,
            canKnock: true,
            buildingType: 'residential',
            occupants: [],
            businessHours: { open: 9, close: 17 },
            label: 'Door',
            icon: '🚪'
        };
    }

    /**
     * Update editor tool
     */
    update(deltaTime) {
        // Update logic here
    }

    /**
     * Handle mouse click
     */
    handleClick(mouseX, mouseY, camera) {
        const worldPos = camera.screenToWorld(mouseX, mouseY);
        
        switch (this.mode) {
            case 'select':
                this.selectPortalAt(worldPos.x, worldPos.y);
                break;
                
            case 'place':
                this.placePortal(worldPos.x, worldPos.y);
                break;
        }
    }

    /**
     * Select portal at position
     */
    selectPortalAt(x, y) {
        const portals = this.portalSystem.getPortals();
        
        for (const portal of portals) {
            const dx = Math.abs(portal.x - x);
            const dy = Math.abs(portal.y - y);
            
            if (dx < portal.width/2 && dy < portal.height/2) {
                this.selectedPortal = portal;
                this.showPortalEditor(portal);
                return true;
            }
        }
        
        this.selectedPortal = null;
        return false;
    }

    /**
     * Place new portal
     */
    placePortal(x, y) {
        if (this.snapToGrid) {
            x = Math.round(x / 32) * 32;
            y = Math.round(y / 32) * 32;
        }
        
        const portalConfig = {
            ...this.placementTemplate,
            x: x,
            y: y,
            z: this.game.player ? this.game.player.z : 0
        };
        
        const portal = this.portalSystem.registerPortal(portalConfig);
        this.selectedPortal = portal;
        this.showPortalEditor(portal);
        
        console.log('Portal placed:', portal);
    }

    /**
     * Show portal editor UI
     */
    showPortalEditor(portal) {
        // This creates the editor UI panel
        const editorHTML = this.generateEditorHTML(portal);
        
        // Create or update editor panel
        let editorPanel = document.getElementById('portal-editor-panel');
        if (!editorPanel) {
            editorPanel = document.createElement('div');
            editorPanel.id = 'portal-editor-panel';
            editorPanel.style.cssText = `
                position: fixed;
                right: 20px;
                top: 100px;
                width: 350px;
                max-height: 80vh;
                overflow-y: auto;
                background: rgba(30, 30, 40, 0.95);
                border: 2px solid #4a9eff;
                border-radius: 8px;
                padding: 15px;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 1000;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            `;
            document.body.appendChild(editorPanel);
        }
        
        editorPanel.innerHTML = editorHTML;
        this.attachEditorEvents(portal);
    }

    /**
     * Generate editor HTML
     */
    generateEditorHTML(portal) {
        return `
            <div style="margin-bottom: 15px; border-bottom: 2px solid #4a9eff; padding-bottom: 10px;">
                <h3 style="margin: 0 0 5px 0; color: #4a9eff;">🔧 Portal Editor</h3>
                <div style="font-size: 12px; color: #aaa;">ID: ${portal.id}</div>
            </div>
            
            <div class="portal-editor-section">
                <h4>Basic Properties</h4>
                
                <label>Label:</label>
                <input type="text" id="portal-label" value="${portal.label}" 
                       style="width: 100%; padding: 5px; margin-bottom: 10px;">
                
                <label>Type:</label>
                <select id="portal-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                    <option value="door" ${portal.type === 'door' ? 'selected' : ''}>Door</option>
                    <option value="stairs" ${portal.type === 'stairs' ? 'selected' : ''}>Stairs</option>
                    <option value="elevator" ${portal.type === 'elevator' ? 'selected' : ''}>Elevator</option>
                    <option value="portal" ${portal.type === 'portal' ? 'selected' : ''}>Portal</option>
                </select>
                
                <label>Icon:</label>
                <select id="portal-icon" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                    <option value="🚪" ${portal.icon === '🚪' ? 'selected' : ''}>🚪 Door</option>
                    <option value="🏠" ${portal.icon === '🏠' ? 'selected' : ''}>🏠 House</option>
                    <option value="🏢" ${portal.icon === '🏢' ? 'selected' : ''}>🏢 Building</option>
                    <option value="🏪" ${portal.icon === '🏪' ? 'selected' : ''}>🏪 Store</option>
                    <option value="🏥" ${portal.icon === '🏥' ? 'selected' : ''}>🏥 Hospital</option>
                    <option value="🔒" ${portal.icon === '🔒' ? 'selected' : ''}>🔒 Locked</option>
                    <option value="⬆️" ${portal.icon === '⬆️' ? 'selected' : ''}>⬆️ Stairs Up</option>
                    <option value="⬇️" ${portal.icon === '⬇️' ? 'selected' : ''}>⬇️ Stairs Down</option>
                </select>
            </div>
            
            <div class="portal-editor-section">
                <h4>Position</h4>
                <label>X: <input type="number" id="portal-x" value="${portal.x}" style="width: 80px;"></label>
                <label>Y: <input type="number" id="portal-y" value="${portal.y}" style="width: 80px;"></label>
                <label>Z: <input type="number" id="portal-z" value="${portal.z}" style="width: 80px;"></label>
            </div>
            
            <div class="portal-editor-section">
                <h4>Target Scene</h4>
                
                <label>Scene Name:</label>
                <input type="text" id="portal-target-scene" value="${portal.targetScene || ''}" 
                       placeholder="interior_house_01"
                       style="width: 100%; padding: 5px; margin-bottom: 10px;">
                
                <label>Spawn Position:</label>
                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <input type="number" id="portal-target-x" value="${portal.targetX}" 
                           placeholder="X" style="flex: 1; padding: 5px;">
                    <input type="number" id="portal-target-y" value="${portal.targetY}" 
                           placeholder="Y" style="flex: 1; padding: 5px;">
                    <input type="number" id="portal-target-z" value="${portal.targetZ}" 
                           placeholder="Z" style="flex: 1; padding: 5px;">
                </div>
                
                <button id="portal-browse-scenes" style="width: 100%; padding: 8px; margin-bottom: 5px;">
                    📁 Browse Scenes
                </button>
                <button id="portal-test-transition" style="width: 100%; padding: 8px;">
                    ▶️ Test Transition
                </button>
            </div>
            
            <div class="portal-editor-section">
                <h4>Access Control</h4>
                
                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                    <input type="checkbox" id="portal-locked" ${portal.locked ? 'checked' : ''}
                           style="margin-right: 10px;">
                    Locked
                </label>
                
                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                    <input type="checkbox" id="portal-requires-key" ${portal.requiresKey ? 'checked' : ''}
                           style="margin-right: 10px;">
                    Requires Key
                </label>
                
                <div id="key-item-section" style="display: ${portal.requiresKey ? 'block' : 'none'};">
                    <label>Key Item ID:</label>
                    <input type="text" id="portal-key-item" value="${portal.keyItemId || ''}" 
                           placeholder="key_house_01"
                           style="width: 100%; padding: 5px; margin-bottom: 10px;">
                </div>
            </div>
            
            <div class="portal-editor-section">
                <h4>Interaction Settings</h4>
                
                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                    <input type="checkbox" id="portal-can-knock" ${portal.canKnock ? 'checked' : ''}
                           style="margin-right: 10px;">
                    Can Knock
                </label>
                
                <label>Building Type:</label>
                <select id="portal-building-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                    <option value="residential" ${portal.buildingType === 'residential' ? 'selected' : ''}>Residential</option>
                    <option value="commercial" ${portal.buildingType === 'commercial' ? 'selected' : ''}>Commercial</option>
                    <option value="industrial" ${portal.buildingType === 'industrial' ? 'selected' : ''}>Industrial</option>
                    <option value="abandoned" ${portal.buildingType === 'abandoned' ? 'selected' : ''}>Abandoned</option>
                </select>
                
                <div id="business-hours-section" style="display: ${portal.buildingType === 'commercial' ? 'block' : 'none'};">
                    <label>Business Hours:</label>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <div style="flex: 1;">
                            <label style="font-size: 12px;">Open:</label>
                            <input type="number" id="portal-open-hour" value="${portal.businessHours.open}" 
                                   min="0" max="23" style="width: 100%; padding: 5px;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 12px;">Close:</label>
                            <input type="number" id="portal-close-hour" value="${portal.businessHours.close}" 
                                   min="0" max="23" style="width: 100%; padding: 5px;">
                        </div>
                    </div>
                </div>
                
                <label>Occupants (comma-separated):</label>
                <input type="text" id="portal-occupants" value="${portal.occupants.join(', ')}" 
                       placeholder="John Smith, Jane Doe"
                       style="width: 100%; padding: 5px; margin-bottom: 10px;">
            </div>
            
            <div class="portal-editor-section">
                <h4>Actions</h4>
                <button id="portal-save" style="width: 100%; padding: 10px; background: #4caf50; 
                        color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;">
                    💾 Save Changes
                </button>
                <button id="portal-duplicate" style="width: 100%; padding: 10px; background: #2196f3; 
                        color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;">
                    📋 Duplicate Portal
                </button>
                <button id="portal-delete" style="width: 100%; padding: 10px; background: #f44336; 
                        color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;">
                    🗑️ Delete Portal
                </button>
                <button id="portal-close-editor" style="width: 100%; padding: 10px; background: #666; 
                        color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ✖️ Close Editor
                </button>
            </div>
            
            <style>
                .portal-editor-section {
                    margin: 15px 0;
                    padding: 10px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 4px;
                }
                .portal-editor-section h4 {
                    margin: 0 0 10px 0;
                    color: #4a9eff;
                    font-size: 14px;
                    border-bottom: 1px solid #4a9eff;
                    padding-bottom: 5px;
                }
                .portal-editor-section label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 12px;
                    color: #ccc;
                }
                .portal-editor-section input[type="text"],
                .portal-editor-section input[type="number"],
                .portal-editor-section select {
                    background: rgba(0,0,0,0.5);
                    border: 1px solid #666;
                    color: white;
                    border-radius: 3px;
                }
                .portal-editor-section button {
                    font-size: 14px;
                    font-weight: bold;
                }
                .portal-editor-section button:hover {
                    opacity: 0.8;
                }
            </style>
        `;
    }

    /**
     * Attach event listeners to editor
     */
    attachEditorEvents(portal) {
        // Save button
        document.getElementById('portal-save')?.addEventListener('click', () => {
            this.savePortalChanges(portal);
        });
        
        // Delete button
        document.getElementById('portal-delete')?.addEventListener('click', () => {
            if (confirm('Delete this portal?')) {
                this.deletePortal(portal);
            }
        });
        
        // Duplicate button
        document.getElementById('portal-duplicate')?.addEventListener('click', () => {
            this.duplicatePortal(portal);
        });
        
        // Close button
        document.getElementById('portal-close-editor')?.addEventListener('click', () => {
            this.closeEditor();
        });
        
        // Test transition
        document.getElementById('portal-test-transition')?.addEventListener('click', () => {
            this.testPortalTransition(portal);
        });
        
        // Browse scenes
        document.getElementById('portal-browse-scenes')?.addEventListener('click', () => {
            this.browseScenes(portal);
        });
        
        // Toggle key requirement
        document.getElementById('portal-requires-key')?.addEventListener('change', (e) => {
            const keySection = document.getElementById('key-item-section');
            if (keySection) {
                keySection.style.display = e.target.checked ? 'block' : 'none';
            }
        });
        
        // Toggle business hours
        document.getElementById('portal-building-type')?.addEventListener('change', (e) => {
            const hoursSection = document.getElementById('business-hours-section');
            if (hoursSection) {
                hoursSection.style.display = e.target.value === 'commercial' ? 'block' : 'none';
            }
        });
    }

    /**
     * Save portal changes
     */
    savePortalChanges(portal) {
        // Update portal properties from form
        portal.label = document.getElementById('portal-label')?.value || portal.label;
        portal.type = document.getElementById('portal-type')?.value || portal.type;
        portal.icon = document.getElementById('portal-icon')?.value || portal.icon;
        
        portal.x = parseFloat(document.getElementById('portal-x')?.value) || portal.x;
        portal.y = parseFloat(document.getElementById('portal-y')?.value) || portal.y;
        portal.z = parseFloat(document.getElementById('portal-z')?.value) || portal.z;
        
        portal.targetScene = document.getElementById('portal-target-scene')?.value || portal.targetScene;
        portal.targetX = parseFloat(document.getElementById('portal-target-x')?.value) || portal.targetX;
        portal.targetY = parseFloat(document.getElementById('portal-target-y')?.value) || portal.targetY;
        portal.targetZ = parseFloat(document.getElementById('portal-target-z')?.value) || portal.targetZ;
        
        portal.locked = document.getElementById('portal-locked')?.checked || false;
        portal.requiresKey = document.getElementById('portal-requires-key')?.checked || false;
        portal.keyItemId = document.getElementById('portal-key-item')?.value || null;
        
        portal.canKnock = document.getElementById('portal-can-knock')?.checked !== false;
        portal.buildingType = document.getElementById('portal-building-type')?.value || 'residential';
        
        portal.businessHours.open = parseInt(document.getElementById('portal-open-hour')?.value) || 9;
        portal.businessHours.close = parseInt(document.getElementById('portal-close-hour')?.value) || 17;
        
        const occupantsText = document.getElementById('portal-occupants')?.value || '';
        portal.occupants = occupantsText.split(',').map(n => n.trim()).filter(n => n.length > 0);
        
        console.log('Portal saved:', portal);
        alert('Portal saved successfully!');
    }

    /**
     * Delete portal
     */
    deletePortal(portal) {
        const portals = this.portalSystem.getPortals();
        const index = portals.indexOf(portal);
        if (index > -1) {
            portals.splice(index, 1);
            this.selectedPortal = null;
            this.closeEditor();
            console.log('Portal deleted');
        }
    }

    /**
     * Duplicate portal
     */
    duplicatePortal(portal) {
        const newPortal = {
            ...portal,
            id: `portal_${Date.now()}`,
            x: portal.x + 50,
            y: portal.y + 50
        };
        
        this.portalSystem.registerPortal(newPortal);
        this.selectedPortal = newPortal;
        this.showPortalEditor(newPortal);
    }

    /**
     * Test portal transition
     */
    testPortalTransition(portal) {
        console.log('Testing portal transition...');
        this.portalSystem.transitionToScene(portal);
    }

    /**
     * Browse available scenes
     */
    browseScenes(portal) {
        // This would show a file browser for scenes
        alert('Scene browser not yet implemented. Enter scene name manually.');
    }

    /**
     * Close editor
     */
    closeEditor() {
        const editorPanel = document.getElementById('portal-editor-panel');
        if (editorPanel) {
            editorPanel.remove();
        }
        this.selectedPortal = null;
    }

    /**
     * Export portals to JSON
     */
    exportPortals() {
        const portals = this.portalSystem.getPortals();
        const data = JSON.stringify(portals, null, 2);
        
        // Download as file
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portals.json';
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('Portals exported');
    }

    /**
     * Import portals from JSON
     */
    importPortals(jsonData) {
        try {
            const portals = JSON.parse(jsonData);
            this.portalSystem.clearPortals();
            
            for (const portalData of portals) {
                this.portalSystem.registerPortal(portalData);
            }
            
            console.log(`Imported ${portals.length} portals`);
        } catch (error) {
            console.error('Error importing portals:', error);
        }
    }

    /**
     * Set editor mode
     */
    setMode(mode) {
        this.mode = mode;
        console.log(`Portal editor mode: ${mode}`);
    }

    /**
     * Render editor overlays
     */
    render(renderer, camera) {
        if (!this.showPortalMarkers) return;
        
        const ctx = renderer.ctx;
        const portals = this.portalSystem.getPortals();
        
        for (const portal of portals) {
            const screenPos = camera.worldToScreen(portal.x, portal.y);
            
            // Draw portal bounds
            ctx.strokeStyle = portal === this.selectedPortal ? '#ffff00' : '#4a9eff';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                screenPos.x - portal.width/2,
                screenPos.y - portal.height/2,
                portal.width,
                portal.height
            );
            
            // Draw ID
            if (portal === this.selectedPortal) {
                ctx.font = '12px Arial';
                ctx.fillStyle = 'yellow';
                ctx.textAlign = 'center';
                ctx.fillText(portal.id, screenPos.x, screenPos.y - portal.height/2 - 10);
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortalEditorTool;
}
