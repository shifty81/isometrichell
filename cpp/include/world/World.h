#ifndef WORLD_H
#define WORLD_H

#include <vector>
#include <memory>
#include "Tile.h"
#include "Biome.h"

// Forward declarations
class Renderer;
class IsometricRenderer;
class Camera;
class Texture;

/**
 * World Management
 * Manages the tile-based game world
 */
class World {
public:
    World(int width, int height);
    ~World();
    
    // Initialize world with procedural generation
    void generate();
    
    // Update world
    void update(float deltaTime);
    
    // Render world
    void render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera);
    
    // Get tile at grid position
    Tile* getTile(int x, int y);
    const Tile* getTile(int x, int y) const;
    
    // Check if position is within world bounds
    bool isValidPosition(int x, int y) const;
    
    // Get world dimensions
    int getWidth() const { return width; }
    int getHeight() const { return height; }
    
    // Load world from scene file
    bool loadFromFile(const char* filename);
    
    // Save world to scene file
    bool saveToFile(const char* filename) const;
    
private:
    int width;
    int height;
    std::vector<std::vector<std::unique_ptr<Tile>>> tiles;
    std::vector<std::vector<std::unique_ptr<Biome>>> biomeMap;
    
    // Generate biome map
    void generateBiomeMap();
    
    // Generate terrain
    void generateTerrain();
    
    // Generate decorations (trees, rocks, bushes)
    void generateDecorations();
};

#endif // WORLD_H
