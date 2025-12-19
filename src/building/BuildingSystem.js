/**
 * Building System
 * Manages building placement and construction
 */
class BuildingSystem {
    constructor(world, audioManager = null, assetLoader = null) {
        this.world = world;
        this.audioManager = audioManager;
        this.assetLoader = assetLoader;
        this.buildMode = false;
        this.selectedBuildingType = Building.TYPES.HOUSE;
        this.previewTile = null;
    }
    
    /**
     * Toggle build mode
     */
    toggleBuildMode() {
        this.buildMode = !this.buildMode;
        return this.buildMode;
    }
    
    /**
     * Set building type to place
     */
    setBuildingType(type) {
        this.selectedBuildingType = type;
    }
    
    /**
     * Update preview based on mouse position
     */
    updatePreview(mouseX, mouseY, camera) {
        if (!this.buildMode) {
            this.previewTile = null;
            return;
        }
        
        const tile = this.world.getTileAtScreen(mouseX, mouseY, camera);
        this.previewTile = tile;
    }
    
    /**
     * Check if building can be placed at tile
     */
    canPlaceBuilding(tile) {
        if (!tile) return false;
        if (!tile.isWalkable()) return false;
        if (tile.building) return false;
        
        // Check if it's a valid building location
        const buildingWidth = this.selectedBuildingType.width;
        const buildingHeight = this.selectedBuildingType.height;
        
        // Check all tiles that building will occupy
        for (let dy = 0; dy < buildingHeight; dy++) {
            for (let dx = 0; dx < buildingWidth; dx++) {
                const checkTile = this.world.getTile(tile.x + dx, tile.y + dy);
                if (!checkTile || !checkTile.isWalkable() || checkTile.building) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Place building at tile
     */
    placeBuilding(tile) {
        if (!this.canPlaceBuilding(tile)) {
            // Play error sound if available
            if (this.audioManager) {
                this.audioManager.playSfx('sfx_womp', 0.5);
            }
            return false;
        }
        
        const building = new Building(tile.x, tile.y, this.selectedBuildingType, this.assetLoader);
        
        // Occupy all tiles
        const buildingWidth = this.selectedBuildingType.width;
        const buildingHeight = this.selectedBuildingType.height;
        
        for (let dy = 0; dy < buildingHeight; dy++) {
            for (let dx = 0; dx < buildingWidth; dx++) {
                const occupyTile = this.world.getTile(tile.x + dx, tile.y + dy);
                if (occupyTile) {
                    occupyTile.setBuilding(building);
                }
            }
        }
        
        // Play placement sound if available
        if (this.audioManager) {
            this.audioManager.playSfx('sfx_badadadink', 0.7);
        }
        
        return true;
    }
    
    /**
     * Attempt to place building at mouse position
     */
    tryPlaceBuilding(mouseX, mouseY, camera) {
        if (!this.buildMode) return false;
        
        const tile = this.world.getTileAtScreen(mouseX, mouseY, camera);
        return this.placeBuilding(tile);
    }
    
    /**
     * Render building preview
     */
    renderPreview(renderer, camera, isometricRenderer) {
        if (!this.buildMode || !this.previewTile) return;
        
        const canPlace = this.canPlaceBuilding(this.previewTile);
        const color = canPlace ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
        
        const screenPos = IsometricUtils.tileToScreen(
            this.previewTile.x,
            this.previewTile.y,
            64,
            32
        );
        
        // Draw preview cube
        renderer.save();
        renderer.setAlpha(0.5);
        
        isometricRenderer.drawIsometricCube(
            screenPos.x,
            screenPos.y,
            64,
            32,
            this.selectedBuildingType.buildHeight,
            color,
            color,
            color,
            camera
        );
        
        renderer.restore();
        
        // Draw outline
        isometricRenderer.drawIsometricTileOutline(
            screenPos.x,
            screenPos.y,
            64,
            32,
            canPlace ? '#00ff00' : '#ff0000',
            camera,
            2
        );
    }
}
