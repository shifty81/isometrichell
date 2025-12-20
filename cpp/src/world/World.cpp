#include "world/World.h"
#include "world/Biome.h"
#include "rendering/Renderer.h"
#include "rendering/IsometricRenderer.h"
#include "rendering/Camera.h"
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <sstream>

World::World(int width, int height)
    : width(width)
    , height(height)
{
    // Initialize tiles
    tiles.resize(height);
    for (int y = 0; y < height; ++y) {
        tiles[y].resize(width);
        for (int x = 0; x < width; ++x) {
            tiles[y][x] = std::make_unique<Tile>(x, y, TileType::GRASS);
        }
    }
}

World::~World() {
}

void World::generate() {
    // Seed random number generator
    std::srand(static_cast<unsigned>(std::time(nullptr)));
    
    // Generate biome map first
    generateBiomeMap();
    
    // Generate terrain based on biomes
    generateTerrain();
    
    // Generate decorations
    generateDecorations();
    
    std::cout << "World generated: " << width << "x" << height << " tiles with biomes" << std::endl;
}

void World::update(float deltaTime) {
    // World update logic (future: weather, day/night cycle, etc.)
}

void World::render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera) {
    // Render tiles in isometric order (back to front, left to right)
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            const Tile* tile = getTile(x, y);
            if (tile) {
                isoRenderer->drawIsometricColoredTile(
                    x, y,
                    tile->getColor()
                );
            }
        }
    }
}

Tile* World::getTile(int x, int y) {
    if (!isValidPosition(x, y)) {
        return nullptr;
    }
    return tiles[y][x].get();
}

const Tile* World::getTile(int x, int y) const {
    if (!isValidPosition(x, y)) {
        return nullptr;
    }
    return tiles[y][x].get();
}

bool World::isValidPosition(int x, int y) const {
    return x >= 0 && x < width && y >= 0 && y < height;
}

bool World::loadFromFile(const char* filename) {
    // TODO: Implement JSON loading
    std::cout << "Loading world from: " << filename << std::endl;
    return false;
}

bool World::saveToFile(const char* filename) const {
    // TODO: Implement JSON saving
    std::cout << "Saving world to: " << filename << std::endl;
    return false;
}

void World::generateBiomeMap() {
    // Create biome map with same dimensions as world
    biomeMap.resize(height);
    
    const BiomeType biomeTypes[] = {
        BiomeType::FOREST,
        BiomeType::PLAINS,
        BiomeType::DESERT,
        BiomeType::MOUNTAINS,
        BiomeType::WETLANDS
    };
    const int numBiomeTypes = 5;
    
    for (int y = 0; y < height; ++y) {
        biomeMap[y].resize(width);
        for (int x = 0; x < width; ++x) {
            // Use simple region-based biome assignment (same as JS version)
            int regionX = x / 10;
            int regionY = y / 10;
            int biomeIndex = (regionX + regionY * 3) % numBiomeTypes;
            
            biomeMap[y][x] = std::make_unique<Biome>(biomeTypes[biomeIndex]);
        }
    }
}

void World::generateTerrain() {
    // Generate terrain based on biomes
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            const Biome* biome = biomeMap[y][x].get();
            
            // Check for water first
            TileType tileType;
            if (biome->shouldSpawnWater()) {
                tileType = TileType::WATER;
            } else {
                // Use biome's primary or secondary tile
                float random = static_cast<float>(std::rand()) / RAND_MAX;
                if (random < 0.8f) {
                    tileType = biome->getPrimaryTile();
                } else {
                    tileType = biome->getSecondaryTile();
                }
            }
            
            tiles[y][x]->setType(tileType);
        }
    }
}

void World::generateDecorations() {
    const int TREE_TYPES = 20;  // Match JS version
    const int BUSH_TYPES = 3;
    const int ROCK_TYPES = 2;
    
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            Tile* tile = tiles[y][x].get();
            const Biome* biome = biomeMap[y][x].get();
            
            // Skip water tiles
            if (tile->getType() == TileType::WATER) {
                // Add pond decorations to some water tiles
                if ((std::rand() % 100) < 30) {
                    tile->setDecoration("pond");
                }
                continue;
            }
            
            // Skip non-walkable tiles
            if (!tile->isWalkable()) {
                continue;
            }
            
            // Add trees based on biome
            if (biome->shouldSpawnTree()) {
                int treeType = std::rand() % TREE_TYPES;
                std::stringstream ss;
                ss << "tree_" << treeType;
                tile->setDecoration(ss.str());
                tile->setResource(true);  // Mark as gatherable
            }
            // Add bushes based on biome
            else if (biome->shouldSpawnBush()) {
                int bushType = (std::rand() % BUSH_TYPES) + 1;
                std::stringstream ss;
                ss << "bush_" << bushType;
                tile->setDecoration(ss.str());
            }
            // Add rocks based on biome
            else if (biome->shouldSpawnRock()) {
                int rockType = (std::rand() % ROCK_TYPES) + 1;
                std::stringstream ss;
                ss << "rocks_" << rockType;
                tile->setDecoration(ss.str());
                tile->setResource(true);  // Mark as gatherable
            }
        }
    }
}
