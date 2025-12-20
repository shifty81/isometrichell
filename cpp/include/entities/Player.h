#ifndef PLAYER_H
#define PLAYER_H

#include "Entity.h"
#include <string>
#include <map>

// Forward declarations
class Input;

/**
 * Player Class
 * Represents the player character with movement, inventory, and interaction
 */
class Player : public Entity {
public:
    Player(float x, float y);
    virtual ~Player();
    
    // Update player (handles input and movement)
    virtual void update(float deltaTime, World* world) override;
    void updateWithInput(float deltaTime, World* world, Input* input);
    
    // Render player
    virtual void render(Renderer* renderer, IsometricRenderer* isoRenderer, Camera* camera) override;
    
    // Interaction
    bool interact(float targetX, float targetY, World* world);
    
    // Inventory
    int getWood() const { return inventory["wood"]; }
    int getStone() const { return inventory["stone"]; }
    void addWood(int amount) { inventory["wood"] += amount; }
    void addStone(int amount) { inventory["stone"] += amount; }
    
    // Movement state
    bool isMoving() const { return moving; }
    glm::vec2 getDirection() const { return direction; }
    
    // Interaction range
    float getInteractionRange() const { return interactionRange; }
    
private:
    float speed;                           // Movement speed (tiles per second)
    float interactionRange;                // Range for interacting with objects
    std::map<std::string, int> inventory;  // Resource inventory
    bool moving;                           // Is player currently moving
    glm::vec2 direction;                   // Current movement direction
    
    // Helper methods
    bool canMove(float newX, float newY, World* world);
};

#endif // PLAYER_H
