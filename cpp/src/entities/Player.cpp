#include "entities/Player.h"
#include "world/World.h"
#include "world/Tile.h"
#include "engine/Input.h"
#include "rendering/Renderer.h"
#include "rendering/IsometricRenderer.h"
#include "rendering/Camera.h"
#include <cmath>
#include <iostream>

Player::Player(float x, float y)
    : Entity(x, y)
    , speed(4.0f)
    , interactionRange(1.5f)
    , moving(false)
    , direction(0.0f, 0.0f)
{
    // Initialize inventory
    inventory["wood"] = 0;
    inventory["stone"] = 0;
}

Player::~Player() {
}

void Player::update(float deltaTime, World* world) {
    // Base update without input (called by world)
    // Player movement is handled by updateWithInput() from Game
}

void Player::updateWithInput(float deltaTime, World* world, Input* input) {
    moving = false;
    float dx = 0.0f;
    float dy = 0.0f;
    
    // WASD movement
    if (input->isKeyDown(GLFW_KEY_W)) {
        dy -= 1.0f;
        moving = true;
    }
    if (input->isKeyDown(GLFW_KEY_S)) {
        dy += 1.0f;
        moving = true;
    }
    if (input->isKeyDown(GLFW_KEY_A)) {
        dx -= 1.0f;
        moving = true;
    }
    if (input->isKeyDown(GLFW_KEY_D)) {
        dx += 1.0f;
        moving = true;
    }
    
    // Normalize diagonal movement
    if (dx != 0.0f && dy != 0.0f) {
        dx *= 0.707f; // 1/sqrt(2)
        dy *= 0.707f;
    }
    
    // Store direction for rendering
    if (dx != 0.0f || dy != 0.0f) {
        direction.x = dx;
        direction.y = dy;
    }
    
    // Apply movement
    if (moving) {
        float moveAmount = speed * deltaTime;
        float newX = position.x + dx * moveAmount;
        float newY = position.y + dy * moveAmount;
        
        if (canMove(newX, newY, world)) {
            position.x = newX;
            position.y = newY;
        }
    }
}

bool Player::canMove(float newX, float newY, World* world) {
    // Check if new position is valid
    int tileX = static_cast<int>(std::floor(newX));
    int tileY = static_cast<int>(std::floor(newY));
    
    const Tile* tile = world->getTile(tileX, tileY);
    if (!tile) {
        return false; // Out of bounds
    }
    
    // Check if tile is walkable
    return tile->isWalkable() && !tile->isOccupied();
}

bool Player::interact(float targetX, float targetY, World* world) {
    // Check distance to target
    float dx = targetX - position.x;
    float dy = targetY - position.y;
    float distance = std::sqrt(dx * dx + dy * dy);
    
    if (distance > interactionRange) {
        return false; // Too far away
    }
    
    // Get the tile at target position
    int tileX = static_cast<int>(std::floor(targetX));
    int tileY = static_cast<int>(std::floor(targetY));
    Tile* tile = world->getTile(tileX, tileY);
    
    if (!tile) {
        return false;
    }
    
    // Check if tile has a resource decoration
    std::string decoration = tile->getDecoration();
    if (!decoration.empty() && tile->isResource()) {
        // Check decoration type and gather resource
        if (decoration.find("tree_") == 0) {
            // Gather wood
            addWood(1);
            tile->setDecoration("");  // Remove the tree
            tile->setResource(false);
            std::cout << "Gathered wood! Total: " << getWood() << std::endl;
            return true;
        } else if (decoration.find("rocks_") == 0) {
            // Gather stone
            addStone(1);
            tile->setDecoration("");  // Remove the rocks
            tile->setResource(false);
            std::cout << "Gathered stone! Total: " << getStone() << std::endl;
            return true;
        }
    }
    
    return false;
}

void Player::render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera) {
    // Get screen position from isometric coordinates
    glm::vec2 screenPos = isoRenderer->tileToScreen(position.x, position.y);
    
    // Adjust for camera
    screenPos.x -= camera->getX();
    screenPos.y -= camera->getY();
    
    // Draw simple player representation (will be replaced with sprites later)
    
    // Shadow
    glm::vec4 shadowColor(0.0f, 0.0f, 0.0f, 0.3f);
    isoRenderer->drawEllipse(screenPos.x - 12, screenPos.y + 5, 24, 8, shadowColor);
    
    // Body
    glm::vec4 bodyColor(0.2f, 0.6f, 0.9f, 1.0f); // Blue
    renderer->drawRect(screenPos.x - 10, screenPos.y - 30, 20, 30, bodyColor);
    
    // Head
    glm::vec4 headColor(0.94f, 0.75f, 0.56f, 1.0f); // Skin tone
    isoRenderer->drawCircle(screenPos.x, screenPos.y - 35, 8, headColor);
    
    // Direction indicator (for debugging)
    if (moving) {
        glm::vec4 dirColor(1.0f, 1.0f, 1.0f, 1.0f);
        renderer->drawLine(
            screenPos.x, screenPos.y - 20,
            screenPos.x + direction.x * 15,
            screenPos.y - 20 + direction.y * 15,
            dirColor, 2.0f
        );
    }
}
