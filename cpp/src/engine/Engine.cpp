#include "engine/Engine.h"
#include "rendering/Renderer.h"
#include "rendering/Camera.h"
#include "game/Game.h"
#include "utils/Logger.h"
#include <glad/glad.h>
#include <iostream>

Engine::Engine(int width, int height, const char* title)
    : window(nullptr)
    , width(width)
    , height(height)
    , title(title)
    , game(nullptr)
{
}

Engine::~Engine() {
    shutdown();
}

bool Engine::initialize() {
    LOG_INFO("Initializing engine...");
    
    // Initialize GLFW and create window
    if (!initWindow()) {
        LOG_ERROR("Failed to initialize window");
        return false;
    }
    LOG_INFO("Window created successfully");
    
    // Initialize OpenGL
    if (!initOpenGL()) {
        LOG_ERROR("Failed to initialize OpenGL");
        return false;
    }
    LOG_INFO("OpenGL initialized successfully");
    
    // Create core systems
    time = std::make_unique<Time>();
    input = std::make_unique<Input>(window);
    camera = std::make_unique<Camera>(0.0f, 0.0f);
    renderer = std::make_unique<Renderer>();
    LOG_INFO("Core systems created");
    
    // Initialize renderer
    if (!renderer->initialize()) {
        LOG_ERROR("Failed to initialize renderer");
        std::cerr << "Failed to initialize renderer" << std::endl;
        return false;
    }
    LOG_INFO("Renderer initialized");
    
    std::cout << "Engine initialized successfully" << std::endl;
    std::cout << "OpenGL Version: " << glGetString(GL_VERSION) << std::endl;
    LOG_INFO(std::string("OpenGL Version: ") + reinterpret_cast<const char*>(glGetString(GL_VERSION)));
    
    return true;
}

void Engine::run() {
    if (!game) {
        LOG_ERROR("No game instance set!");
        std::cerr << "No game instance set!" << std::endl;
        return;
    }
    
    LOG_INFO("Starting game loop");
    
    // Main game loop
    int frameCount = 0;
    try {
        while (!shouldClose()) {
            frameCount++;
            
            try {
                // Update time
                time->update();
                float deltaTime = time->getDeltaTime();
                
                // Update camera
                camera->update(deltaTime);
                
                // Update game
                game->update(deltaTime);
                
                // Render
                renderer->beginFrame();
                renderer->clear(0.1f, 0.1f, 0.15f, 1.0f);
                
                // Set view and projection matrices
                renderer->setViewMatrix(camera->getViewMatrix());
                renderer->setProjectionMatrix(camera->getProjectionMatrix(
                    static_cast<float>(width), 
                    static_cast<float>(height)
                ));
                
                // Render game
                game->render();
                
                renderer->endFrame();
                
                // Update input (at end of frame)
                input->update();
                
                // Swap buffers
                glfwSwapBuffers(window);
            } catch (const std::exception& e) {
                LOG_ERROR(std::string("Error in game loop (frame ") + std::to_string(frameCount) + "): " + e.what());
                std::cerr << "Error in game loop: " << e.what() << std::endl;
                // Continue running but log the error
            }
        }
    } catch (const std::exception& e) {
        LOG_FATAL(std::string("Fatal error in game loop: ") + e.what());
        std::cerr << "Fatal error in game loop: " << e.what() << std::endl;
        throw;
    }
    
    LOG_INFO("Game loop ended normally");
}

void Engine::shutdown() {
    LOG_INFO("Shutting down engine");
    
    if (game) {
        game->shutdown();
    }
    
    renderer.reset();
    camera.reset();
    input.reset();
    time.reset();
    
    if (window) {
        glfwDestroyWindow(window);
        window = nullptr;
    }
    
    glfwTerminate();
    LOG_INFO("Engine shutdown complete");
}

bool Engine::shouldClose() const {
    return window && glfwWindowShouldClose(window);
}

bool Engine::initWindow() {
    LOG_INFO("Initializing GLFW");
    
    // Initialize GLFW
    if (!glfwInit()) {
        LOG_ERROR("Failed to initialize GLFW");
        std::cerr << "Failed to initialize GLFW" << std::endl;
        return false;
    }
    
    // Set OpenGL version (3.3 Core)
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    
#ifdef __APPLE__
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif
    
    // Create window
    LOG_INFO("Creating window");
    window = glfwCreateWindow(width, height, title, nullptr, nullptr);
    if (!window) {
        LOG_ERROR("Failed to create GLFW window");
        std::cerr << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return false;
    }
    
    // Make context current
    glfwMakeContextCurrent(window);
    
    // Set callbacks
    glfwSetFramebufferSizeCallback(window, framebufferSizeCallback);
    
    // Enable VSync
    glfwSwapInterval(1);
    
    LOG_INFO("Window created successfully");
    return true;
}

bool Engine::initOpenGL() {
    LOG_INFO("Initializing OpenGL");
    
    // Load OpenGL functions with GLAD
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        LOG_ERROR("Failed to initialize GLAD");
        std::cerr << "Failed to initialize GLAD" << std::endl;
        return false;
    }
    
    // Set viewport
    glViewport(0, 0, width, height);
    
    // Enable blending for transparency
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    
    LOG_INFO("OpenGL initialized");
    return true;
}

void Engine::framebufferSizeCallback(GLFWwindow* window, int width, int height) {
    glViewport(0, 0, width, height);
}
