/**
 * AI Data Exporter
 * 
 * Exports game world and systems data in AI-consumable formats
 * Provides structured, machine-readable data for:
 * - AI training and pattern recognition
 * - Procedural generation
 * - Game system understanding
 * - Map analysis and generation
 * 
 * This module creates comprehensive JSON datasets that describe:
 * 1. Map structure (grid-based, tile data, zones)
 * 2. Game mechanics (survival systems, AI behaviors)
 * 3. Entity definitions (players, NPCs, zombies, items)
 * 4. World rules and constraints
 */
class AIDataExporter {
    constructor(world, game) {
        this.world = world;
        this.game = game;
    }

    /**
     * Export complete AI training dataset
     * Returns a comprehensive JSON structure
     */
    exportCompleteDataset() {
        return {
            metadata: this.exportMetadata(),
            worldStructure: this.exportWorldStructure(),
            gameSystems: this.exportGameSystems(),
            tileTypes: this.exportTileTypes(),
            entities: this.exportEntityDefinitions(),
            zones: this.exportZones(),
            behaviors: this.exportBehaviors(),
            rules: this.exportGameRules(),
            patterns: this.exportPatterns()
        };
    }

    /**
     * Export metadata about the dataset
     */
    exportMetadata() {
        return {
            format: 'TheDailyGrind_AI_Dataset',
            version: '1.0.0',
            exported: new Date().toISOString(),
            gameType: 'survival_simulation',
            perspective: 'isometric',
            gridBased: true,
            cellSize: this.world ? this.world.tileWidth : 64,
            description: 'Structured game data for AI training and procedural generation'
        };
    }

    /**
     * Export world structure - grid-based map data
     * This is the core data AI needs for understanding spatial layout
     */
    exportWorldStructure() {
        if (!this.world) return null;

        const structure = {
            dimensions: {
                width: this.world.width,
                height: this.world.height,
                tileWidth: this.world.tileWidth,
                tileHeight: this.world.tileHeight
            },
            cells: [],
            chunks: [],
            coordinateSystem: {
                type: 'isometric',
                origin: 'top-left',
                cellSize: 300, // PZ-style cells
                chunkSize: 10  // PZ-style chunks
            }
        };

        // Export tile grid data
        const tileGrid = [];
        for (let y = 0; y < this.world.height; y++) {
            const row = [];
            for (let x = 0; x < this.world.width; x++) {
                const tile = this.world.getTile(x, y);
                if (tile) {
                    row.push({
                        x: x,
                        y: y,
                        type: tile.type?.name || 'unknown',
                        walkable: tile.type?.walkable || false,
                        biome: tile.biome || null,
                        decoration: tile.decoration || null,
                        building: tile.building || null
                    });
                } else {
                    row.push(null);
                }
            }
            tileGrid.push(row);
        }
        structure.tileGrid = tileGrid;

        // Export cells (300x300 tile regions)
        const cellWidth = Math.ceil(this.world.width / 300);
        const cellHeight = Math.ceil(this.world.height / 300);
        for (let cy = 0; cy < cellHeight; cy++) {
            for (let cx = 0; cx < cellWidth; cx++) {
                structure.cells.push({
                    cellX: cx,
                    cellY: cy,
                    worldX: cx * 300,
                    worldY: cy * 300,
                    width: 300,
                    height: 300
                });
            }
        }

        return structure;
    }

    /**
     * Export game systems - modular rule-based components
     * AI needs to understand how different systems interact
     */
    exportGameSystems() {
        return {
            corePremise: {
                goal: 'survival',
                setting: 'post_apocalyptic',
                threats: ['zombies', 'hunger', 'thirst', 'fatigue', 'illness'],
                permadeath: true,
                worldPersistence: true
            },
            
            playerSystems: {
                survival: {
                    hunger: {
                        range: [0, 100],
                        depletion: 'over_time',
                        effects: ['weakness', 'death'],
                        restoration: ['food']
                    },
                    thirst: {
                        range: [0, 100],
                        depletion: 'over_time',
                        effects: ['weakness', 'death'],
                        restoration: ['water']
                    },
                    fatigue: {
                        range: [0, 100],
                        depletion: 'over_time',
                        effects: ['reduced_performance'],
                        restoration: ['sleep']
                    },
                    health: {
                        range: [0, 100],
                        depletion: ['damage', 'illness'],
                        effects: ['death_at_zero'],
                        restoration: ['medical_items', 'rest']
                    },
                    hygiene: {
                        range: [0, 100],
                        depletion: 'over_time',
                        effects: ['illness_risk'],
                        restoration: ['washing']
                    }
                },
                
                skills: {
                    types: ['carpentry', 'mechanics', 'farming', 'cooking', 'medical', 'combat'],
                    progression: 'practice_based',
                    levels: [0, 10],
                    effects: 'improved_efficiency'
                },
                
                traits: {
                    positive: ['strong', 'athletic', 'organized', 'lucky'],
                    negative: ['weak', 'prone_to_illness', 'clumsy', 'unlucky'],
                    impact: 'starting_stats_and_gameplay'
                },
                
                inventory: {
                    type: 'weight_volume_based',
                    capacity: 'limited_by_strength',
                    organization: 'container_based'
                },
                
                combat: {
                    types: ['melee', 'ranged', 'stealth'],
                    mechanics: ['weapon_durability', 'stamina_cost', 'noise_generation']
                }
            },
            
            worldSystems: {
                time: {
                    dayNightCycle: true,
                    seasons: true,
                    weatherEvents: true,
                    infrastructure: {
                        electricity: 'degrades_over_time',
                        water: 'degrades_over_time'
                    }
                },
                
                aiDirector: {
                    purpose: 'dynamic_difficulty',
                    controls: ['event_frequency', 'zombie_population', 'item_distribution'],
                    events: ['helicopter', 'power_outage', 'hordes']
                },
                
                loot: {
                    distribution: 'location_based',
                    examples: {
                        hospital: ['medical_supplies', 'first_aid'],
                        police_station: ['weapons', 'ammunition'],
                        grocery_store: ['food', 'water'],
                        hardware_store: ['tools', 'construction_materials']
                    },
                    scarcity: 'finite_resources'
                }
            },
            
            zombieSystems: {
                navigation: {
                    pathfinding: 'grid_based',
                    obstacles: 'breakable_player_structures',
                    ignores: 'pre_existing_structures'
                },
                
                behavior: {
                    attraction: ['sound', 'sight', 'smell'],
                    states: ['idle', 'alerted', 'pursuing', 'attacking'],
                    groups: 'form_hordes'
                },
                
                population: {
                    respawn: 'configurable',
                    migration: 'hordes_wander_map',
                    density: 'location_dependent'
                }
            }
        };
    }

    /**
     * Export tile type definitions
     * Essential for AI to understand terrain and placement rules
     */
    exportTileTypes() {
        return {
            terrain: {
                grass: { walkable: true, speed: 1.0, buildable: true, category: 'ground' },
                dirt: { walkable: true, speed: 0.9, buildable: true, category: 'ground' },
                stone: { walkable: true, speed: 1.0, buildable: false, category: 'ground' },
                sand: { walkable: true, speed: 0.8, buildable: true, category: 'ground' },
                water: { walkable: false, speed: 0.0, buildable: false, category: 'water' },
                road: { walkable: true, speed: 1.2, buildable: false, category: 'infrastructure' },
                floor: { walkable: true, speed: 1.0, buildable: false, category: 'interior' }
            },
            
            structures: {
                wall: { walkable: false, blocksVision: true, breakable: true, category: 'building' },
                door: { walkable: true, blocksVision: false, interactable: true, category: 'building' },
                window: { walkable: false, blocksVision: false, breakable: true, category: 'building' },
                fence: { walkable: false, blocksVision: false, breakable: true, category: 'outdoor' }
            },
            
            decorations: {
                tree: { walkable: false, blocksVision: true, resource: 'wood', category: 'vegetation' },
                bush: { walkable: false, blocksVision: false, resource: 'berries', category: 'vegetation' },
                rock: { walkable: false, blocksVision: false, resource: 'stone', category: 'natural' }
            }
        };
    }

    /**
     * Export entity definitions
     */
    exportEntityDefinitions() {
        return {
            player: {
                type: 'humanoid',
                controllable: true,
                attributes: ['health', 'hunger', 'thirst', 'fatigue'],
                skills: 'variable',
                inventory: 'dynamic'
            },
            
            npc: {
                type: 'humanoid',
                controllable: false,
                ai: 'utility_goap_hybrid',
                needs: ['hunger', 'thirst', 'safety', 'social'],
                occupation: 'variable'
            },
            
            zombie: {
                type: 'undead',
                controllable: false,
                ai: 'simple_state_machine',
                states: ['idle', 'roaming', 'investigating', 'pursuing', 'attacking'],
                senses: ['sight', 'hearing', 'smell'],
                behavior: 'aggressive'
            },
            
            items: {
                food: { consumable: true, effect: 'restore_hunger', perishable: true },
                water: { consumable: true, effect: 'restore_thirst', perishable: false },
                weapon: { equippable: true, durability: 'limited', effect: 'combat' },
                tool: { equippable: true, durability: 'limited', effect: 'crafting' },
                medical: { consumable: true, effect: 'restore_health', perishable: true }
            }
        };
    }

    /**
     * Export zone definitions
     * Critical for AI to understand urban planning and resource distribution
     */
    exportZones() {
        return {
            zoneTypes: {
                residential: {
                    density: 'variable',
                    buildings: ['houses', 'apartments'],
                    loot: ['food', 'clothing', 'basic_tools'],
                    zombies: 'medium'
                },
                
                commercial: {
                    density: 'high',
                    buildings: ['shops', 'restaurants', 'offices'],
                    loot: ['food', 'goods', 'cash'],
                    zombies: 'high'
                },
                
                industrial: {
                    density: 'low',
                    buildings: ['warehouses', 'factories'],
                    loot: ['tools', 'materials', 'vehicles'],
                    zombies: 'low'
                },
                
                medical: {
                    density: 'low',
                    buildings: ['hospitals', 'clinics'],
                    loot: ['medical_supplies', 'equipment'],
                    zombies: 'high'
                },
                
                wilderness: {
                    density: 'none',
                    buildings: [],
                    loot: ['natural_resources', 'foraging'],
                    zombies: 'very_low'
                }
            }
        };
    }

    /**
     * Export behavior trees and AI patterns
     */
    exportBehaviors() {
        return {
            zombieBehavior: {
                idle: {
                    conditions: ['no_stimulus'],
                    actions: ['stand', 'wander_short'],
                    transitions: {
                        sound_detected: 'investigating',
                        sight_detected: 'pursuing'
                    }
                },
                
                investigating: {
                    conditions: ['heard_sound'],
                    actions: ['move_to_sound_source', 'look_around'],
                    transitions: {
                        target_found: 'pursuing',
                        nothing_found: 'idle'
                    }
                },
                
                pursuing: {
                    conditions: ['target_visible'],
                    actions: ['pathfind_to_target', 'break_obstacles'],
                    transitions: {
                        target_reached: 'attacking',
                        target_lost: 'investigating'
                    }
                },
                
                attacking: {
                    conditions: ['target_in_range'],
                    actions: ['attack_target'],
                    transitions: {
                        target_dead: 'idle',
                        target_escaped: 'pursuing'
                    }
                }
            },
            
            npcBehavior: {
                prioritySystem: 'utility_based',
                considerations: ['hunger', 'thirst', 'safety', 'social', 'goals'],
                actions: ['eat', 'drink', 'sleep', 'work', 'socialize', 'flee', 'fight']
            }
        };
    }

    /**
     * Export game rules and constraints
     */
    exportGameRules() {
        return {
            physics: {
                gravity: true,
                collision: 'grid_based',
                pathfinding: 'tile_based'
            },
            
            resources: {
                food: 'finite',
                water: 'renewable_with_rain',
                materials: 'finite',
                electricity: 'time_limited'
            },
            
            time: {
                realTimeRatio: 'configurable',
                pausable: true,
                seasons: 'affect_gameplay'
            },
            
            death: {
                permanent: true,
                consequences: 'world_persists'
            }
        };
    }

    /**
     * Export common patterns for AI learning
     */
    exportPatterns() {
        return {
            urbanLayouts: {
                gridPattern: 'rectangular_streets',
                zoning: 'commercial_center_residential_outer',
                density: 'higher_near_center'
            },
            
            buildingPlacements: {
                residential: 'clustered_neighborhoods',
                commercial: 'main_streets',
                industrial: 'outskirts',
                medical: 'accessible_locations'
            },
            
            resourceDistribution: {
                food: 'grocery_stores_restaurants_homes',
                weapons: 'police_stations_gun_stores_rare',
                medical: 'hospitals_pharmacies',
                tools: 'hardware_stores_garages'
            }
        };
    }

    /**
     * Export to JSON file
     */
    exportToJSON() {
        return JSON.stringify(this.exportCompleteDataset(), null, 2);
    }

    /**
     * Export minimal grid data for AI training
     * Compact format for large maps
     */
    exportCompactGrid() {
        if (!this.world) return null;

        const grid = [];
        for (let y = 0; y < this.world.height; y++) {
            const row = [];
            for (let x = 0; x < this.world.width; x++) {
                const tile = this.world.getTile(x, y);
                // Encode tile as single character or number for compactness
                row.push(this.encodeTile(tile));
            }
            grid.push(row.join(''));
        }
        
        return {
            width: this.world.width,
            height: this.world.height,
            encoding: this.getTileEncoding(),
            grid: grid
        };
    }

    /**
     * Encode tile to single character
     */
    encodeTile(tile) {
        if (!tile || !tile.type) return '0';
        
        const encoding = {
            'grass': 'g',
            'dirt': 'd',
            'water': 'w',
            'sand': 's',
            'stone': 'r',
            'road': 'R',
            'floor': 'f'
        };
        
        return encoding[tile.type.name] || '?';
    }

    /**
     * Get tile encoding legend
     */
    getTileEncoding() {
        return {
            '0': 'empty',
            'g': 'grass',
            'd': 'dirt',
            'w': 'water',
            's': 'sand',
            'r': 'stone',
            'R': 'road',
            'f': 'floor',
            '?': 'unknown'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIDataExporter;
}
