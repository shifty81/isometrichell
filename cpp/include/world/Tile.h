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
    
    // Setters
    void setType(TileType type);
    void setOccupied(bool occupied) { this->occupied = occupied; }
    
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
};

#endif // TILE_H
