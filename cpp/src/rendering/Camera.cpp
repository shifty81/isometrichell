#include "rendering/Camera.h"

Camera::Camera(float x, float y)
    : position(x, y)
    , speed(300.0f)
{
}

void Camera::update(float deltaTime) {
    // Camera update logic (can be extended for smooth movement, etc.)
}

void Camera::move(float dx, float dy) {
    position.x += dx;
    position.y += dy;
}

void Camera::setPosition(float x, float y) {
    position.x = x;
    position.y = y;
}

glm::mat4 Camera::getViewMatrix() const {
    // Create a view matrix that translates the world by camera position
    // In 2D, we simply translate by negative camera position
    return glm::translate(glm::mat4(1.0f), glm::vec3(-position.x, -position.y, 0.0f));
}

glm::mat4 Camera::getProjectionMatrix(float screenWidth, float screenHeight) const {
    // Orthographic projection for 2D
    // Origin at center of screen
    float halfWidth = screenWidth / 2.0f;
    float halfHeight = screenHeight / 2.0f;
    
    return glm::ortho(
        -halfWidth, halfWidth,    // left, right
        -halfHeight, halfHeight,  // bottom, top
        -1.0f, 1.0f               // near, far
    );
}

glm::vec2 Camera::screenToWorld(const glm::vec2& screenPos, float screenWidth, float screenHeight) const {
    // Convert screen coordinates (0,0 = top-left) to world coordinates
    float worldX = screenPos.x - screenWidth / 2.0f + position.x;
    float worldY = -(screenPos.y - screenHeight / 2.0f) + position.y;
    return glm::vec2(worldX, worldY);
}

glm::vec2 Camera::worldToScreen(const glm::vec2& worldPos, float screenWidth, float screenHeight) const {
    // Convert world coordinates to screen coordinates (0,0 = top-left)
    float screenX = (worldPos.x - position.x) + screenWidth / 2.0f;
    float screenY = -(worldPos.y - position.y) + screenHeight / 2.0f;
    return glm::vec2(screenX, screenY);
}
