#include "engine/Engine.h"
#include "rendering/Renderer.h"
#include "rendering/Camera.h"
#include "game/Game.h"
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
    // Initialize GLFW and create window
    if (!initWindow()) {
        return false;
    }
    
    // Initialize OpenGL
    if (!initOpenGL()) {
        return false;
    }
    
    // Create core systems
    time = std::make_unique<Time>();
    input = std::make_unique<Input>(window);
    camera = std::make_unique<Camera>(0.0f, 0.0f);
    renderer = std::make_unique<Renderer>();
    
    // Initialize renderer
    if (!renderer->initialize()) {
        std::cerr << "Failed to initialize renderer" << std::endl;
        return false;
    }
    
    std::cout << "Engine initialized successfully" << std::endl;
    std::cout << "OpenGL Version: " << glGetString(GL_VERSION) << std::endl;
    
    return true;
}

void Engine::run() {
    if (!game) {
        std::cerr << "No game instance set!" << std::endl;
        return;
    }
    
    // Main game loop
    while (!shouldClose()) {
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
    }
}

void Engine::shutdown() {
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
}

bool Engine::shouldClose() const {
    return window && glfwWindowShouldClose(window);
}

bool Engine::initWindow() {
    // Initialize GLFW
    if (!glfwInit()) {
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
    window = glfwCreateWindow(width, height, title, nullptr, nullptr);
    if (!window) {
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
    
    return true;
}

bool Engine::initOpenGL() {
    // Load OpenGL functions with GLAD
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        std::cerr << "Failed to initialize GLAD" << std::endl;
        return false;
    }
    
    // Set viewport
    glViewport(0, 0, width, height);
    
    // Enable blending for transparency
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    
    return true;
}

void Engine::framebufferSizeCallback(GLFWwindow* window, int width, int height) {
    glViewport(0, 0, width, height);
}
