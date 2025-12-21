/**
 * PZW (Project Zomboid World) File Format Loader
 * 
 * Loads and parses .pzw world files created by WorldEd
 * The .pzw format is a text-based format used by Project Zomboid's WorldEd
 * 
 * Format Structure:
 * - Version information
 * - Map metadata (name, dimensions)
 * - Cell list (300x300 tile regions in Build 41, 256x256 in Build 42)
 * - Chunk references (10x10 tile blocks)
 * - Building placements
 * - Zone definitions
 * - Spawn points
 */
class PZWLoader {
    constructor() {
        this.version = 0;
        this.mapName = '';
        this.dimensions = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        this.cells = [];
        this.buildings = [];
        this.zones = [];
        this.spawnPoints = [];
        this.metadata = {};
    }

    /**
     * Load and parse a .pzw file
     * @param {string} content - The .pzw file content as text
     * @returns {Object} Parsed world data
     */
    async parse(content) {
        const lines = content.split('\n').map(line => line.trim());
        let currentSection = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Skip empty lines and comments
            if (!line || line.startsWith('#') || line.startsWith('//')) {
                continue;
            }
            
            // Check for section markers
            if (line.includes('{')) {
                currentSection = this.extractSectionName(line);
                continue;
            }
            
            if (line.includes('}')) {
                currentSection = null;
                continue;
            }
            
            // Parse key-value pairs
            if (line.includes('=')) {
                const [key, value] = line.split('=').map(s => s.trim());
                this.parseKeyValue(key, value, currentSection);
            }
        }
        
        return this.toWorldData();
    }

    /**
     * Extract section name from line
     */
    extractSectionName(line) {
        const match = line.match(/(\w+)\s*=/);
        if (match) {
            return match[1];
        }
        return null;
    }

    /**
     * Parse key-value pair based on current section
     */
    parseKeyValue(key, value, section) {
        // Remove quotes and trailing commas
        value = value.replace(/["',]/g, '').trim();
        
        switch(key.toLowerCase()) {
            case 'version':
                this.version = parseInt(value);
                break;
                
            case 'mapname':
            case 'name':
                this.mapName = value;
                break;
                
            case 'dimensions':
                this.parseDimensions(value);
                break;
                
            case 'cell':
                if (section === 'Cells' || section === 'chunks') {
                    this.cells.push(this.parseCell(value));
                }
                break;
                
            case 'building':
                if (section === 'Buildings') {
                    this.buildings.push(this.parseBuilding(value));
                }
                break;
                
            case 'zone':
                if (section === 'Zones') {
                    this.zones.push(this.parseZone(value));
                }
                break;
                
            case 'spawn':
            case 'spawnpoint':
                this.spawnPoints.push(this.parseSpawnPoint(value));
                break;
                
            default:
                // Store unknown metadata
                this.metadata[key] = value;
                break;
        }
    }

    /**
     * Parse dimensions string: "minX,minY,maxX,maxY"
     */
    parseDimensions(value) {
        const parts = value.split(',').map(n => parseInt(n.trim()));
        if (parts.length >= 4) {
            this.dimensions = {
                minX: parts[0],
                minY: parts[1],
                maxX: parts[2],
                maxY: parts[3]
            };
        }
    }

    /**
     * Parse cell reference
     * Format: "cell_X_Y" or "X,Y"
     */
    parseCell(value) {
        if (value.includes('_')) {
            const parts = value.split('_');
            return {
                x: parseInt(parts[parts.length - 2]),
                y: parseInt(parts[parts.length - 1])
            };
        } else if (value.includes(',')) {
            const parts = value.split(',').map(n => parseInt(n.trim()));
            return { x: parts[0], y: parts[1] };
        }
        return null;
    }

    /**
     * Parse building placement
     * Format: "name,x,y" or "name x y"
     */
    parseBuilding(value) {
        const parts = value.split(/[,\s]+/);
        return {
            name: parts[0],
            x: parseInt(parts[1]),
            y: parseInt(parts[2])
        };
    }

    /**
     * Parse zone definition
     * Format: "type,x,y,width,height"
     */
    parseZone(value) {
        const parts = value.split(',').map(s => s.trim());
        return {
            type: parts[0],
            x: parseInt(parts[1]),
            y: parseInt(parts[2]),
            width: parseInt(parts[3]) || 1,
            height: parseInt(parts[4]) || 1
        };
    }

    /**
     * Parse spawn point
     * Format: "x,y" or "x,y,z"
     */
    parseSpawnPoint(value) {
        const parts = value.split(',').map(n => parseFloat(n.trim()));
        return {
            x: parts[0],
            y: parts[1],
            z: parts[2] || 0
        };
    }

    /**
     * Convert parsed data to world format
     */
    toWorldData() {
        const width = this.dimensions.maxX - this.dimensions.minX;
        const height = this.dimensions.maxY - this.dimensions.minY;
        
        return {
            version: this.version,
            name: this.mapName,
            dimensions: {
                width: width,
                height: height,
                minX: this.dimensions.minX,
                minY: this.dimensions.minY,
                maxX: this.dimensions.maxX,
                maxY: this.dimensions.maxY
            },
            cells: this.cells,
            buildings: this.buildings,
            zones: this.zones,
            spawnPoints: this.spawnPoints,
            metadata: this.metadata,
            // Cell size in PZ is 300x300 tiles (Build 41) or 256x256 (Build 42)
            cellSize: 300,
            // Chunk size in PZ is 10x10 tiles
            chunkSize: 10
        };
    }

    /**
     * Load .pzw file from URL
     */
    static async loadFromURL(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load .pzw file: ${response.statusText}`);
            }
            const content = await response.text();
            const loader = new PZWLoader();
            return await loader.parse(content);
        } catch (error) {
            console.error('Error loading .pzw file:', error);
            throw error;
        }
    }

    /**
     * Create a sample .pzw file content
     */
    static createSample(mapName = 'MyWorld', cellsX = 3, cellsY = 3) {
        let content = `# Project Zomboid World File
# Generated by The Daily Grind

Version=2
MapName=${mapName}
Dimensions=0,0,${cellsX * 300},${cellsY * 300}

Cells={
`;
        
        // Add cells
        for (let y = 0; y < cellsY; y++) {
            for (let x = 0; x < cellsX; x++) {
                content += `    cell_${x}_${y},\n`;
            }
        }
        
        content += `}

Buildings={
    house_01, 450, 450,
    shop_01, 750, 450
}

Zones={
    residential, 0, 0, 900, 600,
    commercial, 0, 600, 900, 300
}

SpawnPoints={
    450, 450, 0
}
`;
        
        return content;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PZWLoader;
}
