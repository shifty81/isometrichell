#include "entities/Entity.h"

Entity::Entity(float x, float y)
    : position(x, y)
    , velocity(0.0f, 0.0f)
    , active(true)
{
}

Entity::~Entity() {
}

void Entity::update(float deltaTime, World* world) {
    (void)world; // Unused in base class
    // Update position based on velocity
    position += velocity * deltaTime;
}

void Entity::render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera) {
    (void)renderer; // Unused in base class
    (void)isoRenderer; // Unused in base class
    (void)camera; // Unused in base class
    // Base entity has no visual representation
    // Override in derived classes
}

void Entity::setPosition(float x, float y) {
    position.x = x;
    position.y = y;
}

void Entity::setVelocity(float vx, float vy) {
    velocity.x = vx;
    velocity.y = vy;
}
