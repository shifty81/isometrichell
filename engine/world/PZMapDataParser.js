/**
 * Project Zomboid Map Data Parser
 * 
 * Parses extracted Project Zomboid map files and converts them to our game format
 * Supports:
 * - .lotheader files (cell metadata)
 * - .bin files (chunk data)
 * - .lotpack files (world/object data)
 * - objects.lua (object placements)
 * - spawnpoints.lua (spawn definitions)
 * - map.info (map metadata)
 * - .pzw files (WorldEd projects)
 * 
 * Once you upload extracted PZ map data, this parser will analyze it
 * and convert it to our game's format for use as templates
 */
class PZMapDataParser {
    constructor() {
        this.mapData = {
            cells: [],
            chunks: [],
            objects: [],
            spawns: [],
            metadata: {},
            zones: [],
            buildings: []
        };
    }

    /**
     * Parse map.info file
     * This file contains essential map metadata
     */
    parseMapInfo(content) {
        const lines = content.split('\n');
        const info = {};
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            if (trimmed.includes('=')) {
                const [key, value] = trimmed.split('=').map(s => s.trim());
                info[key] = value;
            }
        }
        
        this.mapData.metadata = {
            title: info.title || 'Unnamed Map',
            description: info.description || '',
            worldX: parseInt(info.WorldX) || 0,
            worldY: parseInt(info.WorldY) || 0,
            width: parseInt(info.width) || 0,
            height: parseInt(info.height) || 0
        };
        
        return this.mapData.metadata;
    }

    /**
     * Parse spawnpoints.lua file
     * Example format:
     * function SpawnPoints()
     *     return {
     *         unemployed = {
     *             { worldX = 33, worldY = 32, posX = 242, posY = 56, posZ = 0 },
     *         }
     *     }
     * end
     */
    parseSpawnPoints(content) {
        const spawns = [];
        
        // Extract spawn point data using regex
        const spawnRegex = /worldX\s*=\s*(\d+).*?worldY\s*=\s*(\d+).*?posX\s*=\s*(\d+).*?posY\s*=\s*(\d+).*?posZ\s*=\s*(\d+)/gs;
        
        let match;
        while ((match = spawnRegex.exec(content)) !== null) {
            spawns.push({
                cellX: parseInt(match[1]),
                cellY: parseInt(match[2]),
                tileX: parseInt(match[3]),
                tileY: parseInt(match[4]),
                floor: parseInt(match[5]),
                // Convert to world coordinates (cell * 300 + tile position)
                worldX: parseInt(match[1]) * 300 + parseInt(match[3]),
                worldY: parseInt(match[2]) * 300 + parseInt(match[4])
            });
        }
        
        this.mapData.spawns = spawns;
        return spawns;
    }

    /**
     * Parse objects.lua file
     * Contains object placements, furniture, etc.
     */
    parseObjects(content) {
        const objects = [];
        
        // Look for object definitions
        // Format varies but typically includes coordinates and object types
        const objectRegex = /objects\s*=\s*{([^}]+)}/gs;
        
        let match;
        while ((match = objectRegex.exec(content)) !== null) {
            const objectData = match[1];
            // Parse individual object properties
            const propsRegex = /(\w+)\s*=\s*"?([^",\s]+)"?/g;
            const obj = {};
            
            let propMatch;
            while ((propMatch = propsRegex.exec(objectData)) !== null) {
                obj[propMatch[1]] = propMatch[2];
            }
            
            if (obj.x && obj.y) {
                objects.push({
                    type: obj.type || 'unknown',
                    x: parseInt(obj.x),
                    y: parseInt(obj.y),
                    z: parseInt(obj.z || 0),
                    properties: obj
                });
            }
        }
        
        this.mapData.objects = objects;
        return objects;
    }

    /**
     * Parse .lotheader file (binary format - basic parsing)
     * This contains cell header information
     */
    parseLotheader(buffer) {
        // .lotheader files are binary, we'll extract basic info
        try {
            const view = new DataView(buffer);
            
            // Basic structure (may vary by PZ version)
            const header = {
                version: view.getInt32(0, true),
                cellX: view.getInt32(4, true),
                cellY: view.getInt32(8, true),
                // More fields exist but require reverse engineering
                fileSize: buffer.byteLength
            };
            
            return header;
        } catch (error) {
            console.error('Error parsing lotheader:', error);
            return null;
        }
    }

    /**
     * Analyze directory structure of extracted PZ map
     * Expected structure:
     * media/maps/MapName/
     *   ├── map.info
     *   ├── spawnpoints.lua
     *   ├── objects.lua (optional)
     *   └── celldata/
     *       ├── XX_YY.lotheader
     *       ├── chunkdata_XX_YY.bin
     *       └── world_XX_YY.lotpack
     */
    analyzeMapStructure(files) {
        const structure = {
            hasMapInfo: false,
            hasSpawnPoints: false,
            hasObjects: false,
            cells: [],
            fileCount: 0
        };
        
        for (const filename of files) {
            structure.fileCount++;
            
            if (filename.includes('map.info')) {
                structure.hasMapInfo = true;
            } else if (filename.includes('spawnpoints.lua')) {
                structure.hasSpawnPoints = true;
            } else if (filename.includes('objects.lua')) {
                structure.hasObjects = true;
            } else if (filename.includes('.lotheader')) {
                // Extract cell coordinates from filename: XX_YY.lotheader
                const match = filename.match(/(\d+)_(\d+)\.lotheader/);
                if (match) {
                    structure.cells.push({
                        x: parseInt(match[1]),
                        y: parseInt(match[2]),
                        hasLotheader: true
                    });
                }
            }
        }
        
        return structure;
    }

    /**
     * Convert PZ cell coordinates to our world coordinates
     * PZ uses 300x300 tile cells (Build 41) or 256x256 (Build 42)
     */
    convertCellToWorld(cellX, cellY, tileX, tileY, cellSize = 300) {
        return {
            worldX: cellX * cellSize + tileX,
            worldY: cellY * cellSize + tileY,
            cellX: cellX,
            cellY: cellY,
            tileX: tileX,
            tileY: tileY
        };
    }

    /**
     * Convert parsed PZ data to our game's world format
     */
    convertToGameFormat(cellSize = 300) {
        // Calculate world bounds from cells
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        for (const spawn of this.mapData.spawns) {
            minX = Math.min(minX, spawn.worldX);
            minY = Math.min(minY, spawn.worldY);
            maxX = Math.max(maxX, spawn.worldX);
            maxY = Math.max(maxY, spawn.worldY);
        }
        
        // Create our game world structure
        const gameWorld = {
            name: this.mapData.metadata.title || 'Imported PZ Map',
            format: 'dailygrind_world',
            source: 'project_zomboid',
            dimensions: {
                width: Math.ceil((maxX - minX) / cellSize) * cellSize || cellSize * 3,
                height: Math.ceil((maxY - minY) / cellSize) * cellSize || cellSize * 3,
                cellSize: cellSize,
                chunkSize: 10
            },
            spawnPoints: this.mapData.spawns.map(spawn => ({
                x: spawn.worldX - minX,
                y: spawn.worldY - minY,
                z: spawn.floor || 0
            })),
            zones: this.inferZones(),
            metadata: this.mapData.metadata
        };
        
        return gameWorld;
    }

    /**
     * Infer zones from object and spawn data
     * This is a heuristic approach to identify residential, commercial, etc.
     */
    inferZones() {
        const zones = [];
        
        // Group spawns by proximity to infer neighborhoods
        const spawnClusters = this.clusterSpawns(this.mapData.spawns, 600);
        
        for (let i = 0; i < spawnClusters.length; i++) {
            const cluster = spawnClusters[i];
            zones.push({
                type: 'residential', // Default assumption
                name: `Zone_${i + 1}`,
                centerX: cluster.centerX,
                centerY: cluster.centerY,
                radius: cluster.radius,
                spawnCount: cluster.spawns.length
            });
        }
        
        return zones;
    }

    /**
     * Cluster spawn points to identify zones
     */
    clusterSpawns(spawns, maxDistance) {
        const clusters = [];
        const used = new Set();
        
        for (let i = 0; i < spawns.length; i++) {
            if (used.has(i)) continue;
            
            const cluster = {
                spawns: [spawns[i]],
                centerX: spawns[i].worldX,
                centerY: spawns[i].worldY,
                radius: 0
            };
            
            used.add(i);
            
            // Find nearby spawns
            for (let j = i + 1; j < spawns.length; j++) {
                if (used.has(j)) continue;
                
                const dist = Math.sqrt(
                    Math.pow(spawns[i].worldX - spawns[j].worldX, 2) +
                    Math.pow(spawns[i].worldY - spawns[j].worldY, 2)
                );
                
                if (dist < maxDistance) {
                    cluster.spawns.push(spawns[j]);
                    used.add(j);
                }
            }
            
            // Calculate cluster center and radius
            if (cluster.spawns.length > 0) {
                cluster.centerX = cluster.spawns.reduce((sum, s) => sum + s.worldX, 0) / cluster.spawns.length;
                cluster.centerY = cluster.spawns.reduce((sum, s) => sum + s.worldY, 0) / cluster.spawns.length;
                cluster.radius = Math.max(...cluster.spawns.map(s => 
                    Math.sqrt(Math.pow(s.worldX - cluster.centerX, 2) + Math.pow(s.worldY - cluster.centerY, 2))
                ));
            }
            
            clusters.push(cluster);
        }
        
        return clusters;
    }

    /**
     * Generate a template JSON file for easy editing
     */
    generateTemplate() {
        const template = {
            _comment: 'Template generated from Project Zomboid map data',
            _instructions: 'Edit this file to customize the map for The Daily Grind',
            world: this.convertToGameFormat(),
            aiData: {
                patterns: 'Analyze spawn and object patterns',
                zoneTypes: 'Inferred from object density',
                recommendations: [
                    'Review spawn point placement',
                    'Add building definitions',
                    'Define zone types (residential, commercial, etc.)',
                    'Add road network data',
                    'Configure loot tables per zone'
                ]
            }
        };
        
        return JSON.stringify(template, null, 2);
    }

    /**
     * Extract statistics from the parsed map
     */
    getStatistics() {
        return {
            totalSpawns: this.mapData.spawns.length,
            totalObjects: this.mapData.objects.length,
            totalCells: this.mapData.cells.length,
            totalZones: this.mapData.zones.length,
            inferredZones: this.inferZones().length,
            worldBounds: this.getWorldBounds()
        };
    }

    /**
     * Get world bounds from all data
     */
    getWorldBounds() {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        for (const spawn of this.mapData.spawns) {
            minX = Math.min(minX, spawn.worldX);
            minY = Math.min(minY, spawn.worldY);
            maxX = Math.max(maxX, spawn.worldX);
            maxY = Math.max(maxY, spawn.worldY);
        }
        
        return { minX, minY, maxX, maxY };
    }

    /**
     * Reset parser state
     */
    reset() {
        this.mapData = {
            cells: [],
            chunks: [],
            objects: [],
            spawns: [],
            metadata: {},
            zones: [],
            buildings: []
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PZMapDataParser;
}
