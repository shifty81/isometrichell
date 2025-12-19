#ifndef BUILDING_H
#define BUILDING_H

#include <glm/glm.hpp>
#include <string>

/**
 * Building Types
 */
enum class BuildingType {
    HOUSE,
    TOWER,
    WAREHOUSE
};

/**
 * Building Class
 * Represents a building that can be placed in the world
 */
class Building {
public:
    Building(int x, int y, BuildingType type);
    
    // Getters
    int getX() const { return x; }
    int getY() const { return y; }
    BuildingType getType() const { return type; }
    int getWidth() const { return width; }
    int getHeight() const { return height; }
    float getBuildHeight() const { return buildHeight; }
    
    // Get colors for rendering
    glm::vec4 getTopColor() const { return topColor; }
    glm::vec4 getLeftColor() const { return leftColor; }
    glm::vec4 getRightColor() const { return rightColor; }
    
    // Get building type name
    std::string getTypeName() const;
    
private:
    int x, y;
    BuildingType type;
    int width;
    int height;
    float buildHeight;
    glm::vec4 topColor;
    glm::vec4 leftColor;
    glm::vec4 rightColor;
    
    // Initialize building properties based on type
    void initializeFromType();
};

#endif // BUILDING_H
