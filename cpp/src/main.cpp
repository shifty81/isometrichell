#include "engine/Engine.h"
#include "game/Game.h"
#include <iostream>
#include <memory>

int main() {
    std::cout << "==================================" << std::endl;
    std::cout << "  Isometric Hell - Game Engine" << std::endl;
    std::cout << "  C++ OpenGL Implementation" << std::endl;
    std::cout << "==================================" << std::endl;
    std::cout << std::endl;
    
    // Create engine
    std::unique_ptr<Engine> engine = std::make_unique<Engine>(1280, 720, "Isometric Hell");
    
    // Initialize engine
    if (!engine->initialize()) {
        std::cerr << "Failed to initialize engine" << std::endl;
        return -1;
    }
    
    // Create game
    std::unique_ptr<Game> game = std::make_unique<Game>(engine.get());
    
    // Initialize game
    if (!game->initialize()) {
        std::cerr << "Failed to initialize game" << std::endl;
        return -1;
    }
    
    // Set game in engine
    engine->setGame(game.get());
    
    // Run game
    engine->run();
    
    // Shutdown
    game->shutdown();
    engine->shutdown();
    
    std::cout << "\nThank you for playing!" << std::endl;
    
    return 0;
}
