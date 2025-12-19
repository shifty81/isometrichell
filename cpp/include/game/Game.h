#ifndef GAME_H
#define GAME_H

#include <memory>

// Forward declarations
class Engine;
class World;
class BuildingSystem;
class Entity;

/**
 * Main Game Class
 * Contains game logic and coordinates game systems
 */
class Game {
public:
    Game(Engine* engine);
    ~Game();
    
    // Initialize game
    bool initialize();
    
    // Update game logic
    void update(float deltaTime);
    
    // Render game
    void render();
    
    // Handle input
    void handleInput(float deltaTime);
    
    // Shutdown game
    void shutdown();
    
private:
    Engine* engine;
    
    // Game systems
    std::unique_ptr<World> world;
    std::unique_ptr<BuildingSystem> buildingSystem;
    std::unique_ptr<Entity> player;
    
    // Game state
    bool buildingMode;
    int selectedBuildingType;
    
    // Camera control
    void updateCamera(float deltaTime);
    
    // Building mode
    void updateBuildingMode();
};

#endif // GAME_H
