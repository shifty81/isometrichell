#ifndef ISOMETRIC_UTILS_H
#define ISOMETRIC_UTILS_H

#include <glm/glm.hpp>

/**
 * Isometric Utility Functions
 * Coordinate conversion and isometric math helpers
 */
namespace IsometricUtils {
    
    // Convert world grid coordinates to screen position
    glm::vec2 worldToScreen(int worldX, int worldY, int tileWidth, int tileHeight);
    
    // Convert world float coordinates to screen position (for entities)
    glm::vec2 worldToScreen(float worldX, float worldY, int tileWidth, int tileHeight);
    
    // Convert screen position to world grid coordinates
    glm::ivec2 screenToWorld(float screenX, float screenY, int tileWidth, int tileHeight);
    
    // Calculate rendering order for isometric tiles
    // Returns a value used for depth sorting (back-to-front rendering)
    int getRenderOrder(int gridX, int gridY);
    
} // namespace IsometricUtils

#endif // ISOMETRIC_UTILS_H
