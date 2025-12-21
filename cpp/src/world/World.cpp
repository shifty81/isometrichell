#include "world/World.h"
#include "world/Biome.h"
#include "rendering/Renderer.h"
#include "rendering/IsometricRenderer.h"
#include "rendering/Camera.h"
#include "utils/NoiseGenerator.h"
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <sstream>

World::World(int width, int height)
    : width(width)
    , height(height)
    , noiseGen(std::make_unique<NoiseGenerator>(static_cast<uint32_t>(std::time(nullptr))))
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
    (void)deltaTime; // Unused - reserved for future weather/day-night cycle
    // World update logic (future: weather, day/night cycle, etc.)
}

void World::render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera) {
    (void)renderer; // Unused - using isoRenderer for rendering
    (void)camera; // Unused - camera handled by renderer
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
    // Create biome map using noise-based temperature and moisture
    biomeMap.resize(height);
    
    const float scale = 0.05f; // Scale for noise (larger = bigger biomes)
    
    for (int y = 0; y < height; ++y) {
        biomeMap[y].resize(width);
        for (int x = 0; x < width; ++x) {
            // Generate temperature and moisture using different noise octaves
            float temperature = noiseGen->fractalNoise2D(x * scale, y * scale, 4, 0.5f);
            float moisture = noiseGen->fractalNoise2D(x * scale + 1000.0f, y * scale + 1000.0f, 4, 0.5f);
            
            // Determine biome based on temperature and moisture
            BiomeType biomeType = getBiomeFromNoise(temperature, moisture);
            biomeMap[y][x] = std::make_unique<Biome>(biomeType);
        }
    }
}

BiomeType World::getBiomeFromNoise(float temperature, float moisture) const {
    // Map temperature and moisture to biomes
    // Temperature: 0.0 (cold) -> 1.0 (hot)
    // Moisture: 0.0 (dry) -> 1.0 (wet)
    
    if (temperature < 0.3f) {
        // Cold regions
        if (moisture > 0.5f) {
            return BiomeType::WETLANDS; // Cold and wet
        } else {
            return BiomeType::MOUNTAINS; // Cold and dry
        }
    } else if (temperature < 0.6f) {
        // Temperate regions
        if (moisture > 0.6f) {
            return BiomeType::FOREST; // Temperate and wet
        } else if (moisture > 0.3f) {
            return BiomeType::PLAINS; // Temperate and moderate
        } else {
            return BiomeType::DESERT; // Temperate and dry
        }
    } else {
        // Hot regions
        if (moisture > 0.5f) {
            return BiomeType::FOREST; // Hot and wet (tropical)
        } else {
            return BiomeType::DESERT; // Hot and dry
        }
    }
}

void World::generateTerrain() {
    // Generate terrain based on biomes and additional noise
    const float detailScale = 0.15f; // Finer detail for terrain variation
    
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            const Biome* biome = biomeMap[y][x].get();
            
            // Add detail noise for within-biome variation
            float detailNoise = noiseGen->noise2D(x * detailScale, y * detailScale);
            
            TileType tileType;
            
            // Check for water using noise (creates lakes and rivers)
            if (biome->shouldSpawnWater()) {
                // Use noise to create connected water bodies
                float waterNoise = noiseGen->fractalNoise2D(x * 0.08f, y * 0.08f, 3, 0.6f);
                if (waterNoise < 0.35f) {
                    tileType = TileType::WATER;
                } else {
                    // Use biome's primary or secondary tile based on detail noise
                    tileType = (detailNoise < 0.7f) ? biome->getPrimaryTile() : biome->getSecondaryTile();
                }
            } else {
                // Use biome's primary or secondary tile based on detail noise
                tileType = (detailNoise < 0.8f) ? biome->getPrimaryTile() : biome->getSecondaryTile();
            }
            
            tiles[y][x]->setType(tileType);
        }
    }
}

void World::generateDecorations() {
    const int TREE_TYPES = 20;
    const int BUSH_TYPES = 3;
    const int ROCK_TYPES = 2;
    
    // Use different noise frequencies for different decoration types
    const float treeScale = 0.2f;
    const float bushScale = 0.25f;
    const float rockScale = 0.18f;
    
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            Tile* tile = tiles[y][x].get();
            const Biome* biome = biomeMap[y][x].get();
            
            // Skip water tiles (add pond decorations to some)
            if (tile->getType() == TileType::WATER) {
                float pondNoise = noiseGen->noise2D(x * 0.3f, y * 0.3f);
                if (pondNoise > 0.7f) {
                    tile->setDecoration("pond");
                }
                continue;
            }
            
            // Skip non-walkable tiles
            if (!tile->isWalkable()) {
                continue;
            }
            
            // Use noise to create clustered decorations (more realistic)
            float treeNoise = noiseGen->fractalNoise2D(x * treeScale + 500.0f, y * treeScale + 500.0f, 2, 0.4f);
            float bushNoise = noiseGen->fractalNoise2D(x * bushScale + 1500.0f, y * bushScale + 1500.0f, 2, 0.4f);
            float rockNoise = noiseGen->fractalNoise2D(x * rockScale + 2500.0f, y * rockScale + 2500.0f, 2, 0.4f);
            
            // Combine biome probability with noise for natural clustering
            bool shouldPlaceTree = biome->shouldSpawnTree() && (treeNoise > 0.55f);
            bool shouldPlaceBush = biome->shouldSpawnBush() && (bushNoise > 0.6f);
            bool shouldPlaceRock = biome->shouldSpawnRock() && (rockNoise > 0.58f);
            
            // Place decorations (priority: trees > rocks > bushes)
            if (shouldPlaceTree) {
                int treeType = static_cast<int>(treeNoise * TREE_TYPES) % TREE_TYPES;
                std::stringstream ss;
                ss << "tree_" << treeType;
                tile->setDecoration(ss.str());
                tile->setResource(true);
            } else if (shouldPlaceRock) {
                int rockType = (static_cast<int>(rockNoise * ROCK_TYPES) % ROCK_TYPES) + 1;
                std::stringstream ss;
                ss << "rocks_" << rockType;
                tile->setDecoration(ss.str());
                tile->setResource(true);
            } else if (shouldPlaceBush) {
                int bushType = (static_cast<int>(bushNoise * BUSH_TYPES) % BUSH_TYPES) + 1;
                std::stringstream ss;
                ss << "bush_" << bushType;
                tile->setDecoration(ss.str());
            }
        }
    }
}
