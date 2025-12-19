#ifndef BUILDING_SYSTEM_H
#define BUILDING_SYSTEM_H

#include <vector>
#include <memory>
#include "Building.h"

// Forward declarations
class World;
class Renderer;
class IsometricRenderer;
class Camera;

/**
 * Building System
 * Manages building placement and rendering
 */
class BuildingSystem {
public:
    BuildingSystem(World* world);
    
    // Update buildings
    void update(float deltaTime);
    
    // Render buildings
    void render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera);
    
    // Place a building
    bool placeBuilding(int x, int y, BuildingType type);
    
    // Check if a building can be placed at position
    bool canPlaceBuilding(int x, int y, BuildingType type) const;
    
    // Get building at position
    Building* getBuildingAt(int x, int y);
    
    // Remove building at position
    bool removeBuilding(int x, int y);
    
    // Get all buildings
    const std::vector<std::unique_ptr<Building>>& getBuildings() const { return buildings; }
    
private:
    World* world;
    std::vector<std::unique_ptr<Building>> buildings;
    
    // Check if tiles are available for building placement
    bool areTilesAvailable(int x, int y, int width, int height) const;
    
    // Mark tiles as occupied/unoccupied
    void markTilesOccupied(int x, int y, int width, int height, bool occupied);
};

#endif // BUILDING_SYSTEM_H
