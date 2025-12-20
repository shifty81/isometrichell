#include "engine/Input.h"
#include <cstring>
#include <iostream>

Input* Input::instance = nullptr;

Input::Input(GLFWwindow* window)
    : window(window)
    , mousePosition(0.0f, 0.0f)
    , prevMousePosition(0.0f, 0.0f)
    , mouseDelta(0.0f, 0.0f)
{
    // Initialize arrays
    std::memset(keyStates, 0, sizeof(keyStates));
    std::memset(prevKeyStates, 0, sizeof(prevKeyStates));
    std::memset(mouseButtonStates, 0, sizeof(mouseButtonStates));
    std::memset(prevMouseButtonStates, 0, sizeof(prevMouseButtonStates));
    
    // Set instance for callbacks
    instance = this;
    
    // Set up GLFW callbacks
    glfwSetKeyCallback(window, keyCallback);
    glfwSetMouseButtonCallback(window, mouseButtonCallback);
    glfwSetCursorPosCallback(window, cursorPosCallback);
}

void Input::update() {
    // Copy current states to previous states
    std::memcpy(prevKeyStates, keyStates, sizeof(keyStates));
    std::memcpy(prevMouseButtonStates, mouseButtonStates, sizeof(mouseButtonStates));
    
    // Update mouse delta
    mouseDelta = mousePosition - prevMousePosition;
    prevMousePosition = mousePosition;
    
    // Poll events
    glfwPollEvents();
}

bool Input::isKeyDown(int key) const {
    if (key < 0 || key > GLFW_KEY_LAST) return false;
    return keyStates[key];
}

bool Input::isKeyPressed(int key) const {
    if (key < 0 || key > GLFW_KEY_LAST) return false;
    return keyStates[key] && !prevKeyStates[key];
}

bool Input::isKeyReleased(int key) const {
    if (key < 0 || key > GLFW_KEY_LAST) return false;
    return !keyStates[key] && prevKeyStates[key];
}

bool Input::isMouseButtonDown(int button) const {
    if (button < 0 || button > GLFW_MOUSE_BUTTON_LAST) return false;
    return mouseButtonStates[button];
}

bool Input::isMouseButtonPressed(int button) const {
    if (button < 0 || button > GLFW_MOUSE_BUTTON_LAST) return false;
    return mouseButtonStates[button] && !prevMouseButtonStates[button];
}

bool Input::isMouseButtonReleased(int button) const {
    if (button < 0 || button > GLFW_MOUSE_BUTTON_LAST) return false;
    return !mouseButtonStates[button] && prevMouseButtonStates[button];
}

void Input::keyCallback(GLFWwindow* window, int key, int scancode, int action, int mods) {
    if (!instance) return;
    
    if (key >= 0 && key <= GLFW_KEY_LAST) {
        if (action == GLFW_PRESS) {
            instance->keyStates[key] = true;
        } else if (action == GLFW_RELEASE) {
            instance->keyStates[key] = false;
        }
    }
}

void Input::mouseButtonCallback(GLFWwindow* window, int button, int action, int mods) {
    if (!instance) return;
    
    if (button >= 0 && button <= GLFW_MOUSE_BUTTON_LAST) {
        if (action == GLFW_PRESS) {
            instance->mouseButtonStates[button] = true;
        } else if (action == GLFW_RELEASE) {
            instance->mouseButtonStates[button] = false;
        }
    }
}

void Input::cursorPosCallback(GLFWwindow* window, double xpos, double ypos) {
    if (!instance) return;
    instance->mousePosition = glm::vec2(static_cast<float>(xpos), static_cast<float>(ypos));
}
