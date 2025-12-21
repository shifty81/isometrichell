#include "building/BuildingSystem.h"
#include "world/World.h"
#include "rendering/Renderer.h"
#include "rendering/IsometricRenderer.h"
#include <iostream>

BuildingSystem::BuildingSystem(World* world)
    : world(world)
{
}

void BuildingSystem::update(float deltaTime) {
    // Building system update logic (future: construction progress, etc.)
    (void)deltaTime; // Unused - reserved for future construction progress
}

void BuildingSystem::render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera) {
    (void)renderer; // Unused - using isoRenderer for rendering
    (void)camera; // Unused - camera handled by renderer
    // Render all buildings
    for (const auto& building : buildings) {
        isoRenderer->drawIsometricCube(
            building->getX(),
            building->getY(),
            building->getBuildHeight(),
            building->getTopColor(),
            building->getLeftColor(),
            building->getRightColor()
        );
    }
}

bool BuildingSystem::placeBuilding(int x, int y, BuildingType type) {
    // Check if building can be placed
    if (!canPlaceBuilding(x, y, type)) {
        return false;
    }
    
    // Create building
    auto building = std::make_unique<Building>(x, y, type);
    
    // Mark tiles as occupied
    markTilesOccupied(x, y, building->getWidth(), building->getHeight(), true);
    
    buildings.push_back(std::move(building));
    
    std::cout << "Placed building at (" << x << ", " << y << ")" << std::endl;
    return true;
}

bool BuildingSystem::canPlaceBuilding(int x, int y, BuildingType type) const {
    // Get building dimensions based on type
    int width, height;
    
    switch (type) {
        case BuildingType::HOUSE:
            width = 2; height = 2;
            break;
        case BuildingType::TOWER:
            width = 1; height = 1;
            break;
        case BuildingType::WAREHOUSE:
            width = 3; height = 3;
            break;
        default:
            return false;
    }
    
    return areTilesAvailable(x, y, width, height);
}

Building* BuildingSystem::getBuildingAt(int x, int y) {
    for (auto& building : buildings) {
        int bx = building->getX();
        int by = building->getY();
        int bw = building->getWidth();
        int bh = building->getHeight();
        
        if (x >= bx && x < bx + bw && y >= by && y < by + bh) {
            return building.get();
        }
    }
    return nullptr;
}

bool BuildingSystem::removeBuilding(int x, int y) {
    for (auto it = buildings.begin(); it != buildings.end(); ++it) {
        if ((*it)->getX() == x && (*it)->getY() == y) {
            // Mark tiles as unoccupied
            markTilesOccupied(x, y, (*it)->getWidth(), (*it)->getHeight(), false);
            
            buildings.erase(it);
            std::cout << "Removed building at (" << x << ", " << y << ")" << std::endl;
            return true;
        }
    }
    return false;
}

bool BuildingSystem::areTilesAvailable(int x, int y, int width, int height) const {
    for (int dy = 0; dy < height; ++dy) {
        for (int dx = 0; dx < width; ++dx) {
            const Tile* tile = world->getTile(x + dx, y + dy);
            
            if (!tile) {
                return false; // Out of bounds
            }
            
            if (!tile->isWalkable() || tile->isOccupied()) {
                return false; // Tile not available
            }
        }
    }
    return true;
}

void BuildingSystem::markTilesOccupied(int x, int y, int width, int height, bool occupied) {
    for (int dy = 0; dy < height; ++dy) {
        for (int dx = 0; dx < width; ++dx) {
            Tile* tile = world->getTile(x + dx, y + dy);
            if (tile) {
                tile->setOccupied(occupied);
            }
        }
    }
}
