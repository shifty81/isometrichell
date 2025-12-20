#ifndef CAMERA_H
#define CAMERA_H

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

/**
 * 2D Camera System
 * Handles viewport positioning for the game world
 */
class Camera {
public:
    Camera(float x = 0.0f, float y = 0.0f);
    
    // Update camera (handle movement, etc.)
    void update(float deltaTime);
    
    // Camera movement
    void move(float dx, float dy);
    void setPosition(float x, float y);
    glm::vec2 getPosition() const { return position; }
    
    // Camera speed
    void setSpeed(float speed) { this->speed = speed; }
    float getSpeed() const { return speed; }
    
    // Get view matrix for 2D rendering
    glm::mat4 getViewMatrix() const;
    
    // Get projection matrix (orthographic for 2D)
    glm::mat4 getProjectionMatrix(float screenWidth, float screenHeight) const;
    
    // Screen to world coordinate conversion
    glm::vec2 screenToWorld(const glm::vec2& screenPos, float screenWidth, float screenHeight) const;
    
    // World to screen coordinate conversion
    glm::vec2 worldToScreen(const glm::vec2& worldPos, float screenWidth, float screenHeight) const;
    
private:
    glm::vec2 position;
    float speed;
};

#endif // CAMERA_H
