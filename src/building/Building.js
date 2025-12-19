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
            rightColor: '#7a3d0f'
        },
        TOWER: {
            name: 'Tower',
            width: 1,
            height: 1,
            buildHeight: 60,
            topColor: '#696969',
            leftColor: '#505050',
            rightColor: '#5a5a5a'
        },
        WAREHOUSE: {
            name: 'Warehouse',
            width: 2,
            height: 2,
            buildHeight: 30,
            topColor: '#a0522d',
            leftColor: '#8b4513',
            rightColor: '#964b1a'
        }
    };
    
    constructor(x, y, type = Building.TYPES.HOUSE) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.constructed = true;
        this.health = 100;
    }
    
    /**
     * Render building
     */
    render(renderer, camera, isometricRenderer, tileScreenPos) {
        if (!this.constructed) return;
        
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
