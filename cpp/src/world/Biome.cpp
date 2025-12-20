#include "world/Biome.h"
#include <cstdlib>

Biome::Biome(BiomeType type)
    : type(type)
    , primaryTile(TileType::GRASS)
    , secondaryTile(TileType::DIRT)
    , treeChance(0.15f)
    , bushChance(0.10f)
    , rockChance(0.05f)
    , waterChance(0.02f)
{
    initializeCharacteristics();
}

void Biome::initializeCharacteristics() {
    switch (type) {
        case BiomeType::FOREST:
            primaryTile = TileType::GRASS;
            secondaryTile = TileType::DIRT;
            treeChance = 0.25f;
            bushChance = 0.15f;
            rockChance = 0.05f;
            waterChance = 0.05f;
            break;
            
        case BiomeType::PLAINS:
            primaryTile = TileType::GRASS;
            secondaryTile = TileType::DIRT;
            treeChance = 0.08f;
            bushChance = 0.10f;
            rockChance = 0.03f;
            waterChance = 0.02f;
            break;
            
        case BiomeType::DESERT:
            primaryTile = TileType::SAND;
            secondaryTile = TileType::STONE;
            treeChance = 0.02f;
            bushChance = 0.05f;
            rockChance = 0.15f;
            waterChance = 0.01f;
            break;
            
        case BiomeType::MOUNTAINS:
            primaryTile = TileType::STONE;
            secondaryTile = TileType::DIRT;
            treeChance = 0.05f;
            bushChance = 0.05f;
            rockChance = 0.30f;
            waterChance = 0.02f;
            break;
            
        case BiomeType::WETLANDS:
            primaryTile = TileType::GRASS;
            secondaryTile = TileType::WATER;
            treeChance = 0.12f;
            bushChance = 0.20f;
            rockChance = 0.05f;
            waterChance = 0.25f;
            break;
    }
}

TileType Biome::getPrimaryTile() const {
    return primaryTile;
}

TileType Biome::getSecondaryTile() const {
    return secondaryTile;
}

bool Biome::shouldSpawnTree() const {
    return (static_cast<float>(std::rand()) / RAND_MAX) < treeChance;
}

bool Biome::shouldSpawnBush() const {
    return (static_cast<float>(std::rand()) / RAND_MAX) < bushChance;
}

bool Biome::shouldSpawnRock() const {
    return (static_cast<float>(std::rand()) / RAND_MAX) < rockChance;
}

bool Biome::shouldSpawnWater() const {
    return (static_cast<float>(std::rand()) / RAND_MAX) < waterChance;
}

std::string Biome::getName() const {
    switch (type) {
        case BiomeType::FOREST:    return "Forest";
        case BiomeType::PLAINS:    return "Plains";
        case BiomeType::DESERT:    return "Desert";
        case BiomeType::MOUNTAINS: return "Mountains";
        case BiomeType::WETLANDS:  return "Wetlands";
        default:                   return "Unknown";
    }
}
