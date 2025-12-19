/**
 * Building Class
 * Represents a building in the game
 */
class Building {
    static TYPES = {
        HOUSE: {
            name: 'House',
            width: 1,
            height: 1,
            buildHeight: 40,
            topColor: '#8b4513',
            leftColor: '#654321',
            rightColor: '#7a3d0f',
            sprite: 'house' // Use house sprite
        },
        TOWER: {
            name: 'Tower',
            width: 1,
            height: 1,
            buildHeight: 60,
            topColor: '#696969',
            leftColor: '#505050',
            rightColor: '#5a5a5a',
            sprite: 'building_iso' // Use iso building sprite
        },
        WAREHOUSE: {
            name: 'Warehouse',
            width: 2,
            height: 2,
            buildHeight: 30,
            topColor: '#a0522d',
            leftColor: '#8b4513',
            rightColor: '#964b1a',
            sprite: 'treehouse' // Use treehouse sprite for warehouse
        }
    };
    
    constructor(x, y, type = Building.TYPES.HOUSE, assetLoader = null) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.constructed = true;
        this.health = 100;
        this.assetLoader = assetLoader;
    }
    
    /**
     * Render building
     */
    render(renderer, camera, isometricRenderer, tileScreenPos) {
        if (!this.constructed) return;
        
        // Try to use sprite if available
        let buildingSprite = null;
        if (this.assetLoader && this.type.sprite) {
            buildingSprite = this.assetLoader.getImage(this.type.sprite);
        }
        
        if (buildingSprite) {
            // Draw building sprite centered on tile
            const spriteX = tileScreenPos.x - buildingSprite.width / 2 - camera.x;
            const spriteY = tileScreenPos.y - buildingSprite.height + 16 - camera.y; // Offset to align with ground
            renderer.drawImage(
                buildingSprite,
                spriteX,
                spriteY,
                buildingSprite.width,
                buildingSprite.height
            );
        } else {
            // Fallback to isometric cube rendering
            isometricRenderer.drawIsometricCube(
                tileScreenPos.x,
                tileScreenPos.y,
                64, // tileWidth
                32, // tileHeight
                this.type.buildHeight,
                this.type.topColor,
                this.type.leftColor,
                this.type.rightColor,
                camera
            );
        }
    }
    
    /**
     * Get building info
     */
    getInfo() {
        return {
            name: this.type.name,
            position: { x: this.x, y: this.y },
            health: this.health
        };
    }
}
