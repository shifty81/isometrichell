#include "game/Game.h"
#include "engine/Engine.h"
#include "engine/Input.h"
#include "rendering/Renderer.h"
#include "rendering/Camera.h"
#include "rendering/IsometricRenderer.h"
#include "rendering/TextureManager.h"
#include "world/World.h"
#include "building/BuildingSystem.h"
#include "entities/Entity.h"
#include <iostream>

Game::Game(Engine* engine)
    : engine(engine)
    , buildingMode(false)
    , selectedBuildingType(0)
{
}

Game::~Game() {
}

bool Game::initialize() {
    std::cout << "Initializing game..." << std::endl;
    
    // Create texture manager
    textureManager = std::make_unique<TextureManager>();
    std::cout << "Loading textures..." << std::endl;
    
    // Load ground tiles
    if (!textureManager->loadGroundTiles()) {
        std::cout << "Warning: Failed to load ground tiles, using colored tiles as fallback" << std::endl;
    }
    
    // Load decorations
    if (!textureManager->loadDecorations()) {
        std::cout << "Warning: Failed to load decorations" << std::endl;
    }
    
    std::cout << "Loaded " << textureManager->getTextureCount() << " textures" << std::endl;
    
    // Create world with texture manager
    world = std::make_unique<World>(30, 30, textureManager.get());
    world->generate();
    
    // Create building system
    buildingSystem = std::make_unique<BuildingSystem>(world.get());
    
    // Create player entity (placeholder)
    player = std::make_unique<Entity>(15.0f, 15.0f);
    
    std::cout << "Game initialized successfully" << std::endl;
    std::cout << "\nControls:" << std::endl;
    std::cout << "  WASD / Arrow Keys - Move camera" << std::endl;
    std::cout << "  B - Toggle building mode" << std::endl;
    std::cout << "  1/2/3 - Select building type (House/Tower/Warehouse)" << std::endl;
    std::cout << "  Left Click - Place building" << std::endl;
    std::cout << "  ESC - Exit" << std::endl;
    
    return true;
}

void Game::update(float deltaTime) {
    // Handle input
    handleInput(deltaTime);
    
    // Update world
    world->update(deltaTime);
    
    // Update building system
    buildingSystem->update(deltaTime);
    
    // Update player
    if (player) {
        player->update(deltaTime, world.get());
    }
}

void Game::render() {
    Renderer* renderer = engine->getRenderer();
    Camera* camera = engine->getCamera();
    
    // Create isometric renderer
    IsometricRenderer isoRenderer(renderer, camera);
    isoRenderer.setTileSize(64, 32);
    
    // Render world
    world->render(renderer, &isoRenderer, camera);
    
    // Render buildings
    buildingSystem->render(renderer, &isoRenderer, camera);
    
    // Render player
    if (player && player->isActive()) {
        // Draw simple colored quad for player
        glm::vec2 playerScreenPos = isoRenderer.gridToScreen(
            static_cast<int>(player->getPosition().x),
            static_cast<int>(player->getPosition().y)
        );
        
        renderer->drawColoredQuad(
            playerScreenPos + glm::vec2(20, -30),
            glm::vec2(24, 30),
            glm::vec4(1.0f, 0.8f, 0.0f, 1.0f)
        );
    }
}

void Game::handleInput(float deltaTime) {
    Input* input = engine->getInput();
    
    // Exit on ESC
    if (input->isKeyPressed(GLFW_KEY_ESCAPE)) {
        glfwSetWindowShouldClose(engine->getWindow(), true);
    }
    
    // Camera movement
    updateCamera(deltaTime);
    
    // Toggle building mode
    if (input->isKeyPressed(GLFW_KEY_B)) {
        buildingMode = !buildingMode;
        std::cout << "Building mode: " << (buildingMode ? "ON" : "OFF") << std::endl;
    }
    
    // Building mode controls
    if (buildingMode) {
        updateBuildingMode();
    }
}

void Game::shutdown() {
    std::cout << "Shutting down game..." << std::endl;
    
    player.reset();
    buildingSystem.reset();
    world.reset();
}

void Game::updateCamera(float deltaTime) {
    Input* input = engine->getInput();
    Camera* camera = engine->getCamera();
    
    float cameraSpeed = camera->getSpeed() * deltaTime;
    
    // WASD or Arrow keys for camera movement
    if (input->isKeyDown(GLFW_KEY_W) || input->isKeyDown(GLFW_KEY_UP)) {
        camera->move(0, cameraSpeed);
    }
    if (input->isKeyDown(GLFW_KEY_S) || input->isKeyDown(GLFW_KEY_DOWN)) {
        camera->move(0, -cameraSpeed);
    }
    if (input->isKeyDown(GLFW_KEY_A) || input->isKeyDown(GLFW_KEY_LEFT)) {
        camera->move(-cameraSpeed, 0);
    }
    if (input->isKeyDown(GLFW_KEY_D) || input->isKeyDown(GLFW_KEY_RIGHT)) {
        camera->move(cameraSpeed, 0);
    }
}

void Game::updateBuildingMode() {
    Input* input = engine->getInput();
    Camera* camera = engine->getCamera();
    Renderer* renderer = engine->getRenderer();
    
    // Select building type
    if (input->isKeyPressed(GLFW_KEY_1)) {
        selectedBuildingType = 0;
        std::cout << "Selected: House" << std::endl;
    }
    if (input->isKeyPressed(GLFW_KEY_2)) {
        selectedBuildingType = 1;
        std::cout << "Selected: Tower" << std::endl;
    }
    if (input->isKeyPressed(GLFW_KEY_3)) {
        selectedBuildingType = 2;
        std::cout << "Selected: Warehouse" << std::endl;
    }
    
    // Place building on left click
    if (input->isMouseButtonPressed(GLFW_MOUSE_BUTTON_LEFT)) {
        // Convert mouse position to grid coordinates
        IsometricRenderer isoRenderer(renderer, camera);
        isoRenderer.setTileSize(64, 32);
        
        glm::vec2 mousePos = input->getMousePosition();
        glm::ivec2 gridPos = isoRenderer.screenToGrid(
            mousePos,
            static_cast<float>(engine->getWidth()),
            static_cast<float>(engine->getHeight())
        );
        
        // Determine building type
        BuildingType buildingType;
        switch (selectedBuildingType) {
            case 0: buildingType = BuildingType::HOUSE; break;
            case 1: buildingType = BuildingType::TOWER; break;
            case 2: buildingType = BuildingType::WAREHOUSE; break;
            default: buildingType = BuildingType::HOUSE; break;
        }
        
        // Try to place building
        if (buildingSystem->placeBuilding(gridPos.x, gridPos.y, buildingType)) {
            std::cout << "Building placed at grid (" << gridPos.x << ", " << gridPos.y << ")" << std::endl;
        } else {
            std::cout << "Cannot place building at grid (" << gridPos.x << ", " << gridPos.y << ")" << std::endl;
        }
    }
}
