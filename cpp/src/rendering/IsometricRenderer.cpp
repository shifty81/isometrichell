#include "rendering/IsometricRenderer.h"
#include "utils/IsometricUtils.h"

IsometricRenderer::IsometricRenderer(Renderer* renderer, Camera* camera)
    : renderer(renderer)
    , camera(camera)
    , tileWidth(64)
    , tileHeight(32)
{
}

void IsometricRenderer::setTileSize(int width, int height) {
    tileWidth = width;
    tileHeight = height;
}

void IsometricRenderer::drawIsometricTile(
    int gridX, int gridY,
    const Texture* texture,
    const glm::vec4& color)
{
    glm::vec2 screenPos = gridToScreen(gridX, gridY);
    
    renderer->drawQuad(
        screenPos,
        glm::vec2(tileWidth, tileHeight),
        texture,
        color
    );
}

void IsometricRenderer::drawIsometricTileWithUV(
    int gridX, int gridY,
    const Texture* texture,
    const glm::vec2& uvMin,
    const glm::vec2& uvMax,
    const glm::vec4& color)
{
    glm::vec2 screenPos = gridToScreen(gridX, gridY);
    
    renderer->drawQuad(
        screenPos,
        glm::vec2(tileWidth, tileHeight),
        texture,
        color,
        0.0f,
        uvMin,
        uvMax
    );
}

void IsometricRenderer::drawIsometricColoredTile(
    int gridX, int gridY,
    const glm::vec4& color)
{
    drawIsometricTile(gridX, gridY, nullptr, color);
}

void IsometricRenderer::drawIsometricCube(
    int gridX, int gridY,
    float height,
    const glm::vec4& topColor,
    const glm::vec4& leftColor,
    const glm::vec4& rightColor)
{
    glm::vec2 basePos = gridToScreen(gridX, gridY);
    
    // Draw left face
    glm::vec2 leftPos = basePos + glm::vec2(0, -height);
    renderer->drawColoredQuad(
        leftPos,
        glm::vec2(tileWidth / 2.0f, height + tileHeight / 2.0f),
        leftColor
    );
    
    // Draw right face
    glm::vec2 rightPos = basePos + glm::vec2(tileWidth / 2.0f, -height);
    renderer->drawColoredQuad(
        rightPos,
        glm::vec2(tileWidth / 2.0f, height + tileHeight / 2.0f),
        rightColor
    );
    
    // Draw top face (diamond shape approximated as quad)
    glm::vec2 topPos = basePos + glm::vec2(0, -height);
    renderer->drawColoredQuad(
        topPos,
        glm::vec2(tileWidth, tileHeight),
        topColor
    );
}

glm::vec2 IsometricRenderer::gridToScreen(int gridX, int gridY) const {
    return IsometricUtils::worldToScreen(gridX, gridY, tileWidth, tileHeight);
}

glm::vec2 IsometricRenderer::tileToScreen(float x, float y) const {
    // Use the same conversion as gridToScreen but with float coordinates
    return IsometricUtils::worldToScreen(x, y, tileWidth, tileHeight);
}

glm::ivec2 IsometricRenderer::screenToGrid(const glm::vec2& screenPos, float screenWidth, float screenHeight) const {
    // Convert screen position to world position using camera
    glm::vec2 worldPos = camera->screenToWorld(screenPos, screenWidth, screenHeight);
    
    // Convert to grid coordinates
    return IsometricUtils::screenToWorld(worldPos.x, worldPos.y, tileWidth, tileHeight);
}

void IsometricRenderer::drawCircle(float screenX, float screenY, float radius, const glm::vec4& color) {
    // Draw circle as a colored quad (simplified for now)
    // In a production system, this would use proper circle rendering
    renderer->drawColoredQuad(
        glm::vec2(screenX - radius, screenY - radius),
        glm::vec2(radius * 2.0f, radius * 2.0f),
        color
    );
}

void IsometricRenderer::drawEllipse(float screenX, float screenY, float radiusX, float radiusY, const glm::vec4& color) {
    // Draw ellipse as a colored quad (simplified for now)
    // In a production system, this would use proper ellipse rendering
    renderer->drawColoredQuad(
        glm::vec2(screenX - radiusX, screenY - radiusY),
        glm::vec2(radiusX * 2.0f, radiusY * 2.0f),
        color
    );
}
