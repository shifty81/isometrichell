#ifndef BIOME_H
#define BIOME_H

#include "Tile.h"
#include <string>

/**
 * Biome Types
 */
enum class BiomeType {
    FOREST,
    PLAINS,
    DESERT,
    MOUNTAINS,
    WETLANDS
};

/**
 * Biome Class
 * Defines different biome types with their characteristics
 */
class Biome {
public:
    Biome(BiomeType type);
    
    // Get tile types for this biome
    TileType getPrimaryTile() const;
    TileType getSecondaryTile() const;
    
    // Spawn probability checks
    bool shouldSpawnTree() const;
    bool shouldSpawnBush() const;
    bool shouldSpawnRock() const;
    bool shouldSpawnWater() const;
    
    // Getters
    BiomeType getType() const { return type; }
    std::string getName() const;
    
private:
    BiomeType type;
    
    // Biome characteristics
    TileType primaryTile;
    TileType secondaryTile;
    float treeChance;
    float bushChance;
    float rockChance;
    float waterChance;
    
    // Initialize biome characteristics based on type
    void initializeCharacteristics();
};

#endif // BIOME_H
