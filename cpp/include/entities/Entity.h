#ifndef ENTITY_H
#define ENTITY_H

#include <glm/glm.hpp>

// Forward declarations
class Renderer;
class IsometricRenderer;
class Camera;
class World;

/**
 * Base Entity Class
 * Base class for all game entities (player, NPCs, items, etc.)
 */
class Entity {
public:
    Entity(float x, float y);
    virtual ~Entity();
    
    // Update entity
    virtual void update(float deltaTime, World* world);
    
    // Render entity
    virtual void render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera);
    
    // Position
    void setPosition(float x, float y);
    glm::vec2 getPosition() const { return position; }
    
    // Velocity
    void setVelocity(float vx, float vy);
    glm::vec2 getVelocity() const { return velocity; }
    
    // Active state
    void setActive(bool isActive) { this->active = isActive; }
    bool isActive() const { return active; }
    
protected:
    glm::vec2 position;
    glm::vec2 velocity;
    bool active;
};

#endif // ENTITY_H
