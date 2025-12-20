#ifndef INPUT_H
#define INPUT_H

#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>

/**
 * Input Management System
 * Handles keyboard and mouse input
 */
class Input {
public:
    Input(GLFWwindow* window);
    
    // Update input state each frame (call at end of frame)
    void update();
    
    // Keyboard input
    bool isKeyDown(int key) const;
    bool isKeyPressed(int key) const;  // True only on first frame of key press
    bool isKeyReleased(int key) const; // True only on first frame of key release
    
    // Mouse input
    bool isMouseButtonDown(int button) const;
    bool isMouseButtonPressed(int button) const;
    bool isMouseButtonReleased(int button) const;
    
    // Mouse position
    glm::vec2 getMousePosition() const { return mousePosition; }
    glm::vec2 getMouseDelta() const { return mouseDelta; }
    
    // Callbacks for GLFW
    static void keyCallback(GLFWwindow* window, int key, int scancode, int action, int mods);
    static void mouseButtonCallback(GLFWwindow* window, int button, int action, int mods);
    static void cursorPosCallback(GLFWwindow* window, double xpos, double ypos);
    
private:
    GLFWwindow* window;
    
    // Keyboard state
    bool keyStates[GLFW_KEY_LAST + 1];
    bool prevKeyStates[GLFW_KEY_LAST + 1];
    
    // Mouse state
    bool mouseButtonStates[GLFW_MOUSE_BUTTON_LAST + 1];
    bool prevMouseButtonStates[GLFW_MOUSE_BUTTON_LAST + 1];
    
    glm::vec2 mousePosition;
    glm::vec2 prevMousePosition;
    glm::vec2 mouseDelta;
    
    static Input* instance;
};

#endif // INPUT_H
