#include "world/Tile.h"
#include <cstdlib>

Tile::Tile(int x, int y, TileType type)
    : x(x)
    , y(y)
    , type(type)
    , walkable(isTypeWalkable(type))
    , occupied(false)
    , decoration("")
    , resource(false)
    , tileVariation(std::rand() % 10)  // Random variation 0-9
{
}

void Tile::setType(TileType newType) {
    type = newType;
    walkable = isTypeWalkable(newType);
}

glm::vec4 Tile::getColor() const {
    switch (type) {
        case TileType::GRASS: return glm::vec4(0.2f, 0.8f, 0.2f, 1.0f);
        case TileType::WATER: return glm::vec4(0.2f, 0.4f, 0.9f, 1.0f);
        case TileType::SAND:  return glm::vec4(0.9f, 0.8f, 0.5f, 1.0f);
        case TileType::STONE: return glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
        case TileType::DIRT:  return glm::vec4(0.5f, 0.3f, 0.1f, 1.0f);
        case TileType::SNOW:  return glm::vec4(0.9f, 0.9f, 1.0f, 1.0f);
        default:              return glm::vec4(1.0f, 0.0f, 1.0f, 1.0f);
    }
}

std::string Tile::getTypeName() const {
    switch (type) {
        case TileType::GRASS: return "Grass";
        case TileType::WATER: return "Water";
        case TileType::SAND:  return "Sand";
        case TileType::STONE: return "Stone";
        case TileType::DIRT:  return "Dirt";
        case TileType::SNOW:  return "Snow";
        default:              return "Unknown";
    }
}

bool Tile::isTypeWalkable(TileType type) {
    switch (type) {
        case TileType::WATER:
            return false;
        default:
            return true;
    }
}
