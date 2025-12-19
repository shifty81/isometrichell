#include "world/World.h"
#include "rendering/Renderer.h"
#include "rendering/IsometricRenderer.h"
#include "rendering/Camera.h"
#include <iostream>
#include <cstdlib>
#include <ctime>

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
    
    generateTerrain();
    
    std::cout << "World generated: " << width << "x" << height << " tiles" << std::endl;
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

void World::generateTerrain() {
    // Simple procedural generation
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            // Create some variation in terrain
            int rand_val = std::rand() % 100;
            
            TileType type = TileType::GRASS;
            
            if (rand_val < 10) {
                type = TileType::WATER;
            } else if (rand_val < 20) {
                type = TileType::SAND;
            } else if (rand_val < 25) {
                type = TileType::DIRT;
            } else if (rand_val < 28) {
                type = TileType::STONE;
            }
            
            tiles[y][x]->setType(type);
        }
    }
}
