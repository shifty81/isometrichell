#include "utils/IsometricUtils.h"
#include <cmath>

namespace IsometricUtils {

glm::vec2 worldToScreen(int worldX, int worldY, int tileWidth, int tileHeight) {
    float screenX = (worldX - worldY) * (tileWidth / 2.0f);
    float screenY = (worldX + worldY) * (tileHeight / 2.0f);
    return glm::vec2(screenX, screenY);
}

glm::ivec2 screenToWorld(float screenX, float screenY, int tileWidth, int tileHeight) {
    float halfTileWidth = tileWidth / 2.0f;
    float halfTileHeight = tileHeight / 2.0f;
    
    int worldX = static_cast<int>(std::round((screenX / halfTileWidth + screenY / halfTileHeight) / 2.0f));
    int worldY = static_cast<int>(std::round((screenY / halfTileHeight - screenX / halfTileWidth) / 2.0f));
    
    return glm::ivec2(worldX, worldY);
}

int getRenderOrder(int gridX, int gridY) {
    // Simple render order: back to front, left to right
    // Higher values render later (on top)
    return gridX + gridY;
}

} // namespace IsometricUtils
