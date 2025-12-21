#ifndef TILE_H
#define TILE_H

#include <glm/glm.hpp>
#include <string>

/**
 * Tile Types
 */
enum class TileType {
    GRASS,
    WATER,
    SAND,
    STONE,
    DIRT,
    SNOW
};

/**
 * Tile Class
 * Represents a single tile in the game world
 */
class Tile {
public:
    Tile(int x, int y, TileType type);
    
    // Getters
    int getX() const { return x; }
    int getY() const { return y; }
    TileType getType() const { return type; }
    bool isWalkable() const { return walkable; }
    bool isOccupied() const { return occupied; }
    std::string getDecoration() const { return decoration; }
    bool isResource() const { return resource; }
    int getTileVariation() const { return tileVariation; }
    
    // Setters
    void setType(TileType type);
    void setOccupied(bool isOccupied) { this->occupied = isOccupied; }
    void setDecoration(const std::string& deco) { decoration = deco; }
    void setResource(bool res) { resource = res; }
    
    // Get color based on tile type (for rendering without textures)
    glm::vec4 getColor() const;
    
    // Get tile type name
    std::string getTypeName() const;
    
    // Check if tile type is walkable
    static bool isTypeWalkable(TileType type);
    
private:
    int x, y;
    TileType type;
    bool walkable;
    bool occupied;
    std::string decoration;  // e.g., "tree_1", "bush_2", "rocks_1"
    bool resource;           // Whether this decoration can be gathered
    int tileVariation;       // Visual variation (0-9) for tile diversity
};

#endif // TILE_H
