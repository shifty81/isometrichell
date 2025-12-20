#include "engine/Engine.h"
#include "game/Game.h"
#include "utils/Logger.h"
#include <iostream>
#include <memory>
#include <exception>

int main() {
    // Initialize logger first
    Logger::getInstance().initialize("logs/engine.log");
    
    LOG_INFO("=================================");
    LOG_INFO("  The Daily Grind - Game Engine");
    LOG_INFO("  C++ OpenGL Implementation");
    LOG_INFO("=================================");
    
    std::cout << "==================================" << std::endl;
    std::cout << "  The Daily Grind - Game Engine" << std::endl;
    std::cout << "  C++ OpenGL Implementation" << std::endl;
    std::cout << "==================================" << std::endl;
    std::cout << std::endl;
    
    try {
        // Create engine
        LOG_INFO("Creating engine...");
        std::unique_ptr<Engine> engine = std::make_unique<Engine>(1280, 720, "The Daily Grind");
        
        // Initialize engine
        LOG_INFO("Initializing engine...");
        if (!engine->initialize()) {
            LOG_FATAL("Failed to initialize engine");
            std::cerr << "Failed to initialize engine" << std::endl;
            return -1;
        }
        LOG_INFO("Engine initialized successfully");
        
        // Create game
        LOG_INFO("Creating game...");
        std::unique_ptr<Game> game = std::make_unique<Game>(engine.get());
        
        // Initialize game
        LOG_INFO("Initializing game...");
        if (!game->initialize()) {
            LOG_FATAL("Failed to initialize game");
            std::cerr << "Failed to initialize game" << std::endl;
            return -1;
        }
        LOG_INFO("Game initialized successfully");
        
        // Set game in engine
        engine->setGame(game.get());
        
        // Run game
        LOG_INFO("Starting game loop...");
        engine->run();
        
        // Shutdown
        LOG_INFO("Shutting down game...");
        game->shutdown();
        
        LOG_INFO("Shutting down engine...");
        engine->shutdown();
        
        LOG_INFO("Game exited normally");
        std::cout << "\nThank you for playing!" << std::endl;
        
    } catch (const std::exception& e) {
        LOG_FATAL(std::string("Unhandled exception: ") + e.what());
        std::cerr << "\n!!! FATAL ERROR !!!" << std::endl;
        std::cerr << "Exception: " << e.what() << std::endl;
        std::cerr << "Check logs/engine.log for details" << std::endl;
        Logger::getInstance().flush();
        return -1;
    } catch (...) {
        LOG_FATAL("Unknown exception occurred");
        std::cerr << "\n!!! FATAL ERROR !!!" << std::endl;
        std::cerr << "Unknown exception occurred" << std::endl;
        std::cerr << "Check logs/engine.log for details" << std::endl;
        Logger::getInstance().flush();
        return -1;
    }
    
    // Ensure logs are flushed
    Logger::getInstance().shutdown();
    
    return 0;
}
