#ifndef ENGINE_H
#define ENGINE_H

#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <memory>
#include "Time.h"
#include "Input.h"

// Forward declarations
class Renderer;
class Camera;
class Game;

/**
 * Core Game Engine
 * Manages the game loop, window, and core systems
 */
class Engine {
public:
    Engine(int width, int height, const char* title);
    ~Engine();
    
    // Initialize the engine
    bool initialize();
    
    // Run the main game loop
    void run();
    
    // Shutdown the engine
    void shutdown();
    
    // Check if engine should close
    bool shouldClose() const;
    
    // Get core systems
    Time* getTime() { return time.get(); }
    Input* getInput() { return input.get(); }
    Renderer* getRenderer() { return renderer.get(); }
    Camera* getCamera() { return camera.get(); }
    GLFWwindow* getWindow() { return window; }
    
    // Get window dimensions
    int getWidth() const { return width; }
    int getHeight() const { return height; }
    
    // Set the game instance
    void setGame(Game* gameInstance) { this->game = gameInstance; }
    
private:
    // Window management
    GLFWwindow* window;
    int width;
    int height;
    const char* title;
    
    // Core systems
    std::unique_ptr<Time> time;
    std::unique_ptr<Input> input;
    std::unique_ptr<Renderer> renderer;
    std::unique_ptr<Camera> camera;
    
    // Game instance
    Game* game;
    
    // Initialize GLFW and create window
    bool initWindow();
    
    // Initialize OpenGL
    bool initOpenGL();
    
    // Frame callbacks
    static void framebufferSizeCallback(GLFWwindow* window, int width, int height);
};

#endif // ENGINE_H
