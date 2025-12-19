#ifndef ISOMETRIC_RENDERER_H
#define ISOMETRIC_RENDERER_H

#include <glm/glm.hpp>
#include "Renderer.h"
#include "Camera.h"

/**
 * Isometric Rendering System
 * Specialized renderer for isometric tile-based graphics
 */
class IsometricRenderer {
public:
    IsometricRenderer(Renderer* renderer, Camera* camera);
    
    // Set tile dimensions
    void setTileSize(int width, int height);
    
    // Get tile dimensions
    int getTileWidth() const { return tileWidth; }
    int getTileHeight() const { return tileHeight; }
    
    // Draw an isometric tile
    void drawIsometricTile(
        int gridX, int gridY,
        const Texture* texture,
        const glm::vec4& color = glm::vec4(1.0f)
    );
    
    // Draw an isometric tile with custom texture coordinates
    void drawIsometricTileWithUV(
        int gridX, int gridY,
        const Texture* texture,
        const glm::vec2& uvMin,
        const glm::vec2& uvMax,
        const glm::vec4& color = glm::vec4(1.0f)
    );
    
    // Draw a colored isometric tile (no texture)
    void drawIsometricColoredTile(
        int gridX, int gridY,
        const glm::vec4& color
    );
    
    // Draw an isometric cube (for buildings)
    void drawIsometricCube(
        int gridX, int gridY,
        float height,
        const glm::vec4& topColor,
        const glm::vec4& leftColor,
        const glm::vec4& rightColor
    );
    
    // Convert grid coordinates to screen position
    glm::vec2 gridToScreen(int gridX, int gridY) const;
    
    // Convert screen position to grid coordinates
    glm::ivec2 screenToGrid(const glm::vec2& screenPos, float screenWidth, float screenHeight) const;
    
private:
    Renderer* renderer;
    Camera* camera;
    int tileWidth;
    int tileHeight;
};

#endif // ISOMETRIC_RENDERER_H
